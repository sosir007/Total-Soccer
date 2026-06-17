import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  CompetitionScopeType,
  CompetitionStandingPlacement,
  CompetitionTargetType,
  type Prisma
} from '@prisma/client';
import { resolvePagination } from '../common/pagination.js';
import { PrismaService } from '../database/prisma.service.js';
import type {
  CompetitionListQuery,
  CreateCompetitionBody,
  CreateCompetitionEditionBody,
  SaveCompetitionStandingsBody,
  UpdateCompetitionEditionBody
} from './competitions.types.js';

const COMPETITION_INCLUDE = {
  confederation: {
    select: {
      id: true,
      uid: true,
      code: true,
      name: true
    }
  },
  country: {
    select: {
      id: true,
      uid: true,
      name: true
    }
  },
  _count: {
    select: {
      editions: true
    }
  }
} satisfies Prisma.CompetitionInclude;

const COMPETITION_DETAIL_INCLUDE = {
  ...COMPETITION_INCLUDE,
  editions: {
    orderBy: [{ year: 'desc' }, { name: 'desc' }],
    include: {
      standings: {
        orderBy: { placement: 'asc' },
        include: {
          country: {
            select: {
              id: true,
              uid: true,
              name: true
            }
          },
          club: {
            select: {
              id: true,
              uid: true,
              name: true
            }
          }
        }
      }
    }
  }
} satisfies Prisma.CompetitionInclude;

@Injectable()
export class CompetitionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: CompetitionListQuery) {
    const pagination = resolvePagination(query);
    const keyword = query.keyword?.trim();
    const where: Prisma.CompetitionWhereInput = {
      ...(keyword
        ? {
            OR: [
              { code: { contains: keyword, mode: 'insensitive' } },
              { name: { contains: keyword, mode: 'insensitive' } },
              { category: { contains: keyword, mode: 'insensitive' } },
              { level: { contains: keyword, mode: 'insensitive' } }
            ]
          }
        : {}),
      ...(query.targetType ? { targetType: this.parseTargetType(query.targetType) } : {}),
      ...(query.scopeType ? { scopeType: this.parseScopeType(query.scopeType) } : {}),
      ...(query.confederationId ? { confederationId: query.confederationId } : {}),
      ...(query.countryId ? { countryId: query.countryId } : {}),
      ...(query.enabled === undefined ? {} : { enabled: query.enabled === 'true' })
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.competition.findMany({
        where,
        include: COMPETITION_INCLUDE,
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        skip: pagination.skip,
        take: pagination.take
      }),
      this.prisma.competition.count({ where })
    ]);

    return {
      items,
      page: pagination.page,
      pageSize: pagination.pageSize,
      total
    };
  }

  async findOne(id: string) {
    const competition = await this.prisma.competition.findUnique({
      where: { id },
      include: COMPETITION_DETAIL_INCLUDE
    });

    if (!competition) {
      throw new NotFoundException('赛事不存在。');
    }

    return competition;
  }

  async create(body: CreateCompetitionBody) {
    const data = await this.buildCompetitionData(body);

    return this.prisma.competition.create({
      data,
      include: COMPETITION_INCLUDE
    });
  }

  async createEdition(competitionId: string, body: CreateCompetitionEditionBody) {
    await this.assertCompetitionExists(competitionId);

    return this.prisma.competitionEdition.create({
      data: this.buildEditionData(competitionId, body),
      include: {
        standings: true
      }
    });
  }

  async updateEdition(id: string, body: UpdateCompetitionEditionBody) {
    await this.assertEditionExists(id);

    return this.prisma.competitionEdition.update({
      where: { id },
      data: this.buildEditionUpdateData(body),
      include: {
        standings: true
      }
    });
  }

  async saveStandings(id: string, body: SaveCompetitionStandingsBody) {
    const edition = await this.prisma.competitionEdition.findUnique({
      where: { id },
      include: {
        competition: true
      }
    });

    if (!edition) {
      throw new NotFoundException('赛事届次不存在。');
    }

    const standings = this.buildStandingData(edition.competition.targetType, body);

    await this.prisma.$transaction([
      this.prisma.competitionStanding.deleteMany({
        where: { editionId: id }
      }),
      ...(standings.length
        ? [
            this.prisma.competitionStanding.createMany({
              data: standings.map((standing) => ({
                editionId: id,
                ...standing
              }))
            })
          ]
        : [])
    ]);

    return this.prisma.competitionEdition.findUnique({
      where: { id },
      include: COMPETITION_DETAIL_INCLUDE.editions.include
    });
  }

  private async buildCompetitionData(body: CreateCompetitionBody) {
    const code = body.code?.trim();
    const name = body.name?.trim();
    const targetType = this.parseTargetType(body.targetType);
    const scopeType = this.parseScopeType(body.scopeType ?? CompetitionScopeType.GLOBAL);

    if (!code) {
      throw new BadRequestException('赛事编码不能为空。');
    }

    if (!name) {
      throw new BadRequestException('赛事名称不能为空。');
    }

    this.validateScope(scopeType, body);

    return {
      code,
      name,
      targetType,
      scopeType,
      category: this.toNullableString(body.category),
      level: this.toNullableString(body.level),
      confederationId:
        scopeType === CompetitionScopeType.CONFEDERATION ? body.confederationId : null,
      countryId: scopeType === CompetitionScopeType.COUNTRY ? body.countryId : null,
      enabled: body.enabled ?? true,
      sortOrder: body.sortOrder ?? 0
    } satisfies Prisma.CompetitionUncheckedCreateInput;
  }

  private buildEditionData(competitionId: string, body: CreateCompetitionEditionBody) {
    const name = body.name?.trim();

    if (!name) {
      throw new BadRequestException('届次名称不能为空。');
    }

    return {
      competition: {
        connect: {
          id: competitionId
        }
      },
      name,
      season: this.toNullableString(body.season),
      year: this.toNullableNumber(body.year),
      host: this.toNullableString(body.host),
      remark: this.toNullableString(body.remark)
    } satisfies Prisma.CompetitionEditionCreateInput;
  }

  private buildEditionUpdateData(body: UpdateCompetitionEditionBody) {
    return {
      ...(body.name !== undefined ? { name: this.requiredString(body.name, '届次名称') } : {}),
      ...(body.season !== undefined ? { season: this.toNullableString(body.season) } : {}),
      ...(body.year !== undefined ? { year: this.toNullableNumber(body.year) } : {}),
      ...(body.host !== undefined ? { host: this.toNullableString(body.host) } : {}),
      ...(body.remark !== undefined ? { remark: this.toNullableString(body.remark) } : {})
    } satisfies Prisma.CompetitionEditionUpdateInput;
  }

  private buildStandingData(
    targetType: CompetitionTargetType,
    body: SaveCompetitionStandingsBody
  ): Array<{
    placement: CompetitionStandingPlacement;
    countryId?: string;
    clubId?: string;
    remark?: string | null;
  }> {
    const standings = body.standings ?? [];
    const usedPlacements = new Set<CompetitionStandingPlacement>();

    const rows: Array<{
      placement: CompetitionStandingPlacement;
      countryId?: string;
      clubId?: string;
      remark?: string | null;
    }> = [];

    for (const standing of standings) {
      const placement = this.parsePlacement(standing.placement);

      if (usedPlacements.has(placement)) {
        throw new BadRequestException('同一届赛事不能重复录入相同名次。');
      }

      usedPlacements.add(placement);

      if (targetType === CompetitionTargetType.COUNTRY) {
        if (!standing.countryId) {
          continue;
        }

        if (standing.clubId) {
          throw new BadRequestException('国家队赛事不能关联俱乐部。');
        }

        rows.push({
          placement,
          countryId: standing.countryId,
          remark: standing.remark ?? null
        });
        continue;
      }

      if (!standing.clubId) {
        continue;
      }

      if (standing.countryId) {
        throw new BadRequestException('俱乐部赛事不能关联国家队。');
      }

      rows.push({
        placement,
        clubId: standing.clubId,
        remark: standing.remark ?? null
      });
    }

    return rows;
  }

  private validateScope(scopeType: CompetitionScopeType, body: CreateCompetitionBody) {
    if (scopeType === CompetitionScopeType.CONFEDERATION && !body.confederationId) {
      throw new BadRequestException('足联范围赛事必须选择足联。');
    }

    if (scopeType === CompetitionScopeType.COUNTRY && !body.countryId) {
      throw new BadRequestException('国家范围赛事必须选择国家。');
    }
  }

  private async assertCompetitionExists(id: string) {
    const competition = await this.prisma.competition.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!competition) {
      throw new NotFoundException('赛事不存在。');
    }
  }

  private async assertEditionExists(id: string) {
    const edition = await this.prisma.competitionEdition.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!edition) {
      throw new NotFoundException('赛事届次不存在。');
    }
  }

  private parseTargetType(value: CompetitionTargetType | undefined) {
    if (!value || !Object.values(CompetitionTargetType).includes(value)) {
      throw new BadRequestException('赛事对象类型不合法。');
    }

    return value;
  }

  private parseScopeType(value: CompetitionScopeType) {
    if (!Object.values(CompetitionScopeType).includes(value)) {
      throw new BadRequestException('赛事适用范围不合法。');
    }

    return value;
  }

  private parsePlacement(value: CompetitionStandingPlacement | undefined) {
    if (!value || !Object.values(CompetitionStandingPlacement).includes(value)) {
      throw new BadRequestException('赛事名次不合法。');
    }

    return value;
  }

  private requiredString(value: string | undefined, label: string) {
    const trimmed = value?.trim();

    if (!trimmed) {
      throw new BadRequestException(`${label}不能为空。`);
    }

    return trimmed;
  }

  private toNullableString(value: string | undefined | null) {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
  }

  private toNullableNumber(value: number | undefined) {
    return Number.isFinite(value) ? value : null;
  }
}
