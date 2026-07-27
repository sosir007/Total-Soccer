const FIFA_WORLD_CUP_GOLDEN_BALL_CODE = 'FIFA_WORLD_CUP_GOLDEN_BALL';

type AwardDisplayRef = {
  code?: string | null;
};

type AwardRecipientDisplayRef = {
  rank?: number | null;
  placement?: string | null;
};

const worldCupGoldenBallRankLabels: Record<number, string> = {
  1: '金球奖',
  2: '银球奖',
  3: '铜球奖'
};

export function isWorldCupGoldenBallAward(award?: AwardDisplayRef | null) {
  return award?.code === FIFA_WORLD_CUP_GOLDEN_BALL_CODE;
}

export function getAwardRankColumnLabel(
  award: AwardDisplayRef | null | undefined,
  rank: 1 | 2 | 3,
  fallback: string
) {
  if (!isWorldCupGoldenBallAward(award)) {
    return fallback;
  }

  return worldCupGoldenBallRankLabels[rank] ?? fallback;
}

export function formatAwardRecipientPlacementDisplay(
  award: AwardDisplayRef | null | undefined,
  recipient: AwardRecipientDisplayRef,
  fallback = '-'
) {
  if (isWorldCupGoldenBallAward(award)) {
    const specialLabel = resolveWorldCupGoldenBallLabel(recipient);

    if (specialLabel) {
      return specialLabel;
    }
  }

  if (recipient.placement) {
    return recipient.placement;
  }

  return recipient.rank ? `第 ${recipient.rank} 名` : fallback;
}

export function resolveWorldCupGoldenBallLabel(recipient: AwardRecipientDisplayRef) {
  if (recipient.rank && worldCupGoldenBallRankLabels[recipient.rank]) {
    return worldCupGoldenBallRankLabels[recipient.rank];
  }

  const normalizedPlacement = normalizePlacement(recipient.placement);

  if (['第一名', '第1名', '第1名', '1', '金球奖'].includes(normalizedPlacement)) {
    return '金球奖';
  }

  if (['第二名', '第2名', '第2名', '2', '银球奖'].includes(normalizedPlacement)) {
    return '银球奖';
  }

  if (['第三名', '第3名', '第3名', '3', '铜球奖'].includes(normalizedPlacement)) {
    return '铜球奖';
  }

  return null;
}

function normalizePlacement(value?: string | null) {
  return (value ?? '').replace(/\s+/g, '').trim();
}
