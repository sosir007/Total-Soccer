import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  AwardScopeType,
  AwardTargetType,
  HonorRuleConversionType,
  type AwardRule,
  type Prisma
} from '@prisma/client';
import { resolvePagination } from '../common/pagination.js';
import { PrismaService } from '../database/prisma.service.js';
import { DEFAULT_AWARD_RULES, type AwardRuleDefaultDefinition } from './default-award-rules.js';
import type { AwardRuleListQuery, AwardRulePayload } from './award-rules.types.js';

interface PlayerAwardStats {
  awardCount: number;
  topAwardCount: number;
  honorScore: number;
}

type AwardRuleMatchTarget = {
  scopeType: AwardScopeType;
  category: string | null;
  placement: string | null;
  rank: number | null;
};

type ScoredAwardRecipient = {
  playerId: string;
  groupKey: string;
  rule: AwardRule;
  score: number;
};

type CompetitionHonorRule = Prisma.HonorRuleGetPayload<{ include: { coefficients: true } }>;

type AwardEventCompetition = Prisma.CompetitionGetPayload<{
  include: {
    scopeConfederations: true;
    scopeCountries: true;
    editions: {
      select: {
        year: true;
        quantity: true;
      };
    };
  };
}>;

@Injectable()
export class AwardRulesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: AwardRuleListQuery) {
    await this.ensureDefaultRules();
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

  async initializeDefaults() {
    return this.ensureDefaultRules({ reset: true });
  }

  async recalculate() {
    await this.ensureDefaultRules();
    const [players, rules, competitionHonorRules, recipients] = await Promise.all([
      this.prisma.player.findMany({ select: { id: true } }),
      this.prisma.awardRule.findMany({
        where: { enabled: true },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }]
      }),
      this.prisma.honorRule.findMany({
        where: { enabled: true },
        include: { coefficients: true },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }]
      }),
      this.prisma.awardRecipient.findMany({
        where: { targetType: AwardTargetType.PLAYER },
        include: {
          edition: {
            include: {
              competitionEdition: {
                select: {
                  id: true,
                  year: true,
                  quantity: true
                }
              },
              award: {
                include: {
                  competition: {
                    include: {
                      scopeConfederations: true,
                      scopeCountries: true,
                      editions: {
                        select: {
                          year: true,
                          quantity: true
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      })
    ]);
    const sortedRules = this.sortRulesBySpecificity(rules);
    const statsByPlayer = new Map<string, PlayerAwardStats>();
    const scoredRecipients: ScoredAwardRecipient[] = [];
    const lineupGroups = new Set<string>();

    for (const recipient of recipients) {
      if (!recipient.playerId) {
        continue;
      }

      const stats = statsByPlayer.get(recipient.playerId) ?? this.emptyStats();
      const rule = this.findMatchingRule(sortedRules, {
        scopeType: recipient.edition.award.scopeType,
        category: recipient.edition.award.category,
        placement: recipient.placement,
        rank: recipient.rank
      });

      stats.awardCount += 1;
      if (rule?.topAward) {
        stats.topAwardCount += 1;
      }
      if (rule) {
        const scoredRecipient = {
          playerId: recipient.playerId,
          groupKey: this.buildCombinationGroupKey({
            playerId: recipient.playerId,
            period: this.resolveEditionPeriod(recipient.edition),
            scopeType: recipient.edition.award.scopeType,
            confederationId: recipient.edition.award.confederationId,
            countryId: recipient.edition.award.countryId,
            category: rule.category
          }),
          rule,
          score:
            rule.baseScore *
            rule.coefficient *
            this.resolveEventAwardCoefficient({
              competition: recipient.edition.award.competition,
              competitionEdition: recipient.edition.competitionEdition,
              honorRules: competitionHonorRules
            })
        };

        scoredRecipients.push(scoredRecipient);

        if (this.isLineupRule(rule)) {
          lineupGroups.add(scoredRecipient.groupKey);
        }
      }

      statsByPlayer.set(recipient.playerId, stats);
    }

    for (const recipient of scoredRecipients) {
      const stats = statsByPlayer.get(recipient.playerId) ?? this.emptyStats();
      const score =
        this.isSpecialtyRule(recipient.rule) && lineupGroups.has(recipient.groupKey)
          ? recipient.score * 0.5
          : recipient.score;

      stats.honorScore += score;
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

  private async ensureDefaultRules({ reset = false }: { reset?: boolean } = {}) {
    const existingRules = await this.prisma.awardRule.findMany({
      where: {
        code: {
          in: DEFAULT_AWARD_RULES.map((rule) => rule.code)
        }
      },
      select: { code: true }
    });
    const existingCodes = new Set(existingRules.map((rule) => rule.code));

    for (const definition of DEFAULT_AWARD_RULES) {
      await this.prisma.awardRule.upsert({
        where: { code: definition.code },
        create: this.defaultRuleData(definition),
        update: reset
          ? this.defaultRuleResetData(definition)
          : this.defaultRuleStructuralUpdateData(definition)
      });
    }

    return {
      total: DEFAULT_AWARD_RULES.length,
      created: DEFAULT_AWARD_RULES.filter((rule) => !existingCodes.has(rule.code)).length,
      updated: DEFAULT_AWARD_RULES.filter((rule) => existingCodes.has(rule.code)).length
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

  private resolveEventAwardCoefficient({
    competition,
    competitionEdition,
    honorRules
  }: {
    competition: AwardEventCompetition | null;
    competitionEdition: { year: number | null; quantity: number | null } | null;
    honorRules: CompetitionHonorRule[];
  }) {
    if (!competition) {
      return 1;
    }

    const rule = this.findMatchingCompetitionHonorRule(honorRules, competition);

    if (!rule) {
      return 1;
    }

    return (
      this.resolveCompetitionQualityCoefficient(rule, competition) *
      this.resolveCompetitionConversionCoefficient(
        rule,
        competition,
        competitionEdition?.year ?? null,
        competitionEdition?.quantity ?? null
      )
    );
  }

  private findMatchingCompetitionHonorRule(
    honorRules: CompetitionHonorRule[],
    competition: AwardEventCompetition
  ) {
    return [...honorRules]
      .filter((rule) => {
        if (rule.targetType !== competition.targetType) return false;
        if (rule.scopeType && rule.scopeType !== competition.scopeType) return false;
        if (!this.sameText(rule.category, competition.category)) return false;
        if (!this.sameText(rule.level, competition.level)) return false;
        if (!this.sameText(rule.format, competition.format)) return false;
        return true;
      })
      .sort((left, right) => {
        if (left.sortOrder !== right.sortOrder) return left.sortOrder - right.sortOrder;
        return left.name.localeCompare(right.name, 'zh-Hans-CN');
      })[0];
  }

  private resolveCompetitionQualityCoefficient(
    rule: CompetitionHonorRule,
    competition: AwardEventCompetition
  ) {
    const confederationIds = this.competitionConfederationIds(competition);
    const countryIds = this.competitionCountryIds(competition);
    const coefficient = rule.coefficients.find(
      (item) =>
        (item.confederationId && confederationIds.includes(item.confederationId)) ||
        (item.countryId && countryIds.includes(item.countryId))
    );

    return coefficient?.coefficient ?? rule.qualityCoefficient;
  }

  private resolveCompetitionConversionCoefficient(
    rule: CompetitionHonorRule,
    competition: AwardEventCompetition,
    year: number | null,
    quantity: number | null
  ) {
    if (rule.conversionType === HonorRuleConversionType.FREQUENCY_SCALE) {
      return this.frequencyCoefficient(competition) * this.scaleCoefficient(competition, quantity);
    }

    if (rule.conversionType === HonorRuleConversionType.OLYMPIC_STAGE) {
      if (!year) return 1;
      if (year <= 1928) return 3;
      if (year <= 1980) return 2;
      if (year <= 1988) return 1.5;
      return 1;
    }

    if (rule.conversionType === HonorRuleConversionType.CLUB_WORLD_CUP_STAGE) {
      if (!year) return 1;
      return year < 2025 ? 0.5 : 1;
    }

    return 1;
  }

  private frequencyCoefficient(competition: AwardEventCompetition) {
    const years = competition.editions.map((edition) => edition.year).filter(this.isNumber);

    if (years.length < 2) {
      return 1;
    }

    const firstYear = Math.min(...years);
    const lastYear = Math.max(...years);
    const averageGap = (lastYear - firstYear) / (years.length - 1);

    return Math.min(averageGap / 4, 1);
  }

  private scaleCoefficient(competition: AwardEventCompetition, quantity: number | null) {
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
    const numbers = values.filter(this.isNumber).sort((a, b) => a - b);

    if (!numbers.length) return null;

    return numbers[Math.floor(numbers.length / 2)];
  }

  private competitionConfederationIds(competition: AwardEventCompetition) {
    return [
      competition.confederationId,
      ...competition.scopeConfederations.map((item) => item.confederationId)
    ].filter(this.isString);
  }

  private competitionCountryIds(competition: AwardEventCompetition) {
    return [
      competition.countryId,
      ...competition.scopeCountries.map((item) => item.countryId)
    ].filter(this.isString);
  }

  private sameText(left?: string | null, right?: string | null) {
    return (left?.trim() ?? '') === (right?.trim() ?? '');
  }

  private isNumber(value: number | null): value is number {
    return typeof value === 'number' && Number.isFinite(value);
  }

  private isString(value: string | null): value is string {
    return typeof value === 'string' && Boolean(value);
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

  private findMatchingRule(rules: AwardRule[], recipient: AwardRuleMatchTarget) {
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

  private defaultRuleData(definition: AwardRuleDefaultDefinition) {
    return {
      code: definition.code,
      name: definition.name,
      scopeType: definition.scopeType,
      category: definition.category,
      placement: definition.placement ?? null,
      rank: definition.rank ?? null,
      baseScore: definition.baseScore,
      coefficient: definition.coefficient,
      topAward: definition.topAward,
      enabled: definition.enabled,
      sortOrder: definition.sortOrder,
      remark: definition.remark ?? null
    } satisfies Prisma.AwardRuleUncheckedCreateInput;
  }

  private defaultRuleStructuralUpdateData(definition: AwardRuleDefaultDefinition) {
    return {
      name: definition.name,
      scopeType: definition.scopeType,
      category: definition.category,
      placement: definition.placement ?? null,
      rank: definition.rank ?? null,
      sortOrder: definition.sortOrder
    } satisfies Prisma.AwardRuleUncheckedUpdateInput;
  }

  private defaultRuleResetData(definition: AwardRuleDefaultDefinition) {
    return {
      name: definition.name,
      scopeType: definition.scopeType,
      category: definition.category,
      placement: definition.placement ?? null,
      rank: definition.rank ?? null,
      baseScore: definition.baseScore,
      coefficient: definition.coefficient,
      topAward: definition.topAward,
      enabled: definition.enabled,
      sortOrder: definition.sortOrder,
      remark: definition.remark ?? null
    } satisfies Prisma.AwardRuleUncheckedUpdateInput;
  }

  private resolveEditionPeriod(edition: {
    year: number | null;
    season: string | null;
    name: string;
  }) {
    return edition.year?.toString() ?? edition.season ?? edition.name;
  }

  private buildCombinationGroupKey({
    playerId,
    period,
    scopeType,
    confederationId,
    countryId,
    category
  }: {
    playerId: string;
    period: string;
    scopeType: AwardScopeType;
    confederationId: string | null;
    countryId: string | null;
    category: string | null;
  }) {
    return [
      playerId,
      period,
      scopeType,
      confederationId ?? '',
      countryId ?? '',
      this.categoryFamily(category)
    ].join('|');
  }

  private categoryFamily(category: string | null) {
    return this.normalize(category)
      .replace(/一级综合奖|二级阵容奖|二级门将专项奖|二级专项奖|三级补充奖|一级奖/g, '')
      .replace(/\s+/g, '');
  }

  private isLineupRule(rule: AwardRule) {
    return this.normalize(rule.category).includes('阵容奖');
  }

  private isSpecialtyRule(rule: AwardRule) {
    const category = this.normalize(rule.category);

    return category.includes('专项奖') || category.includes('门将专项奖');
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
