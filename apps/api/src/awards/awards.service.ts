import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AwardScopeType, AwardTargetType, LifecycleStatus, type Prisma } from '@prisma/client';
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
  competition: {
    select: {
      id: true,
      code: true,
      name: true,
      externalUrl: true,
      targetType: true,
      scopeType: true,
      category: true,
      level: true,
      format: true
    }
  },
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
  competition: {
    include: {
      editions: {
        orderBy: [{ year: 'asc' }, { name: 'asc' }]
      }
    }
  },
  editions: {
    orderBy: [{ year: 'desc' }, { name: 'desc' }],
    include: {
      competitionEdition: {
        include: {
          competition: true
        }
      },
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
          },
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
              exists: true,
              visibleInCatalog: true
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
      exists: true,
      visibleInCatalog: true
    }
  },
  edition: {
    include: {
      competitionEdition: {
        include: {
          competition: true
        }
      },
      award: {
        include: {
          competition: {
            select: {
              id: true,
              code: true,
              name: true,
              externalUrl: true,
              targetType: true,
              scopeType: true,
              category: true,
              level: true,
              format: true
            }
          },
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
    await this.assertCompetitionEditionMatchesAward(awardId, body.competitionEditionId);

    return this.prisma.awardEdition.create({
      data: this.buildEditionData(awardId, body),
      include: {
        recipients: true
      }
    });
  }

  async updateEdition(id: string, body: UpdateAwardEditionBody) {
    const edition = await this.assertEditionExists(id);
    await this.assertCompetitionEditionMatchesAward(edition.awardId, body.competitionEditionId);

    return this.prisma.awardEdition.update({
      where: { id },
      data: this.buildEditionUpdateData(body),
      include: {
        recipients: true
      }
    });
  }

  async saveRecipients(id: string, body: SaveAwardRecipientsBody) {
    const edition = await this.assertEditionExists(id);
    const targetType = edition.award.targetType;
    const recipients = this.buildRecipientData(body, targetType);

    await this.assertTargetsExist(
      targetType,
      recipients
        .map((recipient) => this.resolveRecipientTargetId(recipient, targetType))
        .filter((targetId): targetId is string => Boolean(targetId))
    );
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
      ...(query.targetType ? { targetType: this.parseTargetType(query.targetType) } : {}),
      ...(query.competitionId ? { competitionId: query.competitionId } : {}),
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
      ...(query.countryId ? { countryId: query.countryId } : {}),
      ...(query.clubId ? { clubId: query.clubId } : {}),
      ...(query.targetType ? { targetType: this.parseTargetType(query.targetType) } : {}),
      ...(placement ? { placement: { contains: placement, mode: 'insensitive' } } : {}),
      edition: {
        ...(query.awardId ? { awardId: query.awardId } : {}),
        ...(Number.isFinite(year) ? { year } : {}),
        ...(query.scopeType || query.targetType
          ? {
              award: {
                ...(query.scopeType ? { scopeType: this.parseScopeType(query.scopeType) } : {}),
                ...(query.targetType ? { targetType: this.parseTargetType(query.targetType) } : {})
              }
            }
          : {})
      },
      ...(keyword
        ? {
            OR: [
              { placement: { contains: keyword, mode: 'insensitive' } },
              { remark: { contains: keyword, mode: 'insensitive' } },
              { player: { uid: { contains: keyword, mode: 'insensitive' } } },
              { player: { chineseName: { contains: keyword, mode: 'insensitive' } } },
              { player: { englishName: { contains: keyword, mode: 'insensitive' } } },
              { country: { uid: { contains: keyword, mode: 'insensitive' } } },
              { country: { name: { contains: keyword, mode: 'insensitive' } } },
              { club: { uid: { contains: keyword, mode: 'insensitive' } } },
              { club: { name: { contains: keyword, mode: 'insensitive' } } },
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
      targetType: this.parseTargetType(body.targetType ?? AwardTargetType.PLAYER),
      scopeType,
      category: this.toNullableString(body.category),
      level: this.toNullableString(body.level),
      description: this.toNullableString(body.description),
      competitionId: this.toNullableString(body.competitionId),
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
      awardId,
      competitionEditionId: this.toNullableString(body.competitionEditionId),
      name,
      season: this.toNullableString(body.season),
      year: this.toNullableNumber(body.year),
      externalUrl: this.toNullableString(body.externalUrl),
      remark: this.toNullableString(body.remark)
    } satisfies Prisma.AwardEditionUncheckedCreateInput;
  }

  private buildEditionUpdateData(body: UpdateAwardEditionBody) {
    return {
      ...(body.name !== undefined ? { name: this.requiredString(body.name, '奖项届次名称') } : {}),
      ...(body.competitionEditionId !== undefined
        ? { competitionEditionId: this.toNullableString(body.competitionEditionId) }
        : {}),
      ...(body.season !== undefined ? { season: this.toNullableString(body.season) } : {}),
      ...(body.year !== undefined ? { year: this.toNullableNumber(body.year) } : {}),
      ...(body.externalUrl !== undefined
        ? { externalUrl: this.toNullableString(body.externalUrl) }
        : {}),
      ...(body.remark !== undefined ? { remark: this.toNullableString(body.remark) } : {})
    } satisfies Prisma.AwardEditionUpdateInput;
  }

  private buildRecipientData(body: SaveAwardRecipientsBody, targetType: AwardTargetType) {
    const recipients = body.recipients ?? [];
    const usedTargetIds = new Set<string>();
    const rows: Array<{
      targetType: AwardTargetType;
      playerId?: string | null;
      countryId?: string | null;
      clubId?: string | null;
      rank?: number | null;
      placement?: string | null;
      externalUrl?: string | null;
      remark?: string | null;
    }> = [];

    for (const recipient of recipients) {
      const targetId = this.resolveRecipientTargetId(recipient, targetType);

      if (!targetId) {
        continue;
      }

      if (usedTargetIds.has(targetId)) {
        throw new BadRequestException('同一届奖项不能重复录入同一球员。');
      }

      usedTargetIds.add(targetId);
      rows.push({
        targetType,
        playerId: targetType === AwardTargetType.PLAYER ? targetId : null,
        countryId: targetType === AwardTargetType.COUNTRY ? targetId : null,
        clubId: targetType === AwardTargetType.CLUB ? targetId : null,
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
      select: {
        id: true,
        awardId: true,
        award: {
          select: {
            targetType: true
          }
        }
      }
    });

    if (!edition) {
      throw new NotFoundException('奖项届次不存在。');
    }

    return edition;
  }

  private async assertCompetitionEditionMatchesAward(
    awardId: string,
    competitionEditionId?: string
  ) {
    const award = await this.prisma.award.findUnique({
      where: { id: awardId },
      select: {
        id: true,
        competitionId: true
      }
    });

    if (!award) {
      throw new NotFoundException('奖项不存在。');
    }

    const editionId = this.toNullableString(competitionEditionId);

    if (!editionId) {
      return;
    }

    if (!award.competitionId) {
      throw new BadRequestException('非赛事奖项不能绑定赛事届次。');
    }

    const competitionEdition = await this.prisma.competitionEdition.findUnique({
      where: { id: editionId },
      select: {
        id: true,
        competitionId: true
      }
    });

    if (!competitionEdition) {
      throw new BadRequestException('赛事届次不存在。');
    }

    if (competitionEdition.competitionId !== award.competitionId) {
      throw new BadRequestException('奖项届次绑定的赛事届次与奖项所属赛事不一致。');
    }
  }

  private async assertTargetsExist(targetType: AwardTargetType, targetIds: string[]) {
    if (!targetIds.length) {
      return;
    }

    const uniqueIds = [...new Set(targetIds)];
    const foundIds = new Set<string>();

    if (targetType === AwardTargetType.PLAYER) {
      const players = await this.prisma.player.findMany({
        where: { id: { in: uniqueIds } },
        select: { id: true }
      });
      players.forEach((player) => foundIds.add(player.id));
    } else if (targetType === AwardTargetType.COUNTRY) {
      const countries = await this.prisma.country.findMany({
        where: { id: { in: uniqueIds } },
        select: { id: true }
      });
      countries.forEach((country) => foundIds.add(country.id));
    } else if (targetType === AwardTargetType.CLUB) {
      const clubs = await this.prisma.club.findMany({
        where: { id: { in: uniqueIds } },
        select: { id: true }
      });
      clubs.forEach((club) => foundIds.add(club.id));
    }

    const missing = uniqueIds.find((targetId) => !foundIds.has(targetId));

    if (missing) {
      throw new BadRequestException('获奖对象中存在不存在的实体。');
    }
  }

  private resolveRecipientTargetId(
    recipient: {
      playerId?: string | null;
      countryId?: string | null;
      clubId?: string | null;
    },
    targetType: AwardTargetType
  ) {
    if (targetType === AwardTargetType.PLAYER) {
      return this.toNullableString(recipient.playerId);
    }

    if (targetType === AwardTargetType.COUNTRY) {
      return this.toNullableString(recipient.countryId);
    }

    if (targetType === AwardTargetType.CLUB) {
      return this.toNullableString(recipient.clubId);
    }

    return null;
  }

  private parseScopeType(value: AwardScopeType) {
    if (!Object.values(AwardScopeType).includes(value)) {
      throw new BadRequestException('奖项范围不合法。');
    }

    return value;
  }

  private parseTargetType(value: AwardTargetType) {
    if (!Object.values(AwardTargetType).includes(value)) {
      throw new BadRequestException('获奖对象类型不合法。');
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
