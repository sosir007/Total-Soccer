import {
  AwardScopeType,
  AwardTargetType,
  CompetitionEditionStandingMode,
  LifecycleStatus
} from '@prisma/client';
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
const NASL_MVP_AWARD_CODE = 'NASL_MOST_VALUABLE_PLAYER';
const NASL_MVP_EXTERNAL_URL =
  'https://www.sportingnews.com/us/soccer/news/tsn-archives-pele-landslide-winner-nasl-mvp-sept-11-1976-issue/fh9j4ahe4opejebwwe7d0cls';
const NASL_ALL_STAR_TEAM_AWARD_CODE = 'NASL_ALL_STAR_TEAM';
const NASL_ALL_STAR_TEAM_EXTERNAL_URL = 'https://www.nationalsoccerhof.com/players/pele.html';
const NASL_ASSISTS_LEADER_AWARD_CODE = 'NASL_ASSISTS_LEADER';
const NASL_ASSISTS_LEADER_EXTERNAL_URL = 'https://www.statscrew.com/soccer/leaders/l-NASL/y-1976';
const NORTH_AMERICAN_SOCCER_LEAGUE_COMPETITION_CODE = 'NORTH_AMERICAN_SOCCER_LEAGUE_1968_1984';

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

const NASL_MVP_PELE_RESULTS = [
  {
    year: 1976,
    placement: 'MVP',
    remark: '1976年旧北美足球联赛最有价值球员，贝利效力纽约宇宙。'
  }
] as const;

const NASL_ALL_STAR_TEAM_PELE_RESULTS = [
  {
    year: 1975,
    placement: '入选',
    remark: '1975年旧北美足球联赛全明星阵容一队，贝利效力纽约宇宙。'
  },
  {
    year: 1976,
    placement: '入选',
    remark: '1976年旧北美足球联赛全明星阵容一队，贝利效力纽约宇宙。'
  },
  {
    year: 1977,
    placement: '入选',
    remark: '1977年旧北美足球联赛全明星阵容一队，贝利效力纽约宇宙。'
  }
] as const;

const NASL_ASSISTS_LEADER_PELE_RESULTS = [
  {
    year: 1976,
    rank: 1,
    placement: '助攻王',
    remark: '1976年旧北美足球联赛助攻榜第一，贝利效力纽约宇宙，18 次助攻。'
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
  const northAmericanSoccerLeague = await findCompetition(
    NORTH_AMERICAN_SOCCER_LEAGUE_COMPETITION_CODE
  );

  await seedSouthAmericanFootballerOfTheYear(conmebol.id, pele.id);
  await seedFifaWorldCupGoldenBall(pele.id, fifaWorldCup.id);
  await seedFifaWorldCupBestYoungPlayer(pele.id, fifaWorldCup.id);
  await seedCopaAmericaBestPlayer(conmebol.id, copaAmerica.id, pele.id);
  await seedCopaAmericaTopScorer(conmebol.id, copaAmerica.id, pele.id);
  await seedNaslMostValuablePlayer(pele.id, northAmericanSoccerLeague.id);
  await seedNaslAllStarTeam(pele.id, northAmericanSoccerLeague.id);
  await seedNaslAssistsLeader(pele.id, northAmericanSoccerLeague.id);

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

async function seedNaslMostValuablePlayer(peleId: string, competitionId: string) {
  const award = await prisma.award.upsert({
    where: { code: NASL_MVP_AWARD_CODE },
    create: {
      code: NASL_MVP_AWARD_CODE,
      name: '北美足球联赛最有价值球员',
      externalUrl: NASL_MVP_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.LEAGUE,
      category: '国联一级综合奖',
      level: '一级',
      description:
        '旧北美足球联赛赛季最有价值球员奖，系统按国内顶级联赛赛季 MVP / 最佳球员口径计入。',
      competitionId,
      lifecycleStatus: LifecycleStatus.DISCONTINUED,
      enabled: true,
      sortOrder: 7100
    },
    update: {
      name: '北美足球联赛最有价值球员',
      externalUrl: NASL_MVP_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.LEAGUE,
      category: '国联一级综合奖',
      level: '一级',
      description:
        '旧北美足球联赛赛季最有价值球员奖，系统按国内顶级联赛赛季 MVP / 最佳球员口径计入。',
      competitionId,
      lifecycleStatus: LifecycleStatus.DISCONTINUED,
      enabled: true,
      sortOrder: 7100
    }
  });

  for (const result of NASL_MVP_PELE_RESULTS) {
    const competitionEdition = await prisma.competitionEdition.upsert({
      where: {
        competitionId_name: {
          competitionId,
          name: `${result.year}年`
        }
      },
      create: {
        competitionId,
        name: `${result.year}年`,
        season: String(result.year),
        year: result.year,
        standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
        externalUrl: NASL_MVP_EXTERNAL_URL,
        remark: '为绑定旧 NASL 赛季个人奖项创建；本届不补写球队 standings。'
      },
      update: {
        season: String(result.year),
        year: result.year,
        standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
        externalUrl: NASL_MVP_EXTERNAL_URL,
        remark: '为绑定旧 NASL 赛季个人奖项创建；本届不补写球队 standings。'
      }
    });

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
        season: String(result.year),
        year: result.year,
        externalUrl: NASL_MVP_EXTERNAL_URL,
        remark: '旧 NASL 赛季 MVP。'
      },
      update: {
        competitionEditionId: competitionEdition.id,
        season: String(result.year),
        year: result.year,
        externalUrl: NASL_MVP_EXTERNAL_URL,
        remark: '旧 NASL 赛季 MVP。'
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
        rank: 1,
        placement: result.placement,
        externalUrl: NASL_MVP_EXTERNAL_URL,
        remark: result.remark
      },
      update: {
        rank: 1,
        placement: result.placement,
        externalUrl: NASL_MVP_EXTERNAL_URL,
        remark: result.remark
      }
    });
  }

  console.log(`Seeded ${NASL_MVP_AWARD_CODE}: ${NASL_MVP_PELE_RESULTS.length} Pele recipients.`);
}

async function seedNaslAllStarTeam(peleId: string, competitionId: string) {
  const award = await prisma.award.upsert({
    where: { code: NASL_ALL_STAR_TEAM_AWARD_CODE },
    create: {
      code: NASL_ALL_STAR_TEAM_AWARD_CODE,
      name: '北美足球联赛全明星阵容',
      externalUrl: NASL_ALL_STAR_TEAM_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.LEAGUE,
      category: '国联二级阵容奖',
      level: '二级',
      description: '旧北美足球联赛赛季全明星阵容一队，系统按国内顶级联赛赛季最佳阵容口径计入。',
      competitionId,
      lifecycleStatus: LifecycleStatus.DISCONTINUED,
      enabled: true,
      sortOrder: 7200
    },
    update: {
      name: '北美足球联赛全明星阵容',
      externalUrl: NASL_ALL_STAR_TEAM_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.LEAGUE,
      category: '国联二级阵容奖',
      level: '二级',
      description: '旧北美足球联赛赛季全明星阵容一队，系统按国内顶级联赛赛季最佳阵容口径计入。',
      competitionId,
      lifecycleStatus: LifecycleStatus.DISCONTINUED,
      enabled: true,
      sortOrder: 7200
    }
  });

  for (const result of NASL_ALL_STAR_TEAM_PELE_RESULTS) {
    const competitionEdition = await prisma.competitionEdition.upsert({
      where: {
        competitionId_name: {
          competitionId,
          name: `${result.year}年`
        }
      },
      create: {
        competitionId,
        name: `${result.year}年`,
        season: String(result.year),
        year: result.year,
        standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
        externalUrl: NASL_ALL_STAR_TEAM_EXTERNAL_URL,
        remark: '为绑定旧 NASL 赛季个人奖项创建；本届不补写球队 standings。'
      },
      update: {
        season: String(result.year),
        year: result.year,
        standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
        externalUrl: NASL_ALL_STAR_TEAM_EXTERNAL_URL,
        remark: '为绑定旧 NASL 赛季个人奖项创建；本届不补写球队 standings。'
      }
    });

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
        season: String(result.year),
        year: result.year,
        externalUrl: NASL_ALL_STAR_TEAM_EXTERNAL_URL,
        remark: '旧 NASL 赛季全明星阵容一队。'
      },
      update: {
        competitionEditionId: competitionEdition.id,
        season: String(result.year),
        year: result.year,
        externalUrl: NASL_ALL_STAR_TEAM_EXTERNAL_URL,
        remark: '旧 NASL 赛季全明星阵容一队。'
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
        externalUrl: NASL_ALL_STAR_TEAM_EXTERNAL_URL,
        remark: result.remark
      },
      update: {
        rank: null,
        placement: result.placement,
        externalUrl: NASL_ALL_STAR_TEAM_EXTERNAL_URL,
        remark: result.remark
      }
    });
  }

  console.log(
    `Seeded ${NASL_ALL_STAR_TEAM_AWARD_CODE}: ${NASL_ALL_STAR_TEAM_PELE_RESULTS.length} Pele recipients.`
  );
}

async function seedNaslAssistsLeader(peleId: string, competitionId: string) {
  const award = await prisma.award.upsert({
    where: { code: NASL_ASSISTS_LEADER_AWARD_CODE },
    create: {
      code: NASL_ASSISTS_LEADER_AWARD_CODE,
      name: '北美足球联赛助攻王',
      externalUrl: NASL_ASSISTS_LEADER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.LEAGUE,
      category: '国联二级专项奖',
      level: '二级',
      description: '旧北美足球联赛赛季助攻榜第一，系统按国内顶级联赛专项奖口径计入。',
      competitionId,
      lifecycleStatus: LifecycleStatus.DISCONTINUED,
      enabled: true,
      sortOrder: 7300
    },
    update: {
      name: '北美足球联赛助攻王',
      externalUrl: NASL_ASSISTS_LEADER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.LEAGUE,
      category: '国联二级专项奖',
      level: '二级',
      description: '旧北美足球联赛赛季助攻榜第一，系统按国内顶级联赛专项奖口径计入。',
      competitionId,
      lifecycleStatus: LifecycleStatus.DISCONTINUED,
      enabled: true,
      sortOrder: 7300
    }
  });

  for (const result of NASL_ASSISTS_LEADER_PELE_RESULTS) {
    const competitionEdition = await prisma.competitionEdition.upsert({
      where: {
        competitionId_name: {
          competitionId,
          name: `${result.year}年`
        }
      },
      create: {
        competitionId,
        name: `${result.year}年`,
        season: String(result.year),
        year: result.year,
        standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
        externalUrl: NASL_ASSISTS_LEADER_EXTERNAL_URL,
        remark: '为绑定旧 NASL 赛季个人奖项创建；本届不补写球队 standings。'
      },
      update: {
        season: String(result.year),
        year: result.year,
        standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
        externalUrl: NASL_ASSISTS_LEADER_EXTERNAL_URL,
        remark: '为绑定旧 NASL 赛季个人奖项创建；本届不补写球队 standings。'
      }
    });

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
        season: String(result.year),
        year: result.year,
        externalUrl: NASL_ASSISTS_LEADER_EXTERNAL_URL,
        remark: '旧 NASL 赛季助攻王。'
      },
      update: {
        competitionEditionId: competitionEdition.id,
        season: String(result.year),
        year: result.year,
        externalUrl: NASL_ASSISTS_LEADER_EXTERNAL_URL,
        remark: '旧 NASL 赛季助攻王。'
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
        externalUrl: NASL_ASSISTS_LEADER_EXTERNAL_URL,
        remark: result.remark
      },
      update: {
        rank: result.rank,
        placement: result.placement,
        externalUrl: NASL_ASSISTS_LEADER_EXTERNAL_URL,
        remark: result.remark
      }
    });
  }

  console.log(
    `Seeded ${NASL_ASSISTS_LEADER_AWARD_CODE}: ${NASL_ASSISTS_LEADER_PELE_RESULTS.length} Pele recipients.`
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
