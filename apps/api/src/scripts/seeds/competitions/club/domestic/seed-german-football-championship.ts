import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import { GERMAN_FOOTBALL_CHAMPIONSHIP_REQUIRED_CLUBS } from '../../../../data/competition-patches/club/domestic/german-football-championship.js';
import { GERMAN_FOOTBALL_CHAMPIONSHIP_RESULTS } from '../../../../data/competition-results/club/domestic/german-football-championship.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['奥地利', '德国']),
    clubs: GERMAN_FOOTBALL_CHAMPIONSHIP_REQUIRED_CLUBS,
    competition: {
      code: 'GERMAN_FOOTBALL_CHAMPIONSHIP',
      primaryCountryName: '德国',
      create: {
        code: 'GERMAN_FOOTBALL_CHAMPIONSHIP',
        name: '德国足球锦标赛',
        englishName: 'German football championship',
        shortName: null,
        alias: '德国全国锦标赛',
        externalUrl: 'https://en.wikipedia.org/wiki/List_of_German_football_champions',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '一级',
        format: '联赛',
        description:
          '德甲成立前德国全国冠军决赛阶段赛事，1903 年开始，1963 年后由德国足球甲级联赛取代。',
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        enabled: true,
        includeInStats: true,
        sortOrder: 7710
      },
      update: {
        name: '德国足球锦标赛',
        englishName: 'German football championship',
        shortName: null,
        alias: '德国全国锦标赛',
        externalUrl: 'https://en.wikipedia.org/wiki/List_of_German_football_champions',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '一级',
        format: '联赛',
        description:
          '德甲成立前德国全国冠军决赛阶段赛事，1903 年开始，1963 年后由德国足球甲级联赛取代。',
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        enabled: true,
        includeInStats: true,
        sortOrder: 7710
      }
    },
    scope: {
      countryNames: ['德国']
    },
    editions: GERMAN_FOOTBALL_CHAMPIONSHIP_RESULTS,
    buildStandings: () => [],
    expected: {
      editions: 0,
      standings: 0
    },
    completedMessage: 'German football championship seed completed.'
  });
}

void runSeed(prisma, main);
