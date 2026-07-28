import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  AwardScopeType,
  AwardTargetType,
  CompetitionScopeType,
  CompetitionStandingPlacement,
  CompetitionTargetType,
  HonorRuleConversionType,
  HonorRulePlacementScope,
  PlayerCareerType,
  PlayerTeamHonorSourceType,
  PlayerTeamHonorStatus,
  Prisma
} from '@prisma/client';
import { PrismaService } from '../database/prisma.service.js';
import { resolvePagination, toNumber } from '../common/pagination.js';
import type {
  PlayerAwardRecipientPayload,
  PlayerCareerPayload,
  PlayerHonorSummaryQuery,
  PlayerListQuery,
  PlayerPayload,
  PlayerTeamHonorPayload,
  SavePlayerAwardRecipientGroupBody,
  SavePlayerCareersBody,
  TeamHonorStandingOptionQuery
} from './players.types.js';

const FIFA_WORLD_CUP_GOLDEN_BALL_CODE = 'FIFA_WORLD_CUP_GOLDEN_BALL';

const PLAYER_CAREER_INCLUDE = {
  club: {
    select: {
      id: true,
      uid: true,
      name: true,
      externalUrl: true,
      exists: true,
      federationRef: {
        select: {
          id: true,
          uid: true,
          code: true,
          name: true
        }
      }
    }
  },
  country: {
    select: {
      id: true,
      uid: true,
      name: true,
      shortName: true,
      externalUrl: true,
      federationRef: {
        select: {
          id: true,
          uid: true,
          code: true,
          name: true
        }
      }
    }
  }
} satisfies Prisma.PlayerCareerInclude;

const CLUB_NAME_REF_SELECT = {
  id: true,
  uid: true,
  name: true,
  externalUrl: true,
  exists: true,
  federationRef: {
    select: {
      id: true,
      uid: true,
      code: true,
      name: true
    }
  }
} satisfies Prisma.ClubSelect;

const PLAYER_LIST_INCLUDE = {
  country: {
    select: {
      id: true,
      uid: true,
      name: true,
      shortName: true,
      externalUrl: true,
      federationRef: {
        select: {
          id: true,
          uid: true,
          code: true,
          name: true
        }
      }
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
  initialClubRef: {
    select: CLUB_NAME_REF_SELECT
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
  },
  ethnicityRef: {
    select: {
      id: true,
      code: true,
      name: true
    }
  },
  preferredFootRef: {
    select: {
      id: true,
      code: true,
      name: true
    }
  },
  birthCountry: {
    select: {
      id: true,
      uid: true,
      name: true,
      shortName: true
    }
  },
  birthCityRef: {
    select: {
      id: true,
      uid: true,
      name: true,
      country: {
        select: {
          id: true,
          uid: true,
          name: true,
          shortName: true
        }
      }
    }
  },
  nationalities: {
    include: {
      country: {
        select: {
          id: true,
          uid: true,
          name: true,
          shortName: true
        }
      }
    }
  },
  careers: {
    include: PLAYER_CAREER_INCLUDE,
    orderBy: [{ sortOrder: 'asc' }, { startYear: 'asc' }, { startSeason: 'asc' }]
  }
} satisfies Prisma.PlayerInclude;

const PLAYER_AWARD_RECIPIENT_INCLUDE = {
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
            include: {
              scopeConfederations: true,
              scopeCountries: true,
              editions: {
                select: {
                  year: true,
                  quantity: true
                }
              }
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

const TEAM_HONOR_STANDING_INCLUDE = {
  edition: {
    include: {
      competition: {
        include: {
          scopeConfederations: true,
          scopeCountries: true,
          editions: {
            select: {
              year: true,
              quantity: true
            }
          }
        }
      }
    }
  },
  country: {
    select: {
      id: true,
      uid: true,
      name: true,
      externalUrl: true,
      federationRef: {
        select: {
          id: true,
          uid: true,
          code: true,
          name: true
        }
      }
    }
  },
  club: {
    select: {
      id: true,
      uid: true,
      name: true,
      externalUrl: true,
      exists: true,
      federationRef: {
        select: {
          id: true,
          uid: true,
          code: true,
          name: true
        }
      }
    }
  }
} satisfies Prisma.CompetitionStandingInclude;

const PLAYER_TEAM_HONOR_INCLUDE = {
  standing: {
    include: TEAM_HONOR_STANDING_INCLUDE
  },
  career: {
    include: PLAYER_CAREER_INCLUDE
  }
} satisfies Prisma.PlayerTeamHonorInclude;

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
  },
  awardRecipients: {
    where: { targetType: AwardTargetType.PLAYER },
    include: PLAYER_AWARD_RECIPIENT_INCLUDE,
    orderBy: [{ edition: { year: 'desc' } }, { rank: 'asc' }, { placement: 'asc' }]
  },
  teamHonors: {
    where: { status: PlayerTeamHonorStatus.CONFIRMED },
    include: PLAYER_TEAM_HONOR_INCLUDE,
    orderBy: [{ createdAt: 'desc' }]
  }
} satisfies Prisma.PlayerInclude;

type PlayerHonorSummaryPlayer = Prisma.PlayerGetPayload<{
  include: typeof PLAYER_DETAIL_INCLUDE;
}>;
type PlayerAwardRecipientRecord = PlayerHonorSummaryPlayer['awardRecipients'][number];
type PlayerTeamHonorRecord = PlayerHonorSummaryPlayer['teamHonors'][number];
type PlayerAwardCompetition = NonNullable<
  PlayerAwardRecipientRecord['edition']['award']['competition']
>;
type PlayerHonorCompetition = PlayerTeamHonorRecord['standing']['edition']['competition'];
type PlayerAwardRule = Prisma.AwardRuleGetPayload<Record<string, never>>;
type PlayerHonorRule = Prisma.HonorRuleGetPayload<{ include: { coefficients: true } }>;
type PlayerHonorScoreBucketKey =
  | 'worldAwardScore'
  | 'continentalAwardScore'
  | 'countryAwardScore'
  | 'leagueAwardScore'
  | 'clubAwardScore'
  | 'mediaAwardScore'
  | 'worldCupScore'
  | 'continentalCupScore'
  | 'continentalLeagueScore'
  | 'domesticLeagueScore'
  | 'domesticCupScore'
  | 'countryCupScore'
  | 'internationalClubScore'
  | 'otherTeamHonorScore';
type PlayerHonorListColumnKey =
  | 'worldAward'
  | 'continentalAward'
  | 'countryAward'
  | 'mediaAward'
  | 'worldCupTrophy'
  | 'worldCupAward'
  | 'continentalCupTrophy'
  | 'continentalCupAward'
  | 'continentalLeagueTrophy'
  | 'continentalLeagueAward'
  | 'domesticLeagueTrophy'
  | 'domesticLeagueAward'
  | 'domesticCupTrophy'
  | 'domesticCupAward'
  | 'otherCountryTrophy'
  | 'otherCountryAward'
  | 'otherClubTrophy'
  | 'otherClubAward'
  | 'otherPersonalHonor';
type PlayerHonorSummaryScoreKey = Exclude<PlayerHonorListColumnKey, 'otherPersonalHonor'>;
type PlayerHonorSummaryScoreMap = Record<PlayerHonorSummaryScoreKey, number>;
type PlayerHonorScoreDetail = {
  label: string;
  competitionName: string | null;
  placementLabel: string | null;
  score: number;
  placementScore: number;
  qualityCoefficient: number;
  conversionCoefficient: number;
  ruleName: string;
  externalUrl: string | null;
  sourceName: string | null;
};
type PlayerHonorScoreDetailMap = Record<PlayerHonorSummaryScoreKey, PlayerHonorScoreDetail[]>;
type PlayerHonorListColumn = {
  key: PlayerHonorListColumnKey;
  label: string;
  group: string;
  sourceType: 'AWARD' | 'TEAM' | 'OTHER';
};
type PlayerHonorSummaryColumn = PlayerHonorListColumn & {
  key: PlayerHonorSummaryScoreKey;
  sourceType: 'AWARD' | 'TEAM';
};
type PlayerHonorListCell = {
  text: string;
  items: string[];
};
type PlayerHonorListCellMap = Record<PlayerHonorListColumnKey, PlayerHonorListCell>;
type PlayerHonorListEntry = {
  title: string;
  subjectName: string | null;
  periods: Array<{
    label: string;
    sortYear: number;
    placement: string | null;
  }>;
  sortOrder: number;
};
type PlayerHonorListUnit = {
  title: string;
  label: string;
  sortYear: number;
  sortOrder: number;
};
type ScoredPlayerAward = {
  playerId: string;
  scoreKey: PlayerHonorSummaryScoreKey;
  groupKey: string;
  rule: PlayerAwardRule;
  score: number;
  detail: PlayerHonorScoreDetail;
};

const PLAYER_HONOR_LIST_COLUMNS: PlayerHonorListColumn[] = [
  { key: 'worldAward', label: '世界', group: '奖项', sourceType: 'AWARD' },
  { key: 'continentalAward', label: '洲际', group: '奖项', sourceType: 'AWARD' },
  { key: 'countryAward', label: '国家', group: '奖项', sourceType: 'AWARD' },
  { key: 'mediaAward', label: '媒体/附加', group: '奖项', sourceType: 'AWARD' },
  { key: 'worldCupTrophy', label: '奖杯', group: '世界杯', sourceType: 'TEAM' },
  { key: 'worldCupAward', label: '奖项', group: '世界杯', sourceType: 'AWARD' },
  { key: 'continentalCupTrophy', label: '奖杯', group: '洲际杯', sourceType: 'TEAM' },
  { key: 'continentalCupAward', label: '奖项', group: '洲际杯', sourceType: 'AWARD' },
  { key: 'continentalLeagueTrophy', label: '奖杯', group: '洲际联赛', sourceType: 'TEAM' },
  { key: 'continentalLeagueAward', label: '奖项', group: '洲际联赛', sourceType: 'AWARD' },
  { key: 'domesticLeagueTrophy', label: '奖杯', group: '国内联赛', sourceType: 'TEAM' },
  { key: 'domesticLeagueAward', label: '奖项', group: '国内联赛', sourceType: 'AWARD' },
  { key: 'domesticCupTrophy', label: '奖杯', group: '国内杯赛', sourceType: 'TEAM' },
  { key: 'domesticCupAward', label: '奖项', group: '国内杯赛', sourceType: 'AWARD' },
  { key: 'otherCountryTrophy', label: '奖杯', group: '其他国家队', sourceType: 'TEAM' },
  { key: 'otherCountryAward', label: '奖项', group: '其他国家队', sourceType: 'AWARD' },
  { key: 'otherClubTrophy', label: '奖杯', group: '其他俱乐部', sourceType: 'TEAM' },
  { key: 'otherClubAward', label: '奖项', group: '其他俱乐部', sourceType: 'AWARD' },
  { key: 'otherPersonalHonor', label: '成就', group: '个人其他', sourceType: 'OTHER' }
];

const PLAYER_HONOR_SUMMARY_COLUMNS = PLAYER_HONOR_LIST_COLUMNS.filter(
  (column): column is PlayerHonorSummaryColumn => column.sourceType !== 'OTHER'
);

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

    const listItems = items.map((item) => this.attachCareerSummaries(item));

    return {
      items: await this.attachInitialClubRefs(listItems),
      page: pagination.page,
      pageSize: pagination.pageSize,
      total
    };
  }

  async findHonorSummary(query: PlayerHonorSummaryQuery) {
    const pagination = resolvePagination(query);
    const where = this.buildHonorSummaryWhere(query);
    const [players, awardRules, honorRules] = await Promise.all([
      this.prisma.player.findMany({
        where,
        include: PLAYER_DETAIL_INCLUDE,
        orderBy: [{ pa: { sort: 'desc', nulls: 'last' } }, { chineseName: 'asc' }, { uid: 'asc' }]
      }),
      this.prisma.awardRule.findMany({
        where: { enabled: true },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }]
      }),
      this.prisma.honorRule.findMany({
        where: { enabled: true },
        include: { coefficients: true },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }]
      })
    ]);
    const rows = players
      .map((player) => this.buildPlayerHonorSummaryRow(player, awardRules, honorRules))
      .filter((row) => row.totalScore > 0 || row.awardCount > 0 || row.teamHonorCount > 0)
      .sort((left, right) => {
        if (left.totalScore !== right.totalScore) return right.totalScore - left.totalScore;
        if ((left.pa ?? 0) !== (right.pa ?? 0)) return (right.pa ?? 0) - (left.pa ?? 0);
        return left.chineseName.localeCompare(right.chineseName, 'zh-CN');
      });

    return {
      items: rows.slice(pagination.skip, pagination.skip + pagination.take),
      columns: PLAYER_HONOR_SUMMARY_COLUMNS,
      page: pagination.page,
      pageSize: pagination.pageSize,
      total: rows.length
    };
  }

  async findHonorListSummary(query: PlayerHonorSummaryQuery) {
    const pagination = resolvePagination(query);
    const where = this.buildHonorSummaryWhere(query);
    const [players, awardRules, honorRules] = await Promise.all([
      this.prisma.player.findMany({
        where,
        include: PLAYER_DETAIL_INCLUDE,
        orderBy: [{ pa: { sort: 'desc', nulls: 'last' } }, { chineseName: 'asc' }, { uid: 'asc' }]
      }),
      this.prisma.awardRule.findMany({
        where: { enabled: true },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }]
      }),
      this.prisma.honorRule.findMany({
        where: { enabled: true },
        include: { coefficients: true },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }]
      })
    ]);
    const rows = players
      .map((player) => {
        const scoreRow = this.buildPlayerHonorSummaryRow(player, awardRules, honorRules);

        return {
          ...this.buildPlayerHonorListRow(player),
          awardCount: scoreRow.awardCount,
          teamHonorCount: scoreRow.teamHonorCount,
          awardScore: scoreRow.awardScore,
          teamHonorScore: scoreRow.teamHonorScore,
          totalScore: scoreRow.totalScore
        };
      })
      .filter((row) => row.totalScore > 0 || row.awardCount > 0 || row.teamHonorCount > 0)
      .sort((left, right) => {
        if (left.totalScore !== right.totalScore) return right.totalScore - left.totalScore;
        if ((left.pa ?? 0) !== (right.pa ?? 0)) return (right.pa ?? 0) - (left.pa ?? 0);
        return left.chineseName.localeCompare(right.chineseName, 'zh-CN');
      });

    return {
      items: rows.slice(pagination.skip, pagination.skip + pagination.take),
      columns: PLAYER_HONOR_LIST_COLUMNS,
      page: pagination.page,
      pageSize: pagination.pageSize,
      total: rows.length
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

    const [enrichedPlayer] = await this.attachInitialClubRefs([this.attachCareerSummaries(player)]);

    return this.attachPlayerRelations(enrichedPlayer);
  }

  async create(body: PlayerPayload) {
    const { data, nationalityIds, careers } = await this.buildPlayerData(body);
    await this.assertUniqueUid(data.uid);
    const player = await this.prisma.$transaction(async (tx) => {
      const created = await tx.player.create({
        data: {
          ...data,
          importKey: this.createManualImportKey('player', data.uid)
        },
        select: { id: true }
      });
      await this.replaceNationalities(tx, created.id, nationalityIds);
      if (careers) {
        await this.replaceCareers(tx, created.id, careers);
      }

      return created;
    });

    return this.findOne(player.id);
  }

  async update(id: string, body: PlayerPayload) {
    const existing = await this.prisma.player.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!existing) {
      throw new NotFoundException('球员不存在。');
    }

    const { data, nationalityIds, careers } = await this.buildPlayerData(body);
    await this.assertUniqueUid(data.uid, id);
    await this.prisma.$transaction(async (tx) => {
      await tx.player.update({
        where: { id },
        data
      });
      await this.replaceNationalities(tx, id, nationalityIds);
      if (careers) {
        await this.replaceCareers(tx, id, careers);
      }
    });

    return this.findOne(id);
  }

  async remove(id: string) {
    try {
      await this.prisma.player.delete({
        where: { id }
      });

      return { id };
    } catch (error) {
      this.handleDeleteError(error, '球员');
    }
  }

  async saveCareers(id: string, body: SavePlayerCareersBody) {
    await this.assertPlayerExists(id);
    const careers = await this.buildCareerData(body.careers ?? []);

    await this.prisma.$transaction(async (tx) => {
      await this.replaceCareers(tx, id, careers);
    });

    return this.findOne(id);
  }

  async createAwardRecipient(id: string, body: PlayerAwardRecipientPayload) {
    await this.assertPlayerExists(id);
    const editionId = this.requiredText(body.editionId, '奖项届次');
    await this.assertAwardEditionExists(editionId);
    const data = this.buildAwardRecipientData(body);

    return this.prisma.awardRecipient.upsert({
      where: {
        editionId_targetType_playerId: {
          editionId,
          targetType: AwardTargetType.PLAYER,
          playerId: id
        }
      },
      create: {
        editionId,
        targetType: AwardTargetType.PLAYER,
        playerId: id,
        ...data
      },
      update: data,
      include: PLAYER_AWARD_RECIPIENT_INCLUDE
    });
  }

  async saveAwardRecipientGroup(id: string, body: SavePlayerAwardRecipientGroupBody) {
    await this.assertPlayerExists(id);
    const awardId = this.requiredText(body.awardId, '奖项');
    await this.assertPlayerAwardExists(awardId);

    const recipientRows = await this.buildAwardRecipientGroupRows(awardId, body.recipients ?? []);
    const editionIds = recipientRows.map((row) => row.editionId);

    await this.prisma.$transaction(async (tx) => {
      await tx.awardRecipient.deleteMany({
        where: {
          playerId: id,
          targetType: AwardTargetType.PLAYER,
          edition: {
            awardId
          },
          ...(editionIds.length ? { editionId: { notIn: editionIds } } : {})
        }
      });

      for (const row of recipientRows) {
        await tx.awardRecipient.upsert({
          where: {
            editionId_targetType_playerId: {
              editionId: row.editionId,
              targetType: AwardTargetType.PLAYER,
              playerId: id
            }
          },
          create: {
            editionId: row.editionId,
            targetType: AwardTargetType.PLAYER,
            playerId: id,
            ...row.data
          },
          update: row.data
        });
      }
    });

    return this.prisma.awardRecipient.findMany({
      where: {
        playerId: id,
        targetType: AwardTargetType.PLAYER,
        edition: {
          awardId
        }
      },
      include: PLAYER_AWARD_RECIPIENT_INCLUDE,
      orderBy: [{ edition: { year: 'asc' } }, { rank: 'asc' }, { placement: 'asc' }]
    });
  }

  async updateAwardRecipient(id: string, recipientId: string, body: PlayerAwardRecipientPayload) {
    await this.assertPlayerExists(id);
    await this.assertAwardRecipientBelongsToPlayer(recipientId, id);

    return this.prisma.awardRecipient.update({
      where: { id: recipientId },
      data: this.buildAwardRecipientData(body),
      include: PLAYER_AWARD_RECIPIENT_INCLUDE
    });
  }

  async removeAwardRecipient(id: string, recipientId: string) {
    await this.assertPlayerExists(id);
    await this.assertAwardRecipientBelongsToPlayer(recipientId, id);
    await this.prisma.awardRecipient.delete({
      where: { id: recipientId }
    });

    return { id: recipientId };
  }

  async findTeamHonors(id: string) {
    await this.assertPlayerExists(id);

    return this.prisma.playerTeamHonor.findMany({
      where: { playerId: id },
      include: PLAYER_TEAM_HONOR_INCLUDE,
      orderBy: [{ createdAt: 'desc' }]
    });
  }

  async createTeamHonor(id: string, body: PlayerTeamHonorPayload) {
    await this.assertPlayerExists(id);
    const standingId = this.requiredText(body.standingId, '赛事结果');
    await this.assertStandingExists(standingId);
    const data = await this.buildTeamHonorData(id, body);

    return this.prisma.playerTeamHonor.upsert({
      where: {
        playerId_standingId: {
          playerId: id,
          standingId
        }
      },
      create: {
        playerId: id,
        standingId,
        ...data
      },
      update: data,
      include: PLAYER_TEAM_HONOR_INCLUDE
    });
  }

  async updateTeamHonor(id: string, honorId: string, body: PlayerTeamHonorPayload) {
    await this.assertPlayerExists(id);
    const existing = await this.assertTeamHonorBelongsToPlayer(honorId, id);
    const data = await this.buildTeamHonorData(id, {
      ...body,
      standingId: body.standingId ?? existing.standingId
    });

    return this.prisma.playerTeamHonor.update({
      where: { id: honorId },
      data,
      include: PLAYER_TEAM_HONOR_INCLUDE
    });
  }

  async removeTeamHonor(id: string, honorId: string) {
    await this.assertPlayerExists(id);
    await this.assertTeamHonorBelongsToPlayer(honorId, id);
    await this.prisma.playerTeamHonor.delete({
      where: { id: honorId }
    });

    return { id: honorId };
  }

  async findTeamHonorStandingOptions(query: TeamHonorStandingOptionQuery) {
    const pagination = resolvePagination(query);
    const keyword = query.keyword?.trim();
    const targetType = this.parseOptionalCompetitionTargetType(query.targetType);
    const competitionId = this.optionalText(query.competitionId);
    const countryId = this.optionalText(query.countryId);
    const clubId = this.optionalText(query.clubId);
    const competitionWhere: Prisma.CompetitionWhereInput = {
      ...(targetType ? { targetType } : {}),
      ...(competitionId ? { id: competitionId } : {})
    };
    const hasCompetitionWhere = Object.keys(competitionWhere).length > 0;
    const where: Prisma.CompetitionStandingWhereInput = {
      ...(hasCompetitionWhere
        ? {
            edition: {
              competition: competitionWhere
            }
          }
        : {}),
      ...(countryId ? { countryId } : {}),
      ...(clubId ? { clubId } : {}),
      ...(keyword
        ? {
            OR: [
              { edition: { name: { contains: keyword, mode: 'insensitive' } } },
              { edition: { season: { contains: keyword, mode: 'insensitive' } } },
              { edition: { competition: { name: { contains: keyword, mode: 'insensitive' } } } },
              { edition: { competition: { alias: { contains: keyword, mode: 'insensitive' } } } },
              { edition: { competition: { code: { contains: keyword, mode: 'insensitive' } } } },
              { country: { name: { contains: keyword, mode: 'insensitive' } } },
              { country: { uid: { contains: keyword, mode: 'insensitive' } } },
              { club: { name: { contains: keyword, mode: 'insensitive' } } },
              { club: { uid: { contains: keyword, mode: 'insensitive' } } }
            ]
          }
        : {})
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.competitionStanding.findMany({
        where,
        include: TEAM_HONOR_STANDING_INCLUDE,
        orderBy: [
          { edition: { competition: { sortOrder: 'asc' } } },
          { edition: { year: 'asc' } },
          { standingOrder: 'asc' },
          { placement: 'asc' }
        ],
        skip: pagination.skip,
        take: pagination.take
      }),
      this.prisma.competitionStanding.count({ where })
    ]);

    return {
      items,
      page: pagination.page,
      pageSize: pagination.pageSize,
      total
    };
  }

  private async assertPlayerExists(id: string) {
    const player = await this.prisma.player.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!player) {
      throw new NotFoundException('球员不存在。');
    }

    return player;
  }

  private async assertAwardEditionExists(id: string) {
    const edition = await this.prisma.awardEdition.findUnique({
      where: { id },
      select: {
        id: true,
        award: {
          select: {
            targetType: true
          }
        }
      }
    });

    if (!edition) {
      throw new BadRequestException('奖项届次不存在。');
    }

    if (edition.award.targetType !== AwardTargetType.PLAYER) {
      throw new BadRequestException('球员详情只能绑定球员奖项。');
    }
  }

  private async assertPlayerAwardExists(id: string) {
    const award = await this.prisma.award.findUnique({
      where: { id },
      select: {
        id: true,
        targetType: true
      }
    });

    if (!award) {
      throw new BadRequestException('奖项不存在。');
    }

    if (award.targetType !== AwardTargetType.PLAYER) {
      throw new BadRequestException('球员详情只能绑定球员奖项。');
    }
  }

  private async assertAwardRecipientBelongsToPlayer(id: string, playerId: string) {
    const recipient = await this.prisma.awardRecipient.findUnique({
      where: { id },
      select: { id: true, targetType: true, playerId: true }
    });

    if (
      !recipient ||
      recipient.targetType !== AwardTargetType.PLAYER ||
      recipient.playerId !== playerId
    ) {
      throw new NotFoundException('球员奖项记录不存在。');
    }

    return recipient;
  }

  private buildAwardRecipientData(body: PlayerAwardRecipientPayload) {
    return {
      rank: this.optionalInteger(body.rank, '名次', 1, 999),
      placement: this.optionalText(body.placement),
      externalUrl: this.optionalText(body.externalUrl),
      remark: this.optionalText(body.remark)
    } satisfies Prisma.AwardRecipientUncheckedUpdateInput;
  }

  private async buildAwardRecipientGroupRows(
    awardId: string,
    recipients: PlayerAwardRecipientPayload[]
  ) {
    const editionIds = [
      ...new Set(
        recipients
          .map((recipient) => this.optionalText(recipient.editionId))
          .filter((editionId): editionId is string => Boolean(editionId))
      )
    ];

    if (!editionIds.length) {
      return [];
    }

    const editions = await this.prisma.awardEdition.findMany({
      where: {
        id: { in: editionIds },
        awardId,
        award: {
          targetType: AwardTargetType.PLAYER
        }
      },
      select: { id: true }
    });
    const existingIds = new Set(editions.map((edition) => edition.id));

    if (existingIds.size !== editionIds.length) {
      throw new BadRequestException('奖项届次不存在或不属于当前奖项。');
    }

    return recipients.flatMap((recipient) => {
      const editionId = this.optionalText(recipient.editionId);

      if (!editionId) {
        return [];
      }

      return [
        {
          editionId,
          data: this.buildAwardRecipientData(recipient)
        }
      ];
    });
  }

  private async assertStandingExists(id: string) {
    const standing = await this.prisma.competitionStanding.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!standing) {
      throw new BadRequestException('赛事结果不存在。');
    }
  }

  private async assertCareerBelongsToPlayer(id: string, playerId: string) {
    const career = await this.prisma.playerCareer.findUnique({
      where: { id },
      select: { id: true, playerId: true }
    });

    if (!career || career.playerId !== playerId) {
      throw new BadRequestException('球员经历不存在。');
    }
  }

  private async assertTeamHonorBelongsToPlayer(id: string, playerId: string) {
    const honor = await this.prisma.playerTeamHonor.findUnique({
      where: { id },
      select: { id: true, playerId: true, standingId: true }
    });

    if (!honor || honor.playerId !== playerId) {
      throw new NotFoundException('球员关联荣誉不存在。');
    }

    return honor;
  }

  private async buildTeamHonorData(playerId: string, body: PlayerTeamHonorPayload) {
    const careerId = this.optionalText(body.careerId);

    if (careerId) {
      await this.assertCareerBelongsToPlayer(careerId, playerId);
    }

    return {
      careerId,
      sourceType: this.parseTeamHonorSourceType(body.sourceType),
      status: this.parseTeamHonorStatus(body.status),
      remark: this.optionalText(body.remark)
    } satisfies Prisma.PlayerTeamHonorUncheckedUpdateInput;
  }

  private parseTeamHonorSourceType(value?: PlayerTeamHonorPayload['sourceType']) {
    if (!value) {
      return PlayerTeamHonorSourceType.MANUAL;
    }

    if (!Object.values(PlayerTeamHonorSourceType).includes(value)) {
      throw new BadRequestException('关联荣誉来源不合法。');
    }

    return value;
  }

  private parseTeamHonorStatus(value?: PlayerTeamHonorPayload['status']) {
    if (!value) {
      return PlayerTeamHonorStatus.CONFIRMED;
    }

    if (!Object.values(PlayerTeamHonorStatus).includes(value)) {
      throw new BadRequestException('关联荣誉状态不合法。');
    }

    return value;
  }

  private parseOptionalCompetitionTargetType(value?: TeamHonorStandingOptionQuery['targetType']) {
    if (!value) {
      return undefined;
    }

    if (!Object.values(CompetitionTargetType).includes(value)) {
      throw new BadRequestException('赛事对象不合法。');
    }

    return value;
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

  private buildHonorSummaryWhere(query: PlayerHonorSummaryQuery): Prisma.PlayerWhereInput {
    const keyword = query.keyword?.trim();
    const position = query.position?.trim();
    const andConditions: Prisma.PlayerWhereInput[] = [];

    if (keyword) {
      andConditions.push({
        OR: [
          { chineseName: { contains: keyword, mode: 'insensitive' } },
          { englishName: { contains: keyword, mode: 'insensitive' } },
          { uid: { contains: keyword, mode: 'insensitive' } },
          { nationality: { contains: keyword, mode: 'insensitive' } },
          { representedCountry: { contains: keyword, mode: 'insensitive' } },
          { primaryClub: { contains: keyword, mode: 'insensitive' } },
          { club: { name: { contains: keyword, mode: 'insensitive' } } },
          { club: { uid: { contains: keyword, mode: 'insensitive' } } },
          { careers: { some: { club: { name: { contains: keyword, mode: 'insensitive' } } } } },
          { careers: { some: { club: { uid: { contains: keyword, mode: 'insensitive' } } } } },
          {
            teamHonors: {
              some: {
                standing: {
                  club: { name: { contains: keyword, mode: 'insensitive' } }
                }
              }
            }
          },
          {
            teamHonors: {
              some: {
                standing: {
                  club: { uid: { contains: keyword, mode: 'insensitive' } }
                }
              }
            }
          }
        ]
      });
    }

    if (query.confederationId) {
      andConditions.push({
        OR: [
          { confederationId: query.confederationId },
          { country: { federationId: query.confederationId } },
          {
            careers: {
              some: {
                OR: [
                  { country: { federationId: query.confederationId } },
                  { club: { federationId: query.confederationId } }
                ]
              }
            }
          },
          {
            teamHonors: {
              some: {
                standing: {
                  OR: [
                    { country: { federationId: query.confederationId } },
                    { club: { federationId: query.confederationId } }
                  ]
                }
              }
            }
          }
        ]
      });
    }

    if (query.countryId) {
      andConditions.push({
        OR: [
          { countryId: query.countryId },
          { careers: { some: { countryId: query.countryId } } },
          {
            teamHonors: {
              some: {
                standing: {
                  countryId: query.countryId
                }
              }
            }
          }
        ]
      });
    }

    if (query.clubId) {
      andConditions.push({
        OR: [
          { clubId: query.clubId },
          { initialClubId: query.clubId },
          { careers: { some: { clubId: query.clubId } } },
          {
            teamHonors: {
              some: {
                standing: {
                  clubId: query.clubId
                }
              }
            }
          }
        ]
      });
    }

    if (position) {
      andConditions.push({
        OR: [
          { primaryRole: { contains: position, mode: 'insensitive' } },
          { positions: { contains: position, mode: 'insensitive' } },
          { careers: { some: { position: { contains: position, mode: 'insensitive' } } } },
          {
            careers: {
              some: { positionGroup: { contains: position, mode: 'insensitive' } }
            }
          }
        ]
      });
    }

    return andConditions.length ? { AND: andConditions } : {};
  }

  private buildPlayerHonorSummaryRow(
    player: PlayerHonorSummaryPlayer,
    awardRules: PlayerAwardRule[],
    honorRules: PlayerHonorRule[]
  ) {
    const scores = this.createEmptyPlayerHonorScores();
    const scoreDetails = this.createEmptyPlayerHonorScoreDetails();
    const awardScore = this.addPlayerAwardScores(
      scores,
      scoreDetails,
      player.awardRecipients,
      awardRules,
      honorRules
    );
    const teamHonorScore = this.addPlayerTeamHonorScores(
      scores,
      scoreDetails,
      player.teamHonors,
      honorRules
    );
    const totalScore = this.round(awardScore + teamHonorScore);

    return {
      id: player.id,
      uid: player.uid,
      chineseName: player.chineseName,
      englishName: player.englishName,
      pa: player.pa,
      primaryRole: player.primaryRole,
      positions: player.positions,
      country: player.country,
      club: player.club,
      awardCount: player.awardRecipients.length,
      teamHonorCount: player.teamHonors.length,
      awardScore: this.round(awardScore),
      teamHonorScore: this.round(teamHonorScore),
      totalScore,
      scores,
      scoreDetails
    };
  }

  private buildPlayerHonorListRow(player: PlayerHonorSummaryPlayer) {
    const entryMap = this.createEmptyPlayerHonorListEntryMap();
    const hideLowerDomesticLeagueHonors = this.shouldHideLowerDomesticLeagueHonors(player);

    for (const recipient of player.awardRecipients) {
      const award = recipient.edition.award;
      if (this.shouldHideHonorListAward(award, hideLowerDomesticLeagueHonors)) {
        continue;
      }

      const period = this.resolveAwardEditionPeriod(recipient.edition);

      this.addPlayerHonorListEntry(entryMap, this.resolveHonorListAwardColumn(award), {
        title: this.formatHonorListAwardTitle(recipient),
        subjectName: null,
        periods: [
          {
            label: period,
            sortYear: recipient.edition.year ?? this.resolveSortYear(period),
            placement: this.formatAwardRecipientPlacement(recipient)
          }
        ],
        sortOrder: award.sortOrder
      });
    }

    for (const teamHonor of player.teamHonors) {
      const standing = teamHonor.standing;
      const competition = standing.edition.competition;
      if (this.shouldHideHonorListCompetition(competition, hideLowerDomesticLeagueHonors)) {
        continue;
      }

      const period =
        standing.edition.season || String(standing.edition.year ?? standing.edition.name);

      this.addPlayerHonorListEntry(entryMap, this.resolveHonorListTeamColumn(competition), {
        title: this.formatEntityDisplayName(competition),
        subjectName: this.resolveTeamHonorListSubject(player, teamHonor),
        periods: [
          {
            label: period,
            sortYear: standing.edition.year ?? this.resolveSortYear(period),
            placement: this.formatStandingPlacement(standing.placement)
          }
        ],
        sortOrder: competition.sortOrder
      });
    }

    return {
      id: player.id,
      uid: player.uid,
      chineseName: player.chineseName,
      englishName: player.englishName,
      birthDate: player.birthDate,
      pa: player.pa,
      primaryRole: player.primaryRole,
      positions: player.positions,
      country: player.country,
      club: player.club,
      countryTeams: this.buildPlayerHonorListCountryTeams(player),
      trophyClubs: this.buildPlayerHonorListTrophyClubs(player),
      cells: this.toPlayerHonorListCells(entryMap)
    };
  }

  private createEmptyPlayerHonorListEntryMap() {
    return PLAYER_HONOR_LIST_COLUMNS.reduce(
      (map, column) => {
        map[column.key] = new Map<string, PlayerHonorListEntry>();
        return map;
      },
      {} as Record<PlayerHonorListColumnKey, Map<string, PlayerHonorListEntry>>
    );
  }

  private addPlayerHonorListEntry(
    entryMap: Record<PlayerHonorListColumnKey, Map<string, PlayerHonorListEntry>>,
    columnKey: PlayerHonorListColumnKey,
    entry: PlayerHonorListEntry
  ) {
    const key = `${entry.title}::${entry.subjectName ?? ''}`;
    const existing = entryMap[columnKey].get(key);

    if (existing) {
      existing.periods.push(...entry.periods);
      return;
    }

    entryMap[columnKey].set(key, entry);
  }

  private toPlayerHonorListCells(
    entryMap: Record<PlayerHonorListColumnKey, Map<string, PlayerHonorListEntry>>
  ): PlayerHonorListCellMap {
    return PLAYER_HONOR_LIST_COLUMNS.reduce((cells, column) => {
      const entries = [...entryMap[column.key].values()]
        .map((entry) => ({
          ...entry,
          periods: this.dedupeAndSortHonorPeriods(entry.periods)
        }))
        .sort(
          (left, right) =>
            (left.periods[0]?.sortYear ?? 0) - (right.periods[0]?.sortYear ?? 0) ||
            left.sortOrder - right.sortOrder ||
            left.title.localeCompare(right.title, 'zh-CN')
        );
      const items =
        column.sourceType === 'AWARD'
          ? this.formatAwardHonorListEntries(entries, column)
          : entries.map((entry) => this.formatHonorListEntry(entry, column));

      cells[column.key] = {
        text: items.join(column.sourceType === 'AWARD' ? '，' : '；'),
        items
      };

      return cells;
    }, {} as PlayerHonorListCellMap);
  }

  private dedupeAndSortHonorPeriods(periods: PlayerHonorListEntry['periods']) {
    const uniquePeriods = new Map<string, (typeof periods)[number]>();

    for (const period of periods) {
      uniquePeriods.set(`${period.label}::${period.placement ?? ''}`, period);
    }

    return [...uniquePeriods.values()].sort(
      (left, right) => left.sortYear - right.sortYear || left.label.localeCompare(right.label)
    );
  }

  private formatHonorListEntry(entry: PlayerHonorListEntry, column: PlayerHonorListColumn) {
    const placementGroups = new Map<string, PlayerHonorListEntry['periods']>();
    const title = this.formatHonorListTitle(entry.title, column);

    for (const period of entry.periods) {
      const placement = this.resolveVisibleHonorPlacement(period.placement, entry.title);
      const group = placementGroups.get(placement ?? '') ?? [];
      group.push(period);
      placementGroups.set(placement ?? '', group);
    }

    const segments = [...placementGroups.entries()].map(([placement, periods]) => {
      const periodText = periods.map((period) => period.label).join('、');
      const subjectText = this.formatHonorListSubject(entry.subjectName, periods.length);
      const placementText = placement ? ` ${placement}` : '';
      const honorText = `${subjectText}${title}`.trim();

      return `${periodText}${honorText ? ` ${honorText}` : ''}${placementText}`;
    });

    return segments.join('，');
  }

  private formatEntityDisplayName(entity: { name: string; shortName?: string | null }) {
    return entity.shortName?.trim() || entity.name;
  }

  /**
   * 荣誉清单展示压缩：同一球员已经有 2 种以上国内一级联赛奖杯时，
   * 国内二级/以下联赛奖杯及其赛事绑定奖项不再展示，避免低级联赛把清单撑得过长。
   */
  private shouldHideLowerDomesticLeagueHonors(player: PlayerHonorSummaryPlayer) {
    const primaryDomesticLeagueCompetitionIds = new Set<string>();

    for (const teamHonor of player.teamHonors) {
      const competition = teamHonor.standing.edition.competition;

      if (
        this.resolveTeamHonorScoreBucket(competition) === 'domesticLeagueScore' &&
        competition.level === '一级'
      ) {
        primaryDomesticLeagueCompetitionIds.add(competition.id);
      }
    }

    return primaryDomesticLeagueCompetitionIds.size > 1;
  }

  private shouldHideHonorListAward(
    award: PlayerAwardRecipientRecord['edition']['award'],
    hideLowerDomesticLeagueHonors: boolean
  ) {
    return (
      hideLowerDomesticLeagueHonors &&
      Boolean(award.competition && this.shouldHideHonorListCompetition(award.competition, true))
    );
  }

  private shouldHideHonorListCompetition(
    competition: PlayerAwardCompetition | PlayerHonorCompetition,
    hideLowerDomesticLeagueHonors: boolean
  ) {
    return (
      hideLowerDomesticLeagueHonors &&
      this.resolveTeamHonorScoreBucket(competition) === 'domesticLeagueScore' &&
      competition.level !== '一级'
    );
  }

  /**
   * 荣誉清单只负责展示文本，不影响计分或原始记录。
   * 规则：
   * - 奖项/赛事名称优先使用 shortName，缺省回退 name。
   * - 列语境已表达“世界杯/洲际杯”等分组时，正文去掉重复前缀。
   * - 同一奖项多年份优先按奖项合并；剩余单年奖项再按年份合并。
   * - 只有多次时才显示“2次 / 3次”。
   * - 特殊奖项可在生成清单标题时转换名次，例如世界杯金球奖第二名展示为银球奖。
   */
  private formatAwardHonorListEntries(
    entries: PlayerHonorListEntry[],
    column: PlayerHonorListColumn
  ) {
    const units = entries.flatMap((entry) => this.toAwardHonorListUnits(entry, column));
    const titleGroups = new Map<string, PlayerHonorListUnit[]>();

    for (const unit of units) {
      const group = titleGroups.get(unit.title) ?? [];
      group.push(unit);
      titleGroups.set(unit.title, group);
    }

    const consumed = new Set<PlayerHonorListUnit>();
    const outputs: Array<{ text: string; sortYear: number; sortOrder: number; title: string }> = [];

    for (const [title, group] of titleGroups.entries()) {
      if (group.length <= 1) {
        continue;
      }

      group.forEach((unit) => consumed.add(unit));
      const sortedGroup = [...group].sort(
        (left, right) => left.sortYear - right.sortYear || left.label.localeCompare(right.label)
      );
      const periodText = sortedGroup.map((unit) => unit.label).join('、');
      const countText = sortedGroup.length > 1 ? `${sortedGroup.length}次` : '';

      outputs.push({
        text: `${periodText} ${countText}${title}`.trim(),
        sortYear: sortedGroup[0]?.sortYear ?? 0,
        sortOrder: Math.min(...sortedGroup.map((unit) => unit.sortOrder)),
        title
      });
    }

    const yearGroups = new Map<string, PlayerHonorListUnit[]>();
    for (const unit of units) {
      if (consumed.has(unit)) {
        continue;
      }

      const group = yearGroups.get(unit.label) ?? [];
      group.push(unit);
      yearGroups.set(unit.label, group);
    }

    for (const [label, group] of yearGroups.entries()) {
      group.forEach((unit) => consumed.add(unit));
      const sortedGroup = [...group].sort(
        (left, right) =>
          left.sortOrder - right.sortOrder ||
          left.sortYear - right.sortYear ||
          left.title.localeCompare(right.title, 'zh-CN')
      );

      outputs.push({
        text:
          group.length > 1
            ? `${label} ${this.combineHonorListTitles(sortedGroup.map((unit) => unit.title))}`
            : `${label} ${sortedGroup[0]?.title ?? ''}`.trim(),
        sortYear: sortedGroup[0]?.sortYear ?? 0,
        sortOrder: Math.min(...sortedGroup.map((unit) => unit.sortOrder)),
        title: sortedGroup[0]?.title ?? ''
      });
    }

    return outputs
      .sort(
        (left, right) =>
          left.sortYear - right.sortYear ||
          left.sortOrder - right.sortOrder ||
          left.title.localeCompare(right.title, 'zh-CN')
      )
      .map((item) => item.text);
  }

  private toAwardHonorListUnits(entry: PlayerHonorListEntry, column: PlayerHonorListColumn) {
    const title = this.formatHonorListTitle(entry.title, column);

    return entry.periods.map((period) => {
      const placement = this.resolveVisibleHonorPlacement(period.placement, entry.title);
      const placementText = placement ? ` ${placement}` : '';

      return {
        title: `${title}${placementText}`.trim(),
        label: period.label,
        sortYear: period.sortYear,
        sortOrder: entry.sortOrder
      };
    });
  }

  private formatHonorListTitle(title: string, column: PlayerHonorListColumn) {
    const group = column.group.trim();

    if (!group || group === '奖项' || group === '个人其他') {
      return title;
    }

    if (title === group) {
      return '';
    }

    return title.startsWith(group) ? title.slice(group.length).trim() : title;
  }

  private combineHonorListTitles(titles: string[]) {
    const uniqueTitles = [...new Set(titles.filter(Boolean))];

    if (uniqueTitles.length <= 1) {
      return uniqueTitles[0] ?? '';
    }

    const prefix = this.resolveHonorTitleMergePrefix(uniqueTitles);

    if (!prefix) {
      return uniqueTitles.join('、');
    }

    return `${prefix}${uniqueTitles.map((title) => title.slice(prefix.length)).join('、')}`;
  }

  private resolveHonorTitleMergePrefix(titles: string[]) {
    const bestAwardIndex = titles[0]?.indexOf('最佳') ?? -1;

    if (bestAwardIndex > 0 && titles.every((title) => title.indexOf('最佳') === bestAwardIndex)) {
      return titles[0].slice(0, bestAwardIndex);
    }

    let prefix = titles[0] ?? '';

    for (const title of titles.slice(1)) {
      while (prefix && !title.startsWith(prefix)) {
        prefix = prefix.slice(0, -1);
      }
    }

    return prefix.length >= 2 ? prefix : '';
  }

  private resolveHonorListAwardColumn(
    award: PlayerAwardRecipientRecord['edition']['award']
  ): PlayerHonorSummaryScoreKey {
    if (award.competition) {
      const teamBucket = this.resolveTeamHonorScoreBucket(award.competition);

      if (teamBucket === 'worldCupScore') return 'worldCupAward';
      if (teamBucket === 'continentalCupScore') return 'continentalCupAward';
      if (teamBucket === 'continentalLeagueScore') return 'continentalLeagueAward';
      if (teamBucket === 'domesticLeagueScore') return 'domesticLeagueAward';
      if (teamBucket === 'domesticCupScore') return 'domesticCupAward';
      if (award.competition.targetType === CompetitionTargetType.COUNTRY) {
        return 'otherCountryAward';
      }

      return 'otherClubAward';
    }

    if (award.scopeType === AwardScopeType.WORLD) return 'worldAward';
    if (award.scopeType === AwardScopeType.CONFEDERATION) return 'continentalAward';
    if (award.scopeType === AwardScopeType.COUNTRY) return 'countryAward';

    return 'mediaAward';
  }

  private resolveHonorListTeamColumn(
    competition: PlayerAwardCompetition | PlayerHonorCompetition
  ): PlayerHonorSummaryScoreKey {
    const teamBucket = this.resolveTeamHonorScoreBucket(competition);

    if (teamBucket === 'worldCupScore') return 'worldCupTrophy';
    if (teamBucket === 'continentalCupScore') return 'continentalCupTrophy';
    if (teamBucket === 'continentalLeagueScore') return 'continentalLeagueTrophy';
    if (teamBucket === 'domesticLeagueScore') return 'domesticLeagueTrophy';
    if (teamBucket === 'domesticCupScore') return 'domesticCupTrophy';
    if (competition.targetType === CompetitionTargetType.COUNTRY) return 'otherCountryTrophy';

    return 'otherClubTrophy';
  }

  private formatAwardRecipientPlacement(recipient: PlayerAwardRecipientRecord) {
    if (recipient.edition.award.code === FIFA_WORLD_CUP_GOLDEN_BALL_CODE) {
      return null;
    }

    const placement = recipient.placement?.trim();

    if (placement) {
      return placement;
    }

    return recipient.rank ? this.formatAwardRank(recipient.rank) : null;
  }

  private formatHonorListAwardTitle(recipient: PlayerAwardRecipientRecord) {
    const award = recipient.edition.award;

    if (award.code === FIFA_WORLD_CUP_GOLDEN_BALL_CODE) {
      const specialLabel = this.resolveWorldCupGoldenBallLabel(recipient);

      if (specialLabel) {
        return `世界杯${specialLabel}`;
      }
    }

    return this.formatEntityDisplayName(award);
  }

  private resolveWorldCupGoldenBallLabel(
    recipient: Pick<PlayerAwardRecipientRecord, 'rank' | 'placement'>
  ) {
    if (recipient.rank === 1) return '金球奖';
    if (recipient.rank === 2) return '银球奖';
    if (recipient.rank === 3) return '铜球奖';

    const normalizedPlacement = (recipient.placement ?? '').replace(/\s+/g, '').trim();

    if (['第一名', '第1名', '1', '金球奖'].includes(normalizedPlacement)) return '金球奖';
    if (['第二名', '第2名', '2', '银球奖'].includes(normalizedPlacement)) return '银球奖';
    if (['第三名', '第3名', '3', '铜球奖'].includes(normalizedPlacement)) return '铜球奖';

    return null;
  }

  private formatAwardRank(rank: number) {
    const rankLabels: Record<number, string> = {
      1: '第一名',
      2: '第二名',
      3: '第三名',
      4: '第四名'
    };

    return rankLabels[rank] ?? `第${rank}名`;
  }

  private formatStandingPlacement(placement: CompetitionStandingPlacement) {
    if (placement === CompetitionStandingPlacement.CHAMPION) return '冠军';
    if (placement === CompetitionStandingPlacement.RUNNER_UP) return '亚军';
    if (placement === CompetitionStandingPlacement.THIRD_PLACE) return '季军';
    if (placement === CompetitionStandingPlacement.FOURTH_PLACE) return '殿军';
    if (placement === CompetitionStandingPlacement.SEMI_FINALIST) return '四强';

    return placement;
  }

  private resolveVisibleHonorPlacement(placement: string | null, title: string) {
    const normalizedPlacement = this.normalizeText(placement);

    if (
      !normalizedPlacement ||
      [
        '冠军',
        '第一名',
        '第1名',
        '1',
        '获奖',
        '优胜者',
        '金奖',
        '金球奖',
        '最佳球员',
        '入选'
      ].includes(normalizedPlacement)
    ) {
      return null;
    }

    const normalizedTitle = this.normalizeText(title);
    const dedupedPlacement = normalizedPlacement.replace(/^并列/, '');

    if (dedupedPlacement && normalizedTitle.includes(dedupedPlacement)) {
      return null;
    }

    return placement;
  }

  private formatHonorListSubject(subjectName: string | null, count: number) {
    if (!subjectName) {
      return '';
    }

    return count > 1 ? `${subjectName}${count}次` : subjectName;
  }

  private resolveTeamHonorListSubject(
    player: PlayerHonorSummaryPlayer,
    teamHonor: PlayerTeamHonorRecord
  ) {
    const standing = teamHonor.standing;

    if (standing.club?.name) {
      return standing.club.name;
    }

    if (
      standing.country?.name &&
      !this.hasSingleRepresentativeCountry(player, standing.country.id)
    ) {
      return standing.country.name;
    }

    return null;
  }

  private hasSingleRepresentativeCountry(player: PlayerHonorSummaryPlayer, countryId: string) {
    const countryIds = new Set(
      player.careers
        .filter((career) => career.careerType === PlayerCareerType.COUNTRY && career.countryId)
        .map((career) => career.countryId)
    );

    if (!countryIds.size && player.countryId) {
      countryIds.add(player.countryId);
    }

    return countryIds.size === 1 && countryIds.has(countryId);
  }

  private buildPlayerHonorListCountryTeams(player: PlayerHonorSummaryPlayer) {
    const countryCareers = player.careers
      .filter((career) => career.careerType === PlayerCareerType.COUNTRY && career.country)
      .map((career) => ({
        id: career.country?.id ?? null,
        name: career.country?.name ?? null,
        federationRef: career.country?.federationRef ?? null,
        period: this.formatCompactCareerPeriod(career)
      }));

    if (countryCareers.length) {
      return this.dedupeHonorTeamRefs(countryCareers);
    }

    return player.country
      ? [
          {
            id: player.country.id,
            name: player.country.name,
            federationRef: player.country.federationRef ?? null,
            period: null
          }
        ]
      : [];
  }

  private buildPlayerHonorListTrophyClubs(player: PlayerHonorSummaryPlayer) {
    const trophyClubIds = new Set(
      player.teamHonors
        .map((teamHonor) => teamHonor.standing.club?.id)
        .filter((id): id is string => Boolean(id))
    );
    const clubs = player.careers
      .filter(
        (career) =>
          career.careerType === PlayerCareerType.CLUB &&
          career.club &&
          trophyClubIds.has(career.club.id)
      )
      .map((career) => ({
        id: career.club?.id ?? null,
        name: career.club?.name ?? null,
        federationRef: career.club?.federationRef ?? null,
        period: this.formatCompactCareerPeriod(career)
      }));

    for (const teamHonor of player.teamHonors) {
      const club = teamHonor.standing.club;

      if (!club || clubs.some((item) => item.id === club.id)) {
        continue;
      }

      clubs.push({
        id: club.id,
        name: club.name,
        federationRef: club.federationRef ?? null,
        period: teamHonor.career ? this.formatCompactCareerPeriod(teamHonor.career) : null
      });
    }

    return this.dedupeHonorTeamRefs(clubs);
  }

  private dedupeHonorTeamRefs<
    T extends { id: string | null; name: string | null; period: string | null }
  >(refs: T[]) {
    const uniqueRefs = new Map<string, T>();

    for (const ref of refs) {
      const key = `${ref.id ?? ref.name ?? ''}::${ref.period ?? ''}`;

      if (ref.name && !uniqueRefs.has(key)) {
        uniqueRefs.set(key, ref);
      }
    }

    return [...uniqueRefs.values()];
  }

  private formatCompactCareerPeriod(career: {
    startYear?: number | null;
    endYear?: number | null;
    startSeason?: string | null;
    endSeason?: string | null;
  }) {
    if (career.startSeason || career.endSeason) {
      return [career.startSeason, career.endSeason].filter(Boolean).join('-') || null;
    }

    if (!career.startYear && !career.endYear) {
      return null;
    }

    if (career.startYear && career.endYear) {
      const endYearText =
        Math.floor(career.startYear / 100) === Math.floor(career.endYear / 100)
          ? String(career.endYear).slice(2)
          : String(career.endYear);

      return `${career.startYear}-${endYearText}`;
    }

    return career.startYear ? `${career.startYear}-` : `-${career.endYear}`;
  }

  private resolveSortYear(value?: string | null) {
    const match = value?.match(/\d{4}/);

    return match ? Number(match[0]) : 0;
  }

  private createEmptyPlayerHonorScores(): PlayerHonorSummaryScoreMap {
    return PLAYER_HONOR_SUMMARY_COLUMNS.reduce((scores, column) => {
      scores[column.key] = 0;
      return scores;
    }, {} as PlayerHonorSummaryScoreMap);
  }

  private createEmptyPlayerHonorScoreDetails(): PlayerHonorScoreDetailMap {
    return PLAYER_HONOR_SUMMARY_COLUMNS.reduce((details, column) => {
      details[column.key] = [];
      return details;
    }, {} as PlayerHonorScoreDetailMap);
  }

  private addPlayerAwardScores(
    scores: PlayerHonorSummaryScoreMap,
    scoreDetails: PlayerHonorScoreDetailMap,
    recipients: PlayerAwardRecipientRecord[],
    awardRules: PlayerAwardRule[],
    honorRules: PlayerHonorRule[]
  ) {
    const sortedRules = this.sortPlayerAwardRulesBySpecificity(awardRules);
    const scoredAwards: ScoredPlayerAward[] = [];
    const lineupGroups = new Set<string>();

    for (const recipient of recipients) {
      const rule = this.findMatchingPlayerAwardRule(sortedRules, {
        scopeType: recipient.edition.award.scopeType,
        category: recipient.edition.award.category,
        placement: recipient.placement,
        rank: recipient.rank
      });

      if (!rule) {
        continue;
      }

      const eventCoefficient = this.resolveEventAwardCoefficient({
        competition: recipient.edition.award.competition,
        competitionEdition: recipient.edition.competitionEdition,
        honorRules
      });
      const scoredAward = {
        playerId: recipient.playerId ?? '',
        scoreKey: this.resolveHonorListAwardColumn(recipient.edition.award),
        groupKey: this.buildAwardCombinationGroupKey({
          playerId: recipient.playerId ?? '',
          period: this.resolveAwardEditionPeriod(recipient.edition),
          scopeType: recipient.edition.award.scopeType,
          confederationId: recipient.edition.award.confederationId,
          countryId: recipient.edition.award.countryId,
          category: rule.category
        }),
        rule,
        score: rule.baseScore * rule.coefficient * eventCoefficient,
        detail: {
          label: this.resolveAwardEditionPeriod(recipient.edition),
          competitionName: this.formatHonorListAwardTitle(recipient),
          placementLabel: this.formatAwardRecipientPlacement(recipient),
          score: 0,
          placementScore: rule.baseScore,
          qualityCoefficient: rule.coefficient,
          conversionCoefficient: eventCoefficient,
          ruleName: rule.name,
          externalUrl:
            recipient.externalUrl ??
            recipient.edition.externalUrl ??
            recipient.edition.award.externalUrl ??
            null,
          sourceName: null
        }
      } satisfies ScoredPlayerAward;

      scoredAwards.push(scoredAward);

      if (this.isPlayerAwardLineupRule(rule)) {
        lineupGroups.add(scoredAward.groupKey);
      }
    }

    let total = 0;

    for (const award of scoredAwards) {
      const score =
        this.isPlayerAwardSpecialtyRule(award.rule) && lineupGroups.has(award.groupKey)
          ? award.score * 0.5
          : award.score;

      scores[award.scoreKey] = this.round(scores[award.scoreKey] + score);
      scoreDetails[award.scoreKey].push({
        ...award.detail,
        score: this.round(score)
      });
      total += score;
    }

    return this.round(total);
  }

  private addPlayerTeamHonorScores(
    scores: PlayerHonorSummaryScoreMap,
    scoreDetails: PlayerHonorScoreDetailMap,
    teamHonors: PlayerTeamHonorRecord[],
    honorRules: PlayerHonorRule[]
  ) {
    let total = 0;

    for (const teamHonor of teamHonors) {
      const standing = teamHonor.standing;
      const scoreDetail = this.resolveCompetitionStandingScoreDetail(
        honorRules,
        standing.edition.competition,
        standing.placement,
        standing.edition.year,
        standing.edition.quantity
      );

      if (!scoreDetail) {
        continue;
      }

      const scoreKey = this.resolveHonorListTeamColumn(standing.edition.competition);
      scores[scoreKey] = this.round(scores[scoreKey] + scoreDetail.score);
      scoreDetails[scoreKey].push({
        label: standing.edition.season || String(standing.edition.year ?? standing.edition.name),
        competitionName: this.formatEntityDisplayName(standing.edition.competition),
        placementLabel: this.formatStandingPlacement(standing.placement),
        score: scoreDetail.score,
        placementScore: scoreDetail.placementScore,
        qualityCoefficient: scoreDetail.qualityCoefficient,
        conversionCoefficient: scoreDetail.conversionCoefficient,
        ruleName: scoreDetail.ruleName,
        externalUrl: standing.edition.externalUrl ?? null,
        sourceName: standing.club?.name ?? standing.country?.name ?? null
      });
      total += scoreDetail.score;
    }

    return this.round(total);
  }

  private resolveTeamHonorScoreBucket(
    competition: PlayerAwardCompetition | PlayerHonorCompetition
  ): PlayerHonorScoreBucketKey {
    if (
      competition.targetType === CompetitionTargetType.COUNTRY &&
      competition.scopeType === CompetitionScopeType.GLOBAL &&
      competition.category === '国际' &&
      competition.level === '一级'
    ) {
      return 'worldCupScore';
    }

    if (
      competition.targetType === CompetitionTargetType.COUNTRY &&
      competition.category === '洲际'
    ) {
      return 'continentalCupScore';
    }

    if (competition.targetType === CompetitionTargetType.COUNTRY) {
      return 'countryCupScore';
    }

    if (competition.category === '国际') {
      return 'internationalClubScore';
    }

    if (competition.category === '洲际') {
      return 'continentalLeagueScore';
    }

    if (competition.category === '国内' && competition.format === '联赛') {
      return 'domesticLeagueScore';
    }

    if (competition.category === '国内' && competition.format === '杯赛') {
      return 'domesticCupScore';
    }

    return 'otherTeamHonorScore';
  }

  private sortPlayerAwardRulesBySpecificity(rules: PlayerAwardRule[]) {
    return [...rules].sort((left, right) => {
      const specificity =
        this.playerAwardRuleSpecificity(right) - this.playerAwardRuleSpecificity(left);

      if (specificity !== 0) {
        return specificity;
      }

      return left.sortOrder - right.sortOrder || left.name.localeCompare(right.name, 'zh-CN');
    });
  }

  private findMatchingPlayerAwardRule(
    rules: PlayerAwardRule[],
    recipient: {
      scopeType: AwardScopeType;
      category: string | null;
      placement: string | null;
      rank: number | null;
    }
  ) {
    return rules.find((rule) => {
      if (rule.scopeType && rule.scopeType !== recipient.scopeType) {
        return false;
      }

      if (
        rule.category &&
        this.normalizeText(rule.category) !== this.normalizeText(recipient.category)
      ) {
        return false;
      }

      if (rule.rank !== null && rule.rank !== recipient.rank) {
        return false;
      }

      if (rule.placement) {
        const placement = this.normalizeText(recipient.placement);
        const rulePlacement = this.normalizeText(rule.placement);

        if (!placement || !placement.includes(rulePlacement)) {
          return false;
        }
      }

      return true;
    });
  }

  private playerAwardRuleSpecificity(rule: PlayerAwardRule) {
    return [rule.scopeType, rule.category, rule.placement, rule.rank].filter(
      (item) => item !== null && item !== undefined && item !== ''
    ).length;
  }

  private resolveEventAwardCoefficient({
    competition,
    competitionEdition,
    honorRules
  }: {
    competition: PlayerAwardCompetition | null;
    competitionEdition: { year: number | null; quantity: number | null } | null;
    honorRules: PlayerHonorRule[];
  }) {
    if (!competition) {
      return 1;
    }

    const rule = this.findMatchingCompetitionHonorRule(honorRules, competition);

    if (!rule) {
      return 1;
    }

    return (
      this.resolveCompetitionQualityCoefficient(rule, competition) *
      this.resolveCompetitionConversionCoefficient(
        rule,
        competition,
        competitionEdition?.year ?? null,
        competitionEdition?.quantity ?? null
      )
    );
  }

  private resolveCompetitionStandingScoreDetail(
    rules: PlayerHonorRule[],
    competition: PlayerHonorCompetition,
    placement: CompetitionStandingPlacement,
    year: number | null,
    quantity: number | null
  ) {
    const rule = this.findMatchingCompetitionHonorRule(rules, competition, placement);

    if (!rule) {
      return null;
    }

    const placementScore = this.resolvePlacementScore(rule, placement);

    if (placementScore === null || placementScore <= 0) {
      return null;
    }

    const qualityCoefficient = this.resolveCompetitionQualityCoefficient(rule, competition);
    const conversionCoefficient = this.resolveCompetitionConversionCoefficient(
      rule,
      competition,
      year,
      quantity
    );

    return {
      score: this.round(placementScore * qualityCoefficient * conversionCoefficient),
      placementScore,
      qualityCoefficient: this.round(qualityCoefficient),
      conversionCoefficient: this.round(conversionCoefficient),
      ruleName: rule.name
    };
  }

  private findMatchingCompetitionHonorRule(
    rules: PlayerHonorRule[],
    competition: PlayerAwardCompetition | PlayerHonorCompetition,
    placement?: CompetitionStandingPlacement
  ) {
    return rules
      .filter((rule) => {
        if (!this.competitionHonorRuleMatches(rule, competition)) {
          return false;
        }

        return placement ? this.competitionHonorRuleAllowsPlacement(rule, placement) : true;
      })
      .sort(
        (left, right) =>
          this.competitionHonorRuleSpecificity(right) - this.competitionHonorRuleSpecificity(left)
      )[0];
  }

  private competitionHonorRuleMatches(
    rule: PlayerHonorRule,
    competition: PlayerAwardCompetition | PlayerHonorCompetition
  ) {
    return (
      rule.targetType === competition.targetType &&
      this.sameText(rule.category, competition.category) &&
      this.sameText(rule.level, competition.level) &&
      this.competitionFormatMatches(rule.format, competition) &&
      (!rule.scopeType || rule.scopeType === competition.scopeType) &&
      (!rule.confederationId ||
        this.competitionConfederationIds(competition).includes(rule.confederationId)) &&
      (!rule.countryId || this.competitionCountryIds(competition).includes(rule.countryId))
    );
  }

  private competitionFormatMatches(
    ruleFormat: string | null,
    competition: PlayerAwardCompetition | PlayerHonorCompetition
  ) {
    if (this.sameText(ruleFormat, competition.format)) {
      return true;
    }

    return (
      competition.format === '其他' && ruleFormat === '杯赛' && competition.category !== '国内'
    );
  }

  private competitionHonorRuleSpecificity(rule: PlayerHonorRule) {
    return [
      rule.confederationId,
      rule.countryId,
      rule.scopeType,
      rule.format,
      rule.level,
      rule.category
    ].filter(Boolean).length;
  }

  private resolvePlacementScore(rule: PlayerHonorRule, placement: CompetitionStandingPlacement) {
    if (!this.competitionHonorRuleAllowsPlacement(rule, placement)) {
      return null;
    }

    if (placement === CompetitionStandingPlacement.CHAMPION)
      return rule.championScore ?? rule.baseScore;
    if (placement === CompetitionStandingPlacement.RUNNER_UP) return rule.runnerUpScore;
    if (placement === CompetitionStandingPlacement.THIRD_PLACE) return rule.thirdPlaceScore;
    if (placement === CompetitionStandingPlacement.FOURTH_PLACE) return rule.fourthPlaceScore;
    if (placement === CompetitionStandingPlacement.SEMI_FINALIST) return rule.semiFinalistScore;

    return null;
  }

  private competitionHonorRuleAllowsPlacement(
    rule: PlayerHonorRule,
    placement: CompetitionStandingPlacement
  ) {
    if (placement === CompetitionStandingPlacement.CHAMPION) return true;

    if (placement === CompetitionStandingPlacement.RUNNER_UP) {
      return rule.placementScope !== HonorRulePlacementScope.CHAMPION_ONLY;
    }

    if (placement === CompetitionStandingPlacement.THIRD_PLACE) {
      const thirdPlaceScopes: HonorRulePlacementScope[] = [
        HonorRulePlacementScope.TOP_THREE,
        HonorRulePlacementScope.TOP_FOUR,
        HonorRulePlacementScope.LEAGUE_TOP_THREE
      ];

      return thirdPlaceScopes.includes(rule.placementScope);
    }

    if (placement === CompetitionStandingPlacement.FOURTH_PLACE) {
      return rule.placementScope === HonorRulePlacementScope.TOP_FOUR;
    }

    return rule.placementScope === HonorRulePlacementScope.TOP_FOUR;
  }

  private resolveCompetitionQualityCoefficient(
    rule: PlayerHonorRule,
    competition: PlayerAwardCompetition | PlayerHonorCompetition
  ) {
    const confederationIds = this.competitionConfederationIds(competition);
    const countryIds = this.competitionCountryIds(competition);
    const coefficient = rule.coefficients.find(
      (item) =>
        (item.confederationId && confederationIds.includes(item.confederationId)) ||
        (item.countryId && countryIds.includes(item.countryId))
    );

    return coefficient?.coefficient ?? rule.qualityCoefficient;
  }

  private resolveCompetitionConversionCoefficient(
    rule: PlayerHonorRule,
    competition: PlayerAwardCompetition | PlayerHonorCompetition,
    year: number | null,
    quantity: number | null
  ) {
    if (rule.conversionType === HonorRuleConversionType.FREQUENCY_SCALE) {
      return this.frequencyCoefficient(competition) * this.scaleCoefficient(competition, quantity);
    }

    if (rule.conversionType === HonorRuleConversionType.OLYMPIC_STAGE) {
      if (!year) return 1;
      if (year <= 1928) return 3;
      if (year <= 1980) return 2;
      if (year <= 1988) return 1.5;
      return 1;
    }

    if (rule.conversionType === HonorRuleConversionType.CLUB_WORLD_CUP_STAGE) {
      if (!year) return 1;
      return year < 2025 ? 0.5 : 1;
    }

    return 1;
  }

  private frequencyCoefficient(competition: PlayerAwardCompetition | PlayerHonorCompetition) {
    const years = competition.editions.map((edition) => edition.year).filter(this.isNumber);

    if (years.length < 2) {
      return 1;
    }

    const firstYear = Math.min(...years);
    const lastYear = Math.max(...years);
    const averageGap = (lastYear - firstYear) / (years.length - 1);

    return Math.min(averageGap / 4, 1);
  }

  private scaleCoefficient(
    competition: PlayerAwardCompetition | PlayerHonorCompetition,
    quantity: number | null
  ) {
    const resolvedQuantity =
      quantity ?? this.median(competition.editions.map((edition) => edition.quantity));

    if (!resolvedQuantity) return 1;
    if (resolvedQuantity >= 24) return 1;
    if (resolvedQuantity >= 16) return 0.9;
    if (resolvedQuantity >= 10) return 0.75;
    if (resolvedQuantity >= 8) return 0.65;
    if (resolvedQuantity >= 4) return 0.5;
    if (resolvedQuantity === 3) return 0.35;
    if (resolvedQuantity === 2) return 0.25;
    return 0;
  }

  private median(values: Array<number | null>) {
    const numbers = values.filter(this.isNumber).sort((left, right) => left - right);

    if (!numbers.length) return null;

    return numbers[Math.floor(numbers.length / 2)];
  }

  private competitionConfederationIds(
    competition: PlayerAwardCompetition | PlayerHonorCompetition
  ) {
    return [
      competition.confederationId,
      ...competition.scopeConfederations.map((item) => item.confederationId)
    ].filter(this.isString);
  }

  private competitionCountryIds(competition: PlayerAwardCompetition | PlayerHonorCompetition) {
    return [
      competition.countryId,
      ...competition.scopeCountries.map((item) => item.countryId)
    ].filter(this.isString);
  }

  private buildAwardCombinationGroupKey({
    playerId,
    period,
    scopeType,
    confederationId,
    countryId,
    category
  }: {
    playerId: string;
    period: string;
    scopeType: AwardScopeType;
    confederationId: string | null;
    countryId: string | null;
    category: string | null;
  }) {
    return [
      playerId,
      period,
      scopeType,
      confederationId ?? '',
      countryId ?? '',
      this.awardCategoryFamily(category)
    ].join('|');
  }

  private resolveAwardEditionPeriod(edition: {
    year: number | null;
    season: string | null;
    name: string;
  }) {
    return edition.year?.toString() ?? edition.season ?? edition.name;
  }

  private awardCategoryFamily(category: string | null) {
    return this.normalizeText(category)
      .replace(/一级综合奖|二级阵容奖|二级门将专项奖|二级专项奖|三级补充奖|一级奖/g, '')
      .replace(/\s+/g, '');
  }

  private isPlayerAwardLineupRule(rule: PlayerAwardRule) {
    return this.normalizeText(rule.category).includes('阵容奖');
  }

  private isPlayerAwardSpecialtyRule(rule: PlayerAwardRule) {
    const category = this.normalizeText(rule.category);

    return category.includes('专项奖') || category.includes('门将专项奖');
  }

  private sameText(left?: string | null, right?: string | null) {
    return (left?.trim() ?? '') === (right?.trim() ?? '');
  }

  private normalizeText(value?: string | null) {
    return value?.trim().toLocaleLowerCase('zh-CN') ?? '';
  }

  private isNumber(value: number | null): value is number {
    return typeof value === 'number' && Number.isFinite(value);
  }

  private isString(value: string | null): value is string {
    return typeof value === 'string' && Boolean(value);
  }

  private round(value: number) {
    return Math.round(value * 100) / 100;
  }

  private async buildPlayerData(body: PlayerPayload): Promise<{
    data: Pick<
      Prisma.PlayerUncheckedCreateInput,
      | 'uid'
      | 'chineseName'
      | 'englishName'
      | 'birthDate'
      | 'deathDate'
      | 'countryId'
      | 'countryUid'
      | 'representedCountry'
      | 'nationality'
      | 'birthCityUid'
      | 'birthCity'
      | 'birthCountryId'
      | 'birthCityId'
      | 'clubId'
      | 'clubUid'
      | 'primaryClub'
      | 'initialClubId'
      | 'initialClub'
      | 'clubs'
      | 'confederationId'
      | 'confederation'
      | 'positions'
      | 'primaryRole'
      | 'playerTypeId'
      | 'playerType'
      | 'ethnicityId'
      | 'ethnicity'
      | 'hairColorId'
      | 'hairColor'
      | 'preferredFootId'
      | 'foot'
      | 'pa'
      | 'ca'
      | 'height'
      | 'weight'
      | 'shirtNumber'
      | 'skinTone'
      | 'marketValue'
      | 'retired'
      | 'deceased'
      | 'databaseSource'
      | 'staffRoles'
      | 'achievement'
      | 'externalUrl'
      | 'remark'
    >;
    nationalityIds: string[];
    careers?: Prisma.PlayerCareerUncheckedCreateWithoutPlayerInput[];
  }> {
    const uid = this.requiredText(body.uid, 'UID');
    const chineseName = this.requiredText(body.chineseName, '球员中文名');
    const country = await this.findCountry(body.countryId);
    const birthCountry = await this.findCountry(body.birthCountryId);
    const birthCity = await this.findCity(body.birthCityId);
    const club = await this.findClub(body.clubId);
    const initialClub = await this.findClub(body.initialClubId);
    const playerType = await this.findPlayerType(body.playerTypeId);
    const ethnicity = await this.findEthnicity(body.ethnicityId);
    const hairColor = await this.findHairColor(body.hairColorId);
    const preferredFoot = await this.findPreferredFoot(body.preferredFootId);
    const nationalityIds = await this.resolveNationalityIds(body.nationalityIds, country?.id);
    const primaryRole = this.optionalText(body.primaryRole ?? body.position);
    const positions = this.optionalText(body.positions ?? body.position ?? body.primaryRole);
    const clubHistory = await this.resolveClubHistoryText(body.clubHistoryIds, body.clubs);
    const nationality = await this.resolveNationalityText(nationalityIds);
    const finalBirthCountryId = birthCountry?.id ?? birthCity?.countryId ?? null;
    const deathDate = this.optionalDate(body.deathDate, '过世日期');
    const federationId = country?.federationId ?? club?.federationId ?? null;
    const federationName = country?.federation ?? club?.federation ?? null;

    return {
      data: {
        uid,
        chineseName,
        englishName: this.optionalText(body.englishName),
        birthDate: this.optionalDate(body.birthDate, '生日'),
        deathDate,
        countryId: country?.id ?? null,
        countryUid: country?.uid ?? null,
        representedCountry: country?.name ?? null,
        nationality,
        birthCountryId: finalBirthCountryId,
        birthCityId: birthCity?.id ?? null,
        birthCityUid: birthCity?.uid ?? null,
        birthCity: birthCity?.name ?? null,
        clubId: club?.id ?? null,
        clubUid: club?.uid ?? null,
        primaryClub: club?.name ?? null,
        initialClubId: initialClub?.id ?? null,
        initialClub: initialClub?.name ?? this.optionalText(body.initialClub),
        clubs: clubHistory,
        confederationId: federationId,
        confederation: federationName,
        positions,
        primaryRole,
        playerTypeId: playerType?.id ?? null,
        playerType: playerType?.name ?? null,
        ethnicityId: ethnicity?.id ?? null,
        ethnicity: ethnicity?.name ?? null,
        hairColorId: hairColor?.id ?? null,
        hairColor: hairColor?.name ?? null,
        preferredFootId: preferredFoot?.id ?? null,
        foot: this.optionalText(body.foot) ?? preferredFoot?.name ?? null,
        pa: this.optionalInteger(body.pa, 'PA', 0, 250),
        ca: this.optionalInteger(body.ca, 'CA', 0, 250),
        height: this.optionalInteger(body.height, '身高', 0, 300),
        weight: this.optionalInteger(body.weight, '体重', 0, 300),
        shirtNumber: this.optionalText(body.shirtNumber),
        skinTone: this.optionalText(body.skinTone),
        marketValue: this.optionalFloat(body.marketValue, '市场价值', 0),
        retired: this.optionalBoolean(body.retired),
        deceased: Boolean(deathDate),
        databaseSource: this.optionalText(body.databaseSource),
        staffRoles: this.optionalText(body.staffRoles),
        achievement: this.optionalText(body.achievement),
        externalUrl: this.optionalText(body.externalUrl),
        remark: this.optionalText(body.remark)
      },
      nationalityIds,
      careers: body.careers ? await this.buildCareerData(body.careers) : undefined
    };
  }

  private async buildCareerData(
    careers: PlayerCareerPayload[]
  ): Promise<Prisma.PlayerCareerUncheckedCreateWithoutPlayerInput[]> {
    const rows: Prisma.PlayerCareerUncheckedCreateWithoutPlayerInput[] = [];
    let representativeClubCount = 0;

    for (const [index, career] of careers.entries()) {
      const careerType = this.parseCareerType(career.careerType);
      const club =
        careerType === PlayerCareerType.CLUB ? await this.findClub(career.clubId ?? '') : null;
      const country =
        careerType === PlayerCareerType.COUNTRY
          ? await this.findCountry(career.countryId ?? '')
          : null;
      const showInProfile = this.optionalBoolean(career.showInProfile) ?? true;
      const isRepresentative =
        careerType === PlayerCareerType.CLUB
          ? (this.optionalBoolean(career.isRepresentative) ?? false)
          : false;
      const isLegend =
        careerType === PlayerCareerType.CLUB
          ? (this.optionalBoolean(career.isLegend) ?? false)
          : false;

      if (isRepresentative) {
        representativeClubCount += 1;
      }

      rows.push({
        careerType,
        clubId: club?.id ?? null,
        countryId: country?.id ?? null,
        startYear: this.optionalInteger(career.startYear, '开始年份', 1800, 2200),
        endYear: this.optionalInteger(career.endYear, '结束年份', 1800, 2200),
        startSeason: this.optionalText(career.startSeason),
        endSeason: this.optionalText(career.endSeason),
        appearances: this.optionalInteger(career.appearances, '场次', 0, 10000),
        goals: this.optionalInteger(career.goals, '进球', 0, 10000),
        assists: this.optionalInteger(career.assists, '助攻', 0, 10000),
        cleanSheets: this.optionalInteger(career.cleanSheets, '零封', 0, 10000),
        goalsConceded: this.optionalInteger(career.goalsConceded, '失球', 0, 10000),
        position: this.optionalText(career.position),
        positionGroup: this.optionalText(career.positionGroup),
        showInProfile,
        isRepresentative,
        isLegend,
        sortOrder: this.optionalInteger(career.sortOrder, '排序', 0, 9999) ?? index,
        remark: this.optionalText(career.remark)
      });
    }

    if (representativeClubCount > 1) {
      throw new BadRequestException('同一球员只能设置一个代表俱乐部。');
    }

    return rows;
  }

  private async findCountry(id?: string) {
    const cleanId = this.optionalText(id);

    if (!cleanId) {
      return null;
    }

    const country = await this.prisma.country.findUnique({
      where: { id: cleanId },
      select: { id: true, uid: true, name: true, federation: true, federationId: true }
    });

    if (!country) {
      throw new BadRequestException('国家不存在。');
    }

    return country;
  }

  private async findClub(id?: string) {
    const cleanId = this.optionalText(id);

    if (!cleanId) {
      return null;
    }

    const club = await this.prisma.club.findUnique({
      where: { id: cleanId },
      select: { id: true, uid: true, name: true, federation: true, federationId: true }
    });

    if (!club) {
      throw new BadRequestException('俱乐部不存在。');
    }

    return club;
  }

  private async findCity(id?: string) {
    const cleanId = this.optionalText(id);

    if (!cleanId) {
      return null;
    }

    const city = await this.prisma.city.findUnique({
      where: { id: cleanId },
      select: {
        id: true,
        uid: true,
        name: true,
        countryId: true
      }
    });

    if (!city) {
      throw new BadRequestException('出生城市不存在。');
    }

    return city;
  }

  private async resolveClubHistoryText(values?: string[], fallback?: string) {
    const ids = [
      ...new Set(
        (values ?? []).flatMap((value) => {
          const id = this.optionalText(value);

          return id ? [id] : [];
        })
      )
    ];

    if (Array.isArray(values) && ids.length === 0) {
      return null;
    }

    if (ids.length === 0) {
      return this.optionalText(fallback);
    }

    const clubs = await this.prisma.club.findMany({
      where: {
        id: {
          in: ids
        }
      },
      select: {
        id: true,
        name: true
      }
    });
    const nameById = new Map(clubs.map((club) => [club.id, club.name]));
    const missing = ids.find((id) => !nameById.has(id));

    if (missing) {
      throw new BadRequestException('球队经历中存在不存在的俱乐部。');
    }

    return ids.map((id) => nameById.get(id)).join('、') || null;
  }

  private async resolveNationalityIds(values?: string[], fallbackCountryId?: string) {
    const ids = [
      ...new Set(
        (values ?? []).flatMap((value) => {
          const id = this.optionalText(value);

          return id ? [id] : [];
        })
      )
    ];

    if (ids.length === 0 && fallbackCountryId) {
      return [fallbackCountryId];
    }

    if (ids.length === 0) {
      return [];
    }

    const countries = await this.prisma.country.findMany({
      where: {
        id: {
          in: ids
        }
      },
      select: {
        id: true
      }
    });
    const foundIds = new Set(countries.map((country) => country.id));
    const missing = ids.find((id) => !foundIds.has(id));

    if (missing) {
      throw new BadRequestException('国籍国家不存在。');
    }

    return ids;
  }

  private async resolveNationalityText(countryIds: string[]) {
    if (countryIds.length === 0) {
      return null;
    }

    const countries = await this.prisma.country.findMany({
      where: {
        id: {
          in: countryIds
        }
      },
      select: {
        id: true,
        name: true
      }
    });
    const nameById = new Map(countries.map((country) => [country.id, country.name]));

    return (
      countryIds
        .map((id) => nameById.get(id))
        .filter(Boolean)
        .join('、') || null
    );
  }

  private async replaceNationalities(
    tx: Prisma.TransactionClient,
    playerId: string,
    countryIds: string[]
  ) {
    await tx.playerNationality.deleteMany({
      where: {
        playerId
      }
    });

    if (countryIds.length === 0) {
      return;
    }

    await tx.playerNationality.createMany({
      data: countryIds.map((countryId) => ({
        playerId,
        countryId
      })),
      skipDuplicates: true
    });
  }

  private async replaceCareers(
    tx: Prisma.TransactionClient,
    playerId: string,
    careers: Prisma.PlayerCareerUncheckedCreateWithoutPlayerInput[]
  ) {
    await tx.playerCareer.deleteMany({
      where: {
        playerId
      }
    });

    if (careers.length === 0) {
      return;
    }

    await tx.playerCareer.createMany({
      data: careers.map((career) => ({
        ...career,
        playerId
      }))
    });
  }

  private attachCareerSummaries<
    T extends {
      careers?: Array<Prisma.PlayerCareerGetPayload<{ include: typeof PLAYER_CAREER_INCLUDE }>>;
      primaryClub?: string | null;
      clubs?: string | null;
    }
  >(player: T) {
    const careers = player.careers ?? [];
    const representativeClubCareer =
      careers.find(
        (career) => career.careerType === PlayerCareerType.CLUB && career.isRepresentative
      ) ?? null;
    const profileClubCareers = careers.filter(
      (career) => career.careerType === PlayerCareerType.CLUB && career.showInProfile
    );
    const countryCareers = careers.filter(
      (career) => career.careerType === PlayerCareerType.COUNTRY
    );

    return {
      ...player,
      representativeClubCareer,
      profileClubCareers,
      countryCareers,
      representativeClubName: representativeClubCareer?.club?.name ?? player.primaryClub ?? null,
      profileClubNames: profileClubCareers.length
        ? profileClubCareers.flatMap((career) => (career.club?.name ? [career.club.name] : []))
        : player.clubs
          ? [player.clubs]
          : []
    };
  }

  private async attachInitialClubRefs<
    T extends {
      initialClub?: string | null;
      initialClubRef?: Prisma.ClubGetPayload<{ select: typeof CLUB_NAME_REF_SELECT }> | null;
    }
  >(players: T[]) {
    const initialClubNames = Array.from(
      new Set(
        players
          .filter((player) => !player.initialClubRef)
          .map((player) => player.initialClub?.trim())
          .filter((name): name is string => Boolean(name))
      )
    );

    if (initialClubNames.length === 0) {
      return players.map((player) => ({
        ...player,
        initialClubRef: player.initialClubRef ?? null
      }));
    }

    const clubs = await this.prisma.club.findMany({
      where: {
        name: {
          in: initialClubNames
        },
        exists: true
      },
      select: CLUB_NAME_REF_SELECT,
      orderBy: [{ name: 'asc' }, { uid: 'asc' }]
    });
    const clubByName = new Map(clubs.map((club) => [club.name, club]));

    return players.map((player) => ({
      ...player,
      initialClubRef: player.initialClubRef
        ? player.initialClubRef
        : player.initialClub
          ? (clubByName.get(player.initialClub.trim()) ?? null)
          : null
    }));
  }

  private attachPlayerRelations<
    T extends {
      awardRecipients?: Array<
        Prisma.AwardRecipientGetPayload<{ include: typeof PLAYER_AWARD_RECIPIENT_INCLUDE }>
      >;
      teamHonors?: Array<
        Prisma.PlayerTeamHonorGetPayload<{ include: typeof PLAYER_TEAM_HONOR_INCLUDE }>
      >;
    }
  >(player: T) {
    return {
      ...player,
      personalHonors: player.awardRecipients ?? [],
      teamHonors: player.teamHonors ?? []
    };
  }

  private parseCareerType(value: PlayerCareerPayload['careerType']) {
    if (!value || !Object.values(PlayerCareerType).includes(value)) {
      throw new BadRequestException('经历类型不合法。');
    }

    return value;
  }

  private async findConfederation(id?: string) {
    const cleanId = this.optionalText(id);

    if (!cleanId) {
      return null;
    }

    const confederation = await this.prisma.confederation.findUnique({
      where: { id: cleanId },
      select: { id: true, name: true }
    });

    if (!confederation) {
      throw new BadRequestException('足联不存在。');
    }

    return confederation;
  }

  private async findPlayerType(id?: string) {
    const cleanId = this.optionalText(id);

    if (!cleanId) {
      return null;
    }

    const item = await this.prisma.playerType.findUnique({
      where: { id: cleanId },
      select: { id: true, name: true }
    });

    if (!item) {
      throw new BadRequestException('球员类型不存在。');
    }

    return item;
  }

  private async findEthnicity(id?: string) {
    const cleanId = this.optionalText(id);

    if (!cleanId) {
      return null;
    }

    const item = await this.prisma.ethnicity.findUnique({
      where: { id: cleanId },
      select: { id: true, name: true }
    });

    if (!item) {
      throw new BadRequestException('种族不存在。');
    }

    return item;
  }

  private async findHairColor(id?: string) {
    const cleanId = this.optionalText(id);

    if (!cleanId) {
      return null;
    }

    const item = await this.prisma.hairColor.findUnique({
      where: { id: cleanId },
      select: { id: true, name: true }
    });

    if (!item) {
      throw new BadRequestException('发色不存在。');
    }

    return item;
  }

  private async findPreferredFoot(id?: string) {
    const cleanId = this.optionalText(id);

    if (!cleanId) {
      return null;
    }

    const item = await this.prisma.preferredFoot.findUnique({
      where: { id: cleanId },
      select: { id: true, name: true }
    });

    if (!item) {
      throw new BadRequestException('惯用脚不存在。');
    }

    return item;
  }

  private async assertUniqueUid(uid: string, id?: string) {
    if (uid === '-') {
      return;
    }

    const duplicate = await this.prisma.player.findFirst({
      where: {
        uid,
        ...(id ? { id: { not: id } } : {})
      },
      select: { id: true }
    });

    if (duplicate) {
      throw new BadRequestException('球员 UID 已存在。');
    }
  }

  private requiredText(value: unknown, label: string) {
    const text = this.optionalText(value);

    if (!text) {
      throw new BadRequestException(`${label}不能为空。`);
    }

    return text;
  }

  private optionalText(value: unknown) {
    return typeof value === 'string' && value.trim() ? value.trim() : null;
  }

  private optionalInteger(value: unknown, label: string, min: number, max: number) {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const numberValue = Number(value);

    if (!Number.isInteger(numberValue) || numberValue < min || numberValue > max) {
      throw new BadRequestException(`${label}必须是 ${min}-${max} 之间的整数。`);
    }

    return numberValue;
  }

  private optionalFloat(value: unknown, label: string, min?: number, max?: number) {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const numberValue = Number(value);

    if (
      !Number.isFinite(numberValue) ||
      (min !== undefined && numberValue < min) ||
      (max !== undefined && numberValue > max)
    ) {
      throw new BadRequestException(
        max === undefined
          ? `${label}必须是不小于 ${min} 的数字。`
          : `${label}必须是 ${min}-${max} 之间的数字。`
      );
    }

    return numberValue;
  }

  private optionalBoolean(value: unknown) {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    if (typeof value === 'boolean') {
      return value;
    }

    if (value === 'true') {
      return true;
    }

    if (value === 'false') {
      return false;
    }

    throw new BadRequestException('布尔字段格式不正确。');
  }

  private optionalDate(value: unknown, label: string) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    const text = this.optionalText(value);

    if (!text) {
      return null;
    }

    const date = new Date(text);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException(`${label}格式不正确。`);
    }

    return date.getTime();
  }

  private createManualImportKey(entity: string, uid: string) {
    return uid === '-' ? `manual:${entity}:${randomUUID()}` : `manual:${entity}:${uid}`;
  }

  private handleDeleteError(error: unknown, label: string): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`${label}不存在。`);
      }

      if (error.code === 'P2003') {
        throw new BadRequestException(`${label}存在关联数据，不能直接删除。`);
      }
    }

    throw error;
  }

  private buildOrderBy(query: PlayerListQuery): Prisma.PlayerOrderByWithRelationInput[] {
    const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';
    const sortBy = query.sortBy ?? 'pa';
    const allowedSorts = new Set([
      'pa',
      'ca',
      'chineseName',
      'birthDate',
      'height',
      'weight',
      'age',
      'marketValue',
      'createdAt'
    ]);

    if (!allowedSorts.has(sortBy)) {
      return [{ pa: 'desc' }, { chineseName: 'asc' }];
    }

    return [{ [sortBy]: sortOrder }, { chineseName: 'asc' }];
  }
}
