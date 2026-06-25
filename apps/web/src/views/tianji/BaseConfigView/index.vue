<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  createBaseConfig,
  deleteBaseConfig,
  fetchBaseConfigs,
  updateBaseConfig,
  type BaseConfigItem,
  type BaseConfigPayload,
  type BaseConfigType
} from '@/services/base-config';
import { useOptionStore } from '@/stores/options';
import BaseConfigDialog from './components/BaseConfigDialog.vue';
import BaseConfigHeaderPanel from './components/BaseConfigHeaderPanel.vue';
import BaseConfigTablePanel from './components/BaseConfigTablePanel.vue';

interface ConfigTab {
  type: BaseConfigType;
  label: string;
  description: string;
}

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

async function confirmDelete(row: BaseConfigItem) {
  const label = row.name || row.code || row.uid || row.id;

  try {
    await ElMessageBox.confirm(
      `确定要删除「${label}」吗？如果已有球员或其他资料引用，系统会阻止删除。`,
      `删除${activeTab.value.label}`,
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );
    await deleteBaseConfig(activeType.value, row.id);
    ElMessage.success('基础配置已删除。');
    optionStore.invalidate(activeType.value);
    await loadConfigs();
  } catch (error) {
    if (error === 'cancel') {
      return;
    }

    ElMessage.error(error instanceof Error ? error.message : '删除基础配置失败。');
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
    <BaseConfigHeaderPanel
      v-model:active-type="activeType"
      :active-tab="activeTab"
      :config-tabs="configTabs"
      :filters="filters"
      :loading="loading"
      @submit="submitFilters"
      @reset="resetFilters"
      @create="openCreateDialog"
    />

    <div v-if="errorMessage" class="panel">
      <el-alert type="error" :title="errorMessage" show-icon :closable="false" />
    </div>

    <BaseConfigTablePanel
      :label="activeTab.label"
      :items="items"
      :total="total"
      :loading="loading"
      :filters="filters"
      :is-confederation="isConfederation"
      :is-city="isCity"
      :is-position="isPosition"
      :show-enabled="showEnabled"
      @edit="openEditDialog"
      @delete="confirmDelete"
    />

    <BaseConfigDialog
      v-model:visible="dialogVisible"
      :title="dialogTitle"
      :form="form"
      :submitting="submitting"
      :is-confederation="isConfederation"
      :is-city="isCity"
      :is-position="isPosition"
      :is-potential-range="isPotentialRange"
      :show-enabled="showEnabled"
      @save="saveConfig"
    />
  </section>
</template>
