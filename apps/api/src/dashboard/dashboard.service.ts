import { Injectable } from '@nestjs/common';
import { CatalogStatsService } from '../common/catalog-stats.service.js';
import { PrismaService } from '../database/prisma.service.js';

const PA_BUCKETS = [
  { label: '未填写', min: null, max: null },
  { label: '< 100', min: null, max: 99 },
  { label: '100-129', min: 100, max: 129 },
  { label: '130-149', min: 130, max: 149 },
  { label: '150-169', min: 150, max: 169 },
  { label: '170-189', min: 170, max: 189 },
  { label: '190+', min: 190, max: null }
];

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalogStats: CatalogStatsService
  ) {}

  async overview() {
    const [
      playerCount,
      countryCount,
      clubCount,
      honorRuleCount,
      playerAggregate,
      players,
      topCountries,
      topClubs
    ] = await this.prisma.$transaction([
      this.prisma.player.count(),
      this.prisma.country.count(),
      this.prisma.club.count({ where: { exists: true } }),
      this.prisma.honorRule.count(),
      this.prisma.player.aggregate({
        _avg: { pa: true },
        _max: { pa: true }
      }),
      this.prisma.player.findMany({
        select: {
          pa: true,
          positions: true,
          confederationRef: {
            select: {
              id: true,
              uid: true,
              code: true,
              name: true
            }
          },
          playerTypeRef: {
            select: {
              id: true,
              code: true,
              name: true
            }
          }
        }
      }),
      this.prisma.country.findMany({
        where: {
          honorScore: {
            not: null
          }
        },
        select: {
          id: true,
          uid: true,
          name: true,
          honorScore: true,
          championCount: true,
          medalCount: true,
          federationRef: {
            select: {
              id: true,
              uid: true,
              code: true,
              name: true
            }
          }
        },
        orderBy: [{ honorScore: 'desc' }, { name: 'asc' }],
        take: 8
      }),
      this.prisma.club.findMany({
        where: {
          exists: true,
          honorScore: {
            not: null
          }
        },
        select: {
          id: true,
          uid: true,
          name: true,
          honorScore: true,
          championCount: true,
          trophyCount: true,
          countryRef: {
            select: {
              id: true,
              uid: true,
              name: true
            }
          },
          federationRef: {
            select: {
              id: true,
              uid: true,
              code: true,
              name: true
            }
          }
        },
        orderBy: [{ honorScore: 'desc' }, { name: 'asc' }],
        take: 8
      })
    ]);

    const [topCountryStandingStats, topClubStandingStats] = await Promise.all([
      this.catalogStats.getCountryStandingStats(topCountries.map((country) => country.id)),
      this.catalogStats.getClubStandingStats(topClubs.map((club) => club.id))
    ]);

    return {
      summary: {
        playerCount,
        countryCount,
        clubCount,
        honorRuleCount,
        averagePa: playerAggregate._avg.pa,
        highestPa: playerAggregate._max.pa
      },
      paDistribution: this.buildPaDistribution(players.map((player) => player.pa)),
      positionDistribution: this.buildPositionDistribution(
        players.map((player) => player.positions)
      ),
      confederationDistribution: this.buildNamedDistribution(
        players.map((player) => player.confederationRef)
      ),
      playerTypeDistribution: this.buildNamedDistribution(
        players.map((player) => player.playerTypeRef)
      ),
      topCountries: topCountries.map((country) => {
        const standings =
          topCountryStandingStats.get(country.id) ?? this.catalogStats.getEmptyStandingStats();

        return {
          ...country,
          championCount: standings.championCount,
          medalCount: standings.medalCount,
          runnerUpCount: standings.runnerUpCount,
          thirdPlaceCount: standings.thirdPlaceCount,
          fourthPlaceCount: standings.fourthPlaceCount
        };
      }),
      topClubs: topClubs.map((club) => {
        const standings =
          topClubStandingStats.get(club.id) ?? this.catalogStats.getEmptyStandingStats();

        return {
          ...club,
          trophyCount: standings.trophyCount,
          championCount: standings.championCount,
          runnerUpCount: standings.runnerUpCount,
          thirdPlaceCount: standings.thirdPlaceCount,
          fourthPlaceCount: standings.fourthPlaceCount
        };
      })
    };
  }

  private buildPaDistribution(values: Array<number | null>) {
    return PA_BUCKETS.map((bucket) => ({
      ...bucket,
      count: values.filter((value) => {
        if (bucket.label === '未填写') {
          return value === null;
        }

        if (value === null) {
          return false;
        }

        return (
          (bucket.min === null || value >= bucket.min) &&
          (bucket.max === null || value <= bucket.max)
        );
      }).length
    }));
  }

  private buildPositionDistribution(values: Array<string | null>) {
    const counts = new Map<string, number>();

    for (const value of values) {
      const positions = this.splitPositions(value);

      for (const position of positions) {
        counts.set(position, (counts.get(position) ?? 0) + 1);
      }
    }

    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((current, next) => next.count - current.count || current.name.localeCompare(next.name))
      .slice(0, 12);
  }

  private splitPositions(value: string | null) {
    if (!value?.trim()) {
      return ['未填写'];
    }

    return value
      .split(/[,，、;/]+/)
      .map((position) => position.trim())
      .filter(Boolean);
  }

  private buildNamedDistribution<
    T extends { id: string; uid?: string | null; code?: string | null; name: string }
  >(values: Array<T | null>) {
    const counts = new Map<
      string,
      { id: string | null; uid?: string | null; code?: string | null; name: string; count: number }
    >();

    for (const value of values) {
      const key = value?.id ?? 'unknown';
      const current = counts.get(key);

      if (current) {
        current.count += 1;
        continue;
      }

      counts.set(key, {
        id: value?.id ?? null,
        uid: value?.uid,
        code: value?.code,
        name: value?.name ?? '未关联',
        count: 1
      });
    }

    return [...counts.values()].sort(
      (current, next) => next.count - current.count || current.name.localeCompare(next.name)
    );
  }
}
