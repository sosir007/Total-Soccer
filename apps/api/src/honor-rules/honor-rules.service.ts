import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  CompetitionStandingPlacement,
  CompetitionTargetType,
  type HonorRule,
  type Prisma
} from '@prisma/client';
import { resolvePagination } from '../common/pagination.js';
import { PrismaService } from '../database/prisma.service.js';
import type { HonorRuleListQuery, HonorRulePayload } from './honor-rules.types.js';

interface RecalculateTargetStats {
  championCount: number;
  runnerUpCount: number;
  thirdPlaceCount: number;
  fourthPlaceCount: number;
  medalCount: number;
  trophyCount: number;
  honorScore: number;
}

const EMPTY_TARGET_STATS: RecalculateTargetStats = {
  championCount: 0,
  runnerUpCount: 0,
  thirdPlaceCount: 0,
  fourthPlaceCount: 0,
  medalCount: 0,
  trophyCount: 0,
  honorScore: 0
};

@Injectable()
export class HonorRulesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: HonorRuleListQuery) {
    const pagination = resolvePagination(query);
    const where = this.buildWhere(query);
    const [items, total] = await this.prisma.$transaction([
      this.prisma.honorRule.findMany({
        where,
        orderBy: [
          { sortOrder: 'asc' },
          { targetType: 'asc' },
          { category: 'asc' },
          { name: 'asc' }
        ],
        skip: pagination.skip,
        take: pagination.take
      }),
      this.prisma.honorRule.count({ where })
    ]);

    return {
      items,
      page: pagination.page,
      pageSize: pagination.pageSize,
      total
    };
  }

  async create(body: HonorRulePayload) {
    const data = this.buildData(body);

    return this.prisma.honorRule.create({
      data
    });
  }

  async update(id: string, body: HonorRulePayload) {
    await this.assertExists(id);
    const data = this.buildData(body);

    return this.prisma.honorRule.update({
      where: { id },
      data
    });
  }

  async recalculate() {
    const [rules, standings, countryParticipation, clubParticipation, countries, clubs, links] =
      await Promise.all([
        this.prisma.honorRule.findMany({
          where: { enabled: true }
        }),
        this.prisma.competitionStanding.findMany({
          where: {
            edition: {
              competition: {
                includeInStats: true
              }
            }
          },
          include: {
            edition: {
              include: {
                competition: {
                  select: {
                    targetType: true,
                    category: true
                  }
                }
              }
            }
          }
        }),
        this.getCountryParticipationStats(),
        this.getClubParticipationStats(),
        this.prisma.country.findMany({ select: { id: true } }),
        this.prisma.club.findMany({ select: { id: true } }),
        this.prisma.countrySuccessor.findMany({
          select: {
            historicalCountryId: true,
            successorCountryId: true
          }
        })
      ]);

    const ruleMap = this.buildRuleMap(rules);
    const countryStats = new Map<string, RecalculateTargetStats>();
    const clubStats = new Map<string, RecalculateTargetStats>();
    const successorMap = new Map<string, string[]>();

    for (const link of links) {
      const successors = successorMap.get(link.historicalCountryId) ?? [];
      successors.push(link.successorCountryId);
      successorMap.set(link.historicalCountryId, successors);
    }

    for (const standing of standings) {
      const targetType = standing.edition.competition.targetType;

      if (targetType === CompetitionTargetType.COUNTRY && standing.countryId) {
        const score = this.resolveScore(
          ruleMap,
          targetType,
          standing.edition.competition.category,
          standing.placement
        );
        const targetIds = successorMap.get(standing.countryId) ?? [standing.countryId];

        for (const targetId of targetIds) {
          this.addStandingStats(countryStats, targetId, standing.placement, score);
        }
      }

      if (targetType === CompetitionTargetType.CLUB && standing.clubId) {
        this.addStandingStats(
          clubStats,
          standing.clubId,
          standing.placement,
          this.resolveScore(
            ruleMap,
            targetType,
            standing.edition.competition.category,
            standing.placement
          )
        );
      }
    }

    await this.prisma.$transaction([
      ...countries.map((country) => {
        const participation = countryParticipation.get(country.id);
        const stats = countryStats.get(country.id) ?? this.emptyStats();
        const playerCount = participation?.playerCount ?? 0;
        const honorScore = this.round(stats.honorScore);

        return this.prisma.country.update({
          where: { id: country.id },
          data: {
            playerCount,
            totalPa: participation?.totalPa ?? null,
            averagePa: this.roundNullable(participation?.averagePa),
            medalCount: stats.medalCount,
            championCount: stats.championCount,
            majorChampionCount: stats.championCount,
            honorScore,
            averageHonorScore: playerCount > 0 ? this.round(honorScore / playerCount) : null
          }
        });
      }),
      ...clubs.map((club) => {
        const participation = clubParticipation.get(club.id);
        const stats = clubStats.get(club.id) ?? this.emptyStats();

        return this.prisma.club.update({
          where: { id: club.id },
          data: {
            playerCount: participation?.playerCount ?? 0,
            totalPa: participation?.totalPa ?? null,
            averagePa: this.roundNullable(participation?.averagePa),
            trophyCount: stats.championCount,
            championCount: stats.championCount,
            honorScore: this.round(stats.honorScore)
          }
        });
      })
    ]);

    return {
      countryCount: countries.length,
      clubCount: clubs.length,
      standingCount: standings.length,
      enabledRuleCount: rules.length,
      scoredCountryCount: countryStats.size,
      scoredClubCount: clubStats.size
    };
  }

  private buildWhere(query: HonorRuleListQuery): Prisma.HonorRuleWhereInput {
    const keyword = query.keyword?.trim();

    return {
      ...(keyword
        ? {
            OR: [
              { code: { contains: keyword, mode: 'insensitive' } },
              { name: { contains: keyword, mode: 'insensitive' } },
              { category: { contains: keyword, mode: 'insensitive' } },
              { remark: { contains: keyword, mode: 'insensitive' } }
            ]
          }
        : {}),
      ...(query.targetType ? { targetType: this.parseTargetType(query.targetType) } : {}),
      ...(query.placement ? { placement: this.parsePlacement(query.placement) } : {}),
      ...(query.enabled === undefined ? {} : { enabled: query.enabled === 'true' })
    };
  }

  private buildData(body: HonorRulePayload) {
    const code = this.requiredText(body.code, '规则编码');
    const name = this.requiredText(body.name, '规则名称');
    const targetType = this.parseTargetType(body.targetType);
    const placement = this.parsePlacement(body.placement);
    const baseScore = this.toNumber(body.baseScore, '基础分');
    const coefficient = this.toNumber(body.coefficient ?? 1, '系数');

    if (baseScore < 0) {
      throw new BadRequestException('基础分不能小于 0。');
    }

    if (coefficient < 0) {
      throw new BadRequestException('系数不能小于 0。');
    }

    return {
      code,
      name,
      targetType,
      category: this.optionalText(body.category),
      placement,
      baseScore,
      coefficient,
      enabled: body.enabled ?? true,
      sortOrder: Number.isFinite(body.sortOrder) ? Number(body.sortOrder) : 0,
      remark: this.optionalText(body.remark)
    } satisfies Prisma.HonorRuleUncheckedCreateInput;
  }

  private async assertExists(id: string) {
    const rule = await this.prisma.honorRule.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!rule) {
      throw new NotFoundException('荣誉规则不存在。');
    }
  }

  private buildRuleMap(rules: HonorRule[]) {
    const map = new Map<string, HonorRule>();

    for (const rule of rules) {
      map.set(this.createRuleKey(rule.targetType, rule.category, rule.placement), rule);
    }

    return map;
  }

  private resolveScore(
    ruleMap: Map<string, HonorRule>,
    targetType: CompetitionTargetType,
    category: string | null,
    placement: CompetitionStandingPlacement
  ) {
    const rule = ruleMap.get(this.createRuleKey(targetType, category, placement));
    return rule ? rule.baseScore * rule.coefficient : 0;
  }

  private createRuleKey(
    targetType: CompetitionTargetType,
    category: string | null,
    placement: CompetitionStandingPlacement
  ) {
    return `${targetType}:${category?.trim() ?? ''}:${placement}`;
  }

  private addStandingStats(
    map: Map<string, RecalculateTargetStats>,
    targetId: string,
    placement: CompetitionStandingPlacement,
    score: number
  ) {
    const stats = map.get(targetId) ?? this.emptyStats();

    if (placement === CompetitionStandingPlacement.CHAMPION) {
      stats.championCount += 1;
    } else if (placement === CompetitionStandingPlacement.RUNNER_UP) {
      stats.runnerUpCount += 1;
    } else if (placement === CompetitionStandingPlacement.THIRD_PLACE) {
      stats.thirdPlaceCount += 1;
    } else if (placement === CompetitionStandingPlacement.FOURTH_PLACE) {
      stats.fourthPlaceCount += 1;
    }

    stats.medalCount = stats.championCount + stats.runnerUpCount + stats.thirdPlaceCount;
    stats.trophyCount =
      stats.championCount + stats.runnerUpCount + stats.thirdPlaceCount + stats.fourthPlaceCount;
    stats.honorScore += score;
    map.set(targetId, stats);
  }

  private async getCountryParticipationStats() {
    const groups = await this.prisma.player.groupBy({
      by: ['countryId'],
      where: {
        countryId: {
          not: null
        }
      },
      _count: {
        _all: true
      },
      _sum: {
        pa: true
      },
      _avg: {
        pa: true
      }
    });

    return new Map(
      groups
        .filter((group) => group.countryId)
        .map((group) => [
          group.countryId as string,
          {
            playerCount: group._count._all,
            totalPa: group._sum.pa,
            averagePa: group._avg.pa
          }
        ])
    );
  }

  private async getClubParticipationStats() {
    const groups = await this.prisma.player.groupBy({
      by: ['clubId'],
      where: {
        clubId: {
          not: null
        }
      },
      _count: {
        _all: true
      },
      _sum: {
        pa: true
      },
      _avg: {
        pa: true
      }
    });

    return new Map(
      groups
        .filter((group) => group.clubId)
        .map((group) => [
          group.clubId as string,
          {
            playerCount: group._count._all,
            totalPa: group._sum.pa,
            averagePa: group._avg.pa
          }
        ])
    );
  }

  private parseTargetType(value: CompetitionTargetType | undefined) {
    if (!value || !Object.values(CompetitionTargetType).includes(value)) {
      throw new BadRequestException('规则对象类型不合法。');
    }

    return value;
  }

  private parsePlacement(value: CompetitionStandingPlacement | undefined) {
    if (!value || !Object.values(CompetitionStandingPlacement).includes(value)) {
      throw new BadRequestException('名次类型不合法。');
    }

    return value;
  }

  private requiredText(value: unknown, label: string) {
    const text = this.optionalText(value);

    if (!text) {
      throw new BadRequestException(`${label}不能为空。`);
    }

    return text;
  }

  private optionalText(value: unknown) {
    return typeof value === 'string' && value.trim() ? value.trim() : null;
  }

  private toNumber(value: unknown, label: string) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      throw new BadRequestException(`${label}必须是数字。`);
    }

    return number;
  }

  private emptyStats() {
    return { ...EMPTY_TARGET_STATS };
  }

  private round(value: number) {
    return Math.round(value * 100) / 100;
  }

  private roundNullable(value: number | null | undefined) {
    return value === null || value === undefined ? null : this.round(value);
  }
}
