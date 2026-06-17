import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service.js';
import { resolvePagination, toNumber } from '../common/pagination.js';
import type { PlayerListQuery } from './players.types.js';

const PLAYER_LIST_INCLUDE = {
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

const PLAYER_DETAIL_INCLUDE = {
  ...PLAYER_LIST_INCLUDE,
  ethnicityRef: {
    select: {
      id: true,
      code: true,
      name: true,
      description: true
    }
  },
  hairColorRef: {
    select: {
      id: true,
      code: true,
      name: true,
      description: true
    }
  },
  preferredFootRef: {
    select: {
      id: true,
      code: true,
      name: true,
      description: true
    }
  }
} satisfies Prisma.PlayerInclude;

@Injectable()
export class PlayersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PlayerListQuery) {
    const pagination = resolvePagination(query);
    const where = this.buildWhere(query);
    const orderBy = this.buildOrderBy(query);
    const [items, total] = await this.prisma.$transaction([
      this.prisma.player.findMany({
        where,
        include: PLAYER_LIST_INCLUDE,
        orderBy,
        skip: pagination.skip,
        take: pagination.take
      }),
      this.prisma.player.count({ where })
    ]);

    return {
      items,
      page: pagination.page,
      pageSize: pagination.pageSize,
      total
    };
  }

  async findOne(id: string) {
    const player = await this.prisma.player.findUnique({
      where: { id },
      include: PLAYER_DETAIL_INCLUDE
    });

    if (!player) {
      throw new NotFoundException('球员不存在。');
    }

    return player;
  }

  private buildWhere(query: PlayerListQuery): Prisma.PlayerWhereInput {
    const keyword = query.keyword?.trim();
    const minPa = toNumber(query.minPa);
    const maxPa = toNumber(query.maxPa);

    return {
      ...(keyword
        ? {
            OR: [
              { chineseName: { contains: keyword, mode: 'insensitive' } },
              { englishName: { contains: keyword, mode: 'insensitive' } },
              { uid: { contains: keyword, mode: 'insensitive' } },
              { nationality: { contains: keyword, mode: 'insensitive' } },
              { representedCountry: { contains: keyword, mode: 'insensitive' } },
              { primaryClub: { contains: keyword, mode: 'insensitive' } }
            ]
          }
        : {}),
      ...(query.confederationId ? { confederationId: query.confederationId } : {}),
      ...(query.countryId ? { countryId: query.countryId } : {}),
      ...(query.clubId ? { clubId: query.clubId } : {}),
      ...(query.playerTypeId ? { playerTypeId: query.playerTypeId } : {}),
      ...(query.position?.trim()
        ? { positions: { contains: query.position.trim(), mode: 'insensitive' } }
        : {}),
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

  private buildOrderBy(query: PlayerListQuery): Prisma.PlayerOrderByWithRelationInput[] {
    const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';
    const sortBy = query.sortBy ?? 'pa';
    const allowedSorts = new Set(['pa', 'ca', 'chineseName', 'age', 'marketValue', 'createdAt']);

    if (!allowedSorts.has(sortBy)) {
      return [{ pa: 'desc' }, { chineseName: 'asc' }];
    }

    return [{ [sortBy]: sortOrder }, { chineseName: 'asc' }];
  }
}
