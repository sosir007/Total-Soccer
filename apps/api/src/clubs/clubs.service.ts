import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { resolvePagination } from '../common/pagination.js';
import { PrismaService } from '../database/prisma.service.js';
import type { ClubListQuery } from './clubs.types.js';

const CLUB_INCLUDE = {
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

@Injectable()
export class ClubsService {
  constructor(private readonly prisma: PrismaService) {}

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
      items,
      page: pagination.page,
      pageSize: pagination.pageSize,
      total
    };
  }

  async findOne(id: string) {
    const club = await this.prisma.club.findFirst({
      where: {
        id,
        exists: true
      },
      include: CLUB_INCLUDE
    });

    if (!club) {
      throw new NotFoundException('俱乐部不存在。');
    }

    return club;
  }

  private buildWhere(query: ClubListQuery): Prisma.ClubWhereInput {
    const keyword = query.keyword?.trim();

    return {
      exists: true,
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
}
