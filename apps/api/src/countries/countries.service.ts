import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  CompetitionStandingPlacement,
  CompetitionTargetType,
  PlayerCareerType,
  type Prisma
} from '@prisma/client';
import { CatalogStatsService } from '../common/catalog-stats.service.js';
import { resolvePagination, toInteger } from '../common/pagination.js';
import { PrismaService } from '../database/prisma.service.js';
import type { CountryHonorListQuery, CountryListQuery, CountryPayload } from './countries.types.js';

const COUNTRY_INCLUDE = {
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
    select: {
      id: true,
      uid: true,
      name: true,
      externalUrl: true
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
          }
        }
      },
      standings: {
        orderBy: { placement: 'asc' },
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
      }
    }
  }
} satisfies Prisma.CompetitionStandingInclude;

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
    const country = await this.prisma.country.findUnique({
      where: { id },
      include: COUNTRY_INCLUDE
    });

    if (!country) {
      throw new NotFoundException('国家不存在。');
    }

    const [computedCountry] = await this.attachComputedStats([country]);

    return {
      ...computedCountry,
      honorRecords: await this.getCountryHonorRecords(id, 10),
      ...(await this.getCountryCareerProfile(id))
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

  async findHonors(query: CountryHonorListQuery) {
    const pagination = resolvePagination(query);
    const where = this.buildHonorWhere(query);
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

  private buildWhere(query: CountryListQuery): Prisma.CountryWhereInput {
    const keyword = query.keyword?.trim();

    return {
      ...(keyword
        ? {
            OR: [
              { name: { contains: keyword, mode: 'insensitive' } },
              { uid: { contains: keyword, mode: 'insensitive' } },
              { federation: { contains: keyword, mode: 'insensitive' } }
            ]
          }
        : {}),
      ...(query.confederationId ? { federationId: query.confederationId } : {})
    };
  }

  private async buildCountryData(
    body: CountryPayload
  ): Promise<
    Pick<
      Prisma.CountryUncheckedCreateInput,
      'uid' | 'name' | 'externalUrl' | 'remark' | 'federation' | 'federationId'
    >
  > {
    const uid = this.requiredText(body.uid, 'UID');
    const name = this.requiredText(body.name, '国家名称');
    const confederation = await this.findConfederation(body.confederationId);

    return {
      uid,
      name,
      externalUrl: this.optionalText(body.externalUrl),
      remark: this.optionalText(body.remark),
      federation: confederation?.name ?? null,
      federationId: confederation?.id ?? null
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
      'championCount',
      'name',
      'createdAt'
    ]);

    if (!allowedSorts.has(sortBy)) {
      return [{ honorScore: 'desc' }, { name: 'asc' }];
    }

    return [{ [sortBy]: sortOrder }, { name: 'asc' }];
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
    const items = await this.prisma.competitionStanding.findMany({
      where: {
        countryId,
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

  private buildHonorWhere(query: CountryHonorListQuery): Prisma.CompetitionStandingWhereInput {
    const keyword = query.keyword?.trim();
    const year = toInteger(query.year, Number.NaN);

    return {
      countryId: query.countryId || { not: null },
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
              { edition: { competition: { level: { contains: keyword, mode: 'insensitive' } } } }
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
        include: { country: { select: { id: true; uid: true; name: true; externalUrl: true } } };
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
}
