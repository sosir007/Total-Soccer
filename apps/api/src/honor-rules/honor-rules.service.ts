import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  CompetitionScopeType,
  CompetitionStandingPlacement,
  CompetitionTargetType,
  HonorRuleConversionType,
  HonorRulePlacementScope,
  Prisma,
  type HonorRule
} from '@prisma/client';
import { resolvePagination } from '../common/pagination.js';
import { PrismaService } from '../database/prisma.service.js';
import type {
  HonorRuleDefaultDefinition,
  HonorRuleListQuery,
  HonorRulePayload
} from './honor-rules.types.js';

interface RecalculateTargetStats {
  championCount: number;
  runnerUpCount: number;
  thirdPlaceCount: number;
  fourthPlaceCount: number;
  semiFinalistCount: number;
  medalCount: number;
  trophyCount: number;
  honorScore: number;
}

type RuleWithRelations = HonorRule & {
  coefficients: Array<{
    confederationId: string | null;
    countryId: string | null;
    coefficient: number;
  }>;
};

type CompetitionForScoring = {
  id: string;
  targetType: CompetitionTargetType;
  scopeType: CompetitionScopeType;
  category: string | null;
  level: string | null;
  format: string | null;
  confederationId: string | null;
  countryId: string | null;
  scopeConfederations: Array<{ confederationId: string }>;
  scopeCountries: Array<{ countryId: string }>;
  editions: Array<{ year: number | null; quantity: number | null }>;
};

const EMPTY_TARGET_STATS: RecalculateTargetStats = {
  championCount: 0,
  runnerUpCount: 0,
  thirdPlaceCount: 0,
  fourthPlaceCount: 0,
  semiFinalistCount: 0,
  medalCount: 0,
  trophyCount: 0,
  honorScore: 0
};

const DEPRECATED_RULE_CODES = ['CLUB_INTERNATIONAL_LEVEL_2_OTHER'];

const DEFAULT_RULES: HonorRuleDefaultDefinition[] = [
  {
    code: 'COUNTRY_INTERNATIONAL_LEVEL_1_OTHER',
    name: '国家队国际一级',
    targetType: CompetitionTargetType.COUNTRY,
    category: '国际',
    level: '一级',
    format: '杯赛',
    scopeType: CompetitionScopeType.GLOBAL,
    baseScore: 32,
    placementScope: HonorRulePlacementScope.TOP_FOUR,
    conversionType: HonorRuleConversionType.NONE,
    sortOrder: 10,
    remark: '世界杯等国家队国际一级赛事。'
  },
  {
    code: 'COUNTRY_INTERNATIONAL_LEVEL_2_OTHER',
    name: '国家队国际二级',
    targetType: CompetitionTargetType.COUNTRY,
    category: '国际',
    level: '二级',
    format: '杯赛',
    scopeType: CompetitionScopeType.GLOBAL,
    baseScore: 8,
    placementScope: HonorRulePlacementScope.TOP_FOUR,
    conversionType: HonorRuleConversionType.NONE,
    sortOrder: 20,
    remark: '联合会杯等国家队国际二级赛事。'
  },
  {
    code: 'COUNTRY_INTERNATIONAL_LEVEL_3_OTHER',
    name: '国家队国际三级',
    targetType: CompetitionTargetType.COUNTRY,
    category: '国际',
    level: '三级',
    format: '杯赛',
    scopeType: CompetitionScopeType.GLOBAL,
    baseScore: 6,
    placementScope: HonorRulePlacementScope.TOP_FOUR,
    conversionType: HonorRuleConversionType.OLYMPIC_STAGE,
    sortOrder: 30,
    remark: '奥运会男足按年份阶段换算。'
  },
  {
    code: 'COUNTRY_CONTINENTAL_LEVEL_1_CUP',
    name: '国家队洲际一级杯赛',
    targetType: CompetitionTargetType.COUNTRY,
    category: '洲际',
    level: '一级',
    format: '杯赛',
    scopeType: CompetitionScopeType.CONFEDERATION,
    baseScore: 16,
    placementScope: HonorRulePlacementScope.TOP_FOUR,
    conversionType: HonorRuleConversionType.FREQUENCY_SCALE,
    sortOrder: 40,
    remark: '欧洲杯、美洲杯、亚洲杯、非洲杯等，后台按频率和规模换算。',
    confederationCoefficients: [
      { matcher: ['UEFA', '欧足联', '欧洲'], coefficient: 1 },
      { matcher: ['CONMEBOL', '南美'], coefficient: 0.8 },
      { matcher: ['AFC', '亚足联', '亚洲'], coefficient: 0.6 },
      { matcher: ['CAF', '非足联', '非洲'], coefficient: 0.65 },
      { matcher: ['CONCACAF', '中北美'], coefficient: 0.45 },
      { matcher: ['OFC', '大洋'], coefficient: 0.25 }
    ]
  },
  {
    code: 'COUNTRY_OTHER_LEVEL_1_CUP',
    name: '国家队其他一级杯赛',
    targetType: CompetitionTargetType.COUNTRY,
    category: '其他',
    level: '一级',
    format: '杯赛',
    baseScore: 3,
    placementScope: HonorRulePlacementScope.TOP_TWO,
    conversionType: HonorRuleConversionType.NONE,
    sortOrder: 50
  },
  {
    code: 'COUNTRY_OTHER_LEVEL_2_CUP',
    name: '国家队其他二级杯赛',
    targetType: CompetitionTargetType.COUNTRY,
    category: '其他',
    level: '二级',
    format: '杯赛',
    baseScore: 2,
    placementScope: HonorRulePlacementScope.TOP_TWO,
    conversionType: HonorRuleConversionType.NONE,
    sortOrder: 60
  },
  {
    code: 'CLUB_INTERNATIONAL_LEVEL_1_CUP',
    name: '俱乐部国际一级杯赛',
    targetType: CompetitionTargetType.CLUB,
    category: '国际',
    level: '一级',
    format: '杯赛',
    scopeType: CompetitionScopeType.GLOBAL,
    baseScore: 12,
    placementScope: HonorRulePlacementScope.TOP_FOUR,
    conversionType: HonorRuleConversionType.CLUB_WORLD_CUP_STAGE,
    sortOrder: 110,
    remark: '2025 后新世俱杯等俱乐部国际一级杯赛。'
  },
  {
    code: 'CLUB_INTERNATIONAL_LEVEL_2_CUP',
    name: '俱乐部国际二级杯赛',
    targetType: CompetitionTargetType.CLUB,
    category: '国际',
    level: '二级',
    format: '杯赛',
    scopeType: CompetitionScopeType.GLOBAL,
    baseScore: 8,
    placementScope: HonorRulePlacementScope.TOP_TWO,
    conversionType: HonorRuleConversionType.CLUB_WORLD_CUP_STAGE,
    sortOrder: 120,
    remark: '旧世俱杯等俱乐部国际二级杯赛。'
  },
  {
    code: 'CLUB_INTERNATIONAL_LEVEL_3_CUP',
    name: '俱乐部国际三级杯赛',
    targetType: CompetitionTargetType.CLUB,
    category: '国际',
    level: '三级',
    format: '杯赛',
    scopeType: CompetitionScopeType.GLOBAL,
    baseScore: 6,
    placementScope: HonorRulePlacementScope.TOP_TWO,
    conversionType: HonorRuleConversionType.NONE,
    sortOrder: 130,
    remark: '丰田杯、洲际杯等单场世界冠军杯。'
  },
  {
    code: 'CLUB_CONTINENTAL_LEVEL_1_CUP',
    name: '俱乐部洲际一级杯赛',
    targetType: CompetitionTargetType.CLUB,
    category: '洲际',
    level: '一级',
    format: '杯赛',
    scopeType: CompetitionScopeType.CONFEDERATION,
    baseScore: 16,
    placementScope: HonorRulePlacementScope.TOP_TWO,
    conversionType: HonorRuleConversionType.NONE,
    sortOrder: 150,
    confederationCoefficients: clubConfederationCoefficients()
  },
  {
    code: 'CLUB_CONTINENTAL_LEVEL_2_CUP',
    name: '俱乐部洲际二级杯赛',
    targetType: CompetitionTargetType.CLUB,
    category: '洲际',
    level: '二级',
    format: '杯赛',
    scopeType: CompetitionScopeType.CONFEDERATION,
    baseScore: 8,
    placementScope: HonorRulePlacementScope.TOP_TWO,
    conversionType: HonorRuleConversionType.NONE,
    sortOrder: 160,
    confederationCoefficients: clubConfederationCoefficients()
  },
  {
    code: 'CLUB_CONTINENTAL_LEVEL_3_CUP',
    name: '俱乐部洲际三级杯赛',
    targetType: CompetitionTargetType.CLUB,
    category: '洲际',
    level: '三级',
    format: '杯赛',
    scopeType: CompetitionScopeType.CONFEDERATION,
    baseScore: 4,
    placementScope: HonorRulePlacementScope.TOP_TWO,
    conversionType: HonorRuleConversionType.NONE,
    sortOrder: 170,
    confederationCoefficients: clubConfederationCoefficients()
  },
  {
    code: 'CLUB_CONTINENTAL_LEVEL_4_CUP',
    name: '俱乐部洲际四级杯赛',
    targetType: CompetitionTargetType.CLUB,
    category: '洲际',
    level: '四级',
    format: '杯赛',
    scopeType: CompetitionScopeType.CONFEDERATION,
    baseScore: 2,
    placementScope: HonorRulePlacementScope.TOP_TWO,
    conversionType: HonorRuleConversionType.NONE,
    sortOrder: 180,
    confederationCoefficients: clubConfederationCoefficients()
  },
  {
    code: 'CLUB_DOMESTIC_LEVEL_1_LEAGUE',
    name: '俱乐部国内一级联赛',
    targetType: CompetitionTargetType.CLUB,
    category: '国内',
    level: '一级',
    format: '联赛',
    scopeType: CompetitionScopeType.COUNTRY,
    baseScore: 8,
    qualityCoefficient: 0.5,
    placementScope: HonorRulePlacementScope.LEAGUE_TOP_THREE,
    conversionType: HonorRuleConversionType.NONE,
    sortOrder: 190,
    countryCoefficients: domesticCountryCoefficients()
  },
  {
    code: 'CLUB_DOMESTIC_LEVEL_2_LEAGUE',
    name: '俱乐部国内二级联赛',
    targetType: CompetitionTargetType.CLUB,
    category: '国内',
    level: '二级',
    format: '联赛',
    scopeType: CompetitionScopeType.COUNTRY,
    baseScore: 2,
    qualityCoefficient: 0.5,
    placementScope: HonorRulePlacementScope.LEAGUE_TOP_THREE,
    conversionType: HonorRuleConversionType.NONE,
    sortOrder: 200,
    countryCoefficients: domesticCountryCoefficients()
  },
  {
    code: 'CLUB_DOMESTIC_LEVEL_1_CUP',
    name: '俱乐部国内一级杯赛',
    targetType: CompetitionTargetType.CLUB,
    category: '国内',
    level: '一级',
    format: '杯赛',
    scopeType: CompetitionScopeType.COUNTRY,
    baseScore: 3,
    qualityCoefficient: 0.5,
    placementScope: HonorRulePlacementScope.TOP_TWO,
    conversionType: HonorRuleConversionType.NONE,
    sortOrder: 210,
    countryCoefficients: domesticCountryCoefficients()
  },
  {
    code: 'CLUB_DOMESTIC_LEVEL_2_CUP',
    name: '俱乐部国内二级杯赛',
    targetType: CompetitionTargetType.CLUB,
    category: '国内',
    level: '二级',
    format: '杯赛',
    scopeType: CompetitionScopeType.COUNTRY,
    baseScore: 2,
    qualityCoefficient: 0.5,
    placementScope: HonorRulePlacementScope.TOP_TWO,
    conversionType: HonorRuleConversionType.NONE,
    sortOrder: 220,
    countryCoefficients: domesticCountryCoefficients()
  },
  {
    code: 'CLUB_DOMESTIC_LEVEL_3_CUP',
    name: '俱乐部国内三级杯赛',
    targetType: CompetitionTargetType.CLUB,
    category: '国内',
    level: '三级',
    format: '杯赛',
    scopeType: CompetitionScopeType.COUNTRY,
    baseScore: 1,
    qualityCoefficient: 0.5,
    placementScope: HonorRulePlacementScope.TOP_TWO,
    conversionType: HonorRuleConversionType.NONE,
    sortOrder: 230,
    countryCoefficients: domesticCountryCoefficients()
  },
  {
    code: 'CLUB_OTHER_LEVEL_1_CUP',
    name: '俱乐部其他一级杯赛',
    targetType: CompetitionTargetType.CLUB,
    category: '其他',
    level: '一级',
    format: '杯赛',
    baseScore: 2,
    placementScope: HonorRulePlacementScope.TOP_TWO,
    conversionType: HonorRuleConversionType.NONE,
    sortOrder: 240
  }
];

@Injectable()
export class HonorRulesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: HonorRuleListQuery) {
    await this.ensureDefaultRules();
    const pagination = resolvePagination(query);
    const where = this.buildWhere(query);
    const [items, total] = await this.prisma.$transaction([
      this.prisma.honorRule.findMany({
        where,
        include: this.ruleInclude(),
        orderBy: [
          { targetType: 'asc' },
          { sortOrder: 'asc' },
          { category: 'asc' },
          { level: 'asc' },
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

  async create() {
    throw new BadRequestException('荣誉规则为系统预置规则，不支持新增。');
  }

  async update(id: string, body: HonorRulePayload) {
    const rule = await this.assertExists(id);
    const typicalCompetitionIds = await this.parseTypicalCompetitionIds(body.typicalCompetitionIds);

    return this.prisma.$transaction(async (tx) => {
      await tx.honorRule.update({
        where: { id },
        data: {
          championScore: this.optionalNumber(body.championScore, '冠军分'),
          runnerUpScore: this.optionalNumber(body.runnerUpScore, '亚军分'),
          thirdPlaceScore: this.optionalNumber(body.thirdPlaceScore, '季军分'),
          fourthPlaceScore: this.optionalNumber(body.fourthPlaceScore, '殿军分'),
          semiFinalistScore: this.optionalNumber(body.semiFinalistScore, '四强分'),
          remark: this.optionalText(body.remark)
        }
      });
      await tx.honorRuleCompetition.deleteMany({ where: { honorRuleId: rule.id } });

      if (typicalCompetitionIds.length) {
        await tx.honorRuleCompetition.createMany({
          data: typicalCompetitionIds.map((competitionId) => ({
            honorRuleId: rule.id,
            competitionId
          })),
          skipDuplicates: true
        });
      }

      return tx.honorRule.findUniqueOrThrow({
        where: { id },
        include: this.ruleInclude()
      });
    });
  }

  async recalculate() {
    await this.ensureDefaultRules();
    const [rules, standings, countryParticipation, clubParticipation, countries, clubs, links] =
      await Promise.all([
        this.prisma.honorRule.findMany({
          where: { enabled: true, isSystem: true },
          include: { coefficients: true }
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
                  include: {
                    scopeConfederations: { select: { confederationId: true } },
                    scopeCountries: { select: { countryId: true } },
                    editions: { select: { year: true, quantity: true } }
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

    const countryStats = new Map<string, RecalculateTargetStats>();
    const clubStats = new Map<string, RecalculateTargetStats>();
    const successorMap = new Map<string, string[]>();

    for (const link of links) {
      const successors = successorMap.get(link.historicalCountryId) ?? [];
      successors.push(link.successorCountryId);
      successorMap.set(link.historicalCountryId, successors);
    }

    for (const standing of standings) {
      const competition = standing.edition.competition;
      const rule = this.resolveRule(rules, competition, standing.placement);

      if (!rule) {
        continue;
      }

      const score = this.resolveStandingScore(
        rule,
        competition,
        standing.placement,
        standing.edition.year,
        standing.edition.quantity
      );

      if (competition.targetType === CompetitionTargetType.COUNTRY && standing.countryId) {
        const targetIds = successorMap.get(standing.countryId) ?? [standing.countryId];

        for (const targetId of targetIds) {
          this.addStandingStats(countryStats, targetId, standing.placement, score);
        }
      }

      if (competition.targetType === CompetitionTargetType.CLUB && standing.clubId) {
        this.addStandingStats(clubStats, standing.clubId, standing.placement, score);
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
            trophyCount: stats.trophyCount,
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
      isSystem: true,
      ...(keyword
        ? {
            OR: [
              { code: { contains: keyword, mode: 'insensitive' } },
              { name: { contains: keyword, mode: 'insensitive' } },
              { category: { contains: keyword, mode: 'insensitive' } },
              { level: { contains: keyword, mode: 'insensitive' } },
              { format: { contains: keyword, mode: 'insensitive' } },
              { remark: { contains: keyword, mode: 'insensitive' } }
            ]
          }
        : {}),
      ...(query.targetType ? { targetType: this.parseTargetType(query.targetType) } : {}),
      ...(query.enabled === undefined ? {} : { enabled: query.enabled === 'true' })
    };
  }

  private async assertExists(id: string) {
    const rule = await this.prisma.honorRule.findUnique({
      where: { id },
      select: { id: true, isSystem: true }
    });

    if (!rule || !rule.isSystem) {
      throw new NotFoundException('荣誉规则不存在。');
    }

    return rule;
  }

  private ruleInclude() {
    return {
      confederation: {
        select: { id: true, uid: true, code: true, name: true }
      },
      country: {
        select: { id: true, uid: true, name: true }
      },
      typicalCompetitions: {
        include: {
          competition: {
            select: {
              id: true,
              code: true,
              name: true,
              targetType: true,
              category: true,
              level: true,
              format: true
            }
          }
        },
        orderBy: { competition: { sortOrder: 'asc' } }
      },
      coefficients: {
        include: {
          confederation: {
            select: { id: true, uid: true, code: true, name: true }
          },
          country: {
            select: { id: true, uid: true, name: true }
          }
        },
        orderBy: [{ coefficient: 'desc' }, { createdAt: 'asc' }]
      }
    } satisfies Prisma.HonorRuleInclude;
  }

  private async ensureDefaultRules() {
    await this.prisma.honorRule.deleteMany({
      where: {
        code: { in: DEPRECATED_RULE_CODES },
        isSystem: true
      }
    });

    const [confederations, countries] = await Promise.all([
      this.prisma.confederation.findMany({
        select: { id: true, uid: true, code: true, name: true }
      }),
      this.prisma.country.findMany({ select: { id: true, uid: true, name: true } })
    ]);

    for (const definition of DEFAULT_RULES) {
      const rule = await this.prisma.honorRule.upsert({
        where: { code: definition.code },
        create: this.defaultRuleData(definition),
        update: this.defaultRuleUpdateData(definition)
      });
      const semiFinalistScore =
        definition.semiFinalistScore ?? this.defaultSemiFinalistScore(definition);

      if (rule.semiFinalistScore === null && semiFinalistScore !== null) {
        await this.prisma.honorRule.update({
          where: { id: rule.id },
          data: { semiFinalistScore }
        });
      }

      await this.prisma.honorRuleCoefficient.deleteMany({ where: { honorRuleId: rule.id } });
      const coefficientData = [
        ...this.resolveConfederationCoefficients(rule.id, definition, confederations),
        ...this.resolveCountryCoefficients(rule.id, definition, countries)
      ];

      if (coefficientData.length) {
        await this.prisma.honorRuleCoefficient.createMany({
          data: coefficientData
        });
      }
    }
  }

  private defaultRuleData(definition: HonorRuleDefaultDefinition) {
    return {
      code: definition.code,
      name: definition.name,
      targetType: definition.targetType,
      category: definition.category,
      level: definition.level,
      format: definition.format,
      scopeType: definition.scopeType ?? null,
      baseScore: definition.baseScore,
      championScore: definition.championScore ?? definition.baseScore,
      runnerUpScore: definition.runnerUpScore ?? this.defaultPlacementScore(definition, 'runner'),
      thirdPlaceScore:
        definition.thirdPlaceScore ?? this.defaultPlacementScore(definition, 'third'),
      fourthPlaceScore:
        definition.fourthPlaceScore ?? this.defaultPlacementScore(definition, 'fourth'),
      semiFinalistScore: definition.semiFinalistScore ?? this.defaultSemiFinalistScore(definition),
      coefficient: 1,
      qualityCoefficient: definition.qualityCoefficient ?? 1,
      placementScope: definition.placementScope,
      conversionType: definition.conversionType,
      isSystem: true,
      enabled: true,
      sortOrder: definition.sortOrder,
      remark: definition.remark ?? null
    } satisfies Prisma.HonorRuleUncheckedCreateInput;
  }

  private defaultRuleUpdateData(definition: HonorRuleDefaultDefinition) {
    return {
      name: definition.name,
      targetType: definition.targetType,
      category: definition.category,
      level: definition.level,
      format: definition.format,
      scopeType: definition.scopeType ?? null,
      baseScore: definition.baseScore,
      coefficient: 1,
      qualityCoefficient: definition.qualityCoefficient ?? 1,
      placementScope: definition.placementScope,
      conversionType: definition.conversionType,
      isSystem: true,
      sortOrder: definition.sortOrder
    } satisfies Prisma.HonorRuleUncheckedUpdateInput;
  }

  private defaultPlacementScore(
    definition: HonorRuleDefaultDefinition,
    placement: 'runner' | 'third' | 'fourth'
  ) {
    const score = definition.baseScore;

    if (definition.placementScope === HonorRulePlacementScope.CHAMPION_ONLY) {
      return null;
    }

    if (definition.placementScope === HonorRulePlacementScope.LEAGUE_TOP_THREE) {
      if (placement === 'runner') return score * 0.4;
      if (placement === 'third') return score * 0.25;
      return null;
    }

    if (definition.placementScope === HonorRulePlacementScope.TOP_TWO) {
      return placement === 'runner' ? score * 0.5 : null;
    }

    if (definition.placementScope === HonorRulePlacementScope.TOP_THREE) {
      if (placement === 'runner') return score * 0.5;
      if (placement === 'third') return score * 0.3;
      return null;
    }

    if (placement === 'runner') return score * 0.5;
    if (placement === 'third') return score * 0.3;
    return score * 0.2;
  }

  private defaultSemiFinalistScore(definition: HonorRuleDefaultDefinition) {
    if (definition.placementScope !== HonorRulePlacementScope.TOP_FOUR) {
      return null;
    }

    const third = definition.thirdPlaceScore ?? this.defaultPlacementScore(definition, 'third');
    const fourth = definition.fourthPlaceScore ?? this.defaultPlacementScore(definition, 'fourth');

    return third === null || fourth === null ? null : (third + fourth) / 2;
  }

  private resolveConfederationCoefficients(
    ruleId: string,
    definition: HonorRuleDefaultDefinition,
    confederations: Array<{ id: string; uid: string; code: string | null; name: string }>
  ) {
    return (definition.confederationCoefficients ?? []).flatMap((item) => {
      const confederation = confederations.find((candidate) =>
        item.matcher.some((matcher) =>
          [candidate.uid, candidate.code, candidate.name]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(matcher.toLowerCase()))
        )
      );

      return confederation
        ? [
            {
              honorRuleId: ruleId,
              confederationId: confederation.id,
              coefficient: item.coefficient
            }
          ]
        : [];
    });
  }

  private resolveCountryCoefficients(
    ruleId: string,
    definition: HonorRuleDefaultDefinition,
    countries: Array<{ id: string; uid: string; name: string }>
  ) {
    return (definition.countryCoefficients ?? []).flatMap((item) => {
      const country = countries.find((candidate) => candidate.uid === item.uid);

      return country
        ? [{ honorRuleId: ruleId, countryId: country.id, coefficient: item.coefficient }]
        : [];
    });
  }

  private resolveRule(
    rules: RuleWithRelations[],
    competition: CompetitionForScoring,
    placement: CompetitionStandingPlacement
  ) {
    return rules
      .filter(
        (rule) => this.ruleMatches(rule, competition) && this.scopeAllowsPlacement(rule, placement)
      )
      .sort((a, b) => this.ruleSpecificity(b) - this.ruleSpecificity(a))[0];
  }

  private ruleMatches(rule: RuleWithRelations, competition: CompetitionForScoring) {
    return (
      rule.targetType === competition.targetType &&
      this.sameText(rule.category, competition.category) &&
      this.sameText(rule.level, competition.level) &&
      this.formatMatches(rule.format, competition) &&
      (!rule.scopeType || rule.scopeType === competition.scopeType) &&
      (!rule.confederationId ||
        this.competitionConfederationIds(competition).includes(rule.confederationId)) &&
      (!rule.countryId || this.competitionCountryIds(competition).includes(rule.countryId))
    );
  }

  private formatMatches(ruleFormat: string | null, competition: CompetitionForScoring) {
    if (this.sameText(ruleFormat, competition.format)) {
      return true;
    }

    return (
      competition.format === '其他' && ruleFormat === '杯赛' && competition.category !== '国内'
    );
  }

  private ruleSpecificity(rule: RuleWithRelations) {
    return [
      rule.confederationId,
      rule.countryId,
      rule.scopeType,
      rule.format,
      rule.level,
      rule.category
    ].filter(Boolean).length;
  }

  private resolveStandingScore(
    rule: RuleWithRelations,
    competition: CompetitionForScoring,
    placement: CompetitionStandingPlacement,
    year: number | null,
    quantity: number | null
  ) {
    const placementScore = this.placementScore(rule, placement);

    if (placementScore === null) {
      return 0;
    }

    return (
      placementScore *
      this.resolveQualityCoefficient(rule, competition) *
      this.resolveConversionCoefficient(rule, competition, year, quantity)
    );
  }

  private placementScore(rule: RuleWithRelations, placement: CompetitionStandingPlacement) {
    if (!this.scopeAllowsPlacement(rule, placement)) {
      return null;
    }

    if (placement === CompetitionStandingPlacement.CHAMPION)
      return rule.championScore ?? rule.baseScore;
    if (placement === CompetitionStandingPlacement.RUNNER_UP) return rule.runnerUpScore;
    if (placement === CompetitionStandingPlacement.THIRD_PLACE) return rule.thirdPlaceScore;
    if (placement === CompetitionStandingPlacement.FOURTH_PLACE) return rule.fourthPlaceScore;
    if (placement === CompetitionStandingPlacement.SEMI_FINALIST) return rule.semiFinalistScore;
    return null;
  }

  private scopeAllowsPlacement(rule: RuleWithRelations, placement: CompetitionStandingPlacement) {
    if (placement === CompetitionStandingPlacement.CHAMPION) return true;

    if (placement === CompetitionStandingPlacement.RUNNER_UP) {
      return rule.placementScope !== HonorRulePlacementScope.CHAMPION_ONLY;
    }

    if (placement === CompetitionStandingPlacement.THIRD_PLACE) {
      const thirdPlaceScopes: HonorRulePlacementScope[] = [
        HonorRulePlacementScope.TOP_THREE,
        HonorRulePlacementScope.TOP_FOUR,
        HonorRulePlacementScope.LEAGUE_TOP_THREE
      ];

      return thirdPlaceScopes.includes(rule.placementScope);
    }

    if (placement === CompetitionStandingPlacement.FOURTH_PLACE) {
      return rule.placementScope === HonorRulePlacementScope.TOP_FOUR;
    }

    return rule.placementScope === HonorRulePlacementScope.TOP_FOUR;
  }

  private resolveQualityCoefficient(rule: RuleWithRelations, competition: CompetitionForScoring) {
    const confederationIds = this.competitionConfederationIds(competition);
    const countryIds = this.competitionCountryIds(competition);
    const coefficient = rule.coefficients.find(
      (item) =>
        (item.confederationId && confederationIds.includes(item.confederationId)) ||
        (item.countryId && countryIds.includes(item.countryId))
    );

    return coefficient?.coefficient ?? rule.qualityCoefficient;
  }

  private resolveConversionCoefficient(
    rule: RuleWithRelations,
    competition: CompetitionForScoring,
    year: number | null,
    quantity: number | null
  ) {
    if (rule.conversionType === HonorRuleConversionType.FREQUENCY_SCALE) {
      return this.frequencyCoefficient(competition) * this.scaleCoefficient(competition, quantity);
    }

    if (rule.conversionType === HonorRuleConversionType.OLYMPIC_STAGE) {
      if (!year) return 1;
      if (year <= 1928) return 2;
      if (year <= 1980) return 4 / 3;
      if (year <= 1988) return 1;
      return 2 / 3;
    }

    return 1;
  }

  private frequencyCoefficient(competition: CompetitionForScoring) {
    const years = competition.editions.map((edition) => edition.year).filter(isNumber);

    if (years.length < 2) {
      return 1;
    }

    const firstYear = Math.min(...years);
    const lastYear = Math.max(...years);
    const averageGap = (lastYear - firstYear) / (years.length - 1);

    return Math.min(averageGap / 4, 1);
  }

  private scaleCoefficient(competition: CompetitionForScoring, quantity: number | null) {
    const resolvedQuantity =
      quantity ?? this.median(competition.editions.map((edition) => edition.quantity));

    if (!resolvedQuantity) return 1;
    if (resolvedQuantity >= 24) return 1;
    if (resolvedQuantity >= 16) return 0.9;
    if (resolvedQuantity >= 10) return 0.75;
    if (resolvedQuantity >= 8) return 0.65;
    if (resolvedQuantity >= 4) return 0.5;
    if (resolvedQuantity === 3) return 0.35;
    if (resolvedQuantity === 2) return 0.25;
    return 0;
  }

  private median(values: Array<number | null>) {
    const numbers = values.filter(isNumber).sort((a, b) => a - b);

    if (!numbers.length) return null;

    return numbers[Math.floor(numbers.length / 2)];
  }

  private competitionConfederationIds(competition: CompetitionForScoring) {
    return [
      competition.confederationId,
      ...competition.scopeConfederations.map((item) => item.confederationId)
    ].filter(isString);
  }

  private competitionCountryIds(competition: CompetitionForScoring) {
    return [
      competition.countryId,
      ...competition.scopeCountries.map((item) => item.countryId)
    ].filter(isString);
  }

  private sameText(left?: string | null, right?: string | null) {
    return (left?.trim() ?? '') === (right?.trim() ?? '');
  }

  private async parseTypicalCompetitionIds(value: unknown) {
    if (!Array.isArray(value)) {
      return [];
    }

    const ids = [...new Set(value.filter(isString))];

    if (!ids.length) {
      return [];
    }

    const count = await this.prisma.competition.count({
      where: { id: { in: ids } }
    });

    if (count !== ids.length) {
      throw new BadRequestException('典型命中赛事包含不存在的赛事。');
    }

    return ids;
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
    } else if (placement === CompetitionStandingPlacement.SEMI_FINALIST) {
      stats.semiFinalistCount += 1;
    }

    stats.medalCount = stats.championCount + stats.runnerUpCount + stats.thirdPlaceCount;
    stats.trophyCount =
      stats.championCount +
      stats.runnerUpCount +
      stats.thirdPlaceCount +
      stats.fourthPlaceCount +
      stats.semiFinalistCount;
    stats.honorScore += score;
    map.set(targetId, stats);
  }

  private async getCountryParticipationStats() {
    const groups = await this.prisma.player.groupBy({
      by: ['countryId'],
      where: { countryId: { not: null } },
      _count: { _all: true },
      _sum: { pa: true },
      _avg: { pa: true }
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
      where: { clubId: { not: null } },
      _count: { _all: true },
      _sum: { pa: true },
      _avg: { pa: true }
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

  private optionalText(value: unknown) {
    return typeof value === 'string' && value.trim() ? value.trim() : null;
  }

  private optionalNumber(value: unknown, label: string) {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const number = Number(value);

    if (!Number.isFinite(number) || number < 0) {
      throw new BadRequestException(`${label}必须是不小于 0 的数字。`);
    }

    return number;
  }

  private emptyStats() {
    return { ...EMPTY_TARGET_STATS };
  }

  private round(value: number) {
    return Math.round(value * 100) / 100;
  }

  private roundNullable(value?: number | null) {
    return value === null || value === undefined ? null : this.round(value);
  }
}

function clubConfederationCoefficients() {
  return [
    { matcher: ['UEFA', '欧足联', '欧洲'], coefficient: 1 },
    { matcher: ['CONMEBOL', '南美'], coefficient: 0.8 },
    { matcher: ['AFC', '亚足联', '亚洲'], coefficient: 0.6 },
    { matcher: ['CAF', '非足联', '非洲'], coefficient: 0.6 },
    { matcher: ['CONCACAF', '中北美'], coefficient: 0.55 },
    { matcher: ['OFC', '大洋'], coefficient: 0.25 }
  ];
}

function domesticCountryCoefficients() {
  return [
    { uid: '765', coefficient: 1 },
    { uid: '796', coefficient: 1 },
    { uid: '776', coefficient: 1 },
    { uid: '771', coefficient: 1 },
    { uid: '769', coefficient: 0.85 },
    { uid: '1651', coefficient: 0.75 },
    { uid: '1649', coefficient: 0.75 },
    { uid: '788', coefficient: 0.65 },
    { uid: '784', coefficient: 0.65 }
  ];
}

function isString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}
