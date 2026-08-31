import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import {
  buildDoubleThirdPlaceStandings,
  buildFinalOnlyStandings,
  buildSemiFinalistStandings,
  buildTopFourStandings,
  buildTopThreeStandings,
  type SeedEdition
} from './competition-seed.js';

export type CompetitionResultBase = SeedEdition & {
  host: string;
  quantity: number;
};

export type TopFourCompetitionResult = CompetitionResultBase & {
  mode?: typeof CompetitionEditionStandingMode.THIRD_PLACE_MATCH;
  champion: string;
  runnerUp: string;
  thirdPlace: string;
  fourthPlace: string;
};

export type TopThreeCompetitionResult = CompetitionResultBase & {
  mode: typeof CompetitionEditionStandingMode.LEAGUE_TOP_THREE;
  champion: string;
  runnerUp: string;
  thirdPlace: string;
};

export type DoubleRunnerUpCompetitionResult = CompetitionResultBase & {
  mode: typeof CompetitionEditionStandingMode.LEAGUE_TOP_THREE;
  champion: string;
  runnerUps: [string, string];
};

export type FinalOnlyCompetitionResult = CompetitionResultBase & {
  mode: typeof CompetitionEditionStandingMode.FINAL_ONLY;
  champion: string;
  runnerUp: string;
};

export type SemiFinalistCompetitionResult = CompetitionResultBase & {
  mode: typeof CompetitionEditionStandingMode.SEMI_FINALISTS;
  champion: string;
  runnerUp: string;
  semiFinalists: [string, string];
};

export type DoubleThirdCompetitionResult = CompetitionResultBase & {
  mode: typeof CompetitionEditionStandingMode.DOUBLE_THIRD_PLACE;
  champion: string;
  runnerUp: string;
  thirdPlaces: [string, string];
};

export type CompetitionResult =
  | TopFourCompetitionResult
  | TopThreeCompetitionResult
  | DoubleRunnerUpCompetitionResult
  | FinalOnlyCompetitionResult
  | SemiFinalistCompetitionResult
  | DoubleThirdCompetitionResult;

export function withStandingMode<T extends CompetitionResult>(results: T[]) {
  return results.map((result) => ({
    ...result,
    standingMode: result.mode ?? CompetitionEditionStandingMode.THIRD_PLACE_MATCH
  }));
}

export function buildCompetitionResultStandings(result: CompetitionResult) {
  switch (result.mode) {
    case CompetitionEditionStandingMode.LEAGUE_TOP_THREE:
      if ('runnerUps' in result) {
        return buildDoubleRunnerUpStandings(result);
      }

      return buildTopThreeStandings(result);
    case CompetitionEditionStandingMode.FINAL_ONLY:
      return buildFinalOnlyStandings(result);
    case CompetitionEditionStandingMode.SEMI_FINALISTS:
      return buildSemiFinalistStandings(result);
    case CompetitionEditionStandingMode.DOUBLE_THIRD_PLACE:
      return buildDoubleThirdPlaceStandings(result);
    case CompetitionEditionStandingMode.THIRD_PLACE_MATCH:
    case undefined:
      return buildTopFourStandings(result);
    default:
      throw new Error('Unsupported competition result mode.');
  }
}

function buildDoubleRunnerUpStandings(input: DoubleRunnerUpCompetitionResult) {
  return [
    { placement: CompetitionStandingPlacement.CHAMPION, countryName: input.champion },
    {
      placement: CompetitionStandingPlacement.RUNNER_UP,
      countryName: input.runnerUps[0],
      standingOrder: 1
    },
    {
      placement: CompetitionStandingPlacement.RUNNER_UP,
      countryName: input.runnerUps[1],
      standingOrder: 2
    }
  ];
}
