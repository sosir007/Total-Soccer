import { AwardScopeType, AwardTargetType, LifecycleStatus } from '@prisma/client';
import { AwardRulesService } from '../award-rules/award-rules.service.js';
import { PrismaService } from '../database/prisma.service.js';

const prisma = new PrismaService();

const SOUTH_AMERICAN_FOOTBALLER_AWARD_CODE = 'SOUTH_AMERICAN_FOOTBALLER_OF_THE_YEAR';
const SOUTH_AMERICAN_FOOTBALLER_EXTERNAL_URL =
  'https://en.wikipedia.org/wiki/South_American_Footballer_of_the_Year';
const FIFA_WORLD_CUP_GOLDEN_BALL_AWARD_CODE = 'FIFA_WORLD_CUP_GOLDEN_BALL';
const FIFA_WORLD_CUP_GOLDEN_BALL_EXTERNAL_URL =
  'https://en.wikipedia.org/wiki/FIFA_World_Cup_awards#Golden_Ball';
const FIFA_WORLD_CUP_BEST_YOUNG_PLAYER_AWARD_CODE = 'FIFA_WORLD_CUP_BEST_YOUNG_PLAYER';
const FIFA_WORLD_CUP_BEST_YOUNG_PLAYER_EXTERNAL_URL =
  'https://en.wikipedia.org/wiki/FIFA_World_Cup_awards#Best_Young_Player_Award';
const COPA_AMERICA_BEST_PLAYER_AWARD_CODE = 'COPA_AMERICA_BEST_PLAYER';
const COPA_AMERICA_BEST_PLAYER_EXTERNAL_URL =
  'https://en.wikipedia.org/wiki/Copa_Am%C3%A9rica_awards';
const COPA_AMERICA_TOP_SCORER_AWARD_CODE = 'COPA_AMERICA_TOP_SCORER';
const COPA_AMERICA_TOP_SCORER_EXTERNAL_URL =
  'https://en.wikipedia.org/wiki/Copa_Am%C3%A9rica_awards#Golden_Boot';

const PELE_NAME_KEYWORD = '贝利';

const SOUTH_AMERICAN_FOOTBALLER_PELE_RESULTS = [
  {
    year: 1972,
    rank: 2,
    placement: '第二名',
    remark: 'El Mundo 口径，贝利效力桑托斯时期。'
  },
  {
    year: 1973,
    rank: 1,
    placement: '第一名',
    remark: 'El Mundo 口径，贝利效力桑托斯时期。'
  }
] as const;

const FIFA_WORLD_CUP_GOLDEN_BALL_PELE_RESULTS = [
  {
    year: 1958,
    rank: 2,
    placement: '第二名',
    remark: '世界杯银球奖，历史追认口径，非当届正式颁发。'
  },
  {
    year: 1970,
    rank: 1,
    placement: '第一名',
    remark: '世界杯金球奖，历史追认口径，非当届正式颁发。'
  }
] as const;

const FIFA_WORLD_CUP_BEST_YOUNG_PLAYER_PELE_RESULTS = [
  {
    year: 1958,
    placement: '获奖',
    remark: '历史追认口径，非当届正式颁发。'
  }
] as const;

const COPA_AMERICA_BEST_PLAYER_PELE_RESULTS = [
  {
    year: 1959,
    editionName: '1959年 阿根廷',
    placement: '获奖',
    remark: '南美锦标赛历史最佳球员口径；该届贝利同时以 8 球成为最佳射手。'
  }
] as const;

const COPA_AMERICA_TOP_SCORER_PELE_RESULTS = [
  {
    year: 1959,
    editionName: '1959年 阿根廷',
    rank: 1,
    placement: '最佳射手',
    remark: '1959年阿根廷美洲杯最佳射手，贝利 6 场 8 球。'
  }
] as const;

async function main() {
  const conmebol = await prisma.confederation.findFirst({
    where: {
      OR: [{ code: 'CONMEBOL' }, { name: '南美足联' }]
    },
    select: { id: true }
  });

  if (!conmebol) {
    throw new Error('Confederation not found: CONMEBOL / 南美足联');
  }

  const pele = await prisma.player.findFirst({
    where: {
      chineseName: {
        contains: PELE_NAME_KEYWORD
      }
    },
    select: { id: true, chineseName: true }
  });

  if (!pele) {
    throw new Error(`Player not found: ${PELE_NAME_KEYWORD}`);
  }

  const fifaWorldCup = await findCompetition('FIFA_WORLD_CUP');
  const copaAmerica = await findCompetition('COPA_AMERICA');

  await seedSouthAmericanFootballerOfTheYear(conmebol.id, pele.id);
  await seedFifaWorldCupGoldenBall(pele.id, fifaWorldCup.id);
  await seedFifaWorldCupBestYoungPlayer(pele.id, fifaWorldCup.id);
  await seedCopaAmericaBestPlayer(conmebol.id, copaAmerica.id, pele.id);
  await seedCopaAmericaTopScorer(conmebol.id, copaAmerica.id, pele.id);

  const awardRulesService = new AwardRulesService(prisma);
  const recalculation = await awardRulesService.recalculate();

  console.log(`Recalculated player award scores: ${JSON.stringify(recalculation)}`);
}

async function findCompetition(code: string) {
  const competition = await prisma.competition.findUnique({
    where: { code },
    select: {
      id: true,
      code: true
    }
  });

  if (!competition) {
    throw new Error(`Competition not found: ${code}`);
  }

  return competition;
}

async function findCompetitionEdition(competitionId: string, name: string) {
  const edition = await prisma.competitionEdition.findUnique({
    where: {
      competitionId_name: {
        competitionId,
        name
      }
    },
    select: { id: true }
  });

  if (!edition) {
    throw new Error(`Competition edition not found: ${competitionId} / ${name}`);
  }

  return edition;
}

async function seedSouthAmericanFootballerOfTheYear(conmebolId: string, peleId: string) {
  const award = await prisma.award.upsert({
    where: { code: SOUTH_AMERICAN_FOOTBALLER_AWARD_CODE },
    create: {
      code: SOUTH_AMERICAN_FOOTBALLER_AWARD_CODE,
      name: '南美足球先生',
      externalUrl: SOUTH_AMERICAN_FOOTBALLER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.CONFEDERATION,
      category: '洲际一级综合奖',
      level: '一级',
      description:
        '南美年度个人综合奖。1971-1985 采用委内瑞拉 El Mundo 正式口径，1986 起采用乌拉圭 El País 主流口径；1986-1992 的 El Mundo 非官方延续不纳入。',
      confederationId: conmebolId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 4100
    },
    update: {
      name: '南美足球先生',
      externalUrl: SOUTH_AMERICAN_FOOTBALLER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.CONFEDERATION,
      category: '洲际一级综合奖',
      level: '一级',
      description:
        '南美年度个人综合奖。1971-1985 采用委内瑞拉 El Mundo 正式口径，1986 起采用乌拉圭 El País 主流口径；1986-1992 的 El Mundo 非官方延续不纳入。',
      confederationId: conmebolId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 4100
    }
  });

  for (const result of SOUTH_AMERICAN_FOOTBALLER_PELE_RESULTS) {
    const edition = await prisma.awardEdition.upsert({
      where: {
        awardId_name: {
          awardId: award.id,
          name: `${result.year}年`
        }
      },
      create: {
        awardId: award.id,
        name: `${result.year}年`,
        year: result.year,
        externalUrl: SOUTH_AMERICAN_FOOTBALLER_EXTERNAL_URL,
        remark: 'El Mundo 口径。'
      },
      update: {
        year: result.year,
        externalUrl: SOUTH_AMERICAN_FOOTBALLER_EXTERNAL_URL,
        remark: 'El Mundo 口径。'
      }
    });

    await prisma.awardRecipient.upsert({
      where: {
        editionId_targetType_playerId: {
          editionId: edition.id,
          targetType: AwardTargetType.PLAYER,
          playerId: peleId
        }
      },
      create: {
        editionId: edition.id,
        targetType: AwardTargetType.PLAYER,
        playerId: peleId,
        rank: result.rank,
        placement: result.placement,
        externalUrl: SOUTH_AMERICAN_FOOTBALLER_EXTERNAL_URL,
        remark: result.remark
      },
      update: {
        rank: result.rank,
        placement: result.placement,
        externalUrl: SOUTH_AMERICAN_FOOTBALLER_EXTERNAL_URL,
        remark: result.remark
      }
    });
  }

  console.log(
    `Seeded ${SOUTH_AMERICAN_FOOTBALLER_AWARD_CODE}: ${SOUTH_AMERICAN_FOOTBALLER_PELE_RESULTS.length} Pele recipients.`
  );
}

async function seedFifaWorldCupGoldenBall(peleId: string, competitionId: string) {
  const award = await prisma.award.upsert({
    where: { code: FIFA_WORLD_CUP_GOLDEN_BALL_AWARD_CODE },
    create: {
      code: FIFA_WORLD_CUP_GOLDEN_BALL_AWARD_CODE,
      name: '国际足联世界杯金球奖',
      externalUrl: FIFA_WORLD_CUP_GOLDEN_BALL_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.WORLD,
      category: '世界杯一级综合奖',
      level: '一级',
      description:
        '国际足联世界杯最佳球员奖项，统一承接金球奖、银球奖、铜球奖；早期届次按历史追认口径备注。',
      competitionId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 2100
    },
    update: {
      name: '国际足联世界杯金球奖',
      externalUrl: FIFA_WORLD_CUP_GOLDEN_BALL_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.WORLD,
      category: '世界杯一级综合奖',
      level: '一级',
      description:
        '国际足联世界杯最佳球员奖项，统一承接金球奖、银球奖、铜球奖；早期届次按历史追认口径备注。',
      competitionId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 2100
    }
  });

  for (const result of FIFA_WORLD_CUP_GOLDEN_BALL_PELE_RESULTS) {
    const competitionEdition = await findCompetitionEdition(competitionId, `${result.year}年`);
    const edition = await prisma.awardEdition.upsert({
      where: {
        awardId_name: {
          awardId: award.id,
          name: `${result.year}年`
        }
      },
      create: {
        awardId: award.id,
        competitionEditionId: competitionEdition.id,
        name: `${result.year}年`,
        year: result.year,
        externalUrl: FIFA_WORLD_CUP_GOLDEN_BALL_EXTERNAL_URL,
        remark: '历史追认口径，非当届正式颁发。'
      },
      update: {
        competitionEditionId: competitionEdition.id,
        year: result.year,
        externalUrl: FIFA_WORLD_CUP_GOLDEN_BALL_EXTERNAL_URL,
        remark: '历史追认口径，非当届正式颁发。'
      }
    });

    await prisma.awardRecipient.upsert({
      where: {
        editionId_targetType_playerId: {
          editionId: edition.id,
          targetType: AwardTargetType.PLAYER,
          playerId: peleId
        }
      },
      create: {
        editionId: edition.id,
        targetType: AwardTargetType.PLAYER,
        playerId: peleId,
        rank: result.rank,
        placement: result.placement,
        externalUrl: FIFA_WORLD_CUP_GOLDEN_BALL_EXTERNAL_URL,
        remark: result.remark
      },
      update: {
        rank: result.rank,
        placement: result.placement,
        externalUrl: FIFA_WORLD_CUP_GOLDEN_BALL_EXTERNAL_URL,
        remark: result.remark
      }
    });
  }

  console.log(
    `Seeded ${FIFA_WORLD_CUP_GOLDEN_BALL_AWARD_CODE}: ${FIFA_WORLD_CUP_GOLDEN_BALL_PELE_RESULTS.length} Pele recipients.`
  );
}

async function seedFifaWorldCupBestYoungPlayer(peleId: string, competitionId: string) {
  const award = await prisma.award.upsert({
    where: { code: FIFA_WORLD_CUP_BEST_YOUNG_PLAYER_AWARD_CODE },
    create: {
      code: FIFA_WORLD_CUP_BEST_YOUNG_PLAYER_AWARD_CODE,
      name: '国际足联世界杯最佳年轻球员',
      externalUrl: FIFA_WORLD_CUP_BEST_YOUNG_PLAYER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.WORLD,
      category: '世界杯三级补充奖',
      level: '三级',
      description:
        '国际足联世界杯最佳年轻球员奖。正式奖项从 2006 年起稳定颁发，早期届次按历史追认口径备注。',
      competitionId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 2500
    },
    update: {
      name: '国际足联世界杯最佳年轻球员',
      externalUrl: FIFA_WORLD_CUP_BEST_YOUNG_PLAYER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.WORLD,
      category: '世界杯三级补充奖',
      level: '三级',
      description:
        '国际足联世界杯最佳年轻球员奖。正式奖项从 2006 年起稳定颁发，早期届次按历史追认口径备注。',
      competitionId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 2500
    }
  });

  for (const result of FIFA_WORLD_CUP_BEST_YOUNG_PLAYER_PELE_RESULTS) {
    const competitionEdition = await findCompetitionEdition(competitionId, `${result.year}年`);
    const edition = await prisma.awardEdition.upsert({
      where: {
        awardId_name: {
          awardId: award.id,
          name: `${result.year}年`
        }
      },
      create: {
        awardId: award.id,
        competitionEditionId: competitionEdition.id,
        name: `${result.year}年`,
        year: result.year,
        externalUrl: FIFA_WORLD_CUP_BEST_YOUNG_PLAYER_EXTERNAL_URL,
        remark: '历史追认口径，非当届正式颁发。'
      },
      update: {
        competitionEditionId: competitionEdition.id,
        year: result.year,
        externalUrl: FIFA_WORLD_CUP_BEST_YOUNG_PLAYER_EXTERNAL_URL,
        remark: '历史追认口径，非当届正式颁发。'
      }
    });

    await prisma.awardRecipient.upsert({
      where: {
        editionId_targetType_playerId: {
          editionId: edition.id,
          targetType: AwardTargetType.PLAYER,
          playerId: peleId
        }
      },
      create: {
        editionId: edition.id,
        targetType: AwardTargetType.PLAYER,
        playerId: peleId,
        placement: result.placement,
        externalUrl: FIFA_WORLD_CUP_BEST_YOUNG_PLAYER_EXTERNAL_URL,
        remark: result.remark
      },
      update: {
        rank: null,
        placement: result.placement,
        externalUrl: FIFA_WORLD_CUP_BEST_YOUNG_PLAYER_EXTERNAL_URL,
        remark: result.remark
      }
    });
  }

  console.log(
    `Seeded ${FIFA_WORLD_CUP_BEST_YOUNG_PLAYER_AWARD_CODE}: ${FIFA_WORLD_CUP_BEST_YOUNG_PLAYER_PELE_RESULTS.length} Pele recipients.`
  );
}

async function seedCopaAmericaBestPlayer(
  conmebolId: string,
  competitionId: string,
  peleId: string
) {
  const award = await prisma.award.upsert({
    where: { code: COPA_AMERICA_BEST_PLAYER_AWARD_CODE },
    create: {
      code: COPA_AMERICA_BEST_PLAYER_AWARD_CODE,
      name: '南美足联美洲杯最佳球员',
      externalUrl: COPA_AMERICA_BEST_PLAYER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.CONFEDERATION,
      category: '洲际杯一级综合奖',
      level: '一级',
      description:
        '美洲杯最佳球员奖。现代届次以南美足联官方奖项为准，早期南美锦标赛届次按历史整理口径录入并备注。',
      competitionId,
      confederationId: conmebolId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 3100
    },
    update: {
      name: '南美足联美洲杯最佳球员',
      externalUrl: COPA_AMERICA_BEST_PLAYER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.CONFEDERATION,
      category: '洲际杯一级综合奖',
      level: '一级',
      description:
        '美洲杯最佳球员奖。现代届次以南美足联官方奖项为准，早期南美锦标赛届次按历史整理口径录入并备注。',
      competitionId,
      confederationId: conmebolId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 3100
    }
  });

  for (const result of COPA_AMERICA_BEST_PLAYER_PELE_RESULTS) {
    const competitionEdition = await findCompetitionEdition(competitionId, result.editionName);
    const edition = await prisma.awardEdition.upsert({
      where: {
        awardId_name: {
          awardId: award.id,
          name: result.editionName
        }
      },
      create: {
        awardId: award.id,
        competitionEditionId: competitionEdition.id,
        name: result.editionName,
        year: result.year,
        externalUrl: COPA_AMERICA_BEST_PLAYER_EXTERNAL_URL,
        remark: '早期南美锦标赛历史整理口径。'
      },
      update: {
        competitionEditionId: competitionEdition.id,
        year: result.year,
        externalUrl: COPA_AMERICA_BEST_PLAYER_EXTERNAL_URL,
        remark: '早期南美锦标赛历史整理口径。'
      }
    });

    await prisma.awardRecipient.upsert({
      where: {
        editionId_targetType_playerId: {
          editionId: edition.id,
          targetType: AwardTargetType.PLAYER,
          playerId: peleId
        }
      },
      create: {
        editionId: edition.id,
        targetType: AwardTargetType.PLAYER,
        playerId: peleId,
        placement: result.placement,
        externalUrl: COPA_AMERICA_BEST_PLAYER_EXTERNAL_URL,
        remark: result.remark
      },
      update: {
        rank: null,
        placement: result.placement,
        externalUrl: COPA_AMERICA_BEST_PLAYER_EXTERNAL_URL,
        remark: result.remark
      }
    });
  }

  console.log(
    `Seeded ${COPA_AMERICA_BEST_PLAYER_AWARD_CODE}: ${COPA_AMERICA_BEST_PLAYER_PELE_RESULTS.length} Pele recipients.`
  );
}

async function seedCopaAmericaTopScorer(conmebolId: string, competitionId: string, peleId: string) {
  const award = await prisma.award.upsert({
    where: { code: COPA_AMERICA_TOP_SCORER_AWARD_CODE },
    create: {
      code: COPA_AMERICA_TOP_SCORER_AWARD_CODE,
      name: '南美足联美洲杯最佳射手',
      externalUrl: COPA_AMERICA_TOP_SCORER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.CONFEDERATION,
      category: '洲际杯二级专项奖',
      level: '二级',
      description:
        '美洲杯赛事最佳射手奖，统一承接南美锦标赛和美洲杯 Golden Boot / Top Scorer 口径；只录明确获奖或最佳射手记录。',
      competitionId,
      confederationId: conmebolId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 3300
    },
    update: {
      name: '南美足联美洲杯最佳射手',
      externalUrl: COPA_AMERICA_TOP_SCORER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.CONFEDERATION,
      category: '洲际杯二级专项奖',
      level: '二级',
      description:
        '美洲杯赛事最佳射手奖，统一承接南美锦标赛和美洲杯 Golden Boot / Top Scorer 口径；只录明确获奖或最佳射手记录。',
      competitionId,
      confederationId: conmebolId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 3300
    }
  });

  for (const result of COPA_AMERICA_TOP_SCORER_PELE_RESULTS) {
    const competitionEdition = await findCompetitionEdition(competitionId, result.editionName);
    const edition = await prisma.awardEdition.upsert({
      where: {
        awardId_name: {
          awardId: award.id,
          name: result.editionName
        }
      },
      create: {
        awardId: award.id,
        competitionEditionId: competitionEdition.id,
        name: result.editionName,
        year: result.year,
        externalUrl: COPA_AMERICA_TOP_SCORER_EXTERNAL_URL,
        remark: '早期南美锦标赛最佳射手口径。'
      },
      update: {
        competitionEditionId: competitionEdition.id,
        year: result.year,
        externalUrl: COPA_AMERICA_TOP_SCORER_EXTERNAL_URL,
        remark: '早期南美锦标赛最佳射手口径。'
      }
    });

    await prisma.awardRecipient.upsert({
      where: {
        editionId_targetType_playerId: {
          editionId: edition.id,
          targetType: AwardTargetType.PLAYER,
          playerId: peleId
        }
      },
      create: {
        editionId: edition.id,
        targetType: AwardTargetType.PLAYER,
        playerId: peleId,
        rank: result.rank,
        placement: result.placement,
        externalUrl: COPA_AMERICA_TOP_SCORER_EXTERNAL_URL,
        remark: result.remark
      },
      update: {
        rank: result.rank,
        placement: result.placement,
        externalUrl: COPA_AMERICA_TOP_SCORER_EXTERNAL_URL,
        remark: result.remark
      }
    });
  }

  console.log(
    `Seeded ${COPA_AMERICA_TOP_SCORER_AWARD_CODE}: ${COPA_AMERICA_TOP_SCORER_PELE_RESULTS.length} Pele recipients.`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
