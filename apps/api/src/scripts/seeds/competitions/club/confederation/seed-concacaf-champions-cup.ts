import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import {
  runCompetitionSeed,
  runSeed,
  type SeedEdition
} from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import {
  buildConcacafChampionsCupStandings,
  CONCACAF_CHAMPIONS_CUP_REQUIRED_CLUBS,
  CONCACAF_CHAMPIONS_CUP_RESULTS
} from '../../../../data/competition-results/club/confederation/concacaf-champions-cup.js';

const prisma = new PrismaClient();

function formatSeasonForUrl(season: string) {
  return season.replace('-', '%E2%80%93');
}

function getConcacafChampionsCupEditionUrl(result: SeedEdition) {
  const season = getResultSeason(result.season);
  const startYear = Number(season.slice(0, 4));

  if (startYear >= 2024) {
    return `https://en.wikipedia.org/wiki/${formatSeasonForUrl(season)}_CONCACAF_Champions_Cup`;
  }

  if (season.includes('-') || startYear >= 2009 || startYear === 2018) {
    return `https://en.wikipedia.org/wiki/${formatSeasonForUrl(season)}_CONCACAF_Champions_League`;
  }

  return `https://en.wikipedia.org/wiki/${formatSeasonForUrl(season)}_CONCACAF_Champions%27_Cup`;
}

function getResultSeason(season: string | null | undefined) {
  if (!season) {
    throw new Error('CONCACAF Champions Cup edition season is required to build external URL.');
  }

  return season;
}

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['加拿大', '哥斯达黎加', '洪都拉斯', '墨西哥', '美国']),
    clubs: CONCACAF_CHAMPIONS_CUP_REQUIRED_CLUBS,
    competition: {
      code: 'CONCACAF_CHAMPIONS_CUP',
      primaryConfederationCode: 'CONCACAF',
      create: {
        code: 'CONCACAF_CHAMPIONS_CUP',
        name: '中北美洲及加勒比海冠军杯',
        englishName: 'CONCACAF Champions Cup',
        shortName: '中北美冠军杯',
        alias: "中北美冠军联赛、CONCACAF Champions League、CONCACAF Champions' Cup",
        externalUrl: 'https://en.wikipedia.org/wiki/CONCACAF_Champions_Cup',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '一级',
        format: '杯赛',
        description:
          '中北美足联最高级别俱乐部杯赛，1962 年创办，2008 至 2023 年曾使用 CONCACAF Champions League 名称。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 40,
        dataComplete: false,
        dataUpdatedAt: new Date('2026-09-08T00:00:00.000Z'),
        dataRemark:
          '1962 至 2026 已按当前库内俱乐部录入冠亚军；已补齐托卢卡体育、桑托斯拉古纳、莫雷利亚、瓜达拉哈拉大学和奥林匹亚体育相关名次；其他库外俱乐部名次留空；1978 三队并列冠军现仅瓜达拉哈拉大学入库并按 1/3 分摊冠军分。'
      },
      update: {
        name: '中北美洲及加勒比海冠军杯',
        englishName: 'CONCACAF Champions Cup',
        shortName: '中北美冠军杯',
        alias: "中北美冠军联赛、CONCACAF Champions League、CONCACAF Champions' Cup",
        externalUrl: 'https://en.wikipedia.org/wiki/CONCACAF_Champions_Cup',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '一级',
        format: '杯赛',
        description:
          '中北美足联最高级别俱乐部杯赛，1962 年创办，2008 至 2023 年曾使用 CONCACAF Champions League 名称。',
        countryId: null,
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 40,
        dataComplete: false,
        dataUpdatedAt: new Date('2026-09-08T00:00:00.000Z'),
        dataRemark:
          '1962 至 2026 已按当前库内俱乐部录入冠亚军；已补齐托卢卡体育、桑托斯拉古纳、莫雷利亚、瓜达拉哈拉大学和奥林匹亚体育相关名次；其他库外俱乐部名次留空；1978 三队并列冠军现仅瓜达拉哈拉大学入库并按 1/3 分摊冠军分。'
      }
    },
    scope: {
      confederationCodes: ['CONCACAF']
    },
    editions: CONCACAF_CHAMPIONS_CUP_RESULTS.map((result) => ({
      ...result,
      externalUrl: getConcacafChampionsCupEditionUrl(result)
    })),
    buildStandings: buildConcacafChampionsCupStandings,
    expected: {
      editions: 61,
      standings: 86
    },
    allowPartialStandings: true,
    completedMessage: 'CONCACAF Champions Cup seed completed.'
  });
}

void runSeed(prisma, main);
