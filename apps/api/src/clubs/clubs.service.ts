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
import type { ClubHonorListQuery, ClubListQuery, ClubPayload } from './clubs.types.js';

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
    const club = await this.prisma.club.findUnique({
      where: {
        id
      },
      include: CLUB_INCLUDE
    });

    if (!club) {
      throw new NotFoundException('俱乐部不存在。');
    }

    const [computedClub] = await this.attachComputedStats([club]);

    return {
      ...computedClub,
      honorRecords: await this.getClubHonorRecords(id, 10),
      ...(await this.getClubCareerProfile(id))
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

  private buildWhere(query: ClubListQuery): Prisma.ClubWhereInput {
    const keyword = query.keyword?.trim();

    return {
      ...(query.includeHidden === 'true' ? {} : { exists: true }),
      ...(keyword
        ? {
            OR: [
              { name: { contains: keyword, mode: 'insensitive' } },
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
      | 'externalUrl'
      | 'remark'
      | 'exists'
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
    const confederation = await this.findConfederation(body.confederationId);

    return {
      uid,
      name,
      externalUrl: this.optionalText(body.externalUrl),
      remark: this.optionalText(body.remark),
      exists: body.exists ?? true,
      country: country?.name ?? null,
      countryId: country?.id ?? null,
      countryUid: country?.uid ?? null,
      federation: confederation?.name ?? country?.federation ?? null,
      federationId: confederation?.id ?? country?.federationId ?? null
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
              { edition: { competition: { level: { contains: keyword, mode: 'insensitive' } } } }
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
}
