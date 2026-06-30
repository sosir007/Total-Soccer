import { Injectable } from '@nestjs/common';
import { CompetitionStandingPlacement } from '@prisma/client';
import { PrismaService } from '../database/prisma.service.js';

export interface ParticipationStats {
  playerCount: number;
  totalPa: number | null;
  averagePa: number | null;
}

export interface StandingStats {
  championCount: number;
  runnerUpCount: number;
  thirdPlaceCount: number;
  fourthPlaceCount: number;
  semiFinalistCount: number;
  medalCount: number;
  trophyCount: number;
  majorChampionCount: number;
}

const EMPTY_PARTICIPATION_STATS: ParticipationStats = {
  playerCount: 0,
  totalPa: null,
  averagePa: null
};

const EMPTY_STANDING_STATS: StandingStats = {
  championCount: 0,
  runnerUpCount: 0,
  thirdPlaceCount: 0,
  fourthPlaceCount: 0,
  semiFinalistCount: 0,
  medalCount: 0,
  trophyCount: 0,
  majorChampionCount: 0
};

@Injectable()
export class CatalogStatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCountryParticipationStats(countryIds: string[]) {
    const groups = await this.prisma.player.groupBy({
      by: ['countryId'],
      where: {
        countryId: {
          in: countryIds
        }
      },
      _count: {
        _all: true
      },
      _sum: {
        pa: true
      },
      _avg: {
        pa: true
      }
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

  async getClubParticipationStats(clubIds: string[]) {
    const groups = await this.prisma.player.groupBy({
      by: ['clubId'],
      where: {
        clubId: {
          in: clubIds
        }
      },
      _count: {
        _all: true
      },
      _sum: {
        pa: true
      },
      _avg: {
        pa: true
      }
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

  async getCountryStandingStats(countryIds: string[]) {
    const successorLinks = await this.prisma.countrySuccessor.findMany({
      where: {
        successorCountryId: {
          in: countryIds
        }
      },
      select: {
        historicalCountryId: true,
        successorCountryId: true
      }
    });
    const requestedIds = new Set(countryIds);
    const historicalIds = [...new Set(successorLinks.map((link) => link.historicalCountryId))];
    const linkMap = new Map<string, string[]>();

    for (const link of successorLinks) {
      const successors = linkMap.get(link.historicalCountryId) ?? [];
      successors.push(link.successorCountryId);
      linkMap.set(link.historicalCountryId, successors);
    }

    const groups = await this.prisma.competitionStanding.groupBy({
      by: ['countryId', 'placement'],
      where: {
        countryId: {
          in: [...new Set([...countryIds, ...historicalIds])]
        },
        edition: {
          competition: {
            includeInStats: true
          }
        }
      },
      _count: {
        _all: true
      }
    });

    const expandedGroups: Array<{
      targetId: string;
      placement: CompetitionStandingPlacement;
      count: number;
    }> = [];

    for (const group of groups) {
      if (!group.countryId) {
        continue;
      }

      if (requestedIds.has(group.countryId)) {
        expandedGroups.push({
          targetId: group.countryId,
          placement: group.placement,
          count: group._count._all
        });
      }

      for (const successorId of linkMap.get(group.countryId) ?? []) {
        expandedGroups.push({
          targetId: successorId,
          placement: group.placement,
          count: group._count._all
        });
      }
    }

    return this.buildStandingStatsMap(expandedGroups);
  }

  async getClubStandingStats(clubIds: string[]) {
    const groups = await this.prisma.competitionStanding.groupBy({
      by: ['clubId', 'placement'],
      where: {
        clubId: {
          in: clubIds
        },
        edition: {
          competition: {
            includeInStats: true
          }
        }
      },
      _count: {
        _all: true
      }
    });

    return this.buildStandingStatsMap(
      groups
        .filter((group) => group.clubId)
        .map((group) => ({
          targetId: group.clubId as string,
          placement: group.placement,
          count: group._count._all
        }))
    );
  }

  getEmptyParticipationStats() {
    return { ...EMPTY_PARTICIPATION_STATS };
  }

  getEmptyStandingStats() {
    return { ...EMPTY_STANDING_STATS };
  }

  private buildStandingStatsMap(
    groups: Array<{
      targetId: string;
      placement: CompetitionStandingPlacement;
      count: number;
    }>
  ) {
    const map = new Map<string, StandingStats>();

    for (const group of groups) {
      const stats = map.get(group.targetId) ?? this.getEmptyStandingStats();

      if (group.placement === CompetitionStandingPlacement.CHAMPION) {
        stats.championCount += group.count;
      } else if (group.placement === CompetitionStandingPlacement.RUNNER_UP) {
        stats.runnerUpCount += group.count;
      } else if (group.placement === CompetitionStandingPlacement.THIRD_PLACE) {
        stats.thirdPlaceCount += group.count;
      } else if (group.placement === CompetitionStandingPlacement.FOURTH_PLACE) {
        stats.fourthPlaceCount += group.count;
      } else if (group.placement === CompetitionStandingPlacement.SEMI_FINALIST) {
        stats.semiFinalistCount += group.count;
      }

      stats.medalCount = stats.championCount + stats.runnerUpCount + stats.thirdPlaceCount;
      stats.trophyCount =
        stats.championCount +
        stats.runnerUpCount +
        stats.thirdPlaceCount +
        stats.fourthPlaceCount +
        stats.semiFinalistCount;
      stats.majorChampionCount = stats.championCount;
      map.set(group.targetId, stats);
    }

    return map;
  }
}
