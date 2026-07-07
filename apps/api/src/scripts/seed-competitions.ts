import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { CompetitionEditionStandingMode } from '@prisma/client';
import {
  buildCompetitionResultStandings,
  type CompetitionResult
} from './helpers/competition-results.js';
import { COMPETITION_SEEDS, type SeedRegistryItem } from './seed-registry.js';

async function main() {
  const startedAt = Date.now();
  const { selectedSeeds, childArgs, reportMode } = resolveSelectedSeeds(process.argv.slice(2));

  if (reportMode === 'list') {
    printSeedList(selectedSeeds);
    return;
  }

  if (reportMode === 'sources') {
    await printSeedSources(selectedSeeds);
    return;
  }

  if (reportMode === 'check') {
    await printSeedCheck(selectedSeeds);
    return;
  }

  for (const seed of selectedSeeds) {
    console.log(`\n> seed:${seed.key}`);
    await runSeedFile(seed.file, childArgs);
  }

  console.log(`\nCompetition seeds completed in ${Date.now() - startedAt}ms.`);
}

function resolveSelectedSeeds(args: string[]) {
  const normalizedArgs = args.filter((arg) => arg !== '--');
  const seedArgs: string[] = [];
  const childArgs: string[] = [];
  let reportMode: 'list' | 'sources' | 'check' | null = null;

  for (const arg of normalizedArgs) {
    if (arg === '--list') {
      reportMode = setReportMode(reportMode, 'list');
      continue;
    }

    if (arg === '--sources') {
      reportMode = setReportMode(reportMode, 'sources');
      continue;
    }

    if (arg === '--check') {
      reportMode = setReportMode(reportMode, 'check');
      continue;
    }

    if (arg === '--validate-only') {
      childArgs.push(arg);
      continue;
    }

    if (arg.startsWith('--')) {
      throw new Error(
        `Unknown option: ${arg}. Available options: --list, --sources, --check, --validate-only.`
      );
    }

    seedArgs.push(arg);
  }

  if (!seedArgs.length) {
    return {
      selectedSeeds: COMPETITION_SEEDS,
      childArgs,
      reportMode
    };
  }

  return {
    selectedSeeds: seedArgs.map((arg) => {
      const key = arg.replace(/^seed:/, '');
      const seed = COMPETITION_SEEDS.find((item) => item.key === key);

      if (!seed) {
        throw new Error(`Unknown competition seed: ${arg}. Available: ${formatAvailableSeeds()}.`);
      }

      return seed;
    }),
    childArgs,
    reportMode
  };
}

function formatAvailableSeeds() {
  return COMPETITION_SEEDS.map((seed) => seed.key).join(', ');
}

function runSeedFile(file: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn('tsx', [file, ...args], {
      cwd: process.cwd(),
      env: process.env,
      stdio: 'inherit'
    });

    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(`${file} failed with ${signal ? `signal ${signal}` : `exit code ${code}`}.`)
      );
    });
  });
}

function printSeedList(seeds: typeof COMPETITION_SEEDS) {
  const rows = seeds.map((seed) => ({
    key: seed.key,
    label: seed.label,
    kind: seed.dataKind,
    target: seed.target,
    scope: seed.scope,
    file: seed.file
  }));

  console.table(rows);
}

async function printSeedSources(seeds: SeedRegistryItem[]) {
  const rows = await Promise.all(
    seeds.flatMap((seed) =>
      seed.dataFiles.length
        ? seed.dataFiles.map(async (file) => {
            const module = await importDataFile(file);
            const metadata = findMetadata(module);

            return {
              key: seed.key,
              label: seed.label,
              file,
              metadata: metadata ? 'yes' : 'missing',
              sources: metadata?.sources.length ?? 0,
              lastVerifiedAt: metadata?.lastVerifiedAt ?? '-',
              notes: metadata?.notes?.length ?? 0
            };
          })
        : [
            Promise.resolve({
              key: seed.key,
              label: seed.label,
              file: '-',
              metadata: 'missing',
              sources: 0,
              lastVerifiedAt: '-',
              notes: 0
            })
          ]
    )
  );

  console.table(rows);
}

async function printSeedCheck(seeds: SeedRegistryItem[]) {
  const rows = await Promise.all(
    seeds.map(async (seed) => {
      const summaries = await Promise.all(seed.dataFiles.map((file) => summarizeDataFile(file)));
      const editions = summaries.reduce((total, summary) => total + summary.editions, 0);
      const standings = summaries.reduce((total, summary) => total + summary.standings, 0);
      const metadataFiles = summaries.filter((summary) => summary.hasMetadata).length;
      const modes = mergeCountRecords(summaries.map((summary) => summary.modes));

      return {
        key: seed.key,
        label: seed.label,
        kind: seed.dataKind,
        target: seed.target,
        scope: seed.scope,
        files: seed.dataFiles.length,
        metadata: `${metadataFiles}/${seed.dataFiles.length}`,
        editions,
        standings,
        modes: formatCountRecord(modes) || '-'
      };
    })
  );

  console.table(rows);
}

async function summarizeDataFile(file: string) {
  const module = await importDataFile(file);
  const resultArrays = findExportedArrays(module, '_RESULTS');
  const patchArrays = findExportedArrays(module, '_PATCHES');
  const resultSummary = summarizeResultArrays(resultArrays);
  const patchSummary = summarizePatchArrays(patchArrays);

  return {
    editions: resultSummary.editions + patchSummary.editions,
    standings: resultSummary.standings + patchSummary.standings,
    modes: mergeCountRecords([resultSummary.modes, patchSummary.modes]),
    hasMetadata: Boolean(findMetadata(module))
  };
}

function summarizeResultArrays(arrays: unknown[][]) {
  const modes: Record<string, number> = {};
  let editions = 0;
  let standings = 0;

  for (const array of arrays) {
    editions += array.length;

    for (const item of array) {
      if (isTupleResult(item)) {
        standings += 4;
        modes[CompetitionEditionStandingMode.THIRD_PLACE_MATCH] =
          (modes[CompetitionEditionStandingMode.THIRD_PLACE_MATCH] ?? 0) + 1;
        continue;
      }

      const result = item as CompetitionResult;
      standings += buildCompetitionResultStandings(result).length;
      const mode = result.mode ?? CompetitionEditionStandingMode.THIRD_PLACE_MATCH;
      modes[mode] = (modes[mode] ?? 0) + 1;
    }
  }

  return { editions, standings, modes };
}

function summarizePatchArrays(arrays: unknown[][]) {
  const modes: Record<string, number> = {};
  const editionKeys = new Set<string>();
  let standings = 0;

  for (const array of arrays) {
    for (const item of array) {
      const patch = item as {
        competitionCode: string;
        name?: string;
        year?: number;
        season?: string | null;
        standingMode: CompetitionEditionStandingMode;
        standings?: unknown[];
      };
      const editionName =
        patch.name ?? (patch.year ? `${patch.year}年` : (patch.season ?? '未命名届次'));
      editionKeys.add(`${patch.competitionCode}:${editionName}`);
      standings += patch.standings?.length ?? 0;
      modes[patch.standingMode] = (modes[patch.standingMode] ?? 0) + 1;
    }
  }

  return { editions: editionKeys.size, standings, modes };
}

function findMetadata(module: Record<string, unknown>) {
  return Object.entries(module).find(([key]) => key.endsWith('_METADATA'))?.[1] as
    | {
        sources: unknown[];
        notes?: unknown[];
        lastVerifiedAt?: string;
      }
    | undefined;
}

function findExportedArrays(module: Record<string, unknown>, suffix: string) {
  return Object.entries(module)
    .filter(([key, value]) => key.endsWith(suffix) && Array.isArray(value))
    .map(([, value]) => value as unknown[]);
}

async function importDataFile(file: string) {
  return import(pathToFileURL(resolve(process.cwd(), file)).href) as Promise<
    Record<string, unknown>
  >;
}

function isTupleResult(item: unknown): item is readonly unknown[] {
  return Array.isArray(item);
}

function mergeCountRecords(records: Array<Record<string, number>>) {
  return records.reduce<Record<string, number>>((result, record) => {
    for (const [key, value] of Object.entries(record)) {
      result[key] = (result[key] ?? 0) + value;
    }

    return result;
  }, {});
}

function formatCountRecord(record: Record<string, number>) {
  return Object.entries(record)
    .map(([key, value]) => `${key}:${value}`)
    .join(', ');
}

function setReportMode(
  currentMode: 'list' | 'sources' | 'check' | null,
  nextMode: 'list' | 'sources' | 'check'
) {
  if (currentMode && currentMode !== nextMode) {
    throw new Error('Use only one report option at a time: --list, --sources, or --check.');
  }

  return nextMode;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
