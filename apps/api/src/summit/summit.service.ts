import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { resolvePagination, toNumber } from '../common/pagination.js';
import { PrismaService } from '../database/prisma.service.js';
import type { SummitCandidatesQuery, SummitQuery } from './summit.types.js';

const FORMATION = '4-3-3';
const CANDIDATE_GROUPS = ['门将', '后卫', '中场', '边锋', '前锋'] as const;

const LINEUP_SLOTS: Array<{
  slot: string;
  label: string;
  group: (typeof CANDIDATE_GROUPS)[number];
  keywords: string[];
}> = [
  { slot: 'GK', label: '门将', group: '门将', keywords: ['GK', '门将', '守门'] },
  { slot: 'LB', label: '左后卫', group: '后卫', keywords: ['LB', 'DL', 'LWB', '左后卫', '边后卫'] },
  { slot: 'CB1', label: '中卫', group: '后卫', keywords: ['CB', 'DC', '中卫', '中后卫'] },
  { slot: 'CB2', label: '中卫', group: '后卫', keywords: ['CB', 'DC', '中卫', '中后卫'] },
  { slot: 'RB', label: '右后卫', group: '后卫', keywords: ['RB', 'DR', 'RWB', '右后卫', '边后卫'] },
  {
    slot: 'CM1',
    label: '中场',
    group: '中场',
    keywords: ['CM', 'MC', 'DMC', 'DM', '中场', '后腰']
  },
  {
    slot: 'CM2',
    label: '中场',
    group: '中场',
    keywords: ['CM', 'MC', 'AMC', 'AM', '中场', '前腰']
  },
  { slot: 'CM3', label: '中场', group: '中场', keywords: ['CM', 'MC', '中场'] },
  { slot: 'LW', label: '左边锋', group: '边锋', keywords: ['LW', 'AML', 'ML', '左边锋', '边锋'] },
  { slot: 'ST', label: '中锋', group: '前锋', keywords: ['ST', 'SC', 'FC', 'CF', '中锋', '前锋'] },
  { slot: 'RW', label: '右边锋', group: '边锋', keywords: ['RW', 'AMR', 'MR', '右边锋', '边锋'] }
];

const GROUP_KEYWORDS: Record<(typeof CANDIDATE_GROUPS)[number], string[]> = {
  门将: ['GK', '门将', '守门'],
  后卫: ['CB', 'DC', 'LB', 'RB', 'DL', 'DR', 'WB', '中卫', '后卫', '边后卫'],
  中场: ['CM', 'MC', 'DM', 'DMC', 'AM', 'AMC', '中场', '后腰', '前腰'],
  边锋: ['LW', 'RW', 'AML', 'AMR', 'ML', 'MR', '边锋', '边前卫'],
  前锋: ['ST', 'SC', 'FC', 'CF', '前锋', '中锋']
};

const PLAYER_INCLUDE = {
  country: {
    select: {
      id: true,
      uid: true,
      name: true,
      externalUrl: true
    }
  },
  club: {
    select: {
      id: true,
      uid: true,
      name: true,
      externalUrl: true,
      exists: true
    }
  },
  confederationRef: {
    select: {
      id: true,
      uid: true,
      name: true,
      code: true
    }
  },
  playerTypeRef: {
    select: {
      id: true,
      code: true,
      name: true
    }
  }
} satisfies Prisma.PlayerInclude;

type SummitPlayer = Prisma.PlayerGetPayload<{ include: typeof PLAYER_INCLUDE }>;

@Injectable()
export class SummitService {
  constructor(private readonly prisma: PrismaService) {}

  async lineup(query: SummitQuery) {
    const players = await this.findPlayers(query, 500);
    const usedPlayerIds = new Set<string>();
    const starters = LINEUP_SLOTS.map((slot) => {
      const player = players.find(
        (candidate) =>
          !usedPlayerIds.has(candidate.id) && this.matchesKeywords(candidate, slot.keywords)
      );

      if (player) {
        usedPlayerIds.add(player.id);
      }

      return {
        slot: slot.slot,
        label: slot.label,
        group: slot.group,
        player: player ?? null
      };
    });

    return {
      formation: FORMATION,
      groups: CANDIDATE_GROUPS,
      starters,
      benchCandidates: this.buildBenchCandidates(players, usedPlayerIds)
    };
  }

  async candidates(query: SummitCandidatesQuery) {
    const pagination = resolvePagination(query);
    const players = await this.findPlayers(query, 1000);
    const group = this.parseGroup(query.group);
    const filteredPlayers = group
      ? players.filter((player) => this.matchesKeywords(player, GROUP_KEYWORDS[group]))
      : players;
    const items = filteredPlayers.slice(pagination.skip, pagination.skip + pagination.take);

    return {
      items,
      page: pagination.page,
      pageSize: pagination.pageSize,
      total: filteredPlayers.length
    };
  }

  private async findPlayers(query: SummitQuery, take: number) {
    return this.prisma.player.findMany({
      where: this.buildWhere(query),
      include: PLAYER_INCLUDE,
      orderBy: [{ pa: 'desc' }, { ca: 'desc' }, { chineseName: 'asc' }],
      take
    });
  }

  private buildWhere(query: SummitQuery): Prisma.PlayerWhereInput {
    const minPa = toNumber(query.minPa);
    const maxPa = toNumber(query.maxPa);

    return {
      ...(query.confederationId ? { confederationId: query.confederationId } : {}),
      ...(query.countryId ? { countryId: query.countryId } : {}),
      ...(query.clubId ? { clubId: query.clubId } : {}),
      ...(query.playerTypeId ? { playerTypeId: query.playerTypeId } : {}),
      ...(minPa !== undefined || maxPa !== undefined
        ? {
            pa: {
              ...(minPa !== undefined ? { gte: minPa } : {}),
              ...(maxPa !== undefined ? { lte: maxPa } : {})
            }
          }
        : {})
    };
  }

  private buildBenchCandidates(players: SummitPlayer[], usedPlayerIds: Set<string>) {
    return CANDIDATE_GROUPS.map((group) => ({
      group,
      players: players
        .filter((player) => !usedPlayerIds.has(player.id))
        .filter((player) => this.matchesKeywords(player, GROUP_KEYWORDS[group]))
        .slice(0, 5)
    }));
  }

  private matchesKeywords(player: SummitPlayer, keywords: string[]) {
    const positionText = `${player.positions ?? ''} ${player.primaryRole ?? ''}`.toUpperCase();

    return keywords.some((keyword) => positionText.includes(keyword.toUpperCase()));
  }

  private parseGroup(value: string | undefined) {
    return CANDIDATE_GROUPS.find((group) => group === value);
  }
}
