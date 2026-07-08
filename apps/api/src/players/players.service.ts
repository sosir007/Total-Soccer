import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PlayerCareerType, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service.js';
import { resolvePagination, toNumber } from '../common/pagination.js';
import type { PlayerCareerPayload, PlayerListQuery, PlayerPayload } from './players.types.js';

const PLAYER_CAREER_INCLUDE = {
  club: {
    select: {
      id: true,
      uid: true,
      name: true,
      externalUrl: true,
      exists: true
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
} satisfies Prisma.PlayerCareerInclude;

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
      name: true
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
          name: true
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
          name: true
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

const CLUB_NAME_REF_SELECT = {
  id: true,
  uid: true,
  name: true,
  externalUrl: true,
  exists: true
} satisfies Prisma.ClubSelect;

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
    include: PLAYER_AWARD_RECIPIENT_INCLUDE,
    orderBy: [{ edition: { year: 'desc' } }, { rank: 'asc' }, { placement: 'asc' }]
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

    const listItems = items.map((item) => this.attachCareerSummaries(item));

    return {
      items: await this.attachInitialClubRefs(listItems),
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

    return this.attachPersonalHonors(this.attachCareerSummaries(player));
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
    const confederation = await this.findConfederation(body.confederationId);
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

    return {
      data: {
        uid,
        chineseName,
        englishName: this.optionalText(body.englishName),
        birthDate: this.optionalDate(body.birthDate, '生日'),
        deathDate: this.optionalDate(body.deathDate, '过世日期'),
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
        initialClub: this.optionalText(body.initialClub),
        clubs: clubHistory,
        confederationId: confederation?.id ?? country?.federationId ?? club?.federationId ?? null,
        confederation: confederation?.name ?? country?.federation ?? club?.federation ?? null,
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
        deceased: this.optionalBoolean(body.deceased),
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

  private async attachInitialClubRefs<T extends { initialClub?: string | null }>(players: T[]) {
    const initialClubNames = Array.from(
      new Set(
        players
          .map((player) => player.initialClub?.trim())
          .filter((name): name is string => Boolean(name))
      )
    );

    if (initialClubNames.length === 0) {
      return players.map((player) => ({
        ...player,
        initialClubRef: null
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
      initialClubRef: player.initialClub
        ? (clubByName.get(player.initialClub.trim()) ?? null)
        : null
    }));
  }

  private attachPersonalHonors<
    T extends {
      awardRecipients?: Array<
        Prisma.AwardRecipientGetPayload<{ include: typeof PLAYER_AWARD_RECIPIENT_INCLUDE }>
      >;
    }
  >(player: T) {
    return {
      ...player,
      personalHonors: player.awardRecipients ?? []
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
