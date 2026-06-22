<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { CountrySelect } from '@/components/selects';
import {
  createBaseConfig,
  fetchBaseConfigs,
  updateBaseConfig,
  type BaseConfigItem,
  type BaseConfigPayload,
  type BaseConfigType
} from '@/services/base-config';
import { useOptionStore } from '@/stores/options';

interface ConfigTab {
  type: BaseConfigType;
  label: string;
  description: string;
}

const positionGroupOptions = [
  {
    label: '前场',
    value: '前场',
    description: '建议包含 ST、AML、AMR，也可按需要纳入 AMC。'
  },
  {
    label: '中场',
    value: '中场',
    description: '建议包含 DMC、MC、ML、MR、WBL、WBR。'
  },
  {
    label: '后场',
    value: '后场',
    description: '建议包含 DL、DC、DR，GK 可单独成组或暂归后场。'
  },
  {
    label: '门将',
    value: '门将',
    description: '如果后续阵容和统计更精细，建议把 GK 单独成组。'
  }
];

const configTabs: ConfigTab[] = [
  {
    type: 'confederations',
    label: '足联',
    description: '六大足联及其固定 UID，用于国家、俱乐部和球员归属关联。'
  },
  {
    type: 'positions',
    label: '位置',
    description: '球员场上位置与位置组，后续用于录入、筛选和紫禁之巅分组。'
  },
  {
    type: 'player-types',
    label: '球员类型',
    description: '球员类型字典，例如传奇、现役、潜力新星等。'
  },
  {
    type: 'potential-ranges',
    label: '潜力范围',
    description: 'PA 或潜力区间配置，名称允许为空。'
  },
  {
    type: 'ethnicities',
    label: '种族',
    description: '球员基础资料中的种族字典。'
  },
  {
    type: 'hair-colors',
    label: '发色',
    description: '球员基础资料中的发色字典。'
  },
  {
    type: 'preferred-feet',
    label: '惯用脚',
    description: '球员基础资料中的惯用脚字典。'
  },
  {
    type: 'cities',
    label: '城市',
    description: '维护球员出生城市及其管理国家，用于球员资料录入和展示。'
  }
];

const activeType = ref<BaseConfigType>('confederations');
const optionStore = useOptionStore();
const loading = ref(false);
const submitting = ref(false);
const dialogVisible = ref(false);
const editingItem = ref<BaseConfigItem | null>(null);
const errorMessage = ref('');
const items = ref<BaseConfigItem[]>([]);
const total = ref(0);
const filters = reactive({
  page: 1,
  pageSize: 20,
  keyword: ''
});
const form = reactive<BaseConfigPayload>({
  uid: '',
  code: '',
  name: '',
  group: '',
  description: '',
  enabled: true,
  sortOrder: 0,
  countryId: ''
});

const activeTab = computed(() => configTabs.find((tab) => tab.type === activeType.value)!);
const hasRows = computed(() => items.value.length > 0);
const isConfederation = computed(() => activeType.value === 'confederations');
const isPosition = computed(() => activeType.value === 'positions');
const isPlayerType = computed(() => activeType.value === 'player-types');
const isPotentialRange = computed(() => activeType.value === 'potential-ranges');
const isCity = computed(() => activeType.value === 'cities');
const showEnabled = computed(() => isPosition.value || isPlayerType.value);
const dialogTitle = computed(() =>
  editingItem.value ? `编辑${activeTab.value.label}` : `新增${activeTab.value.label}`
);

async function loadConfigs() {
  loading.value = true;
  errorMessage.value = '';

  try {
    const result = await fetchBaseConfigs(activeType.value, {
      page: filters.page,
      pageSize: filters.pageSize,
      keyword: filters.keyword || undefined
    });
    items.value = result.items;
    total.value = result.total;
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '基础配置加载失败。';
    ElMessage.error(errorMessage.value);
  } finally {
    loading.value = false;
  }
}

function submitFilters() {
  filters.page = 1;
  void loadConfigs();
}

function resetFilters() {
  filters.keyword = '';
  filters.page = 1;
  void loadConfigs();
}

function resetForm() {
  form.uid = '';
  form.code = '';
  form.name = '';
  form.group = '';
  form.description = '';
  form.enabled = true;
  form.sortOrder = 0;
  form.countryId = '';
}

function openCreateDialog() {
  editingItem.value = null;
  resetForm();
  dialogVisible.value = true;
}

function openEditDialog(row: BaseConfigItem) {
  editingItem.value = row;
  form.uid = row.uid ?? '';
  form.code = row.code ?? '';
  form.name = row.name ?? '';
  form.group = row.group ?? '';
  form.description = row.description ?? '';
  form.enabled = row.enabled ?? true;
  form.sortOrder = row.sortOrder ?? 0;
  form.countryId = row.countryId ?? row.country?.id ?? '';
  dialogVisible.value = true;
}

function buildPayload(): BaseConfigPayload {
  return {
    uid: isConfederation.value || isCity.value ? form.uid?.trim() : undefined,
    code: isCity.value ? undefined : form.code?.trim(),
    name: form.name?.trim(),
    group: isPosition.value ? form.group?.trim() : undefined,
    description: isConfederation.value ? undefined : form.description?.trim(),
    enabled: showEnabled.value ? form.enabled : undefined,
    sortOrder: form.sortOrder ?? 0,
    countryId: isCity.value ? form.countryId || undefined : undefined
  };
}

function validateForm() {
  if (isConfederation.value && !form.uid?.trim()) {
    ElMessage.warning('请填写足联 UID。');
    return false;
  }

  if (isCity.value && !form.uid?.trim()) {
    ElMessage.warning('请填写城市 UID，未知可填 -。');
    return false;
  }

  if (!isConfederation.value && !isCity.value && !form.code?.trim()) {
    ElMessage.warning('请填写编码。');
    return false;
  }

  if (!isPotentialRange.value && !form.name?.trim()) {
    ElMessage.warning('请填写名称。');
    return false;
  }

  return true;
}

async function saveConfig() {
  if (!validateForm()) {
    return;
  }

  submitting.value = true;

  try {
    const payload = buildPayload();

    if (editingItem.value) {
      await updateBaseConfig(activeType.value, editingItem.value.id, payload);
      ElMessage.success('基础配置已更新。');
    } else {
      await createBaseConfig(activeType.value, payload);
      ElMessage.success('基础配置已创建。');
    }

    dialogVisible.value = false;
    optionStore.invalidate(activeType.value);
    await loadConfigs();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '保存基础配置失败。');
  } finally {
    submitting.value = false;
  }
}

watch(activeType, () => {
  filters.keyword = '';
  filters.page = 1;
  resetForm();
  void loadConfigs();
});

watch(
  () => [filters.page, filters.pageSize],
  () => {
    void loadConfigs();
  }
);

onMounted(() => {
  void loadConfigs();
});
</script>

<template>
  <section class="page-stack">
    <div class="panel">
      <div class="panel-header">
        <div>
          <h2>基础配置</h2>
          <p>维护足联、位置、球员类型和基础字典，为后续手动录入保持数据口径一致。</p>
        </div>
        <span class="status-pill">真实配置</span>
      </div>

      <el-tabs v-model="activeType" class="base-config-tabs">
        <el-tab-pane
          v-for="tab in configTabs"
          :key="tab.type"
          :label="tab.label"
          :name="tab.type"
        />
      </el-tabs>

      <div class="base-config-intro">
        <strong>{{ activeTab.label }}</strong>
        <span>{{ activeTab.description }}</span>
      </div>

      <el-form
        class="filter-grid compact-filter base-config-filter"
        label-position="top"
        @submit.prevent="submitFilters"
      >
        <el-form-item label="关键词">
          <el-input
            v-model="filters.keyword"
            clearable
            placeholder="编码 / 名称 / 描述"
            @keyup.enter="submitFilters"
          />
        </el-form-item>
        <div class="filter-actions">
          <el-button type="primary" :loading="loading" @click="submitFilters">筛选</el-button>
          <el-button :disabled="loading" @click="resetFilters">重置</el-button>
          <el-button type="success" :disabled="loading" @click="openCreateDialog">
            新增{{ activeTab.label }}
          </el-button>
        </div>
      </el-form>
    </div>

    <div v-if="errorMessage" class="panel">
      <el-alert type="error" :title="errorMessage" show-icon :closable="false" />
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>{{ activeTab.label }}列表</h3>
        <span class="status-pill">{{ total }} 条</span>
      </div>

      <el-skeleton v-if="loading && !hasRows" :rows="8" animated />

      <div v-else-if="!hasRows" class="empty-panel">
        <h3>暂无{{ activeTab.label }}配置</h3>
        <p>可以新增一条配置，或调整当前筛选条件。</p>
      </div>

      <template v-else>
        <el-table class="base-config-table" :data="items" border>
          <el-table-column prop="sortOrder" label="排序" width="72" />
          <el-table-column v-if="isConfederation || isCity" prop="uid" label="UID" width="96" />
          <el-table-column v-if="!isCity" prop="code" label="编码" min-width="96">
            <template #default="{ row }">{{ row.code || '-' }}</template>
          </el-table-column>
          <el-table-column prop="name" label="名称" min-width="120">
            <template #default="{ row }">{{ row.name || '-' }}</template>
          </el-table-column>
          <el-table-column v-if="isCity" label="管理国家" min-width="120">
            <template #default="{ row }">{{ row.country?.name || '-' }}</template>
          </el-table-column>
          <el-table-column v-if="isPosition" prop="group" label="位置组" width="100">
            <template #default="{ row }">{{ row.group || '-' }}</template>
          </el-table-column>
          <el-table-column
            v-if="!isConfederation"
            prop="description"
            label="描述"
            min-width="140"
            show-overflow-tooltip
          >
            <template #default="{ row }">{{ row.description || '-' }}</template>
          </el-table-column>
          <el-table-column v-if="showEnabled" label="状态" width="84">
            <template #default="{ row }">
              <el-tag :type="row.enabled ? 'success' : 'info'">
                {{ row.enabled ? '启用' : '停用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="84">
            <template #default="{ row }">
              <el-button link type="primary" @click="openEditDialog(row)">编辑</el-button>
            </template>
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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="560px">
      <el-form label-position="top">
        <el-form-item v-if="isConfederation || isCity" label="UID" required>
          <el-input v-model="form.uid" :placeholder="isCity ? '未知可填 -' : '例如 1 / 2 / 3'" />
        </el-form-item>

        <el-form-item v-if="!isCity" label="编码" :required="!isConfederation">
          <el-input v-model="form.code" placeholder="例如 UEFA / ST / LEGEND" />
        </el-form-item>

        <el-form-item label="名称" :required="!isPotentialRange">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>

        <el-form-item v-if="isCity" label="管理国家">
          <CountrySelect v-model="form.countryId" placeholder="请选择管理国家" />
        </el-form-item>

        <el-form-item v-if="isPosition" label="位置组">
          <el-select
            v-model="form.group"
            clearable
            filterable
            allow-create
            placeholder="请选择位置组"
          >
            <el-option
              v-for="option in positionGroupOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            >
              <div class="position-group-option">
                <strong>{{ option.label }}</strong>
                <span>{{ option.description }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="!isConfederation" label="描述">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="可填写补充说明"
          />
        </el-form-item>

        <el-form-item v-if="showEnabled" label="状态">
          <el-switch v-model="form.enabled" active-text="启用" inactive-text="停用" />
        </el-form-item>

        <el-form-item label="排序">
          <el-input-number v-model="form.sortOrder" :min="0" :max="9999" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button :disabled="submitting" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="saveConfig">保存</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<style scoped>
.base-config-tabs {
  margin-top: 6px;
}

.base-config-intro {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin: 2px 0 16px;
  color: var(--muted);
}

.base-config-intro strong {
  color: var(--green);
}

.base-config-filter {
  grid-template-columns: minmax(280px, 560px) auto;
}

.base-config-table {
  max-width: 100%;
  width: 100%;
}

.base-config-table :deep(.el-table__inner-wrapper),
.base-config-table :deep(.el-table__header-wrapper),
.base-config-table :deep(.el-table__body-wrapper),
.base-config-table :deep(.el-scrollbar__wrap) {
  max-width: 100%;
  overflow-x: hidden;
}

.base-config-table :deep(.el-scrollbar__bar.is-horizontal) {
  display: none;
}

.position-group-option {
  display: grid;
  gap: 2px;
  line-height: 1.35;
}

.position-group-option span {
  color: var(--muted);
  font-size: 12px;
}
</style>
