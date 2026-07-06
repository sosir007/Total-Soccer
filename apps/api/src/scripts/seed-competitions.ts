import { spawn } from 'node:child_process';

const COMPETITION_SEEDS = [
  { key: 'world-cup', file: 'src/scripts/seed-world-cup.ts' },
  { key: 'euro', file: 'src/scripts/seed-euro.ts' },
  { key: 'asian-cup', file: 'src/scripts/seed-asian-cup.ts' },
  { key: 'copa-america', file: 'src/scripts/seed-copa-america.ts' },
  { key: 'africa-cup', file: 'src/scripts/seed-africa-cup.ts' },
  { key: 'gold-cup', file: 'src/scripts/seed-gold-cup.ts' },
  { key: 'ofc-nations-cup', file: 'src/scripts/seed-ofc-nations-cup.ts' },
  { key: 'confederations-cup', file: 'src/scripts/seed-confederations-cup.ts' },
  { key: 'olympic-mens-football', file: 'src/scripts/seed-olympic-mens-football.ts' }
];

async function main() {
  const startedAt = Date.now();
  const selectedSeeds = resolveSelectedSeeds(process.argv.slice(2));

  for (const seed of selectedSeeds) {
    console.log(`\n> seed:${seed.key}`);
    await runSeedFile(seed.file);
  }

  console.log(`\nCompetition seeds completed in ${Date.now() - startedAt}ms.`);
}

function resolveSelectedSeeds(args: string[]) {
  const normalizedArgs = args.filter((arg) => arg !== '--');

  if (!normalizedArgs.length) {
    return COMPETITION_SEEDS;
  }

  return normalizedArgs.map((arg) => {
    const key = arg.replace(/^seed:/, '');
    const seed = COMPETITION_SEEDS.find((item) => item.key === key);

    if (!seed) {
      throw new Error(`Unknown competition seed: ${arg}. Available: ${formatAvailableSeeds()}.`);
    }

    return seed;
  });
}

function formatAvailableSeeds() {
  return COMPETITION_SEEDS.map((seed) => seed.key).join(', ');
}

function runSeedFile(file: string) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn('tsx', [file], {
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

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
