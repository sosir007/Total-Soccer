import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AwardScopeType, type AwardRule, type Prisma } from '@prisma/client';
import { resolvePagination } from '../common/pagination.js';
import { PrismaService } from '../database/prisma.service.js';
import type { AwardRuleListQuery, AwardRulePayload } from './award-rules.types.js';

interface PlayerAwardStats {
  awardCount: number;
  topAwardCount: number;
  honorScore: number;
}

const TOP_AWARD_PATTERN = /冠军|第一|第\s*1\s*名|金球奖|金奖/i;

@Injectable()
export class AwardRulesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: AwardRuleListQuery) {
    const pagination = resolvePagination(query);
    const where = this.buildWhere(query);
    const [items, total] = await this.prisma.$transaction([
      this.prisma.awardRule.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { scopeType: 'asc' }, { category: 'asc' }, { name: 'asc' }],
        skip: pagination.skip,
        take: pagination.take
      }),
      this.prisma.awardRule.count({ where })
    ]);

    return {
      items,
      page: pagination.page,
      pageSize: pagination.pageSize,
      total
    };
  }

  async create(body: AwardRulePayload) {
    const data = this.buildData(body);

    return this.prisma.awardRule.create({
      data
    });
  }

  async update(id: string, body: AwardRulePayload) {
    await this.assertExists(id);
    const data = this.buildData(body);

    return this.prisma.awardRule.update({
      where: { id },
      data
    });
  }

  async recalculate() {
    const [players, rules, recipients] = await Promise.all([
      this.prisma.player.findMany({ select: { id: true } }),
      this.prisma.awardRule.findMany({
        where: { enabled: true },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }]
      }),
      this.prisma.awardRecipient.findMany({
        include: {
          edition: {
            include: {
              award: {
                select: {
                  scopeType: true,
                  category: true
                }
              }
            }
          }
        }
      })
    ]);
    const sortedRules = this.sortRulesBySpecificity(rules);
    const statsByPlayer = new Map<string, PlayerAwardStats>();

    for (const recipient of recipients) {
      const stats = statsByPlayer.get(recipient.playerId) ?? this.emptyStats();
      const rule = this.findMatchingRule(sortedRules, {
        scopeType: recipient.edition.award.scopeType,
        category: recipient.edition.award.category,
        placement: recipient.placement,
        rank: recipient.rank
      });

      stats.awardCount += 1;
      if (this.isTopAward(recipient.rank, recipient.placement)) {
        stats.topAwardCount += 1;
      }
      if (rule) {
        stats.honorScore += rule.baseScore * rule.coefficient;
      }

      statsByPlayer.set(recipient.playerId, stats);
    }

    if (players.length > 0) {
      await this.prisma.$transaction(
        players.map((player) => {
          const stats = statsByPlayer.get(player.id) ?? this.emptyStats();

          return this.prisma.player.update({
            where: { id: player.id },
            data: {
              awardCount: stats.awardCount,
              topAwardCount: stats.topAwardCount,
              honorScore: this.round(stats.honorScore)
            }
          });
        })
      );
    }

    return {
      playerCount: players.length,
      recipientCount: recipients.length,
      enabledRuleCount: rules.length,
      scoredPlayerCount: [...statsByPlayer.values()].filter((stats) => stats.honorScore > 0).length
    };
  }

  private buildWhere(query: AwardRuleListQuery): Prisma.AwardRuleWhereInput {
    const keyword = query.keyword?.trim();

    return {
      ...(keyword
        ? {
            OR: [
              { code: { contains: keyword, mode: 'insensitive' } },
              { name: { contains: keyword, mode: 'insensitive' } },
              { category: { contains: keyword, mode: 'insensitive' } },
              { placement: { contains: keyword, mode: 'insensitive' } },
              { remark: { contains: keyword, mode: 'insensitive' } }
            ]
          }
        : {}),
      ...(query.scopeType ? { scopeType: this.parseScopeType(query.scopeType) } : {}),
      ...(query.enabled === undefined ? {} : { enabled: query.enabled === 'true' })
    };
  }

  private buildData(body: AwardRulePayload) {
    const code = this.requiredText(body.code, '规则编码');
    const name = this.requiredText(body.name, '规则名称');
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
      scopeType: body.scopeType ? this.parseScopeType(body.scopeType) : null,
      category: this.optionalText(body.category),
      placement: this.optionalText(body.placement),
      rank: this.optionalInteger(body.rank, '排名'),
      baseScore,
      coefficient,
      topAward: this.optionalBoolean(body.topAward) ?? false,
      enabled: this.optionalBoolean(body.enabled) ?? true,
      sortOrder: this.optionalInteger(body.sortOrder, '排序') ?? 0,
      remark: this.optionalText(body.remark)
    } satisfies Prisma.AwardRuleUncheckedCreateInput;
  }

  private async assertExists(id: string) {
    const rule = await this.prisma.awardRule.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!rule) {
      throw new NotFoundException('球员奖项规则不存在。');
    }
  }

  private sortRulesBySpecificity(rules: AwardRule[]) {
    return [...rules].sort((a, b) => {
      const specificity = this.ruleSpecificity(b) - this.ruleSpecificity(a);

      if (specificity !== 0) {
        return specificity;
      }

      return a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, 'zh-CN');
    });
  }

  private findMatchingRule(
    rules: AwardRule[],
    recipient: {
      scopeType: AwardScopeType;
      category: string | null;
      placement: string | null;
      rank: number | null;
    }
  ) {
    return rules.find((rule) => {
      if (rule.scopeType && rule.scopeType !== recipient.scopeType) {
        return false;
      }

      if (rule.category && this.normalize(rule.category) !== this.normalize(recipient.category)) {
        return false;
      }

      if (rule.rank !== null && rule.rank !== recipient.rank) {
        return false;
      }

      if (rule.placement) {
        const placement = this.normalize(recipient.placement);
        const rulePlacement = this.normalize(rule.placement);

        if (!placement || !placement.includes(rulePlacement)) {
          return false;
        }
      }

      return true;
    });
  }

  private ruleSpecificity(rule: AwardRule) {
    return [rule.scopeType, rule.category, rule.placement, rule.rank].filter(
      (item) => item !== null && item !== undefined && item !== ''
    ).length;
  }

  private isTopAward(rank: number | null, placement: string | null) {
    return rank === 1 || TOP_AWARD_PATTERN.test(placement ?? '');
  }

  private parseScopeType(value: AwardScopeType) {
    if (!Object.values(AwardScopeType).includes(value)) {
      throw new BadRequestException('奖项范围不合法。');
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

  private optionalInteger(value: unknown, label: string) {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const number = Number(value);

    if (!Number.isInteger(number)) {
      throw new BadRequestException(`${label}必须是整数。`);
    }

    return number;
  }

  private optionalBoolean(value: unknown) {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }

    if (typeof value === 'boolean') {
      return value;
    }

    if (value === 'true') {
      return true;
    }

    if (value === 'false') {
      return false;
    }

    return undefined;
  }

  private toNumber(value: unknown, label: string) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      throw new BadRequestException(`${label}必须是数字。`);
    }

    return number;
  }

  private normalize(value?: string | null) {
    return value?.trim().toLowerCase() ?? '';
  }

  private emptyStats(): PlayerAwardStats {
    return {
      awardCount: 0,
      topAwardCount: 0,
      honorScore: 0
    };
  }

  private round(value: number) {
    return Math.round(value * 100) / 100;
  }
}
