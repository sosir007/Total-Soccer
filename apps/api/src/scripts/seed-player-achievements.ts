import { AwardRulesService } from '../award-rules/award-rules.service.js';
import { PrismaService } from '../database/prisma.service.js';

const prisma = new PrismaService();
const validateOnly = process.argv.includes('--validate-only');

const PELE_NAME_KEYWORD = '贝利';

const PELE_ACHIEVEMENTS = [
  {
    season: '1999',
    name: '国际奥委会世纪运动员',
    externalUrl: 'https://olympics.com/ioc/news/pele-world-s-greatest-footballer-dies-at-82',
    remark: '跨项目世纪类权威成就，按个人成就 1 分计。'
  },
  {
    season: '1999',
    name: '《时代》20世纪最重要人物之一',
    externalUrl: 'https://content.time.com/time/magazine/article/0,9171,991257,00.html',
    remark: '跨领域世纪人物榜，按个人成就 1 分计。'
  },
  {
    season: '1999',
    name: 'France Football 世纪最佳球员',
    externalUrl: 'https://en.wikipedia.org/wiki/France_Football#Football_Player_of_the_Century',
    remark: '足球权威媒体世纪类评选，按个人成就 1 分计。'
  },
  {
    season: '1999',
    name: 'World Soccer 世纪最佳球员',
    externalUrl: 'https://en.wikipedia.org/wiki/World_Soccer_(magazine)#Greatest_XI_of_all_time',
    remark: '足球权威媒体世纪类评选，按个人成就 1 分计。'
  },
  {
    season: '2000',
    name: 'FIFA 二十世纪最佳球员',
    externalUrl: 'https://www.fifa.com/fifaplus/en/articles/pele-the-king-of-football',
    remark: 'FIFA 官方世纪类荣誉，按个人成就 1 分计。'
  },
  {
    season: '2000',
    name: 'IFFHS 二十世纪世界最佳球员',
    externalUrl: 'https://iffhs.com/posts/1053',
    remark: '足球历史统计机构世纪类荣誉，按个人成就 1 分计。'
  },
  {
    season: '2000',
    name: '劳伦斯终身成就奖',
    externalUrl: 'https://www.laureus.com/world-sports-awards/2000/lifetime-achievement/pele',
    remark: '国际综合体育奖项终身成就，按个人成就 1 分计。'
  },
  {
    season: '2005',
    name: 'BBC 体育人物终身成就奖',
    externalUrl: 'https://www.bbc.co.uk/sport/sports-personality/30267361',
    remark: '主流媒体综合体育终身成就，按个人成就 1 分计。'
  },
  {
    season: '2013',
    name: 'FIFA 金球奖荣誉奖',
    externalUrl: 'https://www.fifa.com/fifaplus/en/articles/pele-the-king-of-football',
    remark: 'FIFA Ballon d’Or Prix d’Honneur，按个人成就 1 分计。'
  }
] as const;

async function main() {
  const pele = await prisma.player.findFirst({
    where: {
      chineseName: {
        contains: PELE_NAME_KEYWORD
      }
    },
    select: { id: true, chineseName: true, uid: true }
  });

  if (!pele) {
    throw new Error(`Player not found: ${PELE_NAME_KEYWORD}`);
  }

  if (validateOnly) {
    const existingCount = await prisma.playerHonor.count({ where: { playerId: pele.id } });
    console.log(
      `validate-only passed: player=${pele.chineseName} (${pele.uid}), targetAchievements=${PELE_ACHIEVEMENTS.length}, existingAchievements=${existingCount}`
    );
    return;
  }

  let created = 0;
  let updated = 0;

  for (const [index, achievement] of PELE_ACHIEVEMENTS.entries()) {
    const existing = await prisma.playerHonor.findFirst({
      where: {
        playerId: pele.id,
        season: achievement.season,
        name: achievement.name
      }
    });

    if (!existing) {
      await prisma.playerHonor.create({
        data: {
          playerId: pele.id,
          name: achievement.name,
          season: achievement.season,
          score: 1,
          externalUrl: achievement.externalUrl,
          remark: achievement.remark,
          sortOrder: index + 1
        }
      });
      created += 1;
      continue;
    }

    const data = {
      externalUrl: existing.externalUrl ?? achievement.externalUrl,
      remark: existing.remark ?? achievement.remark
    };

    if (data.externalUrl !== existing.externalUrl || data.remark !== existing.remark) {
      await prisma.playerHonor.update({
        where: { id: existing.id },
        data
      });
      updated += 1;
    }
  }

  const awardRulesService = new AwardRulesService(prisma);
  const recalculation = await awardRulesService.recalculate();

  console.log(
    `Seeded Pele achievements: target=${PELE_ACHIEVEMENTS.length}, created=${created}, updated=${updated}.`
  );
  console.log(`Recalculated player award scores: ${JSON.stringify(recalculation)}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
