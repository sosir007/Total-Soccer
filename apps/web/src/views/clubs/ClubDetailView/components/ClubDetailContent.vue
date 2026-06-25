<script setup lang="ts">
import EntityLink from '@/components/EntityLink.vue';
import EntityNameCell from '@/components/EntityNameCell.vue';
import type { CareerProfileLine, ClubDetail, LineupPositionGroup } from '@/services/types/catalog';
import type { NamedRef } from '@/services/types/common';
import { buildExternalUrl } from '@/utils/external-link';
import {
  formatHonorEdition,
  formatPlacement,
  getStandingRef,
  placementOptions
} from '@/utils/honor';

const props = defineProps<{
  club: ClubDetail;
}>();

const emit = defineEmits<{
  edit: [];
  back: [];
  openPlayer: [id?: string | null];
}>();

function formatNumber(value?: number | null, digits = 0) {
  if (value === null || value === undefined) {
    return '-';
  }

  return new Intl.NumberFormat('zh-CN', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  }).format(value);
}

function formatRef(ref?: NamedRef | null) {
  return ref?.name ?? '-';
}

function formatText(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '-' : value;
}

function clubExternalUrl() {
  return buildExternalUrl(props.club.externalUrl, props.club.name || '俱乐部');
}

function formatLineStats(item: CareerProfileLine) {
  const normal = [item.appearances, item.goals, item.assists]
    .map((value) => value ?? '-')
    .join('/');
  const goalkeeper = [item.cleanSheets, item.goalsConceded].some(
    (value) => value !== null && value !== undefined
  )
    ? `，零封/失球 ${item.cleanSheets ?? '-'}/${item.goalsConceded ?? '-'}`
    : '';

  return `${normal}${goalkeeper}`;
}

function countLineupItems(groups?: LineupPositionGroup[]) {
  return groups?.reduce((sum, group) => sum + group.items.length, 0) ?? 0;
}

function hasLineupItems(groups?: LineupPositionGroup[]) {
  return countLineupItems(groups) > 0;
}
</script>

<template>
  <div class="panel player-detail-hero">
    <div>
      <div class="detail-kicker">{{ formatRef(club.federationRef) }}</div>
      <a
        class="external-title-link"
        :href="clubExternalUrl()"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2>{{ club.name }}</h2>
      </a>
      <p>UID {{ club.uid }}</p>
      <div class="detail-tags">
        <el-tag type="success">球员 {{ formatNumber(club.playerCount) }}</el-tag>
        <el-tag>平均 PA {{ formatNumber(club.averagePa, 2) }}</el-tag>
        <el-tag type="warning">荣誉分 {{ formatNumber(club.honorScore, 2) }}</el-tag>
      </div>
    </div>
    <div class="panel-actions">
      <el-button type="primary" @click="emit('edit')">编辑</el-button>
      <el-button @click="emit('back')">返回列表</el-button>
    </div>
  </div>

  <div class="metric-grid">
    <div class="metric-card">
      <span>总 PA</span>
      <strong>{{ formatNumber(club.totalPa) }}</strong>
      <em>俱乐部球员能力总量</em>
    </div>
    <div class="metric-card gold">
      <span>奖杯数</span>
      <strong>{{ formatNumber(club.trophyCount) }}</strong>
      <em>俱乐部荣誉累计</em>
    </div>
    <div class="metric-card">
      <span>冠军数</span>
      <strong>{{ formatNumber(club.championCount) }}</strong>
      <em>冠军荣誉统计</em>
    </div>
    <div class="metric-card">
      <span>关联球员</span>
      <strong>{{ formatNumber(club._count?.players ?? club.playerCount) }}</strong>
      <em>资料库关联数量</em>
    </div>
  </div>

  <div class="detail-grid">
    <div class="panel">
      <div class="panel-header">
        <h3>基础资料</h3>
        <span class="status-pill">豪门殿堂</span>
      </div>
      <dl class="detail-list">
        <div>
          <dt>俱乐部</dt>
          <dd>{{ club.name }}</dd>
        </div>
        <div>
          <dt>UID</dt>
          <dd>{{ club.uid }}</dd>
        </div>
        <div>
          <dt>是否展示</dt>
          <dd>{{ club.exists ? '是' : '否' }}</dd>
        </div>
        <div>
          <dt>荣誉分</dt>
          <dd>{{ formatNumber(club.honorScore, 2) }}</dd>
        </div>
        <div>
          <dt>外部链接</dt>
          <dd>
            <a
              class="external-text-link"
              :href="clubExternalUrl()"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ club.externalUrl || 'Google 搜索' }}
            </a>
          </dd>
        </div>
        <div>
          <dt>备注</dt>
          <dd>{{ formatText(club.remark) }}</dd>
        </div>
      </dl>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>关联信息</h3>
        <span class="status-pill">真实数据</span>
      </div>
      <dl class="detail-list">
        <div>
          <dt>国家</dt>
          <dd>{{ formatRef(club.countryRef) }}</dd>
        </div>
        <div>
          <dt>原始国家</dt>
          <dd>{{ formatText(club.country) }}</dd>
        </div>
        <div>
          <dt>足联</dt>
          <dd>{{ formatRef(club.federationRef) }}</dd>
        </div>
        <div>
          <dt>原始足联</dt>
          <dd>{{ formatText(club.federation) }}</dd>
        </div>
      </dl>
    </div>
  </div>

  <div class="panel">
    <div class="panel-header">
      <h3>荣誉明细</h3>
      <span class="status-pill">{{ club.honorRecords?.length ?? 0 }} 条最近记录</span>
    </div>

    <div v-if="!club.honorRecords?.length" class="mini-empty">暂无赛事荣誉记录</div>

    <el-table v-else :data="club.honorRecords" border>
      <el-table-column label="赛事" min-width="150" fixed>
        <template #default="{ row }">
          <EntityNameCell
            :id="row.competition.id"
            type="competition"
            :title="row.competition.name"
            :subtitle="row.competition.category || row.competition.level || row.competition.code"
          />
        </template>
      </el-table-column>
      <el-table-column label="届次 / 赛季" min-width="150">
        <template #default="{ row }">{{ formatHonorEdition(row) }}</template>
      </el-table-column>
      <el-table-column label="年份" width="90">
        <template #default="{ row }">{{ row.edition.year || '-' }}</template>
      </el-table-column>
      <el-table-column label="名次" width="90">
        <template #default="{ row }">
          <el-tag :type="row.placement === 'CHAMPION' ? 'warning' : 'success'">
            {{ formatPlacement(row.placement) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-for="placement in placementOptions"
        :key="placement.value"
        :label="placement.label"
        min-width="120"
      >
        <template #default="{ row }">
          <EntityLink
            :id="getStandingRef(row, placement.value)?.id"
            type="club"
            :name="getStandingRef(row, placement.value)?.name"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>

  <div class="panel">
    <div class="panel-header">
      <h3>时间线</h3>
      <span class="status-pill">{{ club.careerTimeline?.length ?? 0 }} 个年代</span>
    </div>

    <div v-if="!club.careerTimeline?.length" class="mini-empty">暂无结构化俱乐部经历</div>

    <div v-else class="career-timeline">
      <div v-for="group in club.careerTimeline" :key="group.decade" class="timeline-block">
        <div class="timeline-decade">{{ group.decade }}</div>
        <div class="timeline-lines">
          <button
            v-for="item in group.items"
            :key="item.id"
            class="timeline-player"
            type="button"
            @click="emit('openPlayer', item.player.id)"
          >
            <span>{{ item.position }}</span>
            <strong>{{ item.player.chineseName }}</strong>
            <em>PA {{ formatText(item.player.pa) }} · {{ formatText(item.period) }}</em>
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="detail-grid">
    <div class="panel">
      <div class="panel-header">
        <h3>阵容</h3>
        <span class="status-pill">{{ countLineupItems(club.lineupByPosition) }} 人</span>
      </div>

      <div v-if="!hasLineupItems(club.lineupByPosition)" class="mini-empty">暂无可展示球员</div>

      <div v-else class="lineup-board">
        <div v-for="group in club.lineupByPosition" :key="group.position" class="lineup-row">
          <div class="lineup-position">{{ group.position }}</div>
          <div v-if="!group.items.length" class="lineup-empty">-</div>
          <div v-else class="lineup-players">
            <button
              v-for="item in group.items"
              :key="item.id"
              class="lineup-player"
              type="button"
              @click="emit('openPlayer', item.player.id)"
            >
              <strong>{{ item.player.chineseName }}</strong>
              <span>PA {{ formatText(item.player.pa) }}</span>
              <em>{{ formatLineStats(item) }}</em>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>代表阵容</h3>
        <span class="status-pill">
          {{ countLineupItems(club.representativeLineupByPosition) }} 人
        </span>
      </div>

      <div v-if="!hasLineupItems(club.representativeLineupByPosition)" class="mini-empty">
        暂无俱乐部名宿
      </div>

      <div v-else class="lineup-board">
        <div
          v-for="group in club.representativeLineupByPosition"
          :key="group.position"
          class="lineup-row"
        >
          <div class="lineup-position">{{ group.position }}</div>
          <div v-if="!group.items.length" class="lineup-empty">-</div>
          <div v-else class="lineup-players">
            <button
              v-for="item in group.items"
              :key="item.id"
              class="lineup-player"
              type="button"
              @click="emit('openPlayer', item.player.id)"
            >
              <strong>{{ item.player.chineseName }}</strong>
              <span>PA {{ formatText(item.player.pa) }}</span>
              <em>{{ formatLineStats(item) }}</em>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
