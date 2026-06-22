import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { resolvePagination } from '../common/pagination.js';
import { PrismaService } from '../database/prisma.service.js';
import type { BaseConfigBody, BaseConfigQuery, BaseConfigType } from './base-config.types.js';

const SUPPORTED_TYPES = new Set<BaseConfigType>([
  'confederations',
  'positions',
  'player-types',
  'potential-ranges',
  'ethnicities',
  'hair-colors',
  'preferred-feet',
  'cities'
]);

@Injectable()
export class BaseConfigService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(type: BaseConfigType, query: BaseConfigQuery) {
    this.assertType(type);
    const pagination = resolvePagination(query);
    const keyword = this.cleanKeyword(query.keyword);

    switch (type) {
      case 'confederations': {
        const where: Prisma.ConfederationWhereInput = keyword
          ? {
              OR: [
                { uid: { contains: keyword, mode: 'insensitive' } },
                { code: { contains: keyword, mode: 'insensitive' } },
                { name: { contains: keyword, mode: 'insensitive' } }
              ]
            }
          : {};
        const [items, total] = await this.prisma.$transaction([
          this.prisma.confederation.findMany({
            where,
            orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
            skip: pagination.skip,
            take: pagination.take
          }),
          this.prisma.confederation.count({ where })
        ]);

        return { items, page: pagination.page, pageSize: pagination.pageSize, total };
      }
      case 'positions': {
        const where: Prisma.PositionWhereInput = keyword
          ? {
              OR: [
                { code: { contains: keyword, mode: 'insensitive' } },
                { name: { contains: keyword, mode: 'insensitive' } },
                { group: { contains: keyword, mode: 'insensitive' } },
                { description: { contains: keyword, mode: 'insensitive' } }
              ]
            }
          : {};
        const [items, total] = await this.prisma.$transaction([
          this.prisma.position.findMany({
            where,
            orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
            skip: pagination.skip,
            take: pagination.take
          }),
          this.prisma.position.count({ where })
        ]);

        return { items, page: pagination.page, pageSize: pagination.pageSize, total };
      }
      case 'player-types': {
        const where = this.buildNamedWhere<Prisma.PlayerTypeWhereInput>(keyword);
        const [items, total] = await this.prisma.$transaction([
          this.prisma.playerType.findMany({
            where,
            orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
            skip: pagination.skip,
            take: pagination.take
          }),
          this.prisma.playerType.count({ where })
        ]);

        return { items, page: pagination.page, pageSize: pagination.pageSize, total };
      }
      case 'potential-ranges': {
        const where = this.buildNamedWhere<Prisma.PotentialRangeWhereInput>(keyword);
        const [items, total] = await this.prisma.$transaction([
          this.prisma.potentialRange.findMany({
            where,
            orderBy: [{ sortOrder: 'asc' }, { code: 'asc' }],
            skip: pagination.skip,
            take: pagination.take
          }),
          this.prisma.potentialRange.count({ where })
        ]);

        return { items, page: pagination.page, pageSize: pagination.pageSize, total };
      }
      case 'ethnicities': {
        const where = this.buildNamedWhere<Prisma.EthnicityWhereInput>(keyword);
        const [items, total] = await this.prisma.$transaction([
          this.prisma.ethnicity.findMany({
            where,
            orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
            skip: pagination.skip,
            take: pagination.take
          }),
          this.prisma.ethnicity.count({ where })
        ]);

        return { items, page: pagination.page, pageSize: pagination.pageSize, total };
      }
      case 'hair-colors': {
        const where = this.buildNamedWhere<Prisma.HairColorWhereInput>(keyword);
        const [items, total] = await this.prisma.$transaction([
          this.prisma.hairColor.findMany({
            where,
            orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
            skip: pagination.skip,
            take: pagination.take
          }),
          this.prisma.hairColor.count({ where })
        ]);

        return { items, page: pagination.page, pageSize: pagination.pageSize, total };
      }
      case 'preferred-feet': {
        const where = this.buildNamedWhere<Prisma.PreferredFootWhereInput>(keyword);
        const [items, total] = await this.prisma.$transaction([
          this.prisma.preferredFoot.findMany({
            where,
            orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
            skip: pagination.skip,
            take: pagination.take
          }),
          this.prisma.preferredFoot.count({ where })
        ]);

        return { items, page: pagination.page, pageSize: pagination.pageSize, total };
      }
      case 'cities': {
        const where: Prisma.CityWhereInput = keyword
          ? {
              OR: [
                { uid: { contains: keyword, mode: 'insensitive' } },
                { name: { contains: keyword, mode: 'insensitive' } },
                { description: { contains: keyword, mode: 'insensitive' } },
                { country: { name: { contains: keyword, mode: 'insensitive' } } }
              ]
            }
          : {};
        const [items, total] = await this.prisma.$transaction([
          this.prisma.city.findMany({
            where,
            include: {
              country: {
                select: {
                  id: true,
                  uid: true,
                  name: true
                }
              }
            },
            orderBy: [{ sortOrder: 'asc' }, { uid: 'asc' }, { name: 'asc' }],
            skip: pagination.skip,
            take: pagination.take
          }),
          this.prisma.city.count({ where })
        ]);

        return { items, page: pagination.page, pageSize: pagination.pageSize, total };
      }
    }
  }

  async create(type: BaseConfigType, body: BaseConfigBody) {
    this.assertType(type);

    try {
      switch (type) {
        case 'confederations':
          return await this.prisma.confederation.create({
            data: this.buildConfederationData(body)
          });
        case 'positions':
          return await this.prisma.position.create({
            data: this.buildPositionData(body)
          });
        case 'player-types':
          return await this.prisma.playerType.create({
            data: this.buildPlayerTypeData(body)
          });
        case 'potential-ranges':
          return await this.prisma.potentialRange.create({
            data: this.buildPotentialRangeData(body)
          });
        case 'ethnicities':
          return await this.prisma.ethnicity.create({
            data: this.buildCommonData(body)
          });
        case 'hair-colors':
          return await this.prisma.hairColor.create({
            data: this.buildCommonData(body)
          });
        case 'preferred-feet':
          return await this.prisma.preferredFoot.create({
            data: this.buildCommonData(body)
          });
        case 'cities':
          return await this.prisma.city.create({
            data: await this.buildCityCreateData(body),
            include: {
              country: {
                select: {
                  id: true,
                  uid: true,
                  name: true
                }
              }
            }
          });
      }
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(type: BaseConfigType, id: string, body: BaseConfigBody) {
    this.assertType(type);

    try {
      switch (type) {
        case 'confederations':
          return await this.prisma.confederation.update({
            where: { id },
            data: this.buildConfederationData(body)
          });
        case 'positions':
          return await this.prisma.position.update({
            where: { id },
            data: this.buildPositionData(body)
          });
        case 'player-types':
          return await this.prisma.playerType.update({
            where: { id },
            data: this.buildPlayerTypeData(body)
          });
        case 'potential-ranges':
          return await this.prisma.potentialRange.update({
            where: { id },
            data: this.buildPotentialRangeData(body)
          });
        case 'ethnicities':
          return await this.prisma.ethnicity.update({
            where: { id },
            data: this.buildCommonData(body)
          });
        case 'hair-colors':
          return await this.prisma.hairColor.update({
            where: { id },
            data: this.buildCommonData(body)
          });
        case 'preferred-feet':
          return await this.prisma.preferredFoot.update({
            where: { id },
            data: this.buildCommonData(body)
          });
        case 'cities':
          return await this.prisma.city.update({
            where: { id },
            data: await this.buildCityUpdateData(body),
            include: {
              country: {
                select: {
                  id: true,
                  uid: true,
                  name: true
                }
              }
            }
          });
      }
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private buildNamedWhere<T>(keyword: string | undefined): T {
    return (
      keyword
        ? {
            OR: [
              { code: { contains: keyword, mode: 'insensitive' } },
              { name: { contains: keyword, mode: 'insensitive' } },
              { description: { contains: keyword, mode: 'insensitive' } }
            ]
          }
        : {}
    ) as T;
  }

  private buildConfederationData(body: BaseConfigBody): Prisma.ConfederationCreateInput {
    const uid = this.requireString(body.uid, '足联 UID 不能为空。');
    const name = this.requireString(body.name, '足联名称不能为空。');

    return {
      uid,
      name,
      code: this.cleanOptionalString(body.code),
      sortOrder: this.toSortOrder(body.sortOrder)
    };
  }

  private buildPositionData(body: BaseConfigBody): Prisma.PositionCreateInput {
    return {
      code: this.requireString(body.code, '位置编码不能为空。'),
      name: this.requireString(body.name, '位置名称不能为空。'),
      group: this.cleanOptionalString(body.group),
      description: this.cleanOptionalString(body.description),
      enabled: body.enabled ?? true,
      sortOrder: this.toSortOrder(body.sortOrder)
    };
  }

  private buildPlayerTypeData(body: BaseConfigBody): Prisma.PlayerTypeCreateInput {
    return {
      code: this.requireString(body.code, '球员类型编码不能为空。'),
      name: this.requireString(body.name, '球员类型名称不能为空。'),
      description: this.cleanOptionalString(body.description),
      enabled: body.enabled ?? true,
      sortOrder: this.toSortOrder(body.sortOrder)
    };
  }

  private buildPotentialRangeData(body: BaseConfigBody): Prisma.PotentialRangeCreateInput {
    return {
      code: this.requireString(body.code, '潜力范围编码不能为空。'),
      name: this.cleanOptionalString(body.name),
      description: this.cleanOptionalString(body.description),
      sortOrder: this.toSortOrder(body.sortOrder)
    };
  }

  private buildCommonData(body: BaseConfigBody): Prisma.EthnicityCreateInput {
    return {
      code: this.requireString(body.code, '编码不能为空。'),
      name: this.requireString(body.name, '名称不能为空。'),
      description: this.cleanOptionalString(body.description),
      sortOrder: this.toSortOrder(body.sortOrder)
    };
  }

  private async buildCityCreateData(
    body: BaseConfigBody
  ): Promise<Prisma.CityUncheckedCreateInput> {
    const uid = this.requireString(body.uid, '城市 UID 不能为空，未知可填 -。');
    const name = this.requireString(body.name, '城市名称不能为空。');
    await this.assertCountry(body.countryId);

    return {
      importKey: this.createCityImportKey(uid, name, body.countryId),
      uid,
      name,
      countryId: this.cleanOptionalString(body.countryId),
      description: this.cleanOptionalString(body.description),
      sortOrder: this.toSortOrder(body.sortOrder)
    };
  }

  private async buildCityUpdateData(
    body: BaseConfigBody
  ): Promise<Prisma.CityUncheckedUpdateInput> {
    const uid = this.requireString(body.uid, '城市 UID 不能为空，未知可填 -。');
    const name = this.requireString(body.name, '城市名称不能为空。');
    await this.assertCountry(body.countryId);

    return {
      uid,
      name,
      countryId: this.cleanOptionalString(body.countryId),
      description: this.cleanOptionalString(body.description),
      sortOrder: this.toSortOrder(body.sortOrder)
    };
  }

  private async assertCountry(countryId?: string) {
    const cleaned = this.cleanOptionalString(countryId);

    if (!cleaned) {
      return;
    }

    const country = await this.prisma.country.findUnique({
      where: { id: cleaned },
      select: { id: true }
    });

    if (!country) {
      throw new BadRequestException('管理国家不存在。');
    }
  }

  private createCityImportKey(uid: string, name: string, countryId?: string) {
    if (uid === '-') {
      return `manual:city:${countryId ?? 'none'}:${name}:${randomUUID()}`;
    }

    return `manual:city:${countryId ?? 'none'}:${uid}:${name}`;
  }

  private assertType(type: BaseConfigType) {
    if (!SUPPORTED_TYPES.has(type)) {
      throw new BadRequestException('不支持的基础配置类型。');
    }
  }

  private requireString(value: string | undefined, message: string) {
    const cleaned = this.cleanOptionalString(value);

    if (!cleaned) {
      throw new BadRequestException(message);
    }

    return cleaned;
  }

  private cleanOptionalString(value: string | undefined) {
    const cleaned = value?.trim();

    return cleaned ? cleaned : null;
  }

  private cleanKeyword(value: string | undefined) {
    const cleaned = value?.trim();

    return cleaned ? cleaned : undefined;
  }

  private toSortOrder(value: number | undefined) {
    return Number.isFinite(value) ? Number(value) : 0;
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new BadRequestException('编码或 UID 已存在，请检查后重试。');
      }

      if (error.code === 'P2025') {
        throw new NotFoundException('基础配置不存在。');
      }
    }

    throw error;
  }
}
