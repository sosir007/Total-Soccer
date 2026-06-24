<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';
import { fetchPlayerDetail, type NamedRef, type PlayerDetail } from '@/services/catalog';
import { useRouteTabsStore } from '@/stores/route-tabs';
import { buildExternalUrl } from '@/utils/external-link';

const route = useRoute();
const router = useRouter();
const routeTabsStore = useRouteTabsStore();
const loading = ref(false);
const errorMessage = ref('');
const player = ref<PlayerDetail | null>(null);
const playerId = computed(() => String(route.params.id ?? ''));

async function loadPlayer() {
  if (!playerId.value) {
    player.value = null;
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    player.value = await fetchPlayerDetail(playerId.value);
    routeTabsStore.setTitle(route.fullPath, player.value.chineseName);
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '巨星详情加载失败。';
    ElMessage.error(errorMessage.value);
  } finally {
    loading.value = false;
  }
}

function formatRef(ref?: NamedRef | null) {
  return ref?.name ?? '-';
}

function formatDate(value?: string | number | null) {
  return value ? dayjs(value).format('YYYY-MM-DD') : '-';
}

function formatText(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '-' : value;
}

function formatAge() {
  if (player.value?.deceased || player.value?.deathDate) {
    return '-';
  }

  if (!player.value?.birthDate) {
    return formatText(player.value?.age);
  }

  const birthDate = dayjs(player.value.birthDate);

  if (!birthDate.isValid() || birthDate.isAfter(dayjs(), 'day')) {
    return formatText(player.value.age);
  }

  return dayjs().diff(birthDate, 'year');
}

function formatNationality() {
  const names = player.value?.nationalities?.map((item) => item.country.name).filter(Boolean);

  return names?.length ? names.join('、') : formatText(player.value?.nationality);
}

function formatBirthCity() {
  const city = player.value?.birthCityRef?.name ?? player.value?.birthCity;
  const country = player.value?.birthCityRef?.country?.name ?? player.value?.birthCountry?.name;

  if (!city) {
    return '-';
  }

  return country ? `${city}（${country}）` : city;
}

function formatFoot() {
  return formatText(player.value?.foot || player.value?.preferredFootRef?.name);
}

function formatBoolean(value?: boolean | null) {
  if (value === true) {
    return '是';
  }

  if (value === false) {
    return '否';
  }

  return '-';
}

function playerExternalUrl() {
  const fallbackName =
    player.value?.chineseName || player.value?.englishName || player.value?.uid || '球员';

  return buildExternalUrl(player.value?.externalUrl, fallbackName);
}

function backToList() {
  void router.push({
    name: 'stars-overview'
  });
}

function openEditDialog() {
  if (!playerId.value) {
    return;
  }

  void router.push({
    name: 'stars-edit-id',
    params: { id: playerId.value }
  });
}

function openClubDetail(id?: string | null) {
  if (!id) {
    return;
  }

  void router.push({
    name: 'clubs-detail-id',
    params: { id }
  });
}

function openCountryDetail(id?: string | null) {
  if (!id) {
    return;
  }

  void router.push({
    name: 'nations-detail-id',
    params: { id }
  });
}

function formatCareerPeriod(career: {
  startSeason?: string | null;
  endSeason?: string | null;
  startYear?: number | null;
  endYear?: number | null;
}) {
  if (career.startSeason || career.endSeason) {
    return [career.startSeason, career.endSeason].filter(Boolean).join(' - ') || '-';
  }

  if (career.startYear || career.endYear) {
    return [career.startYear, career.endYear].filter(Boolean).join(' - ');
  }

  return '-';
}

function formatCareerStats(career: {
  appearances?: number | null;
  goals?: number | null;
  assists?: number | null;
  cleanSheets?: number | null;
  goalsConceded?: number | null;
}) {
  const normal = [career.appearances, career.goals, career.assists]
    .map((item) => item ?? '-')
    .join('/');
  const goalkeeper = [career.cleanSheets, career.goalsConceded].some(
    (item) => item !== null && item !== undefined
  )
    ? `，零封/失球 ${career.cleanSheets ?? '-'}/${career.goalsConceded ?? '-'}`
    : '';

  return `${normal}${goalkeeper}`;
}

function formatAwardEdition(honor: NonNullable<PlayerDetail['personalHonors']>[number]) {
  return honor.edition.season || honor.edition.name || honor.edition.year || '-';
}

function formatAwardPlacement(honor: NonNullable<PlayerDetail['personalHonors']>[number]) {
  if (honor.placement) {
    return honor.placement;
  }

  return honor.rank ? `第 ${honor.rank} 名` : '-';
}

function awardUrl(honor: NonNullable<PlayerDetail['personalHonors']>[number]) {
  return buildExternalUrl(honor.edition.award.externalUrl, honor.edition.award.name);
}

function awardEditionUrl(honor: NonNullable<PlayerDetail['personalHonors']>[number]) {
  return buildExternalUrl(
    honor.edition.externalUrl || honor.externalUrl,
    `${honor.edition.award.name} ${formatAwardEdition(honor)}`
  );
}

watch(playerId, () => {
  void loadPlayer();
});

onMounted(() => {
  void loadPlayer();
});
</script>

<template>
  <section class="page-stack">
    <div v-if="!playerId" class="panel empty-panel">
      <h3>请选择巨星</h3>
      <p>从巨星概览进入详情，可以查看完整基础资料。</p>
      <el-button type="primary" @click="backToList">返回巨星概览</el-button>
    </div>

    <div v-else-if="loading" class="panel">
      <el-skeleton :rows="10" animated />
    </div>

    <div v-else-if="errorMessage" class="panel">
      <el-alert type="error" :title="errorMessage" show-icon :closable="false" />
      <div class="detail-actions">
        <el-button @click="backToList">返回巨星概览</el-button>
        <el-button type="primary" @click="loadPlayer">重试</el-button>
      </div>
    </div>

    <template v-else-if="player">
      <div class="panel player-detail-hero">
        <div>
          <div class="detail-kicker">{{ formatRef(player.confederationRef) }}</div>
          <a
            class="external-title-link"
            :href="playerExternalUrl()"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>{{ player.chineseName }}</h2>
          </a>
          <p>{{ player.englishName || player.uid }}</p>
          <div class="detail-tags">
            <el-tag type="success">PA {{ formatText(player.pa) }}</el-tag>
            <el-tag>CA {{ formatText(player.ca) }}</el-tag>
            <el-tag type="warning">荣誉分 {{ formatText(player.honorScore) }}</el-tag>
            <el-tag type="warning">{{ formatRef(player.playerTypeRef) }}</el-tag>
            <el-tag v-if="player.deceased" type="info">已故</el-tag>
            <el-tag v-else-if="player.retired" type="warning">退役</el-tag>
            <el-tag v-else type="success">现役</el-tag>
          </div>
        </div>
        <div class="panel-actions">
          <el-button type="primary" @click="openEditDialog">编辑</el-button>
          <el-button @click="backToList">返回列表</el-button>
        </div>
      </div>

      <div class="detail-grid">
        <div class="panel">
          <div class="panel-header">
            <h3>基础资料</h3>
            <span class="status-pill">UID {{ player.uid }}</span>
          </div>
          <dl class="detail-list">
            <div>
              <dt>生日</dt>
              <dd>{{ formatDate(player.birthDate) }}</dd>
            </div>
            <div>
              <dt>过世</dt>
              <dd>{{ formatDate(player.deathDate) }}</dd>
            </div>
            <div>
              <dt>年龄</dt>
              <dd>{{ formatAge() }}</dd>
            </div>
            <div>
              <dt>身高 / 体重</dt>
              <dd>{{ formatText(player.height) }} cm / {{ formatText(player.weight) }} kg</dd>
            </div>
            <div>
              <dt>球衣</dt>
              <dd>{{ formatText(player.shirtNumber) }}</dd>
            </div>
            <div>
              <dt>数据库</dt>
              <dd>{{ formatText(player.databaseSource) }}</dd>
            </div>
            <div>
              <dt>外部链接</dt>
              <dd>
                <a
                  class="external-text-link"
                  :href="playerExternalUrl()"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ player.externalUrl || 'Google 搜索' }}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div class="panel">
          <div class="panel-header">
            <h3>关联信息</h3>
            <span class="status-pill">资料库</span>
          </div>
          <dl class="detail-list">
            <div>
              <dt>国家</dt>
              <dd>{{ formatRef(player.country) }}</dd>
            </div>
            <div>
              <dt>代表国籍</dt>
              <dd>{{ formatText(player.representedCountry) }}</dd>
            </div>
            <div>
              <dt>国籍</dt>
              <dd>{{ formatNationality() }}</dd>
            </div>
            <div>
              <dt>俱乐部</dt>
              <dd>{{ formatRef(player.club) }}</dd>
            </div>
            <div>
              <dt>主要球队</dt>
              <dd>{{ formatText(player.primaryClub) }}</dd>
            </div>
            <div>
              <dt>出生城市</dt>
              <dd>{{ formatBirthCity() }}</dd>
            </div>
            <div>
              <dt>担任过职位</dt>
              <dd>{{ formatText(player.staffRoles) }}</dd>
            </div>
          </dl>
        </div>

        <div class="panel">
          <div class="panel-header">
            <h3>能力与属性</h3>
            <span class="status-pill">FM Data</span>
          </div>
          <dl class="detail-list">
            <div>
              <dt>位置</dt>
              <dd>{{ formatText(player.positions) }}</dd>
            </div>
            <div>
              <dt>荣誉分</dt>
              <dd>{{ formatText(player.honorScore) }}</dd>
            </div>
            <div>
              <dt>奖项数</dt>
              <dd>{{ formatText(player.awardCount) }}</dd>
            </div>
            <div>
              <dt>顶级奖项</dt>
              <dd>{{ formatText(player.topAwardCount) }}</dd>
            </div>
            <div>
              <dt>左右脚</dt>
              <dd>{{ formatFoot() }}</dd>
            </div>
            <div>
              <dt>种族</dt>
              <dd>{{ formatRef(player.ethnicityRef) }}</dd>
            </div>
            <div>
              <dt>发色</dt>
              <dd>{{ formatRef(player.hairColorRef) }}</dd>
            </div>
            <div>
              <dt>肤色</dt>
              <dd>{{ formatText(player.skinTone) }}</dd>
            </div>
          </dl>
        </div>

        <div class="panel">
          <div class="panel-header">
            <h3>生涯摘要</h3>
            <span class="status-pill">备注</span>
          </div>
          <dl class="detail-list wide">
            <div>
              <dt>初始球队</dt>
              <dd>{{ formatText(player.initialClub) }}</dd>
            </div>
            <div>
              <dt>球队经历</dt>
              <dd>{{ formatText(player.clubs) }}</dd>
            </div>
            <div>
              <dt>是否退役</dt>
              <dd>{{ formatBoolean(player.retired) }}</dd>
            </div>
            <div>
              <dt>是否去世</dt>
              <dd>{{ formatBoolean(player.deceased) }}</dd>
            </div>
            <div>
              <dt>成就</dt>
              <dd>{{ formatText(player.achievement) }}</dd>
            </div>
            <div>
              <dt>备注</dt>
              <dd>{{ formatText(player.remark) }}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div class="detail-grid">
        <div class="panel">
          <div class="panel-header">
            <h3>俱乐部经历</h3>
            <span class="status-pill">{{ player.profileClubCareers?.length ?? 0 }} 段</span>
          </div>

          <div v-if="!player.profileClubCareers?.length" class="mini-empty">
            暂无结构化俱乐部经历
          </div>

          <el-table v-else :data="player.profileClubCareers" border>
            <el-table-column label="俱乐部" min-width="150">
              <template #default="{ row }">
                <button
                  v-if="row.club"
                  class="table-name-link"
                  type="button"
                  @click="openClubDetail(row.club.id)"
                >
                  {{ row.club.name }}
                </button>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="时间" min-width="120">
              <template #default="{ row }">{{ formatCareerPeriod(row) }}</template>
            </el-table-column>
            <el-table-column prop="position" label="位置" width="90" />
            <el-table-column label="场/球/助" width="120">
              <template #default="{ row }">{{ formatCareerStats(row) }}</template>
            </el-table-column>
            <el-table-column label="标签" width="170">
              <template #default="{ row }">
                <el-tag v-if="row.isRepresentative" size="small" type="success">代表</el-tag>
                <el-tag v-if="row.isLegend" size="small" type="warning">名宿</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="panel">
          <div class="panel-header">
            <h3>国家队经历</h3>
            <span class="status-pill">{{ player.countryCareers?.length ?? 0 }} 段</span>
          </div>

          <div v-if="!player.countryCareers?.length" class="mini-empty">暂无结构化国家队经历</div>

          <el-table v-else :data="player.countryCareers" border>
            <el-table-column label="国家队" min-width="150">
              <template #default="{ row }">
                <button
                  v-if="row.country"
                  class="table-name-link"
                  type="button"
                  @click="openCountryDetail(row.country.id)"
                >
                  {{ row.country.name }}
                </button>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="时间" min-width="120">
              <template #default="{ row }">{{ formatCareerPeriod(row) }}</template>
            </el-table-column>
            <el-table-column prop="position" label="位置" width="90" />
            <el-table-column label="场/球/助" width="120">
              <template #default="{ row }">{{ formatCareerStats(row) }}</template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <h3>个人荣誉</h3>
          <span class="status-pill">{{ player.personalHonors?.length ?? 0 }} 条</span>
        </div>

        <div v-if="!player.personalHonors?.length" class="mini-empty">暂无结构化个人荣誉</div>

        <el-table v-else :data="player.personalHonors" border>
          <el-table-column label="奖项" min-width="170" fixed>
            <template #default="{ row }">
              <div class="player-name-cell">
                <a
                  class="external-text-link"
                  :href="awardUrl(row)"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ row.edition.award.name }}
                </a>
                <span>{{ row.edition.award.category || row.edition.award.code }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="年份 / 届次" min-width="150">
            <template #default="{ row }">
              <a
                class="external-text-link"
                :href="awardEditionUrl(row)"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ formatAwardEdition(row) }}
              </a>
            </template>
          </el-table-column>
          <el-table-column label="年份" width="90">
            <template #default="{ row }">{{ row.edition.year || '-' }}</template>
          </el-table-column>
          <el-table-column label="名次" width="110">
            <template #default="{ row }">
              <el-tag type="warning">{{ formatAwardPlacement(row) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="备注" min-width="180">
            <template #default="{ row }">{{ formatText(row.remark) }}</template>
          </el-table-column>
        </el-table>
      </div>
    </template>
  </section>
</template>
