import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  CompetitionStandingPlacement,
  CompetitionTargetType,
  HonorRuleConversionType,
  HonorRulePlacementScope,
  PlayerCareerType,
  Prisma
} from '@prisma/client';
import { CatalogStatsService } from '../common/catalog-stats.service.js';
import { resolvePagination, toInteger } from '../common/pagination.js';
import { PrismaService } from '../database/prisma.service.js';
import type {
  CountryHonorListQuery,
  CountryHonorSummaryQuery,
  CountryListQuery,
  CountryPayload
} from './countries.types.js';

const COUNTRY_REF_SELECT = {
  id: true,
  uid: true,
  name: true,
  externalUrl: true,
  visibleInCatalog: true,
  isHistorical: true,
  detailRedirectCountryId: true,
  detailRedirectCountry: {
    select: {
      id: true,
      uid: true,
      name: true,
      externalUrl: true
    }
  }
} satisfies Prisma.CountrySelect;

const COUNTRY_INCLUDE = {
  detailRedirectCountry: {
    select: {
      id: true,
      uid: true,
      name: true,
      externalUrl: true
    }
  },
  federationRef: {
    select: {
      id: true,
      uid: true,
      name: true,
      code: true
    }
  },
  _count: {
    select: {
      players: true,
      clubs: true
    }
  }
} satisfies Prisma.CountryInclude;

const COUNTRY_HONOR_INCLUDE = {
  country: {
    select: COUNTRY_REF_SELECT
  },
  edition: {
    include: {
      competition: {
        include: {
          confederation: {
            select: {
              id: true,
              uid: true,
              name: true,
              code: true
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
                  name: true,
                  code: true
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
          editions: {
            select: {
              year: true,
              quantity: true
            }
          }
        }
      },
      standings: {
        orderBy: { placement: 'asc' },
        include: {
          country: {
            select: COUNTRY_REF_SELECT
          }
        }
      }
    }
  }
} satisfies Prisma.CompetitionStandingInclude;

type CountryHonorRecord = Prisma.CompetitionStandingGetPayload<{
  include: typeof COUNTRY_HONOR_INCLUDE;
}>;
type CountryHonorCompetition = CountryHonorRecord['edition']['competition'];
type HonorSummaryRule = Prisma.HonorRuleGetPayload<{ include: { coefficients: true } }>;
type HonorSummaryCounts = {
  totalCount: number;
  championCount: number;
  runnerUpCount: number;
  thirdPlaceCount: number;
  fourthPlaceCount: number;
  semiFinalistCount: number;
};

const PROFILE_PLAYER_SELECT = {
  id: true,
  uid: true,
  chineseName: true,
  englishName: true,
  birthDate: true,
  primaryRole: true,
  positions: true,
  pa: true,
  externalUrl: true
} satisfies Prisma.PlayerSelect;

@Injectable()
export class CountriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalogStats: CatalogStatsService
  ) {}

  async findAll(query: CountryListQuery) {
    const pagination = resolvePagination(query);
    const where = this.buildWhere(query);
    const orderBy = this.buildOrderBy(query);

    if (this.shouldSortComputedStats(query.sortBy)) {
      const items = await this.prisma.country.findMany({
        where,
        include: COUNTRY_INCLUDE,
        orderBy
      });
      const computedItems = await this.attachComputedStats(items);
      const sortedItems = this.sortComputedStats(computedItems, query);

      return {
        items: sortedItems.slice(pagination.skip, pagination.skip + pagination.take),
        page: pagination.page,
        pageSize: pagination.pageSize,
        total: sortedItems.length
      };
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.country.findMany({
        where,
        include: COUNTRY_INCLUDE,
        orderBy,
        skip: pagination.skip,
        take: pagination.take
      }),
      this.prisma.country.count({ where })
    ]);

    return {
      items: await this.attachComputedStats(items),
      page: pagination.page,
      pageSize: pagination.pageSize,
      total
    };
  }

  async findOne(id: string) {
    const country = await this.prisma.country.findFirst({
      where: {
        OR: [{ id }, { uid: id }]
      },
      include: COUNTRY_INCLUDE
    });

    if (!country) {
      throw new NotFoundException('国家不存在。');
    }

    const [computedCountry] = await this.attachComputedStats([country]);

    return {
      ...computedCountry,
      honorRecords: await this.getCountryHonorRecords(country.id, 10),
      honorGroups: await this.getCountryHonorGroups(country.id),
      ...(await this.getCountryCareerProfile(country.id))
    };
  }

  async create(body: CountryPayload) {
    const data = await this.buildCountryData(body);
    await this.assertUniqueUid(data.uid);
    const country = await this.prisma.country.create({
      data: {
        ...data,
        importKey: this.createManualImportKey('country', data.uid)
      },
      select: { id: true }
    });

    return this.findOne(country.id);
  }

  async update(id: string, body: CountryPayload) {
    const existing = await this.prisma.country.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!existing) {
      throw new NotFoundException('国家不存在。');
    }

    const data = await this.buildCountryData(body);
    await this.assertUniqueUid(data.uid, id);
    await this.prisma.country.update({
      where: { id },
      data
    });

    return this.findOne(id);
  }

  async remove(id: string) {
    try {
      await this.prisma.country.delete({
        where: { id }
      });

      return { id };
    } catch (error) {
      this.handleDeleteError(error, '国家');
    }
  }

  async findHonors(query: CountryHonorListQuery) {
    const pagination = resolvePagination(query);
    const where = await this.buildHonorWhere(query);
    const [items, total] = await this.prisma.$transaction([
      this.prisma.competitionStanding.findMany({
        where,
        include: COUNTRY_HONOR_INCLUDE,
        orderBy: [
          { edition: { year: 'desc' } },
          { edition: { name: 'desc' } },
          { placement: 'asc' }
        ],
        skip: pagination.skip,
        take: pagination.take
      }),
      this.prisma.competitionStanding.count({ where })
    ]);

    return {
      items: items.map((item) => this.mapHonorRecord(item)),
      page: pagination.page,
      pageSize: pagination.pageSize,
      total
    };
  }

  async findHonorSummary(query: CountryHonorSummaryQuery) {
    const pagination = resolvePagination(query);
    const [records, rules] = await Promise.all([
      this.getCountryHonorSummaryRecords(query),
      this.getHonorSummaryRules(CompetitionTargetType.COUNTRY)
    ]);
    const effectiveRecords = this.filterCountryHonorSummaryRecords(records, query);
    const scoringRecords = effectiveRecords.filter((record) =>
      this.resolveHonorSummaryScore(
        rules,
        record.edition.competition,
        record.placement,
        record.edition.year,
        record.edition.quantity
      )
    );
    const rows = await this.buildCountryHonorSummaryRows(scoringRecords, query, rules);
    const competitions = this.buildHonorSummaryCompetitions(scoringRecords);

    return {
      items: rows.slice(pagination.skip, pagination.skip + pagination.take),
      competitions,
      page: pagination.page,
      pageSize: pagination.pageSize,
      total: rows.length
    };
  }

  private buildWhere(query: CountryListQuery): Prisma.CountryWhereInput {
    const keyword = query.keyword?.trim();
    const includeHidden = query.includeHidden === 'true';
    const includeHistorical = query.includeHistorical === 'true';
    const andConditions: Prisma.CountryWhereInput[] = [];

    if (keyword) {
      andConditions.push({
        OR: [
          { name: { contains: keyword, mode: 'insensitive' } },
          { uid: { contains: keyword, mode: 'insensitive' } },
          { federation: { contains: keyword, mode: 'insensitive' } }
        ]
      });
    }

    if (query.confederationId) {
      andConditions.push({ federationId: query.confederationId });
    }

    if (includeHistorical) {
      andConditions.push({
        OR: [
          {
            isHistorical: false,
            ...(includeHidden ? {} : { visibleInCatalog: true })
          },
          { isHistorical: true }
        ]
      });
    } else {
      andConditions.push({
        isHistorical: false,
        ...(includeHidden ? {} : { visibleInCatalog: true })
      });
    }

    return andConditions.length ? { AND: andConditions } : {};
  }

  private async buildCountryData(
    body: CountryPayload
  ): Promise<
    Pick<
      Prisma.CountryUncheckedCreateInput,
      | 'uid'
      | 'uidSort'
      | 'name'
      | 'externalUrl'
      | 'remark'
      | 'federation'
      | 'federationId'
      | 'visibleInCatalog'
    >
  > {
    const uid = this.requiredText(body.uid, 'UID');
    const name = this.requiredText(body.name, '国家名称');
    const confederation = await this.findConfederation(body.confederationId);

    return {
      uid,
      uidSort: this.toUidSort(uid),
      name,
      externalUrl: this.optionalText(body.externalUrl),
      remark: this.optionalText(body.remark),
      federation: confederation?.name ?? null,
      federationId: confederation?.id ?? null,
      visibleInCatalog: body.visibleInCatalog ?? true
    };
  }

  private async findConfederation(id?: string) {
    const cleanId = this.optionalText(id);

    if (!cleanId) {
      return null;
    }

    const confederation = await this.prisma.confederation.findUnique({
      where: { id: cleanId },
      select: { id: true, name: true }
    });

    if (!confederation) {
      throw new BadRequestException('足联不存在。');
    }

    return confederation;
  }

  private async assertUniqueUid(uid: string, id?: string) {
    if (uid === '-') {
      return;
    }

    const duplicate = await this.prisma.country.findFirst({
      where: {
        uid,
        ...(id ? { id: { not: id } } : {})
      },
      select: { id: true }
    });

    if (duplicate) {
      throw new BadRequestException('国家 UID 已存在。');
    }
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

  private toUidSort(uid: string) {
    return /^\d+$/.test(uid) ? Number(uid) : null;
  }

  private createManualImportKey(entity: string, uid: string) {
    return uid === '-' ? `manual:${entity}:${randomUUID()}` : `manual:${entity}:${uid}`;
  }

  private buildOrderBy(query: CountryListQuery): Prisma.CountryOrderByWithRelationInput[] {
    const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';
    const sortBy = query.sortBy ?? 'honorScore';
    const allowedSorts = new Set([
      'honorScore',
      'playerCount',
      'totalPa',
      'averagePa',
      'medalCount',
      'championCount',
      'name',
      'uid',
      'createdAt'
    ]);

    if (!allowedSorts.has(sortBy)) {
      return [{ honorScore: { sort: 'desc', nulls: 'last' } }, { name: 'asc' }];
    }

    if (sortBy === 'uid') {
      return [{ uidSort: { sort: sortOrder, nulls: 'last' } }, { name: 'asc' }];
    }

    if (sortBy === 'honorScore') {
      return [{ honorScore: { sort: sortOrder, nulls: 'last' } }, { name: 'asc' }];
    }

    return [{ [sortBy]: sortOrder }, { name: 'asc' }];
  }

  private shouldSortComputedStats(sortBy?: string) {
    return ['playerCount', 'totalPa', 'averagePa', 'medalCount', 'championCount'].includes(
      sortBy ?? ''
    );
  }

  private sortComputedStats<T extends { name?: string | null }>(
    items: T[],
    query: CountryListQuery
  ) {
    const sortBy = query.sortBy ?? 'honorScore';
    const direction = query.sortOrder === 'asc' ? 1 : -1;

    return [...items].sort((a, b) => {
      const aValue = this.toSortableNumber((a as Record<string, unknown>)[sortBy]);
      const bValue = this.toSortableNumber((b as Record<string, unknown>)[sortBy]);

      if (aValue === null && bValue === null) {
        return this.compareName(a, b);
      }

      if (aValue === null) {
        return 1;
      }

      if (bValue === null) {
        return -1;
      }

      if (aValue !== bValue) {
        return (aValue - bValue) * direction;
      }

      return this.compareName(a, b);
    });
  }

  private toSortableNumber(value: unknown) {
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
  }

  private compareName(a: { name?: string | null }, b: { name?: string | null }) {
    return (a.name ?? '').localeCompare(b.name ?? '', 'zh-CN');
  }

  private async attachComputedStats<T extends { id: string }>(items: T[]) {
    if (!items.length) {
      return items;
    }

    const ids = items.map((item) => item.id);
    const [participationStats, standingStats] = await Promise.all([
      this.catalogStats.getCountryParticipationStats(ids),
      this.catalogStats.getCountryStandingStats(ids)
    ]);

    return items.map((item) => {
      const participation =
        participationStats.get(item.id) ?? this.catalogStats.getEmptyParticipationStats();
      const standings = standingStats.get(item.id) ?? this.catalogStats.getEmptyStandingStats();

      return {
        ...item,
        playerCount: participation.playerCount,
        totalPa: participation.totalPa,
        averagePa: participation.averagePa,
        championCount: standings.championCount,
        runnerUpCount: standings.runnerUpCount,
        thirdPlaceCount: standings.thirdPlaceCount,
        fourthPlaceCount: standings.fourthPlaceCount,
        medalCount: standings.medalCount,
        majorChampionCount: standings.majorChampionCount
      };
    });
  }

  private async getCountryHonorRecords(countryId: string, take: number) {
    const countryIds = await this.getCountryIdsWithInheritedSources(countryId);
    const items = await this.prisma.competitionStanding.findMany({
      where: {
        countryId: {
          in: countryIds
        },
        edition: {
          competition: {
            targetType: CompetitionTargetType.COUNTRY
          }
        }
      },
      include: COUNTRY_HONOR_INCLUDE,
      orderBy: [{ edition: { year: 'desc' } }, { edition: { name: 'desc' } }, { placement: 'asc' }],
      take
    });

    return items.map((item) => this.mapHonorRecord(item));
  }

  private async getCountryHonorGroups(countryId: string) {
    const countryIds = await this.getCountryIdsWithInheritedSources(countryId);
    const items = await this.prisma.competitionStanding.findMany({
      where: {
        countryId: {
          in: countryIds
        },
        edition: {
          competition: {
            targetType: CompetitionTargetType.COUNTRY,
            includeInStats: true
          }
        }
      },
      include: COUNTRY_HONOR_INCLUDE,
      orderBy: [{ edition: { year: 'asc' } }, { edition: { name: 'asc' } }, { placement: 'asc' }]
    });

    return this.buildCountryHonorGroups(items, countryId);
  }

  private async getCountryHonorSummaryRecords(query: CountryHonorSummaryQuery) {
    const countryIds = query.countryId
      ? await this.getCountryIdsWithInheritedSources(query.countryId)
      : null;

    return this.prisma.competitionStanding.findMany({
      where: {
        countryId: countryIds ? { in: countryIds } : { not: null },
        edition: {
          ...(query.competitionId ? { competitionId: query.competitionId } : {}),
          competition: {
            targetType: CompetitionTargetType.COUNTRY,
            includeInStats: true
          }
        }
      },
      include: COUNTRY_HONOR_INCLUDE,
      orderBy: [
        { edition: { competition: { sortOrder: 'asc' } } },
        { edition: { competition: { level: 'asc' } } },
        { edition: { competition: { name: 'asc' } } },
        { edition: { year: 'asc' } },
        { placement: 'asc' }
      ]
    });
  }

  private async buildCountryHonorSummaryRows(
    records: CountryHonorRecord[],
    query: CountryHonorSummaryQuery,
    rules: HonorSummaryRule[]
  ) {
    const successorMap = await this.getCountrySuccessorMap(
      records.map((record) => record.countryId).filter(Boolean) as string[]
    );
    const keyword = this.normalizeKeyword(query.keyword);
    const competitionKeywordMatched = keyword
      ? records.some((record) =>
          this.matchesCompetitionKeyword(record.edition.competition, keyword)
        )
      : false;
    const effectiveRecords = competitionKeywordMatched
      ? records.filter((record) =>
          this.matchesCompetitionKeyword(record.edition.competition, keyword)
        )
      : records;
    const targetIds = new Set<string>();

    for (const record of effectiveRecords) {
      if (!record.countryId || !record.country) {
        continue;
      }

      if (!record.country.isHistorical) {
        targetIds.add(record.countryId);
      }

      for (const successorId of successorMap.get(record.countryId) ?? []) {
        targetIds.add(successorId);
      }
    }

    const countries = targetIds.size
      ? await this.attachComputedStats(
          await this.prisma.country.findMany({
            where: {
              id: { in: [...targetIds] },
              isHistorical: false
            },
            include: COUNTRY_INCLUDE
          })
        )
      : [];
    const countryMap = new Map(countries.map((country) => [country.id, country]));
    const rowMap = new Map<string, ReturnType<typeof this.createCountryHonorSummaryRow>>();

    for (const record of effectiveRecords) {
      if (!record.countryId || !record.country) {
        continue;
      }

      const ids = [
        ...(record.country.isHistorical ? [] : [record.countryId]),
        ...(successorMap.get(record.countryId) ?? [])
      ];

      for (const targetId of ids) {
        const country = countryMap.get(targetId);

        if (!country) {
          continue;
        }

        const score = this.resolveHonorSummaryScore(
          rules,
          record.edition.competition,
          record.placement,
          record.edition.year,
          record.edition.quantity
        );

        if (score === null) {
          continue;
        }

        const row = rowMap.get(targetId) ?? this.createCountryHonorSummaryRow(country);
        this.addHonorSummaryPlacement(row, record.edition.competition.id, record.placement, score);
        rowMap.set(targetId, row);
      }
    }

    return [...rowMap.values()]
      .filter((row) => {
        if (!keyword || competitionKeywordMatched) {
          return true;
        }

        return this.matchesText(keyword, row.name, row.uid, row.federationRef?.name);
      })
      .sort((a, b) => {
        if (a.honorScore !== b.honorScore) {
          return (b.honorScore ?? 0) - (a.honorScore ?? 0);
        }

        if (a.championCount !== b.championCount) {
          return b.championCount - a.championCount;
        }

        if (a.totalCount !== b.totalCount) {
          return b.totalCount - a.totalCount;
        }

        return a.name.localeCompare(b.name, 'zh-CN');
      });
  }

  private filterCountryHonorSummaryRecords(
    records: Array<Prisma.CompetitionStandingGetPayload<{ include: typeof COUNTRY_HONOR_INCLUDE }>>,
    query: CountryHonorSummaryQuery
  ) {
    const keyword = this.normalizeKeyword(query.keyword);

    if (!keyword) {
      return records;
    }

    const competitionKeywordMatched = records.some((record) =>
      this.matchesCompetitionKeyword(record.edition.competition, keyword)
    );

    return competitionKeywordMatched
      ? records.filter((record) =>
          this.matchesCompetitionKeyword(record.edition.competition, keyword)
        )
      : records;
  }

  private buildCountryHonorGroups(
    records: Array<Prisma.CompetitionStandingGetPayload<{ include: typeof COUNTRY_HONOR_INCLUDE }>>,
    targetCountryId: string
  ) {
    const groupMap = new Map<
      string,
      {
        competition: (typeof records)[number]['edition']['competition'];
        placements: Record<
          CompetitionStandingPlacement,
          Array<{
            id: string;
            label: string;
            year: number | null;
            season: string | null;
            host: string | null;
            sourceName?: string | null;
          }>
        >;
      }
    >();

    for (const record of records) {
      const competition = record.edition.competition;
      const group = groupMap.get(competition.id) ?? {
        competition,
        placements: this.createPlacementEntryMap<{
          id: string;
          label: string;
          year: number | null;
          season: string | null;
          host: string | null;
          sourceName?: string | null;
        }>()
      };
      group.placements[record.placement].push({
        id: record.id,
        label: this.formatHonorEntryLabel(record.edition),
        year: record.edition.year,
        season: record.edition.season,
        host: record.edition.host,
        sourceName: record.countryId === targetCountryId ? null : record.country?.name
      });
      groupMap.set(competition.id, group);
    }

    return [...groupMap.values()]
      .map((group) => ({
        competition: group.competition,
        placements: group.placements
      }))
      .sort((a, b) => {
        if (a.competition.sortOrder !== b.competition.sortOrder) {
          return a.competition.sortOrder - b.competition.sortOrder;
        }

        return a.competition.name.localeCompare(b.competition.name, 'zh-CN');
      });
  }

  private buildHonorSummaryCompetitions(
    records: Array<Prisma.CompetitionStandingGetPayload<{ include: typeof COUNTRY_HONOR_INCLUDE }>>
  ) {
    const competitionMap = new Map<
      string,
      (typeof records)[number]['edition']['competition'] & {
        counts: HonorSummaryCounts;
      }
    >();

    for (const record of records) {
      const competition = competitionMap.get(record.edition.competition.id) ?? {
        ...record.edition.competition,
        counts: this.createHonorSummaryCounts()
      };

      this.addPlacementCount(competition.counts, record.placement);
      competitionMap.set(record.edition.competition.id, competition);
    }

    return [...competitionMap.values()].sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }

      if ((a.level ?? '') !== (b.level ?? '')) {
        return (a.level ?? '').localeCompare(b.level ?? '', 'zh-CN');
      }

      return a.name.localeCompare(b.name, 'zh-CN');
    });
  }

  private async getCountrySuccessorMap(countryIds: string[]) {
    const links = await this.prisma.countrySuccessor.findMany({
      where: {
        historicalCountryId: {
          in: [...new Set(countryIds)]
        }
      },
      select: {
        historicalCountryId: true,
        successorCountryId: true
      }
    });
    const map = new Map<string, string[]>();

    for (const link of links) {
      const rows = map.get(link.historicalCountryId) ?? [];
      rows.push(link.successorCountryId);
      map.set(link.historicalCountryId, rows);
    }

    return map;
  }

  private createCountryHonorSummaryRow(country: {
    id: string;
    uid: string;
    name: string;
    honorScore?: number | null;
    federationRef?: { id: string; uid: string; name: string; code?: string | null } | null;
  }) {
    return {
      id: country.id,
      uid: country.uid,
      name: country.name,
      federationRef: country.federationRef,
      honorScore: 0,
      totalCount: 0,
      championCount: 0,
      runnerUpCount: 0,
      thirdPlaceCount: 0,
      fourthPlaceCount: 0,
      semiFinalistCount: 0,
      competitionStats: {} as Record<string, ReturnType<typeof this.createHonorSummaryCounts>>
    };
  }

  private addHonorSummaryPlacement(
    row: ReturnType<typeof this.createCountryHonorSummaryRow>,
    competitionId: string,
    placement: CompetitionStandingPlacement,
    score: number
  ) {
    const counts = row.competitionStats[competitionId] ?? this.createHonorSummaryCounts();
    this.addPlacementCount(counts, placement);
    this.addPlacementCount(row, placement);
    row.honorScore = this.round((row.honorScore ?? 0) + score);
    row.competitionStats[competitionId] = counts;
  }

  private createHonorSummaryCounts() {
    return {
      totalCount: 0,
      championCount: 0,
      runnerUpCount: 0,
      thirdPlaceCount: 0,
      fourthPlaceCount: 0,
      semiFinalistCount: 0
    };
  }

  private createPlacementEntryMap<T>() {
    return {
      [CompetitionStandingPlacement.CHAMPION]: [],
      [CompetitionStandingPlacement.RUNNER_UP]: [],
      [CompetitionStandingPlacement.THIRD_PLACE]: [],
      [CompetitionStandingPlacement.FOURTH_PLACE]: [],
      [CompetitionStandingPlacement.SEMI_FINALIST]: []
    } as Record<CompetitionStandingPlacement, T[]>;
  }

  private addPlacementCount(
    target: ReturnType<typeof this.createHonorSummaryCounts>,
    placement: CompetitionStandingPlacement
  ) {
    target.totalCount += 1;

    if (placement === CompetitionStandingPlacement.CHAMPION) {
      target.championCount += 1;
    } else if (placement === CompetitionStandingPlacement.RUNNER_UP) {
      target.runnerUpCount += 1;
    } else if (placement === CompetitionStandingPlacement.THIRD_PLACE) {
      target.thirdPlaceCount += 1;
    } else if (placement === CompetitionStandingPlacement.FOURTH_PLACE) {
      target.fourthPlaceCount += 1;
    } else if (placement === CompetitionStandingPlacement.SEMI_FINALIST) {
      target.semiFinalistCount += 1;
    }
  }

  private async getHonorSummaryRules(targetType: CompetitionTargetType) {
    return this.prisma.honorRule.findMany({
      where: {
        enabled: true,
        isSystem: true,
        targetType
      },
      include: { coefficients: true }
    });
  }

  private resolveHonorSummaryScore(
    rules: HonorSummaryRule[],
    competition: CountryHonorCompetition,
    placement: CompetitionStandingPlacement,
    year: number | null,
    quantity: number | null
  ) {
    const rule = this.resolveHonorSummaryRule(rules, competition, placement);

    if (!rule) {
      return null;
    }

    const placementScore = this.resolvePlacementScore(rule, placement);

    if (placementScore === null || placementScore <= 0) {
      return null;
    }

    return this.round(
      placementScore *
        this.resolveQualityCoefficient(rule, competition) *
        this.resolveConversionCoefficient(rule, competition, year, quantity)
    );
  }

  private resolveHonorSummaryRule(
    rules: HonorSummaryRule[],
    competition: CountryHonorCompetition,
    placement: CompetitionStandingPlacement
  ) {
    return rules
      .filter(
        (rule) =>
          this.honorRuleMatches(rule, competition) && this.honorRuleAllowsPlacement(rule, placement)
      )
      .sort((a, b) => this.honorRuleSpecificity(b) - this.honorRuleSpecificity(a))[0];
  }

  private honorRuleMatches(rule: HonorSummaryRule, competition: CountryHonorCompetition) {
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

  private formatMatches(ruleFormat: string | null, competition: CountryHonorCompetition) {
    if (this.sameText(ruleFormat, competition.format)) {
      return true;
    }

    return (
      competition.format === '其他' && ruleFormat === '杯赛' && competition.category !== '国内'
    );
  }

  private honorRuleSpecificity(rule: HonorSummaryRule) {
    return [
      rule.confederationId,
      rule.countryId,
      rule.scopeType,
      rule.format,
      rule.level,
      rule.category
    ].filter(Boolean).length;
  }

  private resolvePlacementScore(rule: HonorSummaryRule, placement: CompetitionStandingPlacement) {
    if (!this.honorRuleAllowsPlacement(rule, placement)) {
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

  private honorRuleAllowsPlacement(
    rule: HonorSummaryRule,
    placement: CompetitionStandingPlacement
  ) {
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

  private resolveQualityCoefficient(rule: HonorSummaryRule, competition: CountryHonorCompetition) {
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
    rule: HonorSummaryRule,
    competition: CountryHonorCompetition,
    year: number | null,
    quantity: number | null
  ) {
    if (rule.conversionType === HonorRuleConversionType.FREQUENCY_SCALE) {
      return this.frequencyCoefficient(competition) * this.scaleCoefficient(competition, quantity);
    }

    if (rule.conversionType === HonorRuleConversionType.OLYMPIC_STAGE) {
      if (!year) return 1;
      if (year <= 1928) return 2.5;
      if (year <= 1988) return 1.2;

      return 0.75;
    }

    return 1;
  }

  private frequencyCoefficient(competition: CountryHonorCompetition) {
    const years = [
      ...new Set(competition.editions.map((edition) => edition.year).filter(isNumber))
    ].sort((a, b) => a - b);

    if (years.length < 2) {
      return 1;
    }

    const gaps = years.slice(1).map((year, index) => year - years[index]);
    const averageGap = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;

    if (averageGap >= 3.5) return 1;
    if (averageGap >= 2.5) return 0.85;
    if (averageGap >= 1.5) return 0.7;

    return 0.45;
  }

  private scaleCoefficient(competition: CountryHonorCompetition, quantity: number | null) {
    const resolvedQuantity =
      quantity ?? this.median(competition.editions.map((edition) => edition.quantity));

    if (!resolvedQuantity) return 1;
    if (resolvedQuantity >= 24) return 1;
    if (resolvedQuantity >= 16) return 0.9;
    if (resolvedQuantity >= 10) return 0.75;
    if (resolvedQuantity >= 8) return 0.65;
    if (resolvedQuantity >= 4) return 0.5;

    return 1;
  }

  private median(values: Array<number | null>) {
    const numbers = values.filter(isNumber).sort((a, b) => a - b);

    if (!numbers.length) return null;

    return numbers[Math.floor(numbers.length / 2)];
  }

  private competitionConfederationIds(competition: CountryHonorCompetition) {
    return [
      competition.confederationId,
      ...competition.scopeConfederations.map((item) => item.confederationId)
    ].filter(isString);
  }

  private competitionCountryIds(competition: CountryHonorCompetition) {
    return [
      competition.countryId,
      ...competition.scopeCountries.map((item) => item.countryId)
    ].filter(isString);
  }

  private sameText(left?: string | null, right?: string | null) {
    return (left?.trim() ?? '') === (right?.trim() ?? '');
  }

  private round(value: number) {
    return Math.round(value * 100) / 100;
  }

  private formatHonorEntryLabel(edition: {
    season: string | null;
    name: string;
    year: number | null;
  }) {
    if (edition.season) {
      return edition.season;
    }

    if (edition.year) {
      return `${edition.year}年`;
    }

    return edition.name;
  }

  private normalizeKeyword(value?: string | null) {
    return value?.trim().toLocaleLowerCase('zh-CN') ?? '';
  }

  private matchesText(keyword: string, ...values: Array<string | number | null | undefined>) {
    return values.some((value) =>
      String(value ?? '')
        .toLocaleLowerCase('zh-CN')
        .includes(keyword)
    );
  }

  private matchesCompetitionKeyword(
    competition: {
      name: string;
      code: string;
      category?: string | null;
      level?: string | null;
      format?: string | null;
    },
    keyword: string
  ) {
    return this.matchesText(
      keyword,
      competition.name,
      competition.code,
      competition.category,
      competition.level,
      competition.format
    );
  }

  private async getCountryIdsWithInheritedSources(countryId: string) {
    const links = await this.prisma.countrySuccessor.findMany({
      where: {
        successorCountryId: countryId
      },
      select: {
        historicalCountryId: true
      }
    });

    return [countryId, ...links.map((link) => link.historicalCountryId)];
  }

  private async getCountryCareerProfile(countryId: string) {
    const [careers, players] = await Promise.all([
      this.prisma.playerCareer.findMany({
        where: {
          countryId,
          careerType: PlayerCareerType.COUNTRY
        },
        include: {
          player: {
            select: PROFILE_PLAYER_SELECT
          }
        },
        orderBy: [{ sortOrder: 'asc' }, { startYear: 'asc' }]
      }),
      this.prisma.player.findMany({
        where: {
          countryId
        },
        select: PROFILE_PLAYER_SELECT,
        orderBy: [{ pa: 'desc' }, { chineseName: 'asc' }]
      })
    ]);

    return {
      careerTimeline: this.buildCareerTimeline(careers),
      lineupByPosition: this.buildPlayerLineup(players)
    };
  }

  private buildCareerTimeline(
    careers: Array<
      Prisma.PlayerCareerGetPayload<{
        include: { player: { select: typeof PROFILE_PLAYER_SELECT } };
      }>
    >
  ) {
    const map = new Map<string, ReturnType<typeof this.mapCareerLine>[]>();

    for (const career of careers) {
      const decade = this.getPlayerDecade(career.player.birthDate);
      const rows = map.get(decade) ?? [];
      rows.push(this.mapCareerLine(career));
      map.set(decade, rows);
    }

    return [...map.entries()]
      .sort(([a], [b]) => this.compareDecade(a, b))
      .map(([decade, items]) => ({ decade, items }));
  }

  private buildPlayerLineup(
    players: Array<Prisma.PlayerGetPayload<{ select: typeof PROFILE_PLAYER_SELECT }>>
  ) {
    const positionOrder = ['ST', 'AML', 'AMC', 'AMR', 'MC', 'DMC', 'DL', 'DC', 'DR', 'GK'];
    const map = new Map<string, ReturnType<typeof this.mapPlayerLine>[]>();

    for (const player of players) {
      const position = this.resolvePlayerPosition(player);
      const rows = map.get(position) ?? [];
      rows.push(this.mapPlayerLine(player));
      map.set(position, rows);
    }

    return positionOrder.map((position) => ({
      position,
      items: map.get(position) ?? []
    }));
  }

  private mapCareerLine(
    career: Prisma.PlayerCareerGetPayload<{
      include: { player: { select: typeof PROFILE_PLAYER_SELECT } };
    }>
  ) {
    return {
      id: career.id,
      player: career.player,
      position: this.resolveCareerPosition(career),
      positionGroup: career.positionGroup,
      period: this.formatCareerPeriod(career),
      appearances: career.appearances,
      goals: career.goals,
      assists: career.assists,
      cleanSheets: career.cleanSheets,
      goalsConceded: career.goalsConceded,
      remark: career.remark
    };
  }

  private mapPlayerLine(player: Prisma.PlayerGetPayload<{ select: typeof PROFILE_PLAYER_SELECT }>) {
    return {
      id: player.id,
      player,
      position: this.resolvePlayerPosition(player),
      pa: player.pa
    };
  }

  private resolveCareerPosition(
    career: Prisma.PlayerCareerGetPayload<{
      include: { player: { select: typeof PROFILE_PLAYER_SELECT } };
    }>
  ) {
    return this.resolvePositionText(
      career.position ?? career.player.primaryRole ?? career.player.positions
    );
  }

  private resolvePlayerPosition(
    player: Prisma.PlayerGetPayload<{ select: typeof PROFILE_PLAYER_SELECT }>
  ) {
    return this.resolvePositionText(player.primaryRole ?? player.positions);
  }

  private resolvePositionText(value?: string | null) {
    const [position] = (value ?? '').split(/[、,，/\s]+/).filter(Boolean);
    return position || '未分组';
  }

  private formatCareerPeriod(career: {
    startSeason: string | null;
    endSeason: string | null;
    startYear: number | null;
    endYear: number | null;
  }) {
    if (career.startSeason || career.endSeason) {
      return [career.startSeason, career.endSeason].filter(Boolean).join(' - ') || null;
    }

    if (career.startYear || career.endYear) {
      return [career.startYear, career.endYear].filter(Boolean).join(' - ');
    }

    return null;
  }

  private getPlayerDecade(value: number | null) {
    if (!value) {
      return '未知年代';
    }

    const year = new Date(value).getFullYear();

    if (!Number.isFinite(year)) {
      return '未知年代';
    }

    const start = Math.floor(year / 10) * 10;
    return `${start}-${start + 9}`;
  }

  private compareDecade(a: string, b: string) {
    if (a === '未知年代') return 1;
    if (b === '未知年代') return -1;
    return Number(a.slice(0, 4)) - Number(b.slice(0, 4));
  }

  private async buildHonorWhere(
    query: CountryHonorListQuery
  ): Promise<Prisma.CompetitionStandingWhereInput> {
    const keyword = query.keyword?.trim();
    const year = toInteger(query.year, Number.NaN);
    const countryIds = query.countryId
      ? await this.getCountryIdsWithInheritedSources(query.countryId)
      : null;

    return {
      countryId: countryIds ? { in: countryIds } : { not: null },
      ...(this.isPlacement(query.placement) ? { placement: query.placement } : {}),
      edition: {
        ...(query.competitionId ? { competitionId: query.competitionId } : {}),
        ...(Number.isFinite(year) ? { year } : {}),
        competition: {
          targetType: CompetitionTargetType.COUNTRY
        }
      },
      ...(keyword
        ? {
            OR: [
              { country: { name: { contains: keyword, mode: 'insensitive' } } },
              { country: { uid: { contains: keyword, mode: 'insensitive' } } },
              { remark: { contains: keyword, mode: 'insensitive' } },
              { edition: { name: { contains: keyword, mode: 'insensitive' } } },
              { edition: { season: { contains: keyword, mode: 'insensitive' } } },
              { edition: { host: { contains: keyword, mode: 'insensitive' } } },
              { edition: { competition: { name: { contains: keyword, mode: 'insensitive' } } } },
              { edition: { competition: { code: { contains: keyword, mode: 'insensitive' } } } },
              {
                edition: { competition: { category: { contains: keyword, mode: 'insensitive' } } }
              },
              { edition: { competition: { level: { contains: keyword, mode: 'insensitive' } } } },
              { edition: { competition: { format: { contains: keyword, mode: 'insensitive' } } } }
            ]
          }
        : {})
    };
  }

  private mapHonorRecord(
    item: Prisma.CompetitionStandingGetPayload<{ include: typeof COUNTRY_HONOR_INCLUDE }>
  ) {
    return {
      id: item.id,
      placement: item.placement,
      remark: item.remark,
      country: item.country,
      competition: item.edition.competition,
      edition: {
        id: item.edition.id,
        name: item.edition.name,
        season: item.edition.season,
        year: item.edition.year,
        host: item.edition.host,
        remark: item.edition.remark
      },
      standings: this.mapCountryStandingSummary(item.edition.standings)
    };
  }

  private mapCountryStandingSummary(
    standings: Array<
      Prisma.CompetitionStandingGetPayload<{
        include: { country: { select: typeof COUNTRY_REF_SELECT } };
      }>
    >
  ) {
    return Object.fromEntries(
      standings.map((standing) => [standing.placement, standing.country])
    ) as Record<CompetitionStandingPlacement, (typeof standings)[number]['country']>;
  }

  private isPlacement(value: string | undefined): value is CompetitionStandingPlacement {
    return (
      value !== undefined &&
      Object.values(CompetitionStandingPlacement).includes(value as CompetitionStandingPlacement)
    );
  }

  private handleDeleteError(error: unknown, label: string): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`${label}不存在。`);
      }

      if (error.code === 'P2003') {
        throw new BadRequestException(`${label}存在关联数据，不能直接删除。`);
      }
    }

    throw error;
  }
}

function isString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}
