import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AwardScopeType, LifecycleStatus, type Prisma } from '@prisma/client';
import { resolvePagination, toInteger } from '../common/pagination.js';
import { PrismaService } from '../database/prisma.service.js';
import type {
  AwardListQuery,
  AwardRecipientListQuery,
  CreateAwardBody,
  CreateAwardEditionBody,
  SaveAwardRecipientsBody,
  UpdateAwardBody,
  UpdateAwardEditionBody
} from './awards.types.js';

const AWARD_INCLUDE = {
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
      name: true,
      externalUrl: true
    }
  },
  _count: {
    select: {
      editions: true
    }
  }
} satisfies Prisma.AwardInclude;

const AWARD_DETAIL_INCLUDE = {
  ...AWARD_INCLUDE,
  editions: {
    orderBy: [{ year: 'desc' }, { name: 'desc' }],
    include: {
      recipients: {
        orderBy: [{ rank: 'asc' }, { placement: 'asc' }],
        include: {
          player: {
            select: {
              id: true,
              uid: true,
              chineseName: true,
              englishName: true,
              externalUrl: true,
              pa: true,
              primaryRole: true,
              positions: true,
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
              }
            }
          }
        }
      }
    }
  }
} satisfies Prisma.AwardInclude;

const AWARD_RECIPIENT_INCLUDE = {
  player: {
    select: {
      id: true,
      uid: true,
      chineseName: true,
      englishName: true,
      externalUrl: true,
      pa: true,
      primaryRole: true,
      positions: true,
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
      }
    }
  },
  edition: {
    include: {
      award: {
        include: {
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
              name: true,
              externalUrl: true
            }
          }
        }
      }
    }
  }
} satisfies Prisma.AwardRecipientInclude;

@Injectable()
export class AwardsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: AwardListQuery) {
    const pagination = resolvePagination(query);
    const where = this.buildAwardWhere(query);
    const [items, total] = await this.prisma.$transaction([
      this.prisma.award.findMany({
        where,
        include: AWARD_INCLUDE,
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        skip: pagination.skip,
        take: pagination.take
      }),
      this.prisma.award.count({ where })
    ]);

    return {
      items,
      page: pagination.page,
      pageSize: pagination.pageSize,
      total
    };
  }

  async findRecipients(query: AwardRecipientListQuery) {
    const pagination = resolvePagination(query);
    const where = this.buildRecipientWhere(query);
    const [items, total] = await this.prisma.$transaction([
      this.prisma.awardRecipient.findMany({
        where,
        include: AWARD_RECIPIENT_INCLUDE,
        orderBy: [
          { edition: { year: 'desc' } },
          { edition: { name: 'desc' } },
          { rank: 'asc' },
          { placement: 'asc' }
        ],
        skip: pagination.skip,
        take: pagination.take
      }),
      this.prisma.awardRecipient.count({ where })
    ]);

    return {
      items,
      page: pagination.page,
      pageSize: pagination.pageSize,
      total
    };
  }

  async findOne(id: string) {
    const award = await this.prisma.award.findUnique({
      where: { id },
      include: AWARD_DETAIL_INCLUDE
    });

    if (!award) {
      throw new NotFoundException('奖项不存在。');
    }

    return award;
  }

  async create(body: CreateAwardBody) {
    const data = await this.buildAwardData(body);

    return this.prisma.award.create({
      data,
      include: AWARD_INCLUDE
    });
  }

  async update(id: string, body: UpdateAwardBody) {
    await this.assertAwardExists(id);
    const data = await this.buildAwardData(body);

    return this.prisma.award.update({
      where: { id },
      data,
      include: AWARD_INCLUDE
    });
  }

  async remove(id: string) {
    const award = await this.prisma.award.findUnique({
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

    if (!award) {
      throw new NotFoundException('奖项不存在。');
    }

    if (award._count.editions > 0) {
      throw new BadRequestException('奖项已有届次或获奖人，不能直接删除。');
    }

    await this.prisma.award.delete({
      where: { id }
    });

    return { id };
  }

  async createEdition(awardId: string, body: CreateAwardEditionBody) {
    await this.assertAwardExists(awardId);

    return this.prisma.awardEdition.create({
      data: this.buildEditionData(awardId, body),
      include: {
        recipients: true
      }
    });
  }

  async updateEdition(id: string, body: UpdateAwardEditionBody) {
    await this.assertEditionExists(id);

    return this.prisma.awardEdition.update({
      where: { id },
      data: this.buildEditionUpdateData(body),
      include: {
        recipients: true
      }
    });
  }

  async saveRecipients(id: string, body: SaveAwardRecipientsBody) {
    await this.assertEditionExists(id);
    const recipients = this.buildRecipientData(body);

    await this.assertPlayersExist(recipients.map((recipient) => recipient.playerId));
    await this.prisma.$transaction([
      this.prisma.awardRecipient.deleteMany({
        where: { editionId: id }
      }),
      ...(recipients.length
        ? [
            this.prisma.awardRecipient.createMany({
              data: recipients.map((recipient) => ({
                editionId: id,
                ...recipient
              }))
            })
          ]
        : [])
    ]);

    return this.prisma.awardEdition.findUnique({
      where: { id },
      include: AWARD_DETAIL_INCLUDE.editions.include
    });
  }

  private buildAwardWhere(query: AwardListQuery): Prisma.AwardWhereInput {
    const keyword = query.keyword?.trim();

    return {
      ...(keyword
        ? {
            OR: [
              { code: { contains: keyword, mode: 'insensitive' } },
              { name: { contains: keyword, mode: 'insensitive' } },
              { category: { contains: keyword, mode: 'insensitive' } },
              { level: { contains: keyword, mode: 'insensitive' } },
              { description: { contains: keyword, mode: 'insensitive' } }
            ]
          }
        : {}),
      ...(query.scopeType ? { scopeType: this.parseScopeType(query.scopeType) } : {}),
      ...(query.confederationId ? { confederationId: query.confederationId } : {}),
      ...(query.countryId ? { countryId: query.countryId } : {}),
      ...(query.lifecycleStatus
        ? { lifecycleStatus: this.parseLifecycleStatus(query.lifecycleStatus) }
        : {}),
      ...(query.enabled === undefined ? {} : { enabled: query.enabled === 'true' })
    };
  }

  private buildRecipientWhere(query: AwardRecipientListQuery): Prisma.AwardRecipientWhereInput {
    const keyword = query.keyword?.trim();
    const year = toInteger(query.year, Number.NaN);
    const placement = this.toNullableString(query.placement);

    return {
      ...(query.playerId ? { playerId: query.playerId } : {}),
      ...(placement ? { placement: { contains: placement, mode: 'insensitive' } } : {}),
      edition: {
        ...(query.awardId ? { awardId: query.awardId } : {}),
        ...(Number.isFinite(year) ? { year } : {}),
        ...(query.scopeType ? { award: { scopeType: this.parseScopeType(query.scopeType) } } : {})
      },
      ...(keyword
        ? {
            OR: [
              { placement: { contains: keyword, mode: 'insensitive' } },
              { remark: { contains: keyword, mode: 'insensitive' } },
              { player: { uid: { contains: keyword, mode: 'insensitive' } } },
              { player: { chineseName: { contains: keyword, mode: 'insensitive' } } },
              { player: { englishName: { contains: keyword, mode: 'insensitive' } } },
              { edition: { name: { contains: keyword, mode: 'insensitive' } } },
              { edition: { season: { contains: keyword, mode: 'insensitive' } } },
              { edition: { award: { code: { contains: keyword, mode: 'insensitive' } } } },
              { edition: { award: { name: { contains: keyword, mode: 'insensitive' } } } },
              { edition: { award: { category: { contains: keyword, mode: 'insensitive' } } } }
            ]
          }
        : {})
    };
  }

  private async buildAwardData(body: CreateAwardBody) {
    const code = this.requiredString(body.code, '奖项编码');
    const name = this.requiredString(body.name, '奖项名称');
    const scopeType = this.parseScopeType(body.scopeType ?? AwardScopeType.WORLD);

    this.validateScope(scopeType, body);

    return {
      code,
      name,
      externalUrl: this.toNullableString(body.externalUrl),
      scopeType,
      category: this.toNullableString(body.category),
      level: this.toNullableString(body.level),
      description: this.toNullableString(body.description),
      confederationId:
        scopeType === AwardScopeType.CONFEDERATION
          ? this.toNullableString(body.confederationId)
          : null,
      countryId:
        scopeType === AwardScopeType.COUNTRY ? this.toNullableString(body.countryId) : null,
      lifecycleStatus: this.parseLifecycleStatus(body.lifecycleStatus ?? LifecycleStatus.CURRENT),
      enabled: body.enabled ?? true,
      sortOrder: body.sortOrder ?? 0
    } satisfies Prisma.AwardUncheckedCreateInput;
  }

  private buildEditionData(awardId: string, body: CreateAwardEditionBody) {
    const name = this.requiredString(body.name, '奖项届次名称');

    return {
      award: {
        connect: {
          id: awardId
        }
      },
      name,
      season: this.toNullableString(body.season),
      year: this.toNullableNumber(body.year),
      externalUrl: this.toNullableString(body.externalUrl),
      remark: this.toNullableString(body.remark)
    } satisfies Prisma.AwardEditionCreateInput;
  }

  private buildEditionUpdateData(body: UpdateAwardEditionBody) {
    return {
      ...(body.name !== undefined ? { name: this.requiredString(body.name, '奖项届次名称') } : {}),
      ...(body.season !== undefined ? { season: this.toNullableString(body.season) } : {}),
      ...(body.year !== undefined ? { year: this.toNullableNumber(body.year) } : {}),
      ...(body.externalUrl !== undefined
        ? { externalUrl: this.toNullableString(body.externalUrl) }
        : {}),
      ...(body.remark !== undefined ? { remark: this.toNullableString(body.remark) } : {})
    } satisfies Prisma.AwardEditionUpdateInput;
  }

  private buildRecipientData(body: SaveAwardRecipientsBody) {
    const recipients = body.recipients ?? [];
    const usedPlayers = new Set<string>();
    const rows: Array<{
      playerId: string;
      rank?: number | null;
      placement?: string | null;
      externalUrl?: string | null;
      remark?: string | null;
    }> = [];

    for (const recipient of recipients) {
      const playerId = this.toNullableString(recipient.playerId);

      if (!playerId) {
        continue;
      }

      if (usedPlayers.has(playerId)) {
        throw new BadRequestException('同一届奖项不能重复录入同一球员。');
      }

      usedPlayers.add(playerId);
      rows.push({
        playerId,
        rank: this.toNullableNumber(recipient.rank),
        placement: this.toNullableString(recipient.placement),
        externalUrl: this.toNullableString(recipient.externalUrl),
        remark: this.toNullableString(recipient.remark)
      });
    }

    return rows;
  }

  private validateScope(scopeType: AwardScopeType, body: CreateAwardBody) {
    if (scopeType === AwardScopeType.CONFEDERATION && !body.confederationId) {
      throw new BadRequestException('洲际奖项必须选择足联。');
    }

    if (scopeType === AwardScopeType.COUNTRY && !body.countryId) {
      throw new BadRequestException('国家奖项必须选择国家。');
    }
  }

  private async assertAwardExists(id: string) {
    const award = await this.prisma.award.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!award) {
      throw new NotFoundException('奖项不存在。');
    }
  }

  private async assertEditionExists(id: string) {
    const edition = await this.prisma.awardEdition.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!edition) {
      throw new NotFoundException('奖项届次不存在。');
    }
  }

  private async assertPlayersExist(playerIds: string[]) {
    if (!playerIds.length) {
      return;
    }

    const players = await this.prisma.player.findMany({
      where: {
        id: {
          in: playerIds
        }
      },
      select: {
        id: true
      }
    });
    const foundIds = new Set(players.map((player) => player.id));
    const missing = playerIds.find((playerId) => !foundIds.has(playerId));

    if (missing) {
      throw new BadRequestException('获奖人中存在不存在的球员。');
    }
  }

  private parseScopeType(value: AwardScopeType) {
    if (!Object.values(AwardScopeType).includes(value)) {
      throw new BadRequestException('奖项范围不合法。');
    }

    return value;
  }

  private parseLifecycleStatus(value: LifecycleStatus) {
    if (!Object.values(LifecycleStatus).includes(value)) {
      throw new BadRequestException('奖项生命周期状态不合法。');
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

  private toNullableNumber(value: number | undefined | null) {
    return Number.isFinite(value) ? value : null;
  }
}
