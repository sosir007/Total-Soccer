<script setup lang="ts">
import { computed } from 'vue';
import EntityLink from '@/components/EntityLink.vue';
import SemanticTag from '@/components/SemanticTag.vue';
import type {
  PlayerCareer,
  PlayerDetail,
  PlayerHonor,
  PlayerTeamHonor
} from '@/services/types/catalog';
import type { AwardRecipientRecord } from '@/services/types/awards';
import { formatAwardRecipientPlacementDisplay } from '@/utils/award-display';
import { formatEntityName } from '@/utils/entity-name';
import { formatHonorEditionLabel } from '@/utils/honor';
import { placementLabels } from '@/utils/honor';
import { getConfederationVariant, getPlacementTextColor } from '@/utils/tag-theme';

type TeamType = 'club' | 'country' | 'personal';
type HonorSubjectType = 'competition' | 'award';
type PlacementTone = 'champion' | 'runner-up' | 'third-place' | 'fourth-place' | 'semi-finalist';
type HonorPeriod = {
  label: string;
  year: number | null;
  externalUrl?: string | null;
};
type HonorLine = {
  key: string;
  subjectType: HonorSubjectType;
  subjectId: string;
  subjectName: string;
  placement: string;
  tone: PlacementTone;
  periods: HonorPeriod[];
  sortYear: number;
};
type HonorSubjectGroup = {
  key: string;
  subjectType: HonorSubjectType;
  subjectId: string;
  subjectName: string;
  placements: HonorLine[];
  sortYear: number;
};
type AchievementLine = {
  id: string;
  label: string;
  sortYear: number;
  sortOrder: number;
  externalUrl?: string | null;
};
type HonorGroup = {
  key: string;
  type: TeamType;
  teamId?: string | null;
  teamName: string;
  countryName?: string | null;
  federationName?: string | null;
  period?: string;
  appearances?: number | null;
  goals?: number | null;
  assists?: number | null;
  trophies: HonorLine[];
  awards: HonorLine[];
  achievements: AchievementLine[];
  sortOrder: number;
};
type HonorGroupBase = Pick<
  HonorGroup,
  | 'key'
  | 'type'
  | 'teamId'
  | 'teamName'
  | 'countryName'
  | 'federationName'
  | 'period'
  | 'appearances'
  | 'goals'
  | 'assists'
  | 'sortOrder'
>;
type HonorGroupView = Omit<HonorGroup, 'trophies' | 'awards'> & {
  trophies: HonorSubjectGroup[];
  awards: HonorSubjectGroup[];
};
type GroupMeta = {
  countryName?: string | null;
  federationName?: string | null;
};

const props = defineProps<{
  player: PlayerDetail;
}>();

const honorGroups = computed<HonorGroupView[]>(() => buildHonorGroups(props.player));

function buildHonorGroups(player: PlayerDetail): HonorGroupView[] {
  const groupMap = new Map<string, HonorGroup>();
  const personalGroup = ensurePersonalGroup(groupMap);

  for (const career of sortedCareers(player)) {
    ensureCareerGroup(groupMap, career);
  }

  for (const honor of player.teamHonors ?? []) {
    const group = resolveTeamHonorGroup(groupMap, honor);
    addHonorLine(group.trophies, buildTeamHonorLine(honor));
  }

  for (const honor of player.personalHonors ?? []) {
    const group = resolvePersonalHonorGroup(groupMap, player, honor) ?? personalGroup;
    addHonorLine(group.awards, buildAwardHonorLine(honor));
  }

  for (const honor of player.honors ?? []) {
    personalGroup.achievements.push(buildAchievementLine(honor));
  }

  return [...groupMap.values()]
    .map(
      (group): HonorGroupView => ({
        ...group,
        trophies: groupHonorLines(group.trophies),
        awards: groupHonorLines(group.awards),
        achievements: sortAchievementLines(group.achievements)
      })
    )
    .filter((group) => group.trophies.length || group.awards.length || group.achievements.length)
    .sort(
      (left, right) =>
        left.sortOrder - right.sortOrder || left.teamName.localeCompare(right.teamName, 'zh-CN')
    );
}

function sortedCareers(player: PlayerDetail) {
  return [...(player.profileClubCareers ?? []), ...(player.countryCareers ?? [])].sort(
    (left, right) => {
      if (left.careerType !== right.careerType) {
        return left.careerType === 'CLUB' ? -1 : 1;
      }

      if (left.sortOrder !== right.sortOrder) return left.sortOrder - right.sortOrder;

      return (left.startYear ?? 0) - (right.startYear ?? 0);
    }
  );
}

function ensurePersonalGroup(groupMap: Map<string, HonorGroup>) {
  const key = 'personal';
  const existing = groupMap.get(key);

  if (existing) {
    return existing;
  }

  const group: HonorGroup = {
    key,
    type: 'personal',
    teamName: '个人奖项',
    awards: [],
    trophies: [],
    achievements: [],
    sortOrder: 0
  };
  groupMap.set(key, group);

  return group;
}

function ensureCareerGroup(groupMap: Map<string, HonorGroup>, career: PlayerCareer) {
  const team = career.club ?? career.country;
  const teamType: TeamType = career.careerType === 'CLUB' ? 'club' : 'country';
  const federationRef = team?.federationRef;
  const countryRef = career.careerType === 'CLUB' ? career.club?.countryRef : career.country;
  const meta = {
    countryName: teamType === 'club' ? formatOptionalEntityName(countryRef) : null,
    federationName: federationRef?.name ?? federationRef?.code ?? null
  };
  const key = career.id || `${teamType}-${team?.id ?? team?.name ?? 'unknown'}`;
  const existing = groupMap.get(key);

  if (existing) {
    fillGroupMeta(existing, meta);
    return existing;
  }

  const group: HonorGroup = {
    key,
    type: teamType,
    teamId: team?.id,
    teamName: formatEntityName(team, true),
    countryName: meta.countryName,
    federationName: meta.federationName,
    period: formatCareerPeriod(career),
    appearances: career.appearances,
    goals: career.goals,
    assists: career.assists,
    trophies: [],
    awards: [],
    achievements: [],
    sortOrder: teamType === 'club' ? 1000 + (career.sortOrder ?? 0) : 2000 + (career.sortOrder ?? 0)
  };
  groupMap.set(key, group);

  return group;
}

function resolveTeamHonorGroup(groupMap: Map<string, HonorGroup>, honor: PlayerTeamHonor) {
  if (honor.career) {
    return ensureCareerGroup(groupMap, honor.career);
  }

  const team = honor.standing.club ?? honor.standing.country;
  const teamType: TeamType = honor.standing.club ? 'club' : 'country';
  const federationRef = team?.federationRef;
  const countryRef = honor.standing.club?.countryRef ?? honor.standing.country ?? null;
  const meta = {
    countryName: teamType === 'club' ? formatOptionalEntityName(countryRef) : null,
    federationName: federationRef?.name ?? federationRef?.code ?? null
  };
  const key = `${teamType}-${team?.id ?? team?.name ?? 'unknown'}`;
  const existing = groupMap.get(key);

  if (existing) {
    fillGroupMeta(existing, meta);
    return existing;
  }

  const group: HonorGroup = {
    key,
    type: teamType,
    teamId: team?.id,
    teamName: formatEntityName(team, true),
    countryName: meta.countryName,
    federationName: meta.federationName,
    trophies: [],
    awards: [],
    achievements: [],
    sortOrder: teamType === 'club' ? 1900 : 2900
  };
  groupMap.set(key, group);

  return group;
}

function resolvePersonalHonorGroup(
  groupMap: Map<string, HonorGroup>,
  player: PlayerDetail,
  honor: AwardRecipientRecord
) {
  const competition = honor.edition.award.competition;

  if (!competition) {
    return null;
  }

  const year = honor.edition.year ?? honor.edition.competitionEdition?.year ?? null;
  const careers =
    competition.targetType === 'CLUB'
      ? (player.profileClubCareers ?? [])
      : (player.countryCareers ?? []);
  const matchedCareer =
    careers.find((career) => isCareerInYear(career, year)) ??
    careers.find(
      (career) => career.careerType === (competition.targetType === 'CLUB' ? 'CLUB' : 'COUNTRY')
    ) ??
    null;

  return matchedCareer ? ensureCareerGroup(groupMap, matchedCareer) : null;
}

function buildTeamHonorLine(honor: PlayerTeamHonor): HonorLine {
  const competition = honor.standing.edition.competition;
  const period = buildTeamHonorPeriod(honor);
  const placement = placementLabels[honor.standing.placement] ?? honor.standing.placement;
  const tone = resolveTeamPlacementTone(honor.standing.placement);

  return {
    key: `team-${competition.id}-${honor.standing.placement}`,
    subjectType: 'competition',
    subjectId: competition.id,
    subjectName: formatEntityName(competition),
    placement,
    tone,
    periods: [period],
    sortYear: period.year ?? Number.MAX_SAFE_INTEGER
  };
}

function buildAwardHonorLine(honor: AwardRecipientRecord): HonorLine {
  const award = honor.edition.award;
  const period = buildAwardHonorPeriod(honor);
  const placementInfo = formatAwardPlacement(honor);

  return {
    key: `award-${award.id}-${normalizePlacementKey(placementInfo.text)}`,
    subjectType: 'award',
    subjectId: award.id,
    subjectName: formatEntityName(award),
    placement: placementInfo.text,
    tone: placementInfo.tone,
    periods: [period],
    sortYear: period.year ?? Number.MAX_SAFE_INTEGER
  };
}

function buildAchievementLine(honor: PlayerHonor): AchievementLine {
  return {
    id: honor.id,
    label: [honor.season, honor.name].filter(Boolean).join(' '),
    sortYear: resolveSortYear(honor.season),
    sortOrder: honor.sortOrder,
    externalUrl: honor.externalUrl
  };
}

function addHonorLine(lines: HonorLine[], nextLine: HonorLine) {
  const existing = lines.find((line) => line.key === nextLine.key);

  if (!existing) {
    lines.push(nextLine);
    return;
  }

  existing.periods.push(...nextLine.periods);
  existing.sortYear = Math.min(existing.sortYear, nextLine.sortYear);
}

function sortAchievementLines(lines: AchievementLine[]) {
  return [...lines].sort(
    (left, right) =>
      left.sortOrder - right.sortOrder ||
      left.sortYear - right.sortYear ||
      left.label.localeCompare(right.label, 'zh-CN')
  );
}

function groupHonorLines(lines: HonorLine[]) {
  const map = new Map<string, HonorSubjectGroup>();

  for (const line of lines) {
    const key = `${line.subjectType}-${line.subjectId}`;
    const existing = map.get(key);

    if (!existing) {
      map.set(key, {
        key,
        subjectType: line.subjectType,
        subjectId: line.subjectId,
        subjectName: line.subjectName,
        placements: [line],
        sortYear: line.sortYear
      });
      continue;
    }

    existing.placements.push(line);
    existing.sortYear = Math.min(existing.sortYear, line.sortYear);
  }

  return [...map.values()]
    .map((group) => ({
      ...group,
      placements: sortHonorPlacements(group.placements)
    }))
    .sort((left, right) => {
      if (left.sortYear !== right.sortYear) {
        return left.sortYear - right.sortYear;
      }

      return left.subjectName.localeCompare(right.subjectName, 'zh-CN');
    });
}

function sortHonorPlacements(lines: HonorLine[]) {
  return [...lines]
    .map((line) => ({
      ...line,
      periods: sortPeriods(line.periods)
    }))
    .sort((left, right) => {
      const leftPlacement = placementSortValue(left);
      const rightPlacement = placementSortValue(right);

      if (leftPlacement !== rightPlacement) {
        return leftPlacement - rightPlacement;
      }

      if (left.sortYear !== right.sortYear) {
        return left.sortYear - right.sortYear;
      }

      return left.subjectName.localeCompare(right.subjectName, 'zh-CN');
    });
}

function sortPeriods(periods: HonorPeriod[]) {
  const periodMap = new Map<string, HonorPeriod>();

  for (const period of periods) {
    periodMap.set(`${period.label}-${period.externalUrl ?? ''}`, period);
  }

  return [...periodMap.values()].sort(
    (left, right) =>
      (left.year ?? Number.MAX_SAFE_INTEGER) - (right.year ?? Number.MAX_SAFE_INTEGER) ||
      left.label.localeCompare(right.label, 'zh-CN')
  );
}

function buildTeamHonorPeriod(honor: PlayerTeamHonor): HonorPeriod {
  const edition = honor.standing.edition;

  return {
    label: formatCompetitionEditionLabel(edition),
    year: edition.year ?? null,
    externalUrl: edition.externalUrl
  };
}

function buildAwardHonorPeriod(honor: AwardRecipientRecord): HonorPeriod {
  const edition = honor.edition;
  const competitionEdition = edition.competitionEdition;

  return {
    label: formatCompetitionEditionLabel(edition),
    year: edition.year ?? competitionEdition?.year ?? null,
    externalUrl: honor.externalUrl ?? edition.externalUrl ?? competitionEdition?.externalUrl
  };
}

function formatCompetitionEditionLabel(edition: {
  season?: string | null;
  name?: string | null;
  year?: number | null;
}) {
  return formatHonorEditionLabel(edition);
}

function resolveSortYear(value?: string | null) {
  const match = value?.match(/\d{4}/);

  return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER;
}

function formatAwardPlacement(honor: AwardRecipientRecord) {
  const placement = formatAwardRecipientPlacementDisplay(honor.edition.award, honor, '');
  const normalizedPlacement = normalizePlacementKey(placement);
  const normalizedSubject = normalizePlacementKey(formatEntityName(honor.edition.award));

  if (!normalizedPlacement || ['获奖', '优胜者', '入选'].includes(normalizedPlacement)) {
    const defaultPlacement = resolveImplicitAwardPlacement(normalizedSubject);

    return {
      text: defaultPlacement,
      tone: resolveAwardPlacementTone(defaultPlacement)
    };
  }

  if (
    normalizedSubject.includes(normalizedPlacement) &&
    !shouldShowDuplicatedAwardPlacement(placement)
  ) {
    return {
      text: '',
      tone: resolveAwardPlacementTone(placement)
    };
  }

  if (normalizedPlacement.startsWith('并列')) {
    const withoutSharedPrefix = normalizedPlacement.replace(/^并列/, '');

    if (
      withoutSharedPrefix &&
      normalizedSubject.includes(withoutSharedPrefix) &&
      !shouldShowDuplicatedAwardPlacement(withoutSharedPrefix)
    ) {
      return {
        text: '',
        tone: resolveAwardPlacementTone(withoutSharedPrefix)
      };
    }
  }

  return {
    text: placement,
    tone: resolveAwardPlacementTone(placement)
  };
}

function resolveImplicitAwardPlacement(normalizedSubject: string) {
  if (normalizedSubject.includes('金球奖') || normalizedSubject.includes('金球')) {
    return '金球奖';
  }

  if (normalizedSubject.includes('银球奖') || normalizedSubject.includes('银球')) {
    return '银球奖';
  }

  if (normalizedSubject.includes('铜球奖') || normalizedSubject.includes('铜球')) {
    return '铜球奖';
  }

  return '';
}

function shouldShowDuplicatedAwardPlacement(placement: string) {
  const normalized = normalizePlacementKey(placement);

  return [
    '金球奖',
    '金球',
    '银球奖',
    '银球',
    '银奖',
    '铜球奖',
    '铜球',
    '铜奖',
    '第一名',
    '第1名',
    '第二名',
    '第2名',
    '第三名',
    '第3名'
  ].includes(normalized);
}

function resolveAwardPlacementTone(placement: string): PlacementTone {
  const normalized = normalizePlacementKey(placement);

  if (['亚军', '第二名', '第2名', '银球奖', '银奖', '银靴奖', '银靴'].includes(normalized)) {
    return 'runner-up';
  }

  if (['季军', '第三名', '第3名', '铜球奖', '铜奖', '铜靴奖', '铜靴'].includes(normalized)) {
    return 'third-place';
  }

  if (['冠军', '第一名', '第1名', '金球奖', '金奖', '金靴奖', '金靴'].includes(normalized)) {
    return 'champion';
  }

  if (['殿军', '第四名', '第4名'].includes(normalized)) {
    return 'fourth-place';
  }

  if (['四强', '半决赛', 'semi-finalist'].includes(normalized)) {
    return 'semi-finalist';
  }

  return 'champion';
}

function resolveTeamPlacementTone(placement: keyof typeof placementLabels | string): PlacementTone {
  if (placement === 'RUNNER_UP') return 'runner-up';
  if (placement === 'THIRD_PLACE') return 'third-place';
  if (placement === 'FOURTH_PLACE') return 'fourth-place';
  if (placement === 'SEMI_FINALIST') return 'semi-finalist';

  return 'champion';
}

function getLineStyle(line: HonorLine) {
  return {
    '--honor-placement-color': getHonorLineColor(line.tone),
    color: getHonorLineColor(line.tone)
  };
}

function getHonorLineColor(tone: PlacementTone) {
  const placementMap = {
    champion: 'CHAMPION',
    'runner-up': 'RUNNER_UP',
    'third-place': 'THIRD_PLACE',
    'fourth-place': 'FOURTH_PLACE',
    'semi-finalist': 'SEMI_FINALIST'
  } as const;

  return getPlacementTextColor(placementMap[tone]);
}

function formatLineCount(line: HonorLine) {
  return line.periods.length > 1 ? `${line.periods.length}次` : '';
}

function placementSortValue(line: HonorLine) {
  const normalized = normalizePlacementKey(line.placement);

  if (line.subjectType === 'award') {
    const order: Record<string, number> = {
      金球奖: 1,
      金球: 1,
      银球奖: 2,
      银球: 2,
      银奖: 2,
      铜球奖: 3,
      铜球: 3,
      铜奖: 3,
      第一名: 4,
      第1名: 4,
      第二名: 5,
      第2名: 5,
      第三名: 6,
      第3名: 6,
      第四名: 7,
      第4名: 7
    };

    if (['获奖', '优胜者', '入选'].includes(normalized)) {
      return 4;
    }

    return order[normalized] ?? 99;
  }

  const order: Record<string, number> = {
    冠军: 1,
    亚军: 2,
    季军: 3,
    殿军: 4,
    四强: 5
  };

  return order[normalized] ?? 99;
}

function fillGroupMeta(group: HonorGroupBase, meta: GroupMeta) {
  group.countryName = group.countryName || meta.countryName || null;
  group.federationName = group.federationName || meta.federationName || null;
}

function formatOptionalEntityName(
  ref?: { name?: string | null; shortName?: string | null } | null
) {
  return ref ? formatEntityName(ref, true) : null;
}

function getGroupCountryVariant(group: HonorGroupBase) {
  return getConfederationVariant(group.federationName);
}

function getGroupTypeVariant(group: HonorGroupBase) {
  return group.type === 'club' ? 'object-club' : 'object-country';
}

function getGroupTypeLabel(group: HonorGroupBase) {
  return group.type === 'club' ? '俱乐部' : '国家队';
}

function normalizePlacementKey(value?: string | null) {
  return (value ?? '').replace(/\s+/g, '').trim();
}

function formatCareerPeriod(career: PlayerCareer) {
  const start = career.startSeason || career.startYear;
  const end = career.endSeason || career.endYear;

  return [start, end].filter(Boolean).join('-');
}

function isCareerInYear(career: PlayerCareer, year?: number | null) {
  if (!year) {
    return false;
  }

  const start = career.startYear ?? Number.MIN_SAFE_INTEGER;
  const end = career.endYear ?? Number.MAX_SAFE_INTEGER;

  return year >= start && year <= end;
}

function formatCareerStats(group: HonorGroupBase) {
  const values = [group.appearances, group.goals, group.assists].filter(
    (value) => value !== null && value !== undefined
  );

  return values.length ? values.join('/') : '';
}

function formatGroupMeta(group: HonorGroupBase) {
  const period = group.period ? `（${group.period}）` : '';
  const stats = formatCareerStats(group);

  return `${period}${stats}`;
}

function hasGroupMeta(group: HonorGroupBase) {
  return Boolean(formatGroupMeta(group));
}
</script>

<template>
  <div class="star-honor-profile">
    <section
      v-for="group in honorGroups"
      :key="group.key"
      class="honor-profile-group"
      :class="`is-${group.type}`"
    >
      <div class="honor-profile-group__header">
        <div class="honor-profile-group__title">
          <EntityLink
            v-if="group.type !== 'personal'"
            :id="group.teamId"
            :type="group.type"
            :name="group.teamName"
          />
          <strong v-else>{{ group.teamName }}</strong>
          <span v-if="hasGroupMeta(group)" class="honor-profile-group__meta">
            {{ formatGroupMeta(group) }}
          </span>
          <span v-if="group.type !== 'personal'" class="honor-profile-group__tags">
            <SemanticTag
              v-if="group.type === 'club' && group.countryName"
              :variant="getGroupCountryVariant(group)"
              size="small"
            >
              {{ group.countryName }}
            </SemanticTag>
            <SemanticTag
              v-if="group.type === 'country' && group.federationName"
              :variant="getGroupCountryVariant(group)"
              size="small"
            >
              {{ group.federationName }}
            </SemanticTag>
            <SemanticTag :variant="getGroupTypeVariant(group)" size="small">
              {{ getGroupTypeLabel(group) }}
            </SemanticTag>
          </span>
        </div>
      </div>

      <div v-if="group.trophies.length" class="honor-profile-block">
        <div class="honor-profile-block__title">奖杯</div>
        <ul class="honor-profile-list">
          <li v-for="subject in group.trophies" :key="subject.key" class="honor-profile-line">
            <span class="honor-profile-subject-wrap">
              <EntityLink
                :id="subject.subjectId"
                :type="subject.subjectType"
                :name="subject.subjectName"
              />
              <span class="honor-profile-subject-sep">：</span>
            </span>
            <span class="honor-profile-placements">
              <span
                v-for="(line, lineIndex) in subject.placements"
                :key="line.key"
                class="honor-profile-placement-line"
                :style="getLineStyle(line)"
              >
                <span class="honor-profile-periods">
                  <template
                    v-for="(period, periodIndex) in line.periods"
                    :key="`${line.key}-${period.label}-${periodIndex}`"
                  >
                    <a
                      v-if="period.externalUrl"
                      class="external-text-link"
                      :href="period.externalUrl"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {{ period.label }}
                    </a>
                    <span v-else>{{ period.label }}</span>
                    <span v-if="periodIndex < line.periods.length - 1">、</span>
                  </template>
                </span>
                <template v-if="formatLineCount(line)">
                  <span class="honor-profile-count">{{ formatLineCount(line) }}</span
                  ><span v-if="line.placement" class="honor-profile-placement is-attached">
                    {{ line.placement }}
                  </span>
                </template>
                <span v-else-if="line.placement" class="honor-profile-placement">
                  {{ line.placement }}
                </span>
                <span v-if="lineIndex < subject.placements.length - 1" class="honor-profile-sep">
                  ，
                </span>
              </span>
            </span>
          </li>
        </ul>
      </div>

      <div v-if="group.awards.length" class="honor-profile-block">
        <div class="honor-profile-block__title">奖项</div>
        <ul class="honor-profile-list">
          <li v-for="subject in group.awards" :key="subject.key" class="honor-profile-line">
            <span class="honor-profile-subject-wrap">
              <EntityLink
                :id="subject.subjectId"
                :type="subject.subjectType"
                :name="subject.subjectName"
              />
              <span class="honor-profile-subject-sep">：</span>
            </span>
            <span class="honor-profile-placements">
              <span
                v-for="(line, lineIndex) in subject.placements"
                :key="line.key"
                class="honor-profile-placement-line"
                :style="getLineStyle(line)"
              >
                <span class="honor-profile-periods">
                  <template
                    v-for="(period, periodIndex) in line.periods"
                    :key="`${line.key}-${period.label}-${periodIndex}`"
                  >
                    <a
                      v-if="period.externalUrl"
                      class="external-text-link"
                      :href="period.externalUrl"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {{ period.label }}
                    </a>
                    <span v-else>{{ period.label }}</span>
                    <span v-if="periodIndex < line.periods.length - 1">、</span>
                  </template>
                </span>
                <template v-if="formatLineCount(line)">
                  <span class="honor-profile-count">{{ formatLineCount(line) }}</span
                  ><span v-if="line.placement" class="honor-profile-placement is-attached">
                    {{ line.placement }}
                  </span>
                </template>
                <span v-else-if="line.placement" class="honor-profile-placement">
                  {{ line.placement }}
                </span>
                <span v-if="lineIndex < subject.placements.length - 1" class="honor-profile-sep">
                  ，
                </span>
              </span>
            </span>
          </li>
        </ul>
      </div>

      <div v-if="group.achievements.length" class="honor-profile-block">
        <div class="honor-profile-block__title">成就</div>
        <ul class="honor-profile-list">
          <li
            v-for="achievement in group.achievements"
            :key="achievement.id"
            class="honor-profile-line"
          >
            <a
              v-if="achievement.externalUrl"
              class="external-text-link"
              :href="achievement.externalUrl"
              target="_blank"
              rel="noreferrer"
            >
              {{ achievement.label }}
            </a>
            <span v-else>{{ achievement.label }}</span>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.star-honor-profile {
  display: grid;
  gap: 16px;
}

.honor-profile-group {
  display: grid;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border-subtle);

  &:last-child {
    padding-bottom: 0;
    border-bottom: 0;
  }
}

.honor-profile-group__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.honor-profile-group__title {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  color: var(--text-color-primary);
  font-size: 15px;
  font-weight: 800;

  > span:not(.honor-profile-group__tags):not(.honor-profile-group__meta) {
    color: var(--text-color-secondary);
    font-weight: 600;
  }
}

.honor-profile-group__meta {
  display: inline-flex;
  gap: 0;
  align-items: center;
  color: #666;
  font-weight: 600;
}

.honor-profile-group__tags {
  display: inline-flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  justify-content: flex-start;
  margin-left: 6px;
}

.honor-profile-block {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr);
  gap: 10px;
}

.honor-profile-block__title {
  color: var(--text-color-secondary);
  font-size: 13px;
  font-weight: 800;
  line-height: 1.7;
  text-align: right;
}

.honor-profile-list {
  display: grid;
  gap: 8px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.honor-profile-line {
  --honor-placement-color: var(--text-color-regular);

  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: baseline;
  padding-left: 13px;
  color: var(--text-color-regular);
  font-size: 14px;
  font-weight: 750;
  line-height: 1.7;

  &::before {
    position: absolute;
    top: 0.85em;
    left: 0;
    width: 5px;
    height: 5px;
    content: '';
    background: var(--honor-placement-color);
    border-radius: 999px;
    transform: translateY(-50%);
  }

  :deep(.entity-link),
  :deep(.entity-link-text),
  .external-text-link {
    color: inherit;
    font-weight: inherit;
  }
}

.honor-profile-subject-wrap {
  display: inline-flex;
  gap: 0;
  align-items: baseline;
  color: var(--color-brand-primary);
  font-weight: 800;
}

.honor-profile-subject-wrap :deep(.entity-link),
.honor-profile-subject-wrap :deep(.entity-link-text) {
  color: var(--color-brand-primary) !important;
}

.honor-profile-placements {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0;
  align-items: baseline;
  margin-left: 4px;
}

.honor-profile-placement-line {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0;
  align-items: baseline;
}

.honor-profile-subject-sep,
.honor-profile-sep {
  color: #666;
  font-weight: 700;
}

.honor-profile-periods {
  color: inherit;
  font-weight: 700;
}

.honor-profile-count,
.honor-profile-placement {
  color: inherit;
  font-weight: 750;
}

.honor-profile-count {
  margin-left: 4px;
}

.honor-profile-placement {
  margin-left: 4px;
}

.honor-profile-placement.is-attached {
  margin-left: 0;
}
</style>
