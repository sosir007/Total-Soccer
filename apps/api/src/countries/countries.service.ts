import { Injectable, NotFoundException } from '@nestjs/common';
import { CompetitionStandingPlacement, CompetitionTargetType, type Prisma } from '@prisma/client';
import { CatalogStatsService } from '../common/catalog-stats.service.js';
import { resolvePagination, toInteger } from '../common/pagination.js';
import { PrismaService } from '../database/prisma.service.js';
import type { CountryHonorListQuery, CountryListQuery } from './countries.types.js';

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
      honorRecords: await this.getCountryHonorRecords(id, 10)
    };
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
