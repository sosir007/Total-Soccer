<script setup lang="ts">
import dayjs from 'dayjs';
import AbilityBadge from '@/components/AbilityBadge.vue';
import EntityLink from '@/components/EntityLink.vue';
import EntityNameCell from '@/components/EntityNameCell.vue';
import IconFont from '@/components/IconFont.vue';
import PositionTags from '@/components/PositionTags.vue';
import SemanticTag from '@/components/SemanticTag.vue';
import type { PlayerDetail } from '@/services/types/catalog';
import type { NamedRef } from '@/services/types/common';
import { buildExternalUrl } from '@/utils/external-link';
import {
  getCareerStatusLabel,
  getCareerStatusVariant,
  getConfederationVariant,
  getLifeStatusLabel,
  getLifeStatusVariant,
  getPlayerStatusLabel,
  getPlayerStatusVariant
} from '@/utils/tag-theme';

const props = defineProps<{
  player: PlayerDetail;
}>();

const emit = defineEmits<{
  edit: [];
  manageResume: [];
  back: [];
}>();

const placementLabels = {
  CHAMPION: '冠军',
  RUNNER_UP: '亚军',
  THIRD_PLACE: '季军',
  FOURTH_PLACE: '殿军',
  SEMI_FINALIST: '四强'
} as const;

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
  if (props.player.deceased || props.player.deathDate) {
    return '-';
  }

  if (!props.player.birthDate) {
    return formatText(props.player.age);
  }

  const birthDate = dayjs(props.player.birthDate);

  if (!birthDate.isValid() || birthDate.isAfter(dayjs(), 'day')) {
    return formatText(props.player.age);
  }

  return dayjs().diff(birthDate, 'year');
}

function formatNationality() {
  const names = props.player.nationalities?.map((item) => item.country.name).filter(Boolean);

  return names?.length ? names.join('、') : formatText(props.player.nationality);
}

function formatBirthCity() {
  const city = props.player.birthCityRef?.name ?? props.player.birthCity;
  const country = props.player.birthCityRef?.country?.name ?? props.player.birthCountry?.name;

  if (!city) {
    return '-';
  }

  return country ? `${city}（${country}）` : city;
}

function formatFoot() {
  return formatText(props.player.foot || props.player.preferredFootRef?.name);
}

function playerExternalUrl() {
  const fallbackName =
    props.player.chineseName || props.player.englishName || props.player.uid || '球员';

  return buildExternalUrl(props.player.externalUrl, fallbackName);
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

function awardEditionUrl(honor: NonNullable<PlayerDetail['personalHonors']>[number]) {
  return buildExternalUrl(
    honor.edition.externalUrl || honor.externalUrl,
    `${honor.edition.award.name} ${formatAwardEdition(honor)}`
  );
}

function formatTeamHonor(row: NonNullable<PlayerDetail['teamHonors']>[number]) {
  const team = row.standing.club?.name ?? row.standing.country?.name ?? '-';
  const competition = row.standing.edition.competition.name;
  const edition =
    row.standing.edition.season || row.standing.edition.name || row.standing.edition.year || '-';
  const placement = placementLabels[row.standing.placement] ?? row.standing.placement;

  return `${team} / ${competition} / ${edition} / ${placement}`;
}
</script>

<template>
  <template v-if="player">
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
          <AbilityBadge type="PA" :value="player.pa" />
          <AbilityBadge type="CA" :value="player.ca" />
          <SemanticTag variant="status-legend">
            荣誉分 {{ formatText(player.honorScore) }}
          </SemanticTag>
          <SemanticTag variant="object-player">{{ formatRef(player.playerTypeRef) }}</SemanticTag>
          <SemanticTag :variant="getPlayerStatusVariant(player)">
            {{ getPlayerStatusLabel(player) }}
          </SemanticTag>
        </div>
      </div>
      <div class="panel-actions">
        <el-button type="primary" @click="emit('edit')">
          <IconFont name="edit" />
          编辑资料
        </el-button>
        <el-button type="success" @click="emit('manageResume')">
          <IconFont name="edit" />
          履历管理
        </el-button>
        <el-button @click="emit('back')">
          <IconFont name="back" />
          返回列表
        </el-button>
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
            <dt>代表国籍</dt>
            <dd>
              <EntityLink
                :id="player.country?.id"
                type="country"
                :name="formatText(player.representedCountry || player.country?.name)"
              />
            </dd>
          </div>
          <div>
            <dt>国籍</dt>
            <dd>
              <div v-if="player.nationalities?.length" class="inline-entity-list">
                <EntityLink
                  v-for="item in player.nationalities"
                  :id="item.country.id"
                  :key="item.country.id"
                  type="country"
                  :name="item.country.name"
                />
              </div>
              <span v-else>{{ formatNationality() }}</span>
            </dd>
          </div>
          <div>
            <dt>足联</dt>
            <dd>
              <SemanticTag
                v-if="formatRef(player.confederationRef) !== '-'"
                :variant="getConfederationVariant(formatRef(player.confederationRef))"
              >
                {{ formatRef(player.confederationRef) }}
              </SemanticTag>
              <span v-else>-</span>
            </dd>
          </div>
          <div>
            <dt>俱乐部</dt>
            <dd>
              <EntityLink :id="player.club?.id" type="club" :name="formatRef(player.club)" />
            </dd>
          </div>
          <div>
            <dt>主要球队</dt>
            <dd>
              <EntityLink
                :id="player.representativeClubCareer?.club?.id ?? player.club?.id"
                type="club"
                :name="
                  formatText(player.representativeClubCareer?.club?.name || player.primaryClub)
                "
              />
            </dd>
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
            <dt>代表位置</dt>
            <dd>
              <PositionTags :value="player.primaryRole" />
            </dd>
          </div>
          <div>
            <dt>位置</dt>
            <dd>
              <PositionTags :value="player.positions" />
            </dd>
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
            <dt>生涯</dt>
            <dd>
              <SemanticTag
                v-if="player.retired !== null && player.retired !== undefined"
                :variant="getCareerStatusVariant(player.retired)"
                size="small"
              >
                {{ getCareerStatusLabel(player.retired) }}
              </SemanticTag>
              <span v-else>-</span>
            </dd>
          </div>
          <div>
            <dt>生命</dt>
            <dd>
              <SemanticTag
                v-if="player.deceased !== null && player.deceased !== undefined"
                :variant="getLifeStatusVariant(player.deceased)"
                size="small"
              >
                {{ getLifeStatusLabel(player.deceased) }}
              </SemanticTag>
              <span v-else>-</span>
            </dd>
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

        <div v-if="!player.profileClubCareers?.length" class="mini-empty">暂无结构化俱乐部经历</div>

        <el-table v-else :data="player.profileClubCareers" border>
          <el-table-column label="俱乐部" min-width="150">
            <template #default="{ row }">
              <EntityLink :id="row.club?.id" type="club" :name="row.club?.name" />
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
              <SemanticTag v-if="row.isRepresentative" size="small" variant="status-representative">
                代表
              </SemanticTag>
              <SemanticTag v-if="row.isLegend" size="small" variant="status-legend">
                名宿
              </SemanticTag>
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
              <EntityLink :id="row.country?.id" type="country" :name="row.country?.name" />
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
            <EntityNameCell
              :id="row.edition.award.id"
              type="award"
              :title="row.edition.award.name"
              :subtitle="row.edition.award.category || row.edition.award.code"
            />
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
            <SemanticTag variant="status-top-award">{{ formatAwardPlacement(row) }}</SemanticTag>
          </template>
        </el-table-column>
        <el-table-column label="备注" min-width="180">
          <template #default="{ row }">{{ formatText(row.remark) }}</template>
        </el-table-column>
      </el-table>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>团队荣誉</h3>
        <span class="status-pill">{{ player.teamHonors?.length ?? 0 }} 条</span>
      </div>

      <div v-if="!player.teamHonors?.length" class="mini-empty">暂无确认关联的团队荣誉</div>

      <el-table v-else :data="player.teamHonors" border>
        <el-table-column label="关联荣誉" min-width="300" show-overflow-tooltip>
          <template #default="{ row }">{{ formatTeamHonor(row) }}</template>
        </el-table-column>
        <el-table-column label="来源" width="110" align="center">
          <template #default="{ row }">
            {{
              row.sourceType === 'MANUAL'
                ? '手动资料'
                : row.sourceType === 'CAREER_MATCH'
                  ? '经历反查'
                  : '批量导入'
            }}
          </template>
        </el-table-column>
        <el-table-column label="备注" min-width="180" show-overflow-tooltip>
          <template #default="{ row }">{{ formatText(row.remark) }}</template>
        </el-table-column>
      </el-table>
    </div>
  </template>
</template>
