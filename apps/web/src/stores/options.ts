import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { fetchBaseConfigs, type BaseConfigItem, type BaseConfigType } from '@/services/base-config';
import { fetchCompetitions, type CompetitionListItem } from '@/services/competitions';
import {
  fetchClubs,
  fetchCountries,
  type ClubListItem,
  type CountryListItem,
  type PaginationResult
} from '@/services/catalog';

export interface SelectOption {
  id: string;
  value: string;
  label: string;
  uid?: string | null;
  code?: string | null;
  description?: string | null;
  group?: string | null;
  meta?: string[];
  chipLabel?: string | null;
  chipTheme?: string | null;
  confederationName?: string | null;
  targetType?: string;
}

type OptionType =
  | 'countries'
  | 'clubs'
  | 'competitions'
  | 'confederations'
  | 'positions'
  | 'playerTypes'
  | 'hairColors'
  | 'preferredFeet'
  | 'ethnicities'
  | 'cities';

const BASE_CONFIG_TYPE_MAP = {
  confederations: 'confederations',
  positions: 'positions',
  playerTypes: 'player-types',
  hairColors: 'hair-colors',
  preferredFeet: 'preferred-feet',
  ethnicities: 'ethnicities',
  cities: 'cities'
} satisfies Partial<Record<OptionType, BaseConfigType>>;

export const useOptionStore = defineStore('options', () => {
  const countries = ref<CountryListItem[]>([]);
  const clubs = ref<ClubListItem[]>([]);
  const competitions = ref<CompetitionListItem[]>([]);
  const confederations = ref<BaseConfigItem[]>([]);
  const positions = ref<BaseConfigItem[]>([]);
  const playerTypes = ref<BaseConfigItem[]>([]);
  const hairColors = ref<BaseConfigItem[]>([]);
  const preferredFeet = ref<BaseConfigItem[]>([]);
  const ethnicities = ref<BaseConfigItem[]>([]);
  const cities = ref<BaseConfigItem[]>([]);
  const loading = ref<Record<OptionType, boolean>>({
    countries: false,
    clubs: false,
    competitions: false,
    confederations: false,
    positions: false,
    playerTypes: false,
    hairColors: false,
    preferredFeet: false,
    ethnicities: false,
    cities: false
  });
  const loaded = ref<Record<OptionType, boolean>>({
    countries: false,
    clubs: false,
    competitions: false,
    confederations: false,
    positions: false,
    playerTypes: false,
    hairColors: false,
    preferredFeet: false,
    ethnicities: false,
    cities: false
  });
  const pending: Partial<Record<OptionType, Promise<void>>> = {};

  const countryOptions = computed(() =>
    [...countries.value].sort(compareCountries).map(countryToOption)
  );
  const clubOptions = computed(() => [...clubs.value].sort(compareClubs).map(clubToOption));
  const competitionOptions = computed(() => competitions.value.map(competitionToOption));
  const confederationOptions = computed(() =>
    confederations.value.map((confederation) => confederationToOption(confederation))
  );
  const positionOptions = computed(() =>
    positions.value.map((position) => positionToOption(position))
  );
  const playerTypeOptions = computed(() =>
    playerTypes.value.map((item) => baseConfigToOption(item))
  );
  const hairColorOptions = computed(() => hairColors.value.map((item) => baseConfigToOption(item)));
  const preferredFootOptions = computed(() =>
    preferredFeet.value.map((item) => baseConfigToOption(item))
  );
  const ethnicityOptions = computed(() =>
    ethnicities.value.map((item) => baseConfigToOption(item))
  );
  const cityOptions = computed(() => cities.value.map((item) => cityToOption(item)));

  async function ensureCountries() {
    await ensure('countries', async () => {
      countries.value = await fetchAll(fetchCountries, {
        sortBy: 'name',
        sortOrder: 'asc' as const
      });
    });
  }

  async function ensureClubs() {
    await ensure('clubs', async () => {
      clubs.value = await fetchAll(fetchClubs, {
        includeHidden: true,
        sortBy: 'name',
        sortOrder: 'asc' as const
      });
    });
  }

  async function ensureCompetitions() {
    await ensure('competitions', async () => {
      competitions.value = await fetchAll(fetchCompetitions, {});
    });
  }

  async function ensureConfederations() {
    await ensureBaseConfig('confederations', confederations);
  }

  async function ensurePositions() {
    await ensureBaseConfig('positions', positions);
  }

  async function ensurePlayerTypes() {
    await ensureBaseConfig('playerTypes', playerTypes);
  }

  async function ensureHairColors() {
    await ensureBaseConfig('hairColors', hairColors);
  }

  async function ensurePreferredFeet() {
    await ensureBaseConfig('preferredFeet', preferredFeet);
  }

  async function ensureEthnicities() {
    await ensureBaseConfig('ethnicities', ethnicities);
  }

  async function ensureCities() {
    await ensureBaseConfig('cities', cities);
  }

  function invalidate(type: OptionType | BaseConfigType) {
    const optionType = normalizeType(type);
    loaded.value[optionType] = false;
    delete pending[optionType];
  }

  async function refresh(type: OptionType | BaseConfigType) {
    const optionType = normalizeType(type);
    invalidate(optionType);
    await ensureByType(optionType);
  }

  async function ensureByType(type: OptionType) {
    const ensureMap: Record<OptionType, () => Promise<void>> = {
      countries: ensureCountries,
      clubs: ensureClubs,
      competitions: ensureCompetitions,
      confederations: ensureConfederations,
      positions: ensurePositions,
      playerTypes: ensurePlayerTypes,
      hairColors: ensureHairColors,
      preferredFeet: ensurePreferredFeet,
      ethnicities: ensureEthnicities,
      cities: ensureCities
    };

    await ensureMap[type]();
  }

  async function ensureBaseConfig(
    type: keyof typeof BASE_CONFIG_TYPE_MAP,
    target: typeof positions
  ) {
    await ensure(type, async () => {
      target.value = await fetchAll(
        (params) => fetchBaseConfigs(BASE_CONFIG_TYPE_MAP[type], params),
        {}
      );
    });
  }

  async function ensure(type: OptionType, loader: () => Promise<void>) {
    if (loaded.value[type]) {
      return;
    }

    if (!pending[type]) {
      loading.value[type] = true;
      pending[type] = loader()
        .then(() => {
          loaded.value[type] = true;
        })
        .finally(() => {
          loading.value[type] = false;
          delete pending[type];
        });
    }

    await pending[type];
  }

  return {
    countries,
    clubs,
    competitions,
    confederations,
    positions,
    playerTypes,
    hairColors,
    preferredFeet,
    ethnicities,
    cities,
    loading,
    countryOptions,
    clubOptions,
    competitionOptions,
    confederationOptions,
    positionOptions,
    playerTypeOptions,
    hairColorOptions,
    preferredFootOptions,
    ethnicityOptions,
    cityOptions,
    ensureCountries,
    ensureClubs,
    ensureCompetitions,
    ensureConfederations,
    ensurePositions,
    ensurePlayerTypes,
    ensureHairColors,
    ensurePreferredFeet,
    ensureEthnicities,
    ensureCities,
    invalidate,
    refresh
  };
});

async function fetchAll<T, P extends Record<string, unknown>>(
  fetcher: (params: P & { page: number; pageSize: number }) => Promise<PaginationResult<T>>,
  params: P
) {
  const items: T[] = [];
  let page = 1;
  let total = 0;

  do {
    const result = await fetcher({
      ...params,
      page,
      pageSize: 100
    });
    items.push(...result.items);
    total = result.total;
    page += 1;
  } while (items.length < total);

  return items;
}

function countryToOption(country: CountryListItem): SelectOption {
  const confederation = country.federationRef?.name ?? country.federation;

  return {
    id: country.id,
    value: country.id,
    label: country.name,
    uid: country.uid,
    description: confederation,
    meta: [formatUid(country.uid)],
    chipLabel: confederation,
    confederationName: confederation
  };
}

function clubToOption(club: ClubListItem): SelectOption {
  const country = club.countryRef?.name ?? club.country;
  const confederation = club.federationRef?.name ?? club.federation;

  return {
    id: club.id,
    value: club.id,
    label: club.name,
    uid: club.uid,
    description: country,
    meta: [formatUid(club.uid), country].filter(Boolean) as string[],
    chipLabel: confederation,
    confederationName: confederation
  };
}

function competitionToOption(competition: CompetitionListItem): SelectOption {
  return {
    id: competition.id,
    value: competition.id,
    label: competition.name,
    code: competition.code,
    description: [competition.category, competition.level, competition.format]
      .filter(Boolean)
      .join(' / '),
    targetType: competition.targetType
  };
}

function baseConfigToOption(item: BaseConfigItem, value = item.id): SelectOption {
  return {
    id: item.id,
    value,
    label: item.name || item.code || item.uid || item.id,
    uid: item.uid,
    code: item.code,
    description: item.description,
    group: item.group,
    meta: [formatUid(item.uid), item.code, item.group, item.description].filter(Boolean) as string[]
  };
}

function cityToOption(item: BaseConfigItem): SelectOption {
  const countryName = item.country?.name;

  return {
    id: item.id,
    value: item.id,
    label: item.name || item.uid || item.id,
    uid: item.uid,
    description: countryName,
    meta: [formatUid(item.uid), countryName].filter(Boolean) as string[],
    chipLabel: countryName
  };
}

function confederationToOption(item: BaseConfigItem): SelectOption {
  return {
    id: item.id,
    value: item.id,
    label: item.name || item.code || item.uid || item.id,
    uid: item.uid,
    code: item.code,
    description: item.description,
    meta: [formatUid(item.uid)].filter(Boolean) as string[],
    chipLabel: item.name,
    confederationName: item.name
  };
}

function positionToOption(item: BaseConfigItem): SelectOption {
  const code = resolvePositionCode(item);
  const group = resolvePositionGroup(item, code);

  return {
    id: item.id,
    value: code || item.id,
    label: item.name || code || item.id,
    code,
    description: item.description,
    group,
    meta: [code].filter(Boolean) as string[],
    chipLabel: group,
    chipTheme: `position-${groupThemeKey(group)}`
  };
}

function compareCountries(a: CountryListItem, b: CountryListItem) {
  return compareUidThenName(a.uid, a.name, b.uid, b.name, 'zh-Hans-CN');
}

function compareClubs(a: ClubListItem, b: ClubListItem) {
  return compareUidThenName(a.uid, a.name, b.uid, b.name, 'en');
}

function compareUidThenName(
  uidAValue: string | null | undefined,
  nameA: string,
  uidBValue: string | null | undefined,
  nameB: string,
  locale: string
) {
  const uidA = uidSortValue(uidAValue);
  const uidB = uidSortValue(uidBValue);

  if (uidA !== null && uidB !== null) {
    return uidA - uidB;
  }

  if (uidA !== null) {
    return -1;
  }

  if (uidB !== null) {
    return 1;
  }

  return nameA.localeCompare(nameB, locale, {
    numeric: true,
    sensitivity: 'base'
  });
}

function uidSortValue(uid?: string | null) {
  const value = uid?.trim();

  if (!value || value === '-') {
    return null;
  }

  const numericUid = Number(value);

  return Number.isFinite(numericUid) ? numericUid : null;
}

function formatUid(uid?: string | null) {
  return uid ? `UID ${uid}` : '';
}

function resolvePositionCode(item: BaseConfigItem) {
  const map: Record<string, string> = {
    ATTACKER_CENTRAL: 'ST',
    ATTACKING_MIDFIELDER_RIGHT_SIDE: 'AMR',
    ATTACKING_MIDFIELDER_LEFT_SIDE: 'AML',
    ATTACKING_MIDFIELDER_CENTRAL: 'AMC',
    MIDFIELDER_CENTRAL: 'MC',
    DEFENSIVE_MIDFIELDER_CENTRAL: 'DMC',
    MIDFIELDER_LEFT_SIDE: 'ML',
    MIDFIELDER_RIGHT_SIDE: 'MR',
    WING_BACK_RIGHT_SIDE: 'WBR',
    WING_BACK_LEFT_SIDE: 'WBL',
    DEFENDER_LEFT_SIDE: 'DL',
    DEFENDER_CENTRAL: 'DC',
    DEFENDER_RIGHT_SIDE: 'DR',
    GOALKEEPER: 'GK'
  };
  const code = item.code ?? '';

  if (map[code]) {
    return map[code];
  }

  if (code) {
    return code;
  }

  const description = item.description ?? '';

  return map[description] ?? item.uid ?? '';
}

function resolvePositionGroup(item: BaseConfigItem, code: string) {
  if (code === 'GK' || /门将|守门/i.test(item.name ?? item.description ?? '')) {
    return '门将';
  }

  const groupMap: Record<string, string> = {
    ST: '前场',
    AMR: '前场',
    AML: '前场',
    AMC: '中场',
    MC: '中场',
    DMC: '中场',
    ML: '中场',
    MR: '中场',
    WBR: '中场',
    WBL: '中场',
    DL: '后场',
    DC: '后场',
    DR: '后场'
  };

  return groupMap[code] ?? item.group ?? '';
}

function groupThemeKey(group?: string | null) {
  const map: Record<string, string> = {
    前场: 'forward',
    中场: 'midfield',
    后场: 'backfield',
    门将: 'goalkeeper'
  };

  return map[group ?? ''] ?? 'default';
}

function normalizeType(type: OptionType | BaseConfigType): OptionType {
  const map: Record<string, OptionType> = {
    countries: 'countries',
    clubs: 'clubs',
    competitions: 'competitions',
    confederations: 'confederations',
    positions: 'positions',
    'player-types': 'playerTypes',
    playerTypes: 'playerTypes',
    'hair-colors': 'hairColors',
    hairColors: 'hairColors',
    'preferred-feet': 'preferredFeet',
    preferredFeet: 'preferredFeet',
    ethnicities: 'ethnicities',
    cities: 'cities'
  };

  return map[type];
}

export type { OptionType };
