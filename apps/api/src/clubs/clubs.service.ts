import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  AwardScopeType,
  AwardTargetType,
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
  ClubHonorListQuery,
  ClubHonorSummaryQuery,
  ClubListQuery,
  ClubPayload
} from './clubs.types.js';

const CLUB_INCLUDE = {
  countryRef: {
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
      players: true
    }
  }
} satisfies Prisma.ClubInclude;

const CLUB_HONOR_INCLUDE = {
  club: {
    select: {
      id: true,
      uid: true,
      name: true,
      externalUrl: true,
      exists: true
    }
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
            select: {
              id: true,
              uid: true,
              name: true,
              externalUrl: true
            }
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
                select: {
                  id: true,
                  uid: true,
                  name: true,
                  externalUrl: true
                }
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
          club: {
            select: {
              id: true,
              uid: true,
              name: true,
              externalUrl: true,
              exists: true
            }
          }
        }
      }
    }
  }
} satisfies Prisma.CompetitionStandingInclude;

type ClubHonorRecord = Prisma.CompetitionStandingGetPayload<{
  include: typeof CLUB_HONOR_INCLUDE;
}>;
type ClubHonorCompetition = ClubHonorRecord['edition']['competition'];
type HonorSummaryRule = Prisma.HonorRuleGetPayload<{ include: { coefficients: true } }>;
type HonorSummaryScoreDetail = {
  score: number;
  placementScore: number;
  qualityCoefficient: number;
  conversionCoefficient: number;
  ruleName: string;
};
type HonorSummaryCounts = {
  totalCount: number;
  championCount: number;
  runnerUpCount: number;
  thirdPlaceCount: number;
  fourthPlaceCount: number;
  semiFinalistCount: number;
  score: number;
  details: Record<
    CompetitionStandingPlacement,
    Array<{
      id: string;
      label: string;
      year: number | null;
      season: string | null;
      host: string | null;
      competitionId: string;
      competitionName: string;
      score: number;
      placementScore: number;
      qualityCoefficient: number;
      conversionCoefficient: number;
      ruleName: string;
    }>
  >;
};
type TeamBonusHonorDetail = {
  id: string;
  awardId: string;
  awardName: string;
  editionName: string;
  year: number | null;
  season: string | null;
  rank: number | null;
  placement: string | null;
  score: number;
  baseScore: number;
  coefficient: number;
  ruleName: string;
  externalUrl: string | null;
  remark: string | null;
};

const CAREER_PLAYER_SELECT = {
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
export class ClubsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalogStats: CatalogStatsService
  ) {}

  async findAll(query: ClubListQuery) {
    const pagination = resolvePagination(query);
    const where = this.buildWhere(query);
    const orderBy = this.buildOrderBy(query);

    if (this.shouldSortComputedStats(query.sortBy)) {
      const items = await this.prisma.club.findMany({
        where,
        include: CLUB_INCLUDE,
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
      this.prisma.club.findMany({
        where,
        include: CLUB_INCLUDE,
        orderBy,
        skip: pagination.skip,
        take: pagination.take
      }),
      this.prisma.club.count({ where })
    ]);

    return {
      items: await this.attachComputedStats(items),
      page: pagination.page,
      pageSize: pagination.pageSize,
      total
    };
  }

  async findOne(id: string) {
    const club = await this.prisma.club.findFirst({
      where: {
        OR: [{ id }, { uid: id }]
      },
      include: CLUB_INCLUDE
    });

    if (!club) {
      throw new NotFoundException('俱乐部不存在。');
    }

    const [computedClub] = await this.attachComputedStats([club]);

    return {
      ...computedClub,
      honorRecords: await this.getClubHonorRecords(club.id, 10),
      honorGroups: await this.getClubHonorGroups(club.id),
      bonusHonorDetails: (await this.getClubBonusHonorDetailMap([club.id])).get(club.id) ?? [],
      ...(await this.getClubCareerProfile(club.id))
    };
  }

  async create(body: ClubPayload) {
    const data = await this.buildClubData(body);
    await this.assertUniqueUid(data.uid);
    const club = await this.prisma.club.create({
      data: {
        ...data,
        importKey: this.createManualImportKey('club', data.uid)
      },
      select: { id: true }
    });

    return this.findOne(club.id);
  }

  async update(id: string, body: ClubPayload) {
    const existing = await this.prisma.club.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!existing) {
      throw new NotFoundException('俱乐部不存在。');
    }

    const data = await this.buildClubData(body);
    await this.assertUniqueUid(data.uid, id);
    await this.prisma.club.update({
      where: { id },
      data
    });

    return this.findOne(id);
  }

  async remove(id: string) {
    try {
      await this.prisma.club.delete({
        where: { id }
      });

      return { id };
    } catch (error) {
      this.handleDeleteError(error, '俱乐部');
    }
  }

  async findHonors(query: ClubHonorListQuery) {
    const pagination = resolvePagination(query);
    const where = this.buildHonorWhere(query);
    const [items, total] = await this.prisma.$transaction([
      this.prisma.competitionStanding.findMany({
        where,
        include: CLUB_HONOR_INCLUDE,
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

  async findHonorSummary(query: ClubHonorSummaryQuery) {
    const pagination = resolvePagination(query);
    const [records, rules] = await Promise.all([
      this.getClubHonorSummaryRecords(query),
      this.getHonorSummaryRules(CompetitionTargetType.CLUB)
    ]);
    const effectiveRecords = this.filterClubHonorSummaryRecords(records, query);
    const scoringRecords = effectiveRecords.filter((record) =>
      this.resolveHonorSummaryScore(
        rules,
        record.edition.competition,
        record.placement,
        record.edition.year,
        record.edition.quantity
      )
    );
    const rows = await this.buildClubHonorSummaryRows(scoringRecords, query, rules);
    const competitions = this.buildHonorSummaryCompetitions(scoringRecords);

    return {
      items: rows.slice(pagination.skip, pagination.skip + pagination.take),
      competitions,
      page: pagination.page,
      pageSize: pagination.pageSize,
      total: rows.length
    };
  }

  private buildWhere(query: ClubListQuery): Prisma.ClubWhereInput {
    const keyword = query.keyword?.trim();

    return {
      ...(query.includeHidden === 'true' ? {} : { visibleInCatalog: true }),
      ...(keyword
        ? {
            OR: [
              { name: { contains: keyword, mode: 'insensitive' } },
              { formerName: { contains: keyword, mode: 'insensitive' } },
              { alias: { contains: keyword, mode: 'insensitive' } },
              { uid: { contains: keyword, mode: 'insensitive' } },
              { country: { contains: keyword, mode: 'insensitive' } },
              { federation: { contains: keyword, mode: 'insensitive' } }
            ]
          }
        : {}),
      ...(query.confederationId ? { federationId: query.confederationId } : {}),
      ...(query.countryId ? { countryId: query.countryId } : {})
    };
  }

  private async buildClubData(
    body: ClubPayload
  ): Promise<
    Pick<
      Prisma.ClubUncheckedCreateInput,
      | 'uid'
      | 'name'
      | 'formerName'
      | 'alias'
      | 'externalUrl'
      | 'remark'
      | 'exists'
      | 'visibleInCatalog'
      | 'country'
      | 'countryId'
      | 'countryUid'
      | 'federation'
      | 'federationId'
    >
  > {
    const uid = this.requiredText(body.uid, 'UID');
    const name = this.requiredText(body.name, '俱乐部名称');
    const country = await this.findCountry(body.countryId);

    return {
      uid,
      name,
      formerName: this.optionalText(body.formerName),
      alias: this.optionalText(body.alias),
      externalUrl: this.optionalText(body.externalUrl),
      remark: this.optionalText(body.remark),
      exists: body.exists ?? true,
      visibleInCatalog: body.visibleInCatalog ?? true,
      country: country?.name ?? null,
      countryId: country?.id ?? null,
      countryUid: country?.uid ?? null,
      federation: country?.federation ?? null,
      federationId: country?.federationId ?? null
    };
  }

  private async findCountry(id?: string) {
    const cleanId = this.optionalText(id);

    if (!cleanId) {
      return null;
    }

    const country = await this.prisma.country.findUnique({
      where: { id: cleanId },
      select: { id: true, uid: true, name: true, federation: true, federationId: true }
    });

    if (!country) {
      throw new BadRequestException('国家不存在。');
    }

    return country;
  }
  private async assertUniqueUid(uid: string, id?: string) {
    if (uid === '-') {
      return;
    }

    const duplicate = await this.prisma.club.findFirst({
      where: {
        uid,
        ...(id ? { id: { not: id } } : {})
      },
      select: { id: true }
    });

    if (duplicate) {
      throw new BadRequestException('俱乐部 UID 已存在。');
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

  private createManualImportKey(entity: string, uid: string) {
    return uid === '-' ? `manual:${entity}:${randomUUID()}` : `manual:${entity}:${uid}`;
  }

  private buildOrderBy(query: ClubListQuery): Prisma.ClubOrderByWithRelationInput[] {
    const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';
    const sortBy = query.sortBy ?? 'honorScore';
    const allowedSorts = new Set([
      'honorScore',
      'playerCount',
      'totalPa',
      'averagePa',
      'championCount',
      'trophyCount',
      'name',
      'createdAt'
    ]);

    if (!allowedSorts.has(sortBy)) {
      return [{ honorScore: { sort: 'desc', nulls: 'last' } }, { name: 'asc' }];
    }

    if (sortBy === 'honorScore') {
      return [{ honorScore: { sort: sortOrder, nulls: 'last' } }, { name: 'asc' }];
    }

    return [{ [sortBy]: sortOrder }, { name: 'asc' }];
  }

  private shouldSortComputedStats(sortBy?: string) {
    return ['playerCount', 'totalPa', 'averagePa', 'trophyCount', 'championCount'].includes(
      sortBy ?? ''
    );
  }

  private sortComputedStats<T extends { name?: string | null }>(items: T[], query: ClubListQuery) {
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
      this.catalogStats.getClubParticipationStats(ids),
      this.catalogStats.getClubStandingStats(ids)
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
        trophyCount: standings.trophyCount,
        championCount: standings.championCount,
        runnerUpCount: standings.runnerUpCount,
        thirdPlaceCount: standings.thirdPlaceCount,
        fourthPlaceCount: standings.fourthPlaceCount
      };
    });
  }

  private async getClubHonorRecords(clubId: string, take: number) {
    const items = await this.prisma.competitionStanding.findMany({
      where: {
        clubId,
        edition: {
          competition: {
            targetType: CompetitionTargetType.CLUB
          }
        }
      },
      include: CLUB_HONOR_INCLUDE,
      orderBy: [{ edition: { year: 'desc' } }, { edition: { name: 'desc' } }, { placement: 'asc' }],
      take
    });

    return items.map((item) => this.mapHonorRecord(item));
  }

  private async getClubHonorGroups(clubId: string) {
    const items = await this.prisma.competitionStanding.findMany({
      where: {
        clubId,
        edition: {
          competition: {
            targetType: CompetitionTargetType.CLUB,
            includeInStats: true
          }
        }
      },
      include: CLUB_HONOR_INCLUDE,
      orderBy: [{ edition: { year: 'asc' } }, { edition: { name: 'asc' } }, { placement: 'asc' }]
    });

    return this.buildClubHonorGroups(items);
  }

  private async getClubBonusHonorDetailMap(clubIds?: string[]) {
    const [rules, recipients] = await Promise.all([
      this.prisma.teamHonorRule.findMany({
        where: { targetType: AwardTargetType.CLUB, enabled: true },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }]
      }),
      this.prisma.awardRecipient.findMany({
        where: {
          targetType: AwardTargetType.CLUB,
          clubId: clubIds?.length ? { in: clubIds } : { not: null }
        },
        include: {
          edition: {
            include: {
              award: {
                select: {
                  id: true,
                  name: true,
                  scopeType: true,
                  category: true,
                  targetType: true
                }
              }
            }
          }
        },
        orderBy: [{ edition: { year: 'desc' } }, { rank: 'asc' }]
      })
    ]);
    const detailMap = new Map<string, TeamBonusHonorDetail[]>();

    for (const recipient of recipients) {
      if (!recipient.clubId) {
        continue;
      }

      const rule = this.findMatchingTeamHonorRule(rules, {
        targetType: recipient.targetType,
        scopeType: recipient.edition.award.scopeType,
        category: recipient.edition.award.category,
        placement: recipient.placement,
        rank: recipient.rank
      });

      if (!rule) {
        continue;
      }

      const detail: TeamBonusHonorDetail = {
        id: recipient.id,
        awardId: recipient.edition.award.id,
        awardName: recipient.edition.award.name,
        editionName: recipient.edition.name,
        year: recipient.edition.year,
        season: recipient.edition.season,
        rank: recipient.rank,
        placement: recipient.placement,
        score: this.round(rule.baseScore * rule.coefficient),
        baseScore: rule.baseScore,
        coefficient: rule.coefficient,
        ruleName: rule.name,
        externalUrl: recipient.externalUrl ?? recipient.edition.externalUrl,
        remark: recipient.remark
      };
      const details = detailMap.get(recipient.clubId) ?? [];
      details.push(detail);
      detailMap.set(recipient.clubId, details);
    }

    return detailMap;
  }

  private async getClubHonorSummaryRecords(query: ClubHonorSummaryQuery) {
    return this.prisma.competitionStanding.findMany({
      where: {
        clubId: query.clubId || { not: null },
        edition: {
          ...(query.competitionId ? { competitionId: query.competitionId } : {}),
          competition: {
            targetType: CompetitionTargetType.CLUB,
            includeInStats: true
          }
        }
      },
      include: CLUB_HONOR_INCLUDE,
      orderBy: [
        { edition: { competition: { sortOrder: 'asc' } } },
        { edition: { competition: { level: 'asc' } } },
        { edition: { competition: { name: 'asc' } } },
        { edition: { year: 'asc' } },
        { placement: 'asc' }
      ]
    });
  }

  private async buildClubHonorSummaryRows(
    records: ClubHonorRecord[],
    query: ClubHonorSummaryQuery,
    rules: HonorSummaryRule[]
  ) {
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
    const bonusDetailMap = query.competitionId
      ? new Map<string, TeamBonusHonorDetail[]>()
      : await this.getClubBonusHonorDetailMap(query.clubId ? [query.clubId] : undefined);
    const clubIds = [
      ...new Set([
        ...effectiveRecords
          .map((record) => record.clubId)
          .filter((clubId): clubId is string => Boolean(clubId)),
        ...bonusDetailMap.keys()
      ])
    ];
    const clubs = clubIds.length
      ? await this.attachComputedStats(
          await this.prisma.club.findMany({
            where: {
              id: { in: clubIds }
            },
            include: CLUB_INCLUDE
          })
        )
      : [];
    const clubMap = new Map(clubs.map((club) => [club.id, club]));
    const rowMap = new Map<string, ReturnType<typeof this.createClubHonorSummaryRow>>();

    for (const record of effectiveRecords) {
      if (!record.clubId) {
        continue;
      }

      const club = clubMap.get(record.clubId);

      if (!club) {
        continue;
      }

      const scoreDetail = this.resolveHonorSummaryScore(
        rules,
        record.edition.competition,
        record.placement,
        record.edition.year,
        record.edition.quantity
      );

      if (scoreDetail === null) {
        continue;
      }

      const row = rowMap.get(record.clubId) ?? this.createClubHonorSummaryRow(club);
      this.addHonorSummaryPlacement(row, record, scoreDetail);
      rowMap.set(record.clubId, row);
    }

    for (const [clubId, details] of bonusDetailMap.entries()) {
      const club = clubMap.get(clubId);

      if (!club || !details.length) {
        continue;
      }

      const row = rowMap.get(clubId) ?? this.createClubHonorSummaryRow(club);
      const bonusHonorScore = this.round(
        details.reduce((total, detail) => total + detail.score, 0)
      );
      row.bonusHonorScore = bonusHonorScore;
      row.bonusHonorDetails = details;
      row.honorScore = this.round((row.honorScore ?? 0) + bonusHonorScore);
      rowMap.set(clubId, row);
    }

    return [...rowMap.values()]
      .filter((row) => {
        if (!keyword || competitionKeywordMatched) {
          return true;
        }

        return (
          this.matchesText(
            keyword,
            row.name,
            row.uid,
            row.countryRef?.name,
            row.federationRef?.name
          ) || this.matchesBonusHonorKeyword(row.bonusHonorDetails, keyword)
        );
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

  private filterClubHonorSummaryRecords(
    records: Array<Prisma.CompetitionStandingGetPayload<{ include: typeof CLUB_HONOR_INCLUDE }>>,
    query: ClubHonorSummaryQuery
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

  private buildClubHonorGroups(
    records: Array<Prisma.CompetitionStandingGetPayload<{ include: typeof CLUB_HONOR_INCLUDE }>>
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
        }>()
      };
      group.placements[record.placement].push({
        id: record.id,
        label: this.formatHonorEntryLabel(record.edition),
        year: record.edition.year,
        season: record.edition.season,
        host: record.edition.host
      });
      groupMap.set(competition.id, group);
    }

    return [...groupMap.values()]
      .map((group) => ({
        competition: group.competition,
        placements: group.placements
      }))
      .sort((a, b) => this.compareCompetitionOrder(a.competition, b.competition));
  }

  private buildHonorSummaryCompetitions(
    records: Array<Prisma.CompetitionStandingGetPayload<{ include: typeof CLUB_HONOR_INCLUDE }>>
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

    return [...competitionMap.values()].sort((a, b) => this.compareCompetitionOrder(a, b));
  }

  private compareCompetitionOrder(
    a: { sortOrder: number; level?: string | null; name: string },
    b: { sortOrder: number; level?: string | null; name: string }
  ) {
    if (a.sortOrder !== b.sortOrder) {
      return a.sortOrder - b.sortOrder;
    }

    const levelDiff = this.competitionLevelWeight(a.level) - this.competitionLevelWeight(b.level);

    if (levelDiff !== 0) {
      return levelDiff;
    }

    return a.name.localeCompare(b.name, 'zh-CN');
  }

  private competitionLevelWeight(level?: string | null) {
    const weights: Record<string, number> = {
      一级: 1,
      二级: 2,
      三级: 3,
      四级: 4
    };

    return weights[level ?? ''] ?? 99;
  }

  private createClubHonorSummaryRow(club: {
    id: string;
    uid: string;
    name: string;
    honorScore?: number | null;
    countryRef?: { id: string; uid: string; name: string; externalUrl?: string | null } | null;
    federationRef?: { id: string; uid: string; name: string; code?: string | null } | null;
  }) {
    return {
      id: club.id,
      uid: club.uid,
      name: club.name,
      countryRef: club.countryRef,
      federationRef: club.federationRef,
      honorScore: 0,
      baseHonorScore: 0,
      bonusHonorScore: 0,
      bonusHonorDetails: [] as TeamBonusHonorDetail[],
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
    row: ReturnType<typeof this.createClubHonorSummaryRow>,
    record: ClubHonorRecord,
    scoreDetail: HonorSummaryScoreDetail
  ) {
    const competitionId = record.edition.competition.id;
    const placement = record.placement;
    const counts = row.competitionStats[competitionId] ?? this.createHonorSummaryCounts();
    this.addPlacementCount(counts, placement);
    this.addPlacementCount(row, placement);
    counts.details[placement].push({
      id: record.id,
      label: this.formatHonorEntryLabel(record.edition),
      year: record.edition.year,
      season: record.edition.season,
      host: record.edition.host,
      competitionId,
      competitionName: record.edition.competition.name,
      score: scoreDetail.score,
      placementScore: scoreDetail.placementScore,
      qualityCoefficient: scoreDetail.qualityCoefficient,
      conversionCoefficient: scoreDetail.conversionCoefficient,
      ruleName: scoreDetail.ruleName
    });
    counts.score = this.round(counts.score + scoreDetail.score);
    row.baseHonorScore = this.round((row.baseHonorScore ?? 0) + scoreDetail.score);
    row.honorScore = this.round((row.honorScore ?? 0) + scoreDetail.score);
    row.competitionStats[competitionId] = counts;
  }

  private createHonorSummaryCounts() {
    return {
      totalCount: 0,
      championCount: 0,
      runnerUpCount: 0,
      thirdPlaceCount: 0,
      fourthPlaceCount: 0,
      semiFinalistCount: 0,
      score: 0,
      details: this.createPlacementEntryMap<{
        id: string;
        label: string;
        year: number | null;
        season: string | null;
        host: string | null;
        competitionId: string;
        competitionName: string;
        score: number;
        placementScore: number;
        qualityCoefficient: number;
        conversionCoefficient: number;
        ruleName: string;
      }>()
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
    target: {
      totalCount: number;
      championCount: number;
      runnerUpCount: number;
      thirdPlaceCount: number;
      fourthPlaceCount: number;
      semiFinalistCount: number;
    },
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
    competition: ClubHonorCompetition,
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

    const qualityCoefficient = this.resolveQualityCoefficient(rule, competition);
    const conversionCoefficient = this.resolveConversionCoefficient(
      rule,
      competition,
      year,
      quantity
    );

    return {
      score: this.round(placementScore * qualityCoefficient * conversionCoefficient),
      placementScore,
      qualityCoefficient: this.round(qualityCoefficient),
      conversionCoefficient: this.round(conversionCoefficient),
      ruleName: rule.name
    };
  }

  private resolveHonorSummaryRule(
    rules: HonorSummaryRule[],
    competition: ClubHonorCompetition,
    placement: CompetitionStandingPlacement
  ) {
    return rules
      .filter(
        (rule) =>
          this.honorRuleMatches(rule, competition) && this.honorRuleAllowsPlacement(rule, placement)
      )
      .sort((a, b) => this.honorRuleSpecificity(b) - this.honorRuleSpecificity(a))[0];
  }

  private honorRuleMatches(rule: HonorSummaryRule, competition: ClubHonorCompetition) {
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

  private formatMatches(ruleFormat: string | null, competition: ClubHonorCompetition) {
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

  private resolveQualityCoefficient(rule: HonorSummaryRule, competition: ClubHonorCompetition) {
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
    competition: ClubHonorCompetition,
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

  private frequencyCoefficient(competition: ClubHonorCompetition) {
    const years = competition.editions.map((edition) => edition.year).filter(isNumber);

    if (years.length < 2) {
      return 1;
    }

    const firstYear = Math.min(...years);
    const lastYear = Math.max(...years);
    const averageGap = (lastYear - firstYear) / (years.length - 1);

    return Math.min(averageGap / 4, 1);
  }

  private scaleCoefficient(competition: ClubHonorCompetition, quantity: number | null) {
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

  private competitionConfederationIds(competition: ClubHonorCompetition) {
    return [
      competition.confederationId,
      ...competition.scopeConfederations.map((item) => item.confederationId)
    ].filter(isString);
  }

  private competitionCountryIds(competition: ClubHonorCompetition) {
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

  private matchesBonusHonorKeyword(details: TeamBonusHonorDetail[] | undefined, keyword: string) {
    return (details ?? []).some((detail) =>
      this.matchesText(
        keyword,
        detail.awardName,
        detail.editionName,
        detail.placement,
        detail.ruleName,
        detail.remark
      )
    );
  }

  private findMatchingTeamHonorRule(
    rules: Array<{
      targetType: AwardTargetType;
      scopeType: AwardScopeType | null;
      category: string | null;
      placement: string | null;
      rank: number | null;
      baseScore: number;
      coefficient: number;
      name: string;
    }>,
    recipient: {
      targetType: AwardTargetType;
      scopeType: AwardScopeType | null;
      category: string | null;
      placement: string | null;
      rank: number | null;
    }
  ) {
    return rules.find((rule) => {
      if (rule.targetType !== recipient.targetType) {
        return false;
      }

      if (rule.scopeType && rule.scopeType !== recipient.scopeType) {
        return false;
      }

      if (
        rule.category &&
        this.normalizeKeyword(rule.category) !== this.normalizeKeyword(recipient.category)
      ) {
        return false;
      }

      if (rule.rank !== null && rule.rank !== recipient.rank) {
        return false;
      }

      if (rule.placement) {
        const placement = this.normalizeKeyword(recipient.placement);
        const rulePlacement = this.normalizeKeyword(rule.placement);

        if (!placement || !placement.includes(rulePlacement)) {
          return false;
        }
      }

      return true;
    });
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

  private async getClubCareerProfile(clubId: string) {
    const careers = await this.prisma.playerCareer.findMany({
      where: {
        clubId,
        careerType: PlayerCareerType.CLUB,
        showInProfile: true
      },
      include: {
        player: {
          select: CAREER_PLAYER_SELECT
        }
      },
      orderBy: [{ sortOrder: 'asc' }, { startYear: 'asc' }]
    });

    return {
      careerTimeline: this.buildCareerTimeline(careers),
      lineupByPosition: this.buildLineupByPosition(careers),
      representativeLineupByPosition: this.buildLineupByPosition(
        careers.filter((career) => career.isLegend)
      )
    };
  }

  private buildCareerTimeline(
    careers: Array<
      Prisma.PlayerCareerGetPayload<{
        include: { player: { select: typeof CAREER_PLAYER_SELECT } };
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

  private buildLineupByPosition(
    careers: Array<
      Prisma.PlayerCareerGetPayload<{
        include: { player: { select: typeof CAREER_PLAYER_SELECT } };
      }>
    >
  ) {
    const positionOrder = ['ST', 'AML', 'AMC', 'AMR', 'MC', 'DMC', 'DL', 'DC', 'DR', 'GK'];
    const map = new Map<string, ReturnType<typeof this.mapCareerLine>[]>();

    for (const career of careers) {
      const position = this.resolvePosition(career);
      const rows = map.get(position) ?? [];
      rows.push(this.mapCareerLine(career));
      map.set(position, rows);
    }

    return positionOrder.map((position) => ({
      position,
      items: map.get(position) ?? []
    }));
  }

  private mapCareerLine(
    career: Prisma.PlayerCareerGetPayload<{
      include: { player: { select: typeof CAREER_PLAYER_SELECT } };
    }>
  ) {
    return {
      id: career.id,
      player: career.player,
      position: this.resolvePosition(career),
      positionGroup: career.positionGroup,
      period: this.formatCareerPeriod(career),
      appearances: career.appearances,
      goals: career.goals,
      assists: career.assists,
      cleanSheets: career.cleanSheets,
      goalsConceded: career.goalsConceded,
      isLegend: career.isLegend,
      remark: career.remark
    };
  }

  private resolvePosition(
    career: Prisma.PlayerCareerGetPayload<{
      include: { player: { select: typeof CAREER_PLAYER_SELECT } };
    }>
  ) {
    const raw = career.position ?? career.player.primaryRole ?? career.player.positions ?? '';
    const [position] = raw.split(/[、,，/\s]+/).filter(Boolean);
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

  private buildHonorWhere(query: ClubHonorListQuery): Prisma.CompetitionStandingWhereInput {
    const keyword = query.keyword?.trim();
    const year = toInteger(query.year, Number.NaN);

    return {
      clubId: query.clubId || { not: null },
      ...(this.isPlacement(query.placement) ? { placement: query.placement } : {}),
      edition: {
        ...(query.competitionId ? { competitionId: query.competitionId } : {}),
        ...(Number.isFinite(year) ? { year } : {}),
        competition: {
          targetType: CompetitionTargetType.CLUB
        }
      },
      ...(keyword
        ? {
            OR: [
              { club: { name: { contains: keyword, mode: 'insensitive' } } },
              { club: { uid: { contains: keyword, mode: 'insensitive' } } },
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
    item: Prisma.CompetitionStandingGetPayload<{ include: typeof CLUB_HONOR_INCLUDE }>
  ) {
    return {
      id: item.id,
      placement: item.placement,
      remark: item.remark,
      club: item.club,
      competition: item.edition.competition,
      edition: {
        id: item.edition.id,
        name: item.edition.name,
        season: item.edition.season,
        year: item.edition.year,
        host: item.edition.host,
        remark: item.edition.remark
      },
      standings: this.mapClubStandingSummary(item.edition.standings)
    };
  }

  private mapClubStandingSummary(
    standings: Array<
      Prisma.CompetitionStandingGetPayload<{
        include: {
          club: {
            select: { id: true; uid: true; name: true; externalUrl: true; exists: true };
          };
        };
      }>
    >
  ) {
    return Object.fromEntries(
      standings.map((standing) => [standing.placement, standing.club])
    ) as Record<CompetitionStandingPlacement, (typeof standings)[number]['club']>;
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
