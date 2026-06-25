<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { fetchAwardRecipients } from '@/services/modules/awards';
import type { AwardRecipientRecord, AwardScopeType } from '@/services/types/awards';
import EntityLink from '@/components/EntityLink.vue';
import EntityNameCell from '@/components/EntityNameCell.vue';
import { buildExternalUrl } from '@/utils/external-link';

const loading = ref(false);
const errorMessage = ref('');
const records = ref<AwardRecipientRecord[]>([]);
const total = ref(0);
const filters = reactive({
  page: 1,
  pageSize: 20,
  keyword: '',
  scopeType: '' as '' | AwardScopeType,
  placement: '',
  year: undefined as number | undefined
});

const scopeOptions: Array<{ label: string; value: AwardScopeType }> = [
  { label: '世界', value: 'WORLD' },
  { label: '洲际', value: 'CONFEDERATION' },
  { label: '国家', value: 'COUNTRY' },
  { label: '联赛', value: 'LEAGUE' },
  { label: '俱乐部', value: 'CLUB' },
  { label: '媒体', value: 'MEDIA' }
];

const scopeLabels = Object.fromEntries(
  scopeOptions.map((item) => [item.value, item.label])
) as Record<AwardScopeType, string>;

const hasRows = computed(() => records.value.length > 0);

async function loadHonors() {
  loading.value = true;
  errorMessage.value = '';

  try {
    const result = await fetchAwardRecipients({
      page: filters.page,
      pageSize: filters.pageSize,
      keyword: filters.keyword || undefined,
      scopeType: filters.scopeType || undefined,
      placement: filters.placement || undefined,
      year: filters.year
    });
    records.value = result.items;
    total.value = result.total;
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '巨星荣誉加载失败。';
    ElMessage.error(errorMessage.value);
  } finally {
    loading.value = false;
  }
}

function submitFilters() {
  filters.page = 1;
  void loadHonors();
}

function resetFilters() {
  filters.page = 1;
  filters.keyword = '';
  filters.scopeType = '';
  filters.placement = '';
  filters.year = undefined;
  void loadHonors();
}

function editionUrl(record: AwardRecipientRecord) {
  return buildExternalUrl(
    record.edition.externalUrl || record.externalUrl,
    `${record.edition.award.name} ${formatEdition(record)}`
  );
}

function formatEdition(record: AwardRecipientRecord) {
  return record.edition.season || record.edition.name || record.edition.year || '-';
}

function formatPlacement(record: AwardRecipientRecord) {
  if (record.placement) {
    return record.placement;
  }

  return record.rank ? `第 ${record.rank} 名` : '-';
}

function formatScope(value: AwardScopeType) {
  return scopeLabels[value] ?? value;
}

function formatText(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '-' : value;
}

watch(
  () => [filters.page, filters.pageSize],
  () => {
    void loadHonors();
  }
);

onMounted(() => {
  void loadHonors();
});
</script>

<template>
  <section class="page-stack">
    <div class="panel">
      <div class="panel-header">
        <div>
          <h2>巨星荣誉</h2>
          <p>查看球员个人奖项和年度评选结果，统计来源为奖项体系录入记录。</p>
        </div>
        <span class="status-pill">真实数据</span>
      </div>

      <el-form class="filter-grid" label-position="top" @submit.prevent="submitFilters">
        <el-form-item label="关键词">
          <el-input
            v-model="filters.keyword"
            clearable
            placeholder="球员 / 奖项 / 届次 / 名次"
            @keyup.enter="submitFilters"
          />
        </el-form-item>
        <el-form-item label="奖项范围">
          <el-select v-model="filters.scopeType" clearable placeholder="全部范围">
            <el-option
              v-for="scope in scopeOptions"
              :key="scope.value"
              :label="scope.label"
              :value="scope.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="名次">
          <el-input v-model="filters.placement" clearable placeholder="冠军 / 第一名 / 金球奖" />
        </el-form-item>
        <div class="filter-actions">
          <el-button type="primary" :loading="loading" @click="submitFilters">筛选</el-button>
          <el-button :disabled="loading" @click="resetFilters">重置</el-button>
        </div>
        <el-form-item label="年份">
          <el-input-number v-model="filters.year" :min="1800" :max="2200" placeholder="全部年份" />
        </el-form-item>
      </el-form>
    </div>

    <div v-if="errorMessage" class="panel">
      <el-alert type="error" :title="errorMessage" show-icon :closable="false" />
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>个人荣誉明细</h3>
        <span class="status-pill">{{ total }} 条记录</span>
      </div>

      <el-skeleton v-if="loading && !hasRows" :rows="8" animated />

      <div v-else-if="!hasRows" class="empty-panel">
        <h3>暂无巨星荣誉</h3>
        <p>可以先通过奖项接口创建奖项、届次，并录入获奖球员。</p>
      </div>

      <template v-else>
        <el-table :data="records" border>
          <el-table-column label="奖项" min-width="170" fixed>
            <template #default="{ row }">
              <EntityNameCell
                :id="row.edition.award.id"
                type="award"
                :title="row.edition.award.name"
                :subtitle="`${formatScope(row.edition.award.scopeType)} / ${
                  row.edition.award.category || row.edition.award.code
                }`"
              />
            </template>
          </el-table-column>
          <el-table-column label="年份 / 届次" min-width="140">
            <template #default="{ row }">
              <a
                class="external-text-link"
                :href="editionUrl(row)"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ formatEdition(row) }}
              </a>
            </template>
          </el-table-column>
          <el-table-column label="年份" width="90">
            <template #default="{ row }">{{ row.edition.year || '-' }}</template>
          </el-table-column>
          <el-table-column label="球员" min-width="150">
            <template #default="{ row }">
              <EntityNameCell
                :id="row.player.id"
                type="player"
                :title="row.player.chineseName"
                :subtitle="row.player.englishName || row.player.uid"
              />
            </template>
          </el-table-column>
          <el-table-column label="名次" width="110">
            <template #default="{ row }">
              <el-tag type="warning">{{ formatPlacement(row) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="PA" width="80">
            <template #default="{ row }">{{ formatText(row.player.pa) }}</template>
          </el-table-column>
          <el-table-column label="国家" min-width="120">
            <template #default="{ row }">
              <EntityLink
                :id="row.player.country?.id"
                type="country"
                :name="formatText(row.player.country?.name)"
              />
            </template>
          </el-table-column>
          <el-table-column label="俱乐部" min-width="140">
            <template #default="{ row }">
              <EntityLink
                :id="row.player.club?.id"
                type="club"
                :name="formatText(row.player.club?.name)"
              />
            </template>
          </el-table-column>
          <el-table-column label="备注" min-width="160">
            <template #default="{ row }">{{ formatText(row.remark) }}</template>
          </el-table-column>
        </el-table>

        <div class="table-footer">
          <el-pagination
            v-model:current-page="filters.page"
            v-model:page-size="filters.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next"
            :total="total"
          />
        </div>
      </template>
    </div>
  </section>
</template>
