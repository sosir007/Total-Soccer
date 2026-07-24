import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  CompetitionEditionStandingMode,
  CompetitionScopeType,
  CompetitionStandingPlacement,
  CompetitionTargetType,
  HonorRuleConversionType,
  LifecycleStatus,
  Prisma,
  type HonorRule
} from '@prisma/client';
import { resolvePagination } from '../common/pagination.js';
import { PrismaService } from '../database/prisma.service.js';
import type {
  CompetitionListQuery,
  CreateCompetitionBody,
  CreateCompetitionEditionBody,
  SaveCompetitionStandingsBody,
  UpdateCompetitionBody,
  UpdateCompetitionEditionBody
} from './competitions.types.js';

const COMPETITION_CATEGORIES = ['国际', '洲际', '国内', '其他'] as const;
const COMPETITION_LEVELS = ['一级', '二级', '三级', '四级'] as const;
const COMPETITION_FORMATS = ['联赛', '杯赛', '其他'] as const;
const COMPETITION_TARGET_ORDER: Record<CompetitionTargetType, number> = {
  COUNTRY: 10,
  CLUB: 20
};
const COMPETITION_SCOPE_ORDER: Record<CompetitionScopeType, number> = {
  GLOBAL: 10,
  CONFEDERATION: 20,
  COUNTRY: 30,
  CUSTOM: 40
};
const COMPETITION_CATEGORY_ORDER: Map<string, number> = new Map(
  COMPETITION_CATEGORIES.map((category, index) => [category, index + 1])
);
const COMPETITION_LEVEL_ORDER: Map<string, number> = new Map(
  COMPETITION_LEVELS.map((level, index) => [level, index + 1])
);
const COMPETITION_FORMAT_ORDER: Map<string, number> = new Map(
  COMPETITION_FORMATS.map((format, index) => [format, index + 1])
);
const COMPETITION_LIFECYCLE_ORDER: Record<LifecycleStatus, number> = {
  CURRENT: 10,
  DISCONTINUED: 20
};

const COUNTRY_REF_SELECT = {
  id: true,
  uid: true,
  uidSort: true,
  name: true,
  externalUrl: true,
  visibleInCatalog: true,
  isHistorical: true,
  detailRedirectCountryId: true,
  detailRedirectCountry: {
    select: {
      id: true,
      uid: true,
      uidSort: true,
      name: true,
      externalUrl: true
    }
  }
} satisfies Prisma.CountrySelect;

const COMPETITION_INCLUDE = {
  confederation: {
    select: {
      id: true,
      uid: true,
      code: true,
      name: true,
      sortOrder: true
    }
  },
  country: {
    select: COUNTRY_REF_SELECT
  },
  scopeConfederations: {
    include: {
      confederation: {
        select: {
          id: true,
          uid: true,
          code: true,
          name: true,
          sortOrder: true
        }
      }
    }
  },
  scopeCountries: {
    include: {
      country: {
        select: COUNTRY_REF_SELECT
      }
    }
  },
  _count: {
    select: {
      editions: true
    }
  },
  editions: {
    select: {
      year: true,
      quantity: true
    }
  }
} satisfies Prisma.CompetitionInclude;

type CompetitionListItem = Prisma.CompetitionGetPayload<{
  include: typeof COMPETITION_INCLUDE;
}>;

type CompetitionScoreRule = HonorRule & {
  coefficients: Array<{
    confederationId: string | null;
    countryId: string | null;
    coefficient: number;
  }>;
};

function compareCompetitionListItems(a: CompetitionListItem, b: CompetitionListItem) {
  return (
    compareNumber(targetRank(a), targetRank(b)) ||
    compareNumber(scopeRank(a), scopeRank(b)) ||
    compareNumber(categoryRank(a), categoryRank(b)) ||
    compareNumber(levelRank(a), levelRank(b)) ||
    compareNumber(formatRank(a), formatRank(b)) ||
    compareNumber(confederationRank(a), confederationRank(b)) ||
    compareNumber(countryRank(a), countryRank(b)) ||
    compareNumber(lifecycleRank(a), lifecycleRank(b)) ||
    compareNumber(a.sortOrder, b.sortOrder) ||
    a.name.localeCompare(b.name, 'zh-Hans-CN')
  );
}

function compareNumber(a: number, b: number) {
  return a - b;
}

function targetRank(competition: CompetitionListItem) {
  return COMPETITION_TARGET_ORDER[competition.targetType] ?? 9999;
}

function scopeRank(competition: CompetitionListItem) {
  return COMPETITION_SCOPE_ORDER[competition.scopeType] ?? 9999;
}

function categoryRank(competition: CompetitionListItem) {
  return competition.category
    ? (COMPETITION_CATEGORY_ORDER.get(competition.category) ?? 9999)
    : 9999;
}

function levelRank(competition: CompetitionListItem) {
  return competition.level ? (COMPETITION_LEVEL_ORDER.get(competition.level) ?? 9999) : 9999;
}

function formatRank(competition: CompetitionListItem) {
  return competition.format ? (COMPETITION_FORMAT_ORDER.get(competition.format) ?? 9999) : 9999;
}

function lifecycleRank(competition: CompetitionListItem) {
  return COMPETITION_LIFECYCLE_ORDER[competition.lifecycleStatus] ?? 9999;
}

function confederationRank(competition: CompetitionListItem) {
  const ranks = [
    competition.confederation?.sortOrder,
    ...competition.scopeConfederations.map((scope) => scope.confederation.sortOrder)
  ].filter((rank): rank is number => Number.isFinite(rank));

  return ranks.length ? Math.min(...ranks) : 9999;
}

function countryRank(competition: CompetitionListItem) {
  const ranks = [
    countrySortValue(competition.country),
    ...competition.scopeCountries.map((scope) => countrySortValue(scope.country))
  ].filter((rank): rank is number => Number.isFinite(rank));

  return ranks.length ? Math.min(...ranks) : 9999;
}

function countrySortValue(country?: CompetitionListItem['country']) {
  if (!country) {
    return undefined;
  }

  if (Number.isFinite(country.uidSort)) {
    return country.uidSort;
  }

  const numericUid = Number(country.uid);
  return Number.isFinite(numericUid) ? numericUid : undefined;
}

const COMPETITION_DETAIL_INCLUDE = {
  ...COMPETITION_INCLUDE,
  editions: {
    orderBy: [{ year: 'desc' }, { name: 'desc' }],
    include: {
      standings: {
        orderBy: [{ placement: 'asc' }, { standingOrder: 'asc' }],
        include: {
          country: {
            select: COUNTRY_REF_SELECT
          },
          club: {
            select: {
              id: true,
              uid: true,
              name: true,
              externalUrl: true
            }
          }
        }
      }
    }
  }
} satisfies Prisma.CompetitionInclude;

@Injectable()
export class CompetitionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: CompetitionListQuery) {
    const pagination = resolvePagination(query);
    const keyword = query.keyword?.trim();
    const andConditions: Prisma.CompetitionWhereInput[] = [];

    if (keyword) {
      andConditions.push({
        OR: [
          { code: { contains: keyword, mode: 'insensitive' } },
          { name: { contains: keyword, mode: 'insensitive' } },
          { alias: { contains: keyword, mode: 'insensitive' } },
          { category: { contains: keyword, mode: 'insensitive' } },
          { level: { contains: keyword, mode: 'insensitive' } },
          { format: { contains: keyword, mode: 'insensitive' } },
          { description: { contains: keyword, mode: 'insensitive' } }
        ]
      });
    }

    if (query.confederationId) {
      andConditions.push({
        OR: [
          { confederationId: query.confederationId },
          { scopeConfederations: { some: { confederationId: query.confederationId } } }
        ]
      });
    }

    if (query.countryId) {
      andConditions.push({
        OR: [
          { countryId: query.countryId },
          { scopeCountries: { some: { countryId: query.countryId } } }
        ]
      });
    }

    const where: Prisma.CompetitionWhereInput = {
      ...(query.targetType ? { targetType: this.parseTargetType(query.targetType) } : {}),
      ...(query.scopeType ? { scopeType: this.parseScopeType(query.scopeType) } : {}),
      ...(query.lifecycleStatus
        ? { lifecycleStatus: this.parseLifecycleStatus(query.lifecycleStatus) }
        : {}),
      ...(andConditions.length ? { AND: andConditions } : {}),
      ...(query.enabled === undefined ? {} : { enabled: query.enabled === 'true' }),
      ...(query.includeInStats === undefined
        ? {}
        : { includeInStats: query.includeInStats === 'true' })
    };
    const [allItems, total, rules] = await this.prisma.$transaction([
      this.prisma.competition.findMany({
        where,
        include: COMPETITION_INCLUDE
      }),
      this.prisma.competition.count({ where }),
      this.prisma.honorRule.findMany({
        where: { enabled: true },
        include: { coefficients: true },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }]
      })
    ]);
    const items = allItems
      .sort(compareCompetitionListItems)
      .slice(pagination.skip, pagination.skip + pagination.take)
      .map((item) => ({
        ...item,
        ...this.resolveCompetitionListScore(rules, item)
      }));

    return {
      items,
      page: pagination.page,
      pageSize: pagination.pageSize,
      total
    };
  }

  private resolveCompetitionListScore(
    rules: CompetitionScoreRule[],
    competition: CompetitionListItem
  ) {
    const rule = this.resolveScoreRule(rules, competition);

    if (!rule) {
      return {
        score: null,
        scoreDescription: null
      };
    }

    const championScore = rule.championScore ?? rule.baseScore;
    const latestEdition = this.latestEdition(competition.editions);
    const qualityCoefficient = this.resolveQualityCoefficient(rule, competition);
    const conversion = this.resolveConversionCoefficientDetail(
      rule,
      competition,
      latestEdition?.year ?? null,
      latestEdition?.quantity ?? null
    );
    const score = this.round(championScore * qualityCoefficient * conversion.coefficient);
    const parts = [
      ...(this.isOne(qualityCoefficient)
        ? []
        : [`质量系数 ${this.formatScoreNumber(qualityCoefficient)}`]),
      ...conversion.parts
    ];

    return {
      score,
      scoreDescription: parts.length
        ? `基础分 ${this.formatScoreNumber(championScore)} × ${parts.join(' × ')} = ${this.formatScoreNumber(score)}`
        : null
    };
  }

  private resolveScoreRule(rules: CompetitionScoreRule[], competition: CompetitionListItem) {
    return rules
      .filter((rule) => this.scoreRuleMatches(rule, competition))
      .sort((a, b) => this.scoreRuleSpecificity(b) - this.scoreRuleSpecificity(a))[0];
  }

  private scoreRuleMatches(rule: CompetitionScoreRule, competition: CompetitionListItem) {
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

  private scoreRuleSpecificity(rule: CompetitionScoreRule) {
    return [
      rule.confederationId,
      rule.countryId,
      rule.scopeType,
      rule.format,
      rule.level,
      rule.category
    ].filter(Boolean).length;
  }

  private resolveQualityCoefficient(rule: CompetitionScoreRule, competition: CompetitionListItem) {
    const confederationIds = this.competitionConfederationIds(competition);
    const countryIds = this.competitionCountryIds(competition);
    const coefficient = rule.coefficients.find(
      (item) =>
        (item.confederationId && confederationIds.includes(item.confederationId)) ||
        (item.countryId && countryIds.includes(item.countryId))
    );

    return coefficient?.coefficient ?? rule.qualityCoefficient;
  }

  private resolveConversionCoefficientDetail(
    rule: CompetitionScoreRule,
    competition: CompetitionListItem,
    year: number | null,
    quantity: number | null
  ) {
    if (rule.conversionType === HonorRuleConversionType.FREQUENCY_SCALE) {
      const frequencyCoefficient = this.frequencyCoefficient(competition);
      const scaleCoefficient = this.scaleCoefficient(competition, quantity);

      return {
        coefficient: frequencyCoefficient * scaleCoefficient,
        parts: [
          `频率系数 ${this.formatScoreNumber(frequencyCoefficient)}`,
          `规模系数 ${this.formatScoreNumber(scaleCoefficient)}`
        ]
      };
    }

    if (rule.conversionType === HonorRuleConversionType.OLYMPIC_STAGE) {
      const coefficient = !year ? 1 : year <= 1928 ? 3 : year <= 1980 ? 2 : year <= 1988 ? 1.5 : 1;
      const suffix = year ? `（按最新届次 ${year} 年）` : '';

      return {
        coefficient,
        parts: [`年代系数 ${this.formatScoreNumber(coefficient)}${suffix}`]
      };
    }

    if (rule.conversionType === HonorRuleConversionType.CLUB_WORLD_CUP_STAGE) {
      const coefficient = year && year < 2025 ? 0.5 : 1;
      const suffix = year ? `（按最新届次 ${year} 年）` : '';

      return {
        coefficient,
        parts: [`赛制阶段系数 ${this.formatScoreNumber(coefficient)}${suffix}`]
      };
    }

    return {
      coefficient: 1,
      parts: []
    };
  }

  private frequencyCoefficient(competition: CompetitionListItem) {
    const years = competition.editions.map((edition) => edition.year).filter(this.isNumber);

    if (years.length < 2) {
      return 1;
    }

    const firstYear = Math.min(...years);
    const lastYear = Math.max(...years);
    const averageGap = (lastYear - firstYear) / (years.length - 1);

    return Math.min(averageGap / 4, 1);
  }

  private scaleCoefficient(competition: CompetitionListItem, quantity: number | null | undefined) {
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

  private latestEdition(editions: Array<{ year: number | null; quantity: number | null }>) {
    return editions
      .filter((edition) => this.isNumber(edition.year))
      .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))[0];
  }

  private median(values: Array<number | null>) {
    const numbers = values.filter(this.isNumber).sort((a, b) => a - b);

    if (!numbers.length) return null;

    return numbers[Math.floor(numbers.length / 2)];
  }

  private competitionConfederationIds(competition: CompetitionListItem) {
    return [
      competition.confederationId,
      ...competition.scopeConfederations.map((item) => item.confederation.id)
    ].filter(this.isString);
  }

  private competitionCountryIds(competition: CompetitionListItem) {
    return [
      competition.countryId,
      ...competition.scopeCountries.map((item) => item.country.id)
    ].filter(this.isString);
  }

  private formatMatches(ruleFormat: string | null, competition: CompetitionListItem) {
    if (this.sameText(ruleFormat, competition.format)) {
      return true;
    }

    return (
      competition.format === '其他' && ruleFormat === '杯赛' && competition.category !== '国内'
    );
  }

  private sameText(left?: string | null, right?: string | null) {
    return (left?.trim() ?? '') === (right?.trim() ?? '');
  }

  private round(value: number) {
    return Math.round(value * 100) / 100;
  }

  private formatScoreNumber(value: number) {
    const rounded = this.round(value);
    return Number.isInteger(rounded)
      ? rounded.toString()
      : rounded.toFixed(2).replace(/\.?0+$/, '');
  }

  private isOne(value: number) {
    return Math.abs(value - 1) < 0.000001;
  }

  private isNumber(value: number | null): value is number {
    return typeof value === 'number' && Number.isFinite(value);
  }

  private isString(value: string | null): value is string {
    return typeof value === 'string' && Boolean(value);
  }

  async findOne(id: string) {
    const competition = await this.prisma.competition.findUnique({
      where: { id },
      include: COMPETITION_DETAIL_INCLUDE
    });

    if (!competition) {
      throw new NotFoundException('赛事不存在。');
    }

    return competition;
  }

  async create(body: CreateCompetitionBody) {
    const input = await this.buildCompetitionData(body);

    return this.prisma.$transaction(async (tx) => {
      const competition = await tx.competition.create({
        data: input.data
      });
      await this.replaceCompetitionScopes(
        tx,
        competition.id,
        input.confederationIds,
        input.countryIds
      );

      return tx.competition.findUniqueOrThrow({
        where: { id: competition.id },
        include: COMPETITION_INCLUDE
      });
    });
  }

  async update(id: string, body: UpdateCompetitionBody) {
    await this.assertCompetitionExists(id);
    const input = await this.buildCompetitionData(body);

    return this.prisma.$transaction(async (tx) => {
      await tx.competition.update({
        where: { id },
        data: input.data
      });
      await this.replaceCompetitionScopes(tx, id, input.confederationIds, input.countryIds);

      return tx.competition.findUniqueOrThrow({
        where: { id },
        include: COMPETITION_INCLUDE
      });
    });
  }

  async remove(id: string) {
    const competition = await this.prisma.competition.findUnique({
      where: { id },
      select: {
        id: true,
        _count: {
          select: {
            editions: true
          }
        }
      }
    });

    if (!competition) {
      throw new NotFoundException('赛事不存在。');
    }

    if (competition._count.editions > 0) {
      throw new BadRequestException('赛事已有届次结果，不能直接删除。');
    }

    try {
      await this.prisma.competition.delete({
        where: { id }
      });

      return { id };
    } catch (error) {
      this.handleDeleteError(error);
    }
  }

  async createEdition(competitionId: string, body: CreateCompetitionEditionBody) {
    await this.assertCompetitionExists(competitionId);

    return this.prisma.competitionEdition.create({
      data: this.buildEditionData(competitionId, body),
      include: {
        standings: true
      }
    });
  }

  async updateEdition(id: string, body: UpdateCompetitionEditionBody) {
    await this.assertEditionExists(id);

    return this.prisma.competitionEdition.update({
      where: { id },
      data: this.buildEditionUpdateData(body),
      include: {
        standings: true
      }
    });
  }

  async removeEdition(id: string) {
    const edition = await this.prisma.competitionEdition.findUnique({
      where: { id },
      select: {
        id: true
      }
    });

    if (!edition) {
      throw new NotFoundException('赛事届次不存在。');
    }

    try {
      await this.prisma.competitionEdition.delete({
        where: { id }
      });

      return { id };
    } catch (error) {
      this.handleEditionDeleteError(error);
    }
  }

  async saveStandings(id: string, body: SaveCompetitionStandingsBody) {
    const edition = await this.prisma.competitionEdition.findUnique({
      where: { id },
      include: {
        competition: true
      }
    });

    if (!edition) {
      throw new NotFoundException('赛事届次不存在。');
    }

    const standingMode = this.parseStandingMode(body.standingMode ?? edition.standingMode);
    const standings = this.buildStandingData(edition.competition.targetType, standingMode, body);

    await this.prisma.$transaction([
      this.prisma.competitionEdition.update({
        where: { id },
        data: { standingMode }
      }),
      this.prisma.competitionStanding.deleteMany({
        where: { editionId: id }
      }),
      ...(standings.length
        ? [
            this.prisma.competitionStanding.createMany({
              data: standings.map((standing) => ({
                editionId: id,
                ...standing
              }))
            })
          ]
        : [])
    ]);

    return this.prisma.competitionEdition.findUnique({
      where: { id },
      include: COMPETITION_DETAIL_INCLUDE.editions.include
    });
  }

  private async buildCompetitionData(body: CreateCompetitionBody): Promise<{
    data: Prisma.CompetitionUncheckedCreateInput;
    confederationIds: string[];
    countryIds: string[];
  }> {
    const code = body.code?.trim();
    const name = body.name?.trim();
    const targetType = this.parseTargetType(body.targetType);
    const scopeType = this.parseScopeType(body.scopeType ?? CompetitionScopeType.GLOBAL);
    const confederationIds = this.getScopeIds(body.confederationIds, body.confederationId);
    const countryIds = this.getScopeIds(body.countryIds, body.countryId);

    if (!code) {
      throw new BadRequestException('赛事编码不能为空。');
    }

    if (!name) {
      throw new BadRequestException('赛事名称不能为空。');
    }

    this.validateScope(scopeType, confederationIds, countryIds);

    return {
      data: {
        code,
        name,
        alias: this.toNullableString(body.alias),
        targetType,
        scopeType,
        category: this.parseStandardText(body.category, COMPETITION_CATEGORIES, '赛事分类'),
        level: this.parseStandardText(body.level, COMPETITION_LEVELS, '赛事级别'),
        format: this.parseStandardText(body.format, COMPETITION_FORMATS, '赛事赛制'),
        description: this.toNullableString(body.description),
        externalUrl: this.toNullableString(body.externalUrl),
        confederationId:
          scopeType === CompetitionScopeType.CONFEDERATION ? confederationIds[0] : null,
        countryId: scopeType === CompetitionScopeType.COUNTRY ? countryIds[0] : null,
        lifecycleStatus: this.parseLifecycleStatus(body.lifecycleStatus ?? LifecycleStatus.CURRENT),
        enabled: body.enabled ?? true,
        includeInStats: body.includeInStats ?? true,
        sortOrder: body.sortOrder ?? 0
      },
      confederationIds: scopeType === CompetitionScopeType.CONFEDERATION ? confederationIds : [],
      countryIds: scopeType === CompetitionScopeType.COUNTRY ? countryIds : []
    };
  }

  private buildEditionData(competitionId: string, body: CreateCompetitionEditionBody) {
    const name = body.name?.trim();

    if (!name) {
      throw new BadRequestException('届次名称不能为空。');
    }

    return {
      competition: {
        connect: {
          id: competitionId
        }
      },
      name,
      season: this.toNullableString(body.season),
      year: this.toNullableNumber(body.year),
      quantity: this.toNullableNumber(body.quantity),
      standingMode: this.parseStandingMode(
        body.standingMode ?? CompetitionEditionStandingMode.THIRD_PLACE_MATCH
      ),
      host: this.toNullableString(body.host),
      externalUrl: this.toNullableString(body.externalUrl),
      remark: this.toNullableString(body.remark)
    } satisfies Prisma.CompetitionEditionCreateInput;
  }

  private buildEditionUpdateData(body: UpdateCompetitionEditionBody) {
    return {
      ...(body.name !== undefined ? { name: this.requiredString(body.name, '届次名称') } : {}),
      ...(body.season !== undefined ? { season: this.toNullableString(body.season) } : {}),
      ...(body.year !== undefined ? { year: this.toNullableNumber(body.year) } : {}),
      ...(body.quantity !== undefined ? { quantity: this.toNullableNumber(body.quantity) } : {}),
      ...(body.standingMode !== undefined
        ? { standingMode: this.parseStandingMode(body.standingMode) }
        : {}),
      ...(body.host !== undefined ? { host: this.toNullableString(body.host) } : {}),
      ...(body.externalUrl !== undefined
        ? { externalUrl: this.toNullableString(body.externalUrl) }
        : {}),
      ...(body.remark !== undefined ? { remark: this.toNullableString(body.remark) } : {})
    } satisfies Prisma.CompetitionEditionUpdateInput;
  }

  private buildStandingData(
    targetType: CompetitionTargetType,
    standingMode: CompetitionEditionStandingMode,
    body: SaveCompetitionStandingsBody
  ): Array<{
    placement: CompetitionStandingPlacement;
    standingOrder: number;
    countryId?: string;
    clubId?: string;
    remark?: string | null;
  }> {
    const standings = body.standings ?? [];
    const usedPlacementKeys = new Set<string>();
    const semiFinalistOrders = new Set<number>();
    const thirdPlaceOrders = new Set<number>();
    const allowedPlacements = this.allowedPlacementsByMode(standingMode);

    const rows: Array<{
      placement: CompetitionStandingPlacement;
      standingOrder: number;
      countryId?: string;
      clubId?: string;
      remark?: string | null;
    }> = [];

    for (const standing of standings) {
      const placement = this.parsePlacement(standing.placement);
      const standingOrder = this.parseStandingOrder(
        standingMode,
        placement,
        standing.standingOrder
      );

      if (!allowedPlacements.includes(placement)) {
        throw new BadRequestException('赛事名次与当前届次名次口径不匹配。');
      }

      const placementKey =
        placement === CompetitionStandingPlacement.SEMI_FINALIST ||
        (standingMode === CompetitionEditionStandingMode.DOUBLE_THIRD_PLACE &&
          placement === CompetitionStandingPlacement.THIRD_PLACE)
          ? `${placement}:${standingOrder}`
          : placement;

      if (usedPlacementKeys.has(placementKey)) {
        throw new BadRequestException('同一届赛事不能重复录入相同名次。');
      }

      usedPlacementKeys.add(placementKey);

      if (placement === CompetitionStandingPlacement.SEMI_FINALIST) {
        semiFinalistOrders.add(standingOrder);

        if (semiFinalistOrders.size > 2) {
          throw new BadRequestException('同一届赛事最多录入两支四强球队。');
        }
      }

      if (
        standingMode === CompetitionEditionStandingMode.DOUBLE_THIRD_PLACE &&
        placement === CompetitionStandingPlacement.THIRD_PLACE
      ) {
        thirdPlaceOrders.add(standingOrder);

        if (thirdPlaceOrders.size > 2) {
          throw new BadRequestException('同一届赛事最多录入两支并列季军球队。');
        }
      }

      if (targetType === CompetitionTargetType.COUNTRY) {
        if (!standing.countryId) {
          continue;
        }

        if (standing.clubId) {
          throw new BadRequestException('国家队赛事不能关联俱乐部。');
        }

        rows.push({
          placement,
          standingOrder,
          countryId: standing.countryId,
          remark: standing.remark ?? null
        });
        continue;
      }

      if (!standing.clubId) {
        continue;
      }

      if (standing.countryId) {
        throw new BadRequestException('俱乐部赛事不能关联国家队。');
      }

      rows.push({
        placement,
        standingOrder,
        clubId: standing.clubId,
        remark: standing.remark ?? null
      });
    }

    return rows;
  }

  private async replaceCompetitionScopes(
    tx: Prisma.TransactionClient,
    competitionId: string,
    confederationIds: string[],
    countryIds: string[]
  ) {
    await tx.competitionScopeConfederation.deleteMany({
      where: { competitionId }
    });
    await tx.competitionScopeCountry.deleteMany({
      where: { competitionId }
    });

    if (confederationIds.length) {
      await tx.competitionScopeConfederation.createMany({
        data: confederationIds.map((confederationId) => ({
          competitionId,
          confederationId
        })),
        skipDuplicates: true
      });
    }

    if (countryIds.length) {
      await tx.competitionScopeCountry.createMany({
        data: countryIds.map((countryId) => ({
          competitionId,
          countryId
        })),
        skipDuplicates: true
      });
    }
  }

  private validateScope(
    scopeType: CompetitionScopeType,
    confederationIds: string[],
    countryIds: string[]
  ) {
    if (scopeType === CompetitionScopeType.CONFEDERATION && !confederationIds.length) {
      throw new BadRequestException('足联范围赛事必须选择足联。');
    }

    if (scopeType === CompetitionScopeType.COUNTRY && !countryIds.length) {
      throw new BadRequestException('国家范围赛事必须选择国家。');
    }
  }

  private async assertCompetitionExists(id: string) {
    const competition = await this.prisma.competition.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!competition) {
      throw new NotFoundException('赛事不存在。');
    }
  }

  private async assertEditionExists(id: string) {
    const edition = await this.prisma.competitionEdition.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!edition) {
      throw new NotFoundException('赛事届次不存在。');
    }
  }

  private parseTargetType(value: CompetitionTargetType | undefined) {
    if (!value || !Object.values(CompetitionTargetType).includes(value)) {
      throw new BadRequestException('赛事对象类型不合法。');
    }

    return value;
  }

  private parseScopeType(value: CompetitionScopeType) {
    if (!Object.values(CompetitionScopeType).includes(value)) {
      throw new BadRequestException('赛事适用范围不合法。');
    }

    return value;
  }

  private parseLifecycleStatus(value: LifecycleStatus) {
    if (!Object.values(LifecycleStatus).includes(value)) {
      throw new BadRequestException('赛事生命周期状态不合法。');
    }

    return value;
  }

  private parsePlacement(value: CompetitionStandingPlacement | undefined) {
    if (!value || !Object.values(CompetitionStandingPlacement).includes(value)) {
      throw new BadRequestException('赛事名次不合法。');
    }

    return value;
  }

  private parseStandingMode(value: CompetitionEditionStandingMode | undefined) {
    if (!value || !Object.values(CompetitionEditionStandingMode).includes(value)) {
      throw new BadRequestException('届次名次口径不合法。');
    }

    return value;
  }

  private parseStandingOrder(
    standingMode: CompetitionEditionStandingMode,
    placement: CompetitionStandingPlacement,
    value: number | null | undefined
  ) {
    const needsOrder =
      placement === CompetitionStandingPlacement.SEMI_FINALIST ||
      (standingMode === CompetitionEditionStandingMode.DOUBLE_THIRD_PLACE &&
        placement === CompetitionStandingPlacement.THIRD_PLACE);

    if (!needsOrder) {
      return 0;
    }

    const order = value === null || value === undefined ? 1 : Number(value);

    if (!Number.isInteger(order) || order < 1 || order > 2) {
      throw new BadRequestException('名次序号必须是 1 或 2。');
    }

    return order;
  }

  private allowedPlacementsByMode(
    standingMode: CompetitionEditionStandingMode
  ): CompetitionStandingPlacement[] {
    if (standingMode === CompetitionEditionStandingMode.THIRD_PLACE_MATCH) {
      return [
        CompetitionStandingPlacement.CHAMPION,
        CompetitionStandingPlacement.RUNNER_UP,
        CompetitionStandingPlacement.THIRD_PLACE,
        CompetitionStandingPlacement.FOURTH_PLACE
      ];
    }

    if (standingMode === CompetitionEditionStandingMode.SEMI_FINALISTS) {
      return [
        CompetitionStandingPlacement.CHAMPION,
        CompetitionStandingPlacement.RUNNER_UP,
        CompetitionStandingPlacement.SEMI_FINALIST
      ];
    }

    if (standingMode === CompetitionEditionStandingMode.LEAGUE_TOP_THREE) {
      return [
        CompetitionStandingPlacement.CHAMPION,
        CompetitionStandingPlacement.RUNNER_UP,
        CompetitionStandingPlacement.THIRD_PLACE
      ];
    }

    if (standingMode === CompetitionEditionStandingMode.DOUBLE_THIRD_PLACE) {
      return [
        CompetitionStandingPlacement.CHAMPION,
        CompetitionStandingPlacement.RUNNER_UP,
        CompetitionStandingPlacement.THIRD_PLACE
      ];
    }

    return [CompetitionStandingPlacement.CHAMPION, CompetitionStandingPlacement.RUNNER_UP];
  }

  private parseStandardText<T extends readonly string[]>(
    value: string | undefined | null,
    allowedValues: T,
    label: string
  ): T[number] | null {
    const trimmed = this.toNullableString(value);

    if (!trimmed) {
      return null;
    }

    if (!allowedValues.includes(trimmed)) {
      throw new BadRequestException(`${label}必须是：${allowedValues.join('、')}。`);
    }

    return trimmed;
  }

  private getScopeIds(values?: string[], fallback?: string) {
    const ids = [...(values ?? []), fallback]
      .map((value) => this.toNullableString(value))
      .filter((value): value is string => Boolean(value));

    return [...new Set(ids)];
  }

  private requiredString(value: string | undefined, label: string) {
    const trimmed = value?.trim();

    if (!trimmed) {
      throw new BadRequestException(`${label}不能为空。`);
    }

    return trimmed;
  }

  private toNullableString(value: string | undefined | null) {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
  }

  private toNullableNumber(value: number | undefined) {
    return Number.isFinite(value) ? value : null;
  }

  private handleDeleteError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new NotFoundException('赛事不存在。');
      }

      if (error.code === 'P2003') {
        throw new BadRequestException('赛事存在关联数据，不能直接删除。');
      }
    }

    throw error;
  }

  private handleEditionDeleteError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new NotFoundException('赛事届次不存在。');
      }

      if (error.code === 'P2003') {
        throw new BadRequestException('赛事届次存在关联数据，不能直接删除。');
      }
    }

    throw error;
  }
}
