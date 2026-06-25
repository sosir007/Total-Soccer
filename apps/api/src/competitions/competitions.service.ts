import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  CompetitionScopeType,
  CompetitionStandingPlacement,
  CompetitionTargetType,
  Prisma
} from '@prisma/client';
import { resolvePagination } from '../common/pagination.js';
import { PrismaService } from '../database/prisma.service.js';
import type {
  CompetitionListQuery,
  CreateCompetitionBody,
  CreateCompetitionEditionBody,
  SaveCompetitionStandingsBody,
  UpdateCompetitionBody,
  UpdateCompetitionEditionBody
} from './competitions.types.js';

const COMPETITION_CATEGORIES = ['国际', '洲际', '国内', '其他'] as const;
const COMPETITION_LEVELS = ['一级', '二级', '三级'] as const;
const COMPETITION_FORMATS = ['联赛', '杯赛', '其他'] as const;

const COUNTRY_REF_SELECT = {
  id: true,
  uid: true,
  name: true,
  externalUrl: true,
  visibleInCatalog: true,
  isHistorical: true,
  detailRedirectCountryId: true,
  detailRedirectCountry: {
    select: {
      id: true,
      uid: true,
      name: true,
      externalUrl: true
    }
  }
} satisfies Prisma.CountrySelect;

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
    select: COUNTRY_REF_SELECT
  },
  scopeConfederations: {
    include: {
      confederation: {
        select: {
          id: true,
          uid: true,
          code: true,
          name: true
        }
      }
    }
  },
  scopeCountries: {
    include: {
      country: {
        select: COUNTRY_REF_SELECT
      }
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
            select: COUNTRY_REF_SELECT
          },
          club: {
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
} satisfies Prisma.CompetitionInclude;

@Injectable()
export class CompetitionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: CompetitionListQuery) {
    const pagination = resolvePagination(query);
    const keyword = query.keyword?.trim();
    const andConditions: Prisma.CompetitionWhereInput[] = [];

    if (keyword) {
      andConditions.push({
        OR: [
          { code: { contains: keyword, mode: 'insensitive' } },
          { name: { contains: keyword, mode: 'insensitive' } },
          { category: { contains: keyword, mode: 'insensitive' } },
          { level: { contains: keyword, mode: 'insensitive' } },
          { format: { contains: keyword, mode: 'insensitive' } },
          { description: { contains: keyword, mode: 'insensitive' } }
        ]
      });
    }

    if (query.confederationId) {
      andConditions.push({
        OR: [
          { confederationId: query.confederationId },
          { scopeConfederations: { some: { confederationId: query.confederationId } } }
        ]
      });
    }

    if (query.countryId) {
      andConditions.push({
        OR: [
          { countryId: query.countryId },
          { scopeCountries: { some: { countryId: query.countryId } } }
        ]
      });
    }

    const where: Prisma.CompetitionWhereInput = {
      ...(query.targetType ? { targetType: this.parseTargetType(query.targetType) } : {}),
      ...(query.scopeType ? { scopeType: this.parseScopeType(query.scopeType) } : {}),
      ...(andConditions.length ? { AND: andConditions } : {}),
      ...(query.enabled === undefined ? {} : { enabled: query.enabled === 'true' }),
      ...(query.includeInStats === undefined
        ? {}
        : { includeInStats: query.includeInStats === 'true' })
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
    const input = await this.buildCompetitionData(body);

    return this.prisma.$transaction(async (tx) => {
      const competition = await tx.competition.create({
        data: input.data
      });
      await this.replaceCompetitionScopes(
        tx,
        competition.id,
        input.confederationIds,
        input.countryIds
      );

      return tx.competition.findUniqueOrThrow({
        where: { id: competition.id },
        include: COMPETITION_INCLUDE
      });
    });
  }

  async update(id: string, body: UpdateCompetitionBody) {
    await this.assertCompetitionExists(id);
    const input = await this.buildCompetitionData(body);

    return this.prisma.$transaction(async (tx) => {
      await tx.competition.update({
        where: { id },
        data: input.data
      });
      await this.replaceCompetitionScopes(tx, id, input.confederationIds, input.countryIds);

      return tx.competition.findUniqueOrThrow({
        where: { id },
        include: COMPETITION_INCLUDE
      });
    });
  }

  async remove(id: string) {
    const competition = await this.prisma.competition.findUnique({
      where: { id },
      select: {
        id: true,
        _count: {
          select: {
            editions: true
          }
        }
      }
    });

    if (!competition) {
      throw new NotFoundException('赛事不存在。');
    }

    if (competition._count.editions > 0) {
      throw new BadRequestException('赛事已有届次结果，不能直接删除。');
    }

    try {
      await this.prisma.competition.delete({
        where: { id }
      });

      return { id };
    } catch (error) {
      this.handleDeleteError(error);
    }
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

  async removeEdition(id: string) {
    const edition = await this.prisma.competitionEdition.findUnique({
      where: { id },
      select: {
        id: true,
        _count: {
          select: {
            standings: true
          }
        }
      }
    });

    if (!edition) {
      throw new NotFoundException('赛事届次不存在。');
    }

    if (edition._count.standings > 0) {
      throw new BadRequestException('赛事届次已有名次关联，不能直接删除。');
    }

    try {
      await this.prisma.competitionEdition.delete({
        where: { id }
      });

      return { id };
    } catch (error) {
      this.handleEditionDeleteError(error);
    }
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

  private async buildCompetitionData(body: CreateCompetitionBody): Promise<{
    data: Prisma.CompetitionUncheckedCreateInput;
    confederationIds: string[];
    countryIds: string[];
  }> {
    const code = body.code?.trim();
    const name = body.name?.trim();
    const targetType = this.parseTargetType(body.targetType);
    const scopeType = this.parseScopeType(body.scopeType ?? CompetitionScopeType.GLOBAL);
    const confederationIds = this.getScopeIds(body.confederationIds, body.confederationId);
    const countryIds = this.getScopeIds(body.countryIds, body.countryId);

    if (!code) {
      throw new BadRequestException('赛事编码不能为空。');
    }

    if (!name) {
      throw new BadRequestException('赛事名称不能为空。');
    }

    this.validateScope(scopeType, confederationIds, countryIds);

    return {
      data: {
        code,
        name,
        targetType,
        scopeType,
        category: this.parseStandardText(body.category, COMPETITION_CATEGORIES, '赛事分类'),
        level: this.parseStandardText(body.level, COMPETITION_LEVELS, '赛事级别'),
        format: this.parseStandardText(body.format, COMPETITION_FORMATS, '赛事赛制'),
        description: this.toNullableString(body.description),
        externalUrl: this.toNullableString(body.externalUrl),
        confederationId:
          scopeType === CompetitionScopeType.CONFEDERATION ? confederationIds[0] : null,
        countryId: scopeType === CompetitionScopeType.COUNTRY ? countryIds[0] : null,
        enabled: body.enabled ?? true,
        includeInStats: body.includeInStats ?? true,
        sortOrder: body.sortOrder ?? 0
      },
      confederationIds: scopeType === CompetitionScopeType.CONFEDERATION ? confederationIds : [],
      countryIds: scopeType === CompetitionScopeType.COUNTRY ? countryIds : []
    };
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
      quantity: this.toNullableNumber(body.quantity),
      host: this.toNullableString(body.host),
      remark: this.toNullableString(body.remark)
    } satisfies Prisma.CompetitionEditionCreateInput;
  }

  private buildEditionUpdateData(body: UpdateCompetitionEditionBody) {
    return {
      ...(body.name !== undefined ? { name: this.requiredString(body.name, '届次名称') } : {}),
      ...(body.season !== undefined ? { season: this.toNullableString(body.season) } : {}),
      ...(body.year !== undefined ? { year: this.toNullableNumber(body.year) } : {}),
      ...(body.quantity !== undefined ? { quantity: this.toNullableNumber(body.quantity) } : {}),
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

  private async replaceCompetitionScopes(
    tx: Prisma.TransactionClient,
    competitionId: string,
    confederationIds: string[],
    countryIds: string[]
  ) {
    await tx.competitionScopeConfederation.deleteMany({
      where: { competitionId }
    });
    await tx.competitionScopeCountry.deleteMany({
      where: { competitionId }
    });

    if (confederationIds.length) {
      await tx.competitionScopeConfederation.createMany({
        data: confederationIds.map((confederationId) => ({
          competitionId,
          confederationId
        })),
        skipDuplicates: true
      });
    }

    if (countryIds.length) {
      await tx.competitionScopeCountry.createMany({
        data: countryIds.map((countryId) => ({
          competitionId,
          countryId
        })),
        skipDuplicates: true
      });
    }
  }

  private validateScope(
    scopeType: CompetitionScopeType,
    confederationIds: string[],
    countryIds: string[]
  ) {
    if (scopeType === CompetitionScopeType.CONFEDERATION && !confederationIds.length) {
      throw new BadRequestException('足联范围赛事必须选择足联。');
    }

    if (scopeType === CompetitionScopeType.COUNTRY && !countryIds.length) {
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

  private parseStandardText<T extends readonly string[]>(
    value: string | undefined | null,
    allowedValues: T,
    label: string
  ): T[number] | null {
    const trimmed = this.toNullableString(value);

    if (!trimmed) {
      return null;
    }

    if (!allowedValues.includes(trimmed)) {
      throw new BadRequestException(`${label}必须是：${allowedValues.join('、')}。`);
    }

    return trimmed;
  }

  private getScopeIds(values?: string[], fallback?: string) {
    const ids = [...(values ?? []), fallback]
      .map((value) => this.toNullableString(value))
      .filter((value): value is string => Boolean(value));

    return [...new Set(ids)];
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

  private handleDeleteError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new NotFoundException('赛事不存在。');
      }

      if (error.code === 'P2003') {
        throw new BadRequestException('赛事存在关联数据，不能直接删除。');
      }
    }

    throw error;
  }

  private handleEditionDeleteError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new NotFoundException('赛事届次不存在。');
      }

      if (error.code === 'P2003') {
        throw new BadRequestException('赛事届次存在关联数据，不能直接删除。');
      }
    }

    throw error;
  }
}
