import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { CompetitionEditionStandingMode } from '@prisma/client';
import {
  buildCompetitionResultStandings,
  type CompetitionResult
} from './helpers/competition-results.js';
import { COMPETITION_SEEDS, type SeedRegistryItem } from './seed-registry.js';

type ReportMode = 'list' | 'sources' | 'check' | 'coverage' | 'validate-data';

type SeedMetadata = {
  competitionCode?: unknown;
  name?: unknown;
  dataKind?: unknown;
  target?: unknown;
  scope?: unknown;
  sources: unknown[];
  notes?: unknown[];
  lastVerifiedAt?: string;
};

type DataFileSummary = {
  editions: number;
  standings: number;
  modes: Record<string, number>;
  hasMetadata: boolean;
  metadataStatus: string;
  remarks: number;
  specialModes: number;
  missingQuantity: number;
  orderIssues: number;
  duplicateEditions: number;
  hasHistoricalCountries: boolean;
  metadataIssues: string[];
};

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

  if (reportMode === 'coverage') {
    await printSeedCoverage(selectedSeeds);
    return;
  }

  if (reportMode === 'validate-data') {
    await validateSeedData(selectedSeeds);
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
  let reportMode: ReportMode | null = null;

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

    if (arg === '--coverage') {
      reportMode = setReportMode(reportMode, 'coverage');
      continue;
    }

    if (arg === '--validate-data') {
      reportMode = setReportMode(reportMode, 'validate-data');
      continue;
    }

    if (arg === '--validate-only') {
      childArgs.push(arg);
      continue;
    }

    if (arg.startsWith('--')) {
      throw new Error(
        `Unknown option: ${arg}. Available options: --list, --sources, --check, --coverage, --validate-data, --validate-only.`
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
              status: formatMetadataStatus(metadata),
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
              status: 'missing',
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

async function printSeedCoverage(seeds: SeedRegistryItem[]) {
  const rows = await Promise.all(
    seeds.map(async (seed) => {
      const summaries = await Promise.all(seed.dataFiles.map((file) => summarizeDataFile(file)));
      const editions = sumSummaryValue(summaries, 'editions');
      const standings = sumSummaryValue(summaries, 'standings');
      const metadataStatus = summarizeMetadataStatus(summaries);
      const modes = mergeCountRecords(summaries.map((summary) => summary.modes));
      const specialModes = sumSummaryValue(summaries, 'specialModes');
      const remarks = sumSummaryValue(summaries, 'remarks');
      const missingQuantity = sumSummaryValue(summaries, 'missingQuantity');
      const orderIssues = sumSummaryValue(summaries, 'orderIssues');
      const duplicateEditions = sumSummaryValue(summaries, 'duplicateEditions');

      return {
        key: seed.key,
        label: seed.label,
        target: seed.target,
        scope: seed.scope,
        status: metadataStatus,
        files: seed.dataFiles.length,
        editions,
        standings,
        specialModes,
        remarks,
        missingQuantity,
        orderIssues,
        duplicateEditions,
        historical: summaries.some((summary) => summary.hasHistoricalCountries) ? 'yes' : '-',
        modes: formatCountRecord(modes) || '-',
        issues: formatCoverageIssues({
          metadataStatus,
          missingQuantity,
          orderIssues,
          duplicateEditions
        })
      };
    })
  );

  console.table(rows);
}

async function validateSeedData(seeds: SeedRegistryItem[]) {
  const seedIssues = await Promise.all(
    seeds.map(async (seed) => {
      const summaries = await Promise.all(
        seed.dataFiles.map((file) => summarizeDataFile(file, seed))
      );
      const issues = summaries.flatMap((summary, index) => {
        const file = seed.dataFiles[index] ?? '-';

        return buildDataValidationIssues(seed, file, summary);
      });

      return { seed, issues };
    })
  );
  const rows = seedIssues.flatMap(({ seed, issues }) =>
    issues.map((issue) => ({
      key: seed.key,
      label: seed.label,
      issue
    }))
  );

  if (rows.length) {
    console.table(rows);
    throw new Error(`Competition seed data validation failed with ${rows.length} issue(s).`);
  }

  console.log(`Competition seed data validation passed for ${seeds.length} seed(s).`);
}

async function summarizeDataFile(file: string, seed?: SeedRegistryItem) {
  const module = await importDataFile(file);
  const resultArrays = findExportedArrays(module, '_RESULTS');
  const patchArrays = findExportedArrays(module, '_PATCHES');
  const metadata = findMetadata(module);
  const resultSummary = summarizeResultArrays(resultArrays);
  const patchSummary = summarizePatchArrays(patchArrays);
  const editions = resultSummary.editions + patchSummary.editions;
  const standings = resultSummary.standings + patchSummary.standings;

  return {
    editions,
    standings,
    modes: mergeCountRecords([resultSummary.modes, patchSummary.modes]),
    hasMetadata: Boolean(metadata),
    metadataStatus: formatMetadataStatus(metadata),
    remarks: resultSummary.remarks + patchSummary.remarks,
    specialModes: resultSummary.specialModes + patchSummary.specialModes,
    missingQuantity: resultSummary.missingQuantity + patchSummary.missingQuantity,
    orderIssues: resultSummary.orderIssues + patchSummary.orderIssues,
    duplicateEditions: resultSummary.duplicateEditions + patchSummary.duplicateEditions,
    hasHistoricalCountries: hasNonEmptyExportedArray(module, 'HISTORICAL_COUNTRIES'),
    metadataIssues: validateMetadata(metadata, seed, {
      allowPartial: seed?.dataKind === 'competition-patches' && editions === 0 && standings === 0
    })
  } satisfies DataFileSummary;
}

function summarizeResultArrays(arrays: unknown[][]) {
  const modes: Record<string, number> = {};
  const editionKeys: string[] = [];
  let editions = 0;
  let standings = 0;
  let remarks = 0;
  let specialModes = 0;
  let missingQuantity = 0;
  let orderIssues = 0;

  for (const array of arrays) {
    editions += array.length;
    let previousYear: number | null = null;

    for (const item of array) {
      if (isTupleResult(item)) {
        const year = toNumericYear(item[0]);
        editionKeys.push(year ? `${year}年` : '未命名届次');
        missingQuantity += item[6] == null ? 1 : 0;
        orderIssues += countOrderIssue(previousYear, year);
        previousYear = year ?? previousYear;
        standings += 4;
        modes[CompetitionEditionStandingMode.THIRD_PLACE_MATCH] =
          (modes[CompetitionEditionStandingMode.THIRD_PLACE_MATCH] ?? 0) + 1;
        continue;
      }

      const result = item as CompetitionResult;
      const mode = result.mode ?? CompetitionEditionStandingMode.THIRD_PLACE_MATCH;
      const year = result.year ?? null;
      editionKeys.push(formatDataEditionName(result));
      remarks += result.remark ? 1 : 0;
      specialModes += mode === CompetitionEditionStandingMode.THIRD_PLACE_MATCH ? 0 : 1;
      missingQuantity += result.quantity == null ? 1 : 0;
      orderIssues += countOrderIssue(previousYear, year);
      previousYear = year ?? previousYear;
      standings += buildCompetitionResultStandings(result).length;
      modes[mode] = (modes[mode] ?? 0) + 1;
    }
  }

  return {
    editions,
    standings,
    modes,
    remarks,
    specialModes,
    missingQuantity,
    orderIssues,
    duplicateEditions: findDuplicates(editionKeys).length
  };
}

function summarizePatchArrays(arrays: unknown[][]) {
  const modes: Record<string, number> = {};
  const editionKeys = new Set<string>();
  const allEditionKeys: string[] = [];
  let standings = 0;
  let remarks = 0;
  let specialModes = 0;
  let missingQuantity = 0;
  let orderIssues = 0;

  for (const array of arrays) {
    let previousYear: number | null = null;

    for (const item of array) {
      const patch = item as {
        competitionCode: string;
        name?: string;
        year?: number;
        season?: string | null;
        standingMode: CompetitionEditionStandingMode;
        quantity?: number | null;
        remark?: string | null;
        standings?: unknown[];
      };
      const editionName =
        patch.name ?? (patch.year ? `${patch.year}年` : (patch.season ?? '未命名届次'));
      editionKeys.add(`${patch.competitionCode}:${editionName}`);
      allEditionKeys.push(`${patch.competitionCode}:${editionName}`);
      standings += patch.standings?.length ?? 0;
      remarks += patch.remark ? 1 : 0;
      specialModes +=
        patch.standingMode === CompetitionEditionStandingMode.THIRD_PLACE_MATCH ? 0 : 1;
      missingQuantity += patch.quantity == null ? 1 : 0;
      orderIssues += countOrderIssue(previousYear, patch.year ?? null);
      previousYear = patch.year ?? previousYear;
      modes[patch.standingMode] = (modes[patch.standingMode] ?? 0) + 1;
    }
  }

  return {
    editions: editionKeys.size,
    standings,
    modes,
    remarks,
    specialModes,
    missingQuantity,
    orderIssues,
    duplicateEditions: findDuplicates(allEditionKeys).length
  };
}

function findMetadata(module: Record<string, unknown>) {
  return Object.entries(module).find(([key]) => key.endsWith('_METADATA'))?.[1] as
    | SeedMetadata
    | undefined;
}

function buildDataValidationIssues(seed: SeedRegistryItem, file: string, summary: DataFileSummary) {
  const issues = [
    ...summary.metadataIssues.map((issue) => `${file}: ${issue}`),
    summary.missingQuantity ? `${file}: missing quantity in ${summary.missingQuantity} row(s)` : '',
    summary.orderIssues ? `${file}: year order issue in ${summary.orderIssues} row(s)` : '',
    summary.duplicateEditions
      ? `${file}: duplicate edition key in ${summary.duplicateEditions} row(s)`
      : ''
  ].filter(Boolean);

  if (!isEmptyPatchIndex(seed, summary) && summary.metadataStatus !== 'verified') {
    issues.push(`${file}: metadata status must be verified, got ${summary.metadataStatus}`);
  }

  return issues;
}

function validateMetadata(
  metadata: SeedMetadata | undefined,
  seed?: SeedRegistryItem,
  options: { allowPartial?: boolean } = {}
) {
  if (!metadata) {
    return ['metadata is missing'];
  }

  const issues = [
    validateLiteral(metadata.dataKind, seed?.dataKind, 'metadata.dataKind'),
    validateLiteral(metadata.target, seed?.target, 'metadata.target'),
    validateLiteral(metadata.scope, seed?.scope, 'metadata.scope'),
    typeof metadata.competitionCode === 'string' && metadata.competitionCode.trim()
      ? ''
      : 'metadata.competitionCode is required',
    typeof metadata.name === 'string' && metadata.name.trim() ? '' : 'metadata.name is required',
    options.allowPartial && metadata.lastVerifiedAt == null
      ? ''
      : validateVerifiedAt(metadata.lastVerifiedAt)
  ].filter(Boolean);

  if (!Array.isArray(metadata.sources)) {
    issues.push('metadata.sources must be an array');
    return issues;
  }

  metadata.sources.forEach((source, index) => {
    issues.push(...validateMetadataSource(source, index));
  });

  return issues;
}

function validateLiteral(actual: unknown, expected: string | undefined, label: string) {
  if (!expected || actual === expected) {
    return '';
  }

  return `${label} must be ${expected}, got ${String(actual)}`;
}

function validateVerifiedAt(value: unknown) {
  if (typeof value !== 'string') {
    return 'metadata.lastVerifiedAt is required';
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return `metadata.lastVerifiedAt must use YYYY-MM-DD, got ${value}`;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    return `metadata.lastVerifiedAt is not a valid date, got ${value}`;
  }

  return '';
}

function validateMetadataSource(source: unknown, index: number) {
  if (!isObject(source)) {
    return [`metadata.sources[${index}] must be an object`];
  }

  const issues = [
    typeof source.label === 'string' && source.label.trim()
      ? ''
      : `metadata.sources[${index}].label is required`
  ];

  if (source.url != null && (typeof source.url !== 'string' || !/^https?:\/\//.test(source.url))) {
    issues.push(`metadata.sources[${index}].url must start with http:// or https://`);
  }

  return issues.filter(Boolean);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isEmptyPatchIndex(seed: SeedRegistryItem, summary: DataFileSummary) {
  return (
    seed.dataKind === 'competition-patches' && summary.editions === 0 && summary.standings === 0
  );
}

function formatMetadataStatus(metadata: SeedMetadata | undefined) {
  if (!metadata) {
    return 'missing';
  }

  if (metadata.sources.length && metadata.lastVerifiedAt) {
    return 'verified';
  }

  return 'partial';
}

function summarizeMetadataStatus(summaries: DataFileSummary[]) {
  if (!summaries.length) {
    return 'missing';
  }

  const statuses = new Set(summaries.map((summary) => summary.metadataStatus));

  if (statuses.size === 1) {
    return summaries[0]?.metadataStatus ?? 'missing';
  }

  if (statuses.has('missing')) {
    return 'mixed';
  }

  return 'partial';
}

function sumSummaryValue<K extends keyof DataFileSummary>(summaries: DataFileSummary[], key: K) {
  return summaries.reduce((total, summary) => {
    const value = summary[key];
    return typeof value === 'number' ? total + value : total;
  }, 0);
}

function formatCoverageIssues(input: {
  metadataStatus: string;
  missingQuantity: number;
  orderIssues: number;
  duplicateEditions: number;
}) {
  const issues = [
    input.metadataStatus === 'verified' ? '' : `metadata:${input.metadataStatus}`,
    input.missingQuantity ? `missingQuantity:${input.missingQuantity}` : '',
    input.orderIssues ? `orderIssues:${input.orderIssues}` : '',
    input.duplicateEditions ? `duplicateEditions:${input.duplicateEditions}` : ''
  ].filter(Boolean);

  return issues.join(', ') || '-';
}

function formatDataEditionName(item: { name?: string; year?: number; season?: string | null }) {
  return item.name ?? (item.year ? `${item.year}年` : (item.season ?? '未命名届次'));
}

function toNumericYear(value: unknown) {
  const year = Number(value);
  return Number.isFinite(year) ? year : null;
}

function countOrderIssue(previousYear: number | null, year: number | null) {
  if (previousYear == null || year == null) {
    return 0;
  }

  return year < previousYear ? 1 : 0;
}

function findExportedArrays(module: Record<string, unknown>, suffix: string) {
  return Object.entries(module)
    .filter(([key, value]) => key.endsWith(suffix) && Array.isArray(value))
    .map(([, value]) => value as unknown[]);
}

function hasNonEmptyExportedArray(module: Record<string, unknown>, name: string) {
  const value = module[name];
  return Array.isArray(value) && value.length > 0;
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

function findDuplicates(values: string[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
    }

    seen.add(value);
  }

  return [...duplicates];
}

function setReportMode(currentMode: ReportMode | null, nextMode: ReportMode) {
  if (currentMode && currentMode !== nextMode) {
    throw new Error(
      'Use only one report option at a time: --list, --sources, --check, --coverage, or --validate-data.'
    );
  }

  return nextMode;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
