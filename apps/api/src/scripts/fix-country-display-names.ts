import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type CountryRenameRule = {
  officialUid: string;
  officialName: string;
  shortName: string;
  aliases: string[];
};

const COUNTRY_RENAME_RULES: CountryRenameRule[] = [
  {
    officialUid: '759',
    officialName: '波斯尼亚和黑塞哥维那',
    shortName: '波黑',
    aliases: ['波黑', '波斯尼亚和黑塞哥维那']
  },
  {
    officialUid: '143',
    officialName: '阿拉伯联合酋长国',
    shortName: '阿联酋',
    aliases: ['阿联酋', '阿拉伯联合酋长国']
  }
];

async function main() {
  for (const rule of COUNTRY_RENAME_RULES) {
    const matches = await prisma.country.findMany({
      where: {
        OR: [{ uid: rule.officialUid }, { name: { in: rule.aliases } }]
      },
      select: {
        id: true,
        uid: true,
        name: true,
        shortName: true,
        visibleInCatalog: true,
        detailRedirectCountryId: true
      },
      orderBy: [{ uid: 'asc' }, { name: 'asc' }]
    });

    if (!matches.length) {
      console.log(`[skip] ${rule.officialName}: no matching country found.`);
      continue;
    }

    const canonical =
      matches.find((item) => item.uid === rule.officialUid) ??
      matches.find((item) => item.name === rule.officialName) ??
      matches[0];

    const duplicateMatches = matches.filter((item) => item.id !== canonical.id);

    await prisma.country.update({
      where: { id: canonical.id },
      data: {
        uid: rule.officialUid,
        name: rule.officialName,
        shortName: rule.shortName,
        visibleInCatalog: true,
        detailRedirectCountryId: null
      }
    });

    for (const duplicate of duplicateMatches) {
      await mergeCountryReferences(duplicate.id, canonical.id);
      await prisma.country.delete({ where: { id: duplicate.id } });
    }

    console.log(
      `[done] ${rule.officialName}: canonical=${canonical.id}, merged=${duplicateMatches.length}.`
    );
  }
}

async function mergeCountryReferences(fromId: string, toId: string) {
  await prisma.$transaction([
    prisma.player.updateMany({
      where: { countryId: fromId },
      data: { countryId: toId }
    }),
    prisma.player.updateMany({
      where: { birthCountryId: fromId },
      data: { birthCountryId: toId }
    }),
    prisma.playerNationality.updateMany({
      where: { countryId: fromId },
      data: { countryId: toId }
    }),
    prisma.city.updateMany({
      where: { countryId: fromId },
      data: { countryId: toId }
    }),
    prisma.club.updateMany({
      where: { countryId: fromId },
      data: { countryId: toId }
    }),
    prisma.playerCareer.updateMany({
      where: { countryId: fromId },
      data: { countryId: toId }
    }),
    prisma.countryHonor.updateMany({
      where: { countryId: fromId },
      data: { countryId: toId }
    }),
    prisma.competition.updateMany({
      where: { countryId: fromId },
      data: { countryId: toId }
    }),
    prisma.competitionScopeCountry.updateMany({
      where: { countryId: fromId },
      data: { countryId: toId }
    }),
    prisma.competitionStanding.updateMany({
      where: { countryId: fromId },
      data: { countryId: toId }
    }),
    prisma.award.updateMany({
      where: { countryId: fromId },
      data: { countryId: toId }
    }),
    prisma.awardRecipient.updateMany({
      where: { countryId: fromId },
      data: { countryId: toId }
    }),
    prisma.honorRule.updateMany({
      where: { countryId: fromId },
      data: { countryId: toId }
    }),
    prisma.honorRuleCoefficient.updateMany({
      where: { countryId: fromId },
      data: { countryId: toId }
    }),
    prisma.countrySuccessor.updateMany({
      where: { historicalCountryId: fromId },
      data: { historicalCountryId: toId }
    }),
    prisma.countrySuccessor.updateMany({
      where: { successorCountryId: fromId },
      data: { successorCountryId: toId }
    }),
    prisma.country.updateMany({
      where: { detailRedirectCountryId: fromId },
      data: { detailRedirectCountryId: toId }
    })
  ]);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
