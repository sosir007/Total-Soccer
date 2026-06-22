<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import {
  createCountry,
  updateCountry,
  type CountryDetail,
  type CountryPayload
} from '@/services/catalog';
import { ConfederationSelect } from '@/components/selects';
import { useOptionStore } from '@/stores/options';

const visible = defineModel<boolean>({ default: false });
const props = defineProps<{
  country?: CountryDetail | null;
}>();
const emit = defineEmits<{
  saved: [country: CountryDetail];
}>();

const optionStore = useOptionStore();
const saving = ref(false);
const form = reactive({
  uid: '',
  name: '',
  confederationId: '',
  externalUrl: '',
  remark: ''
});

watch(
  () => [visible.value, props.country] as const,
  () => {
    if (!visible.value) {
      return;
    }

    form.uid = props.country?.uid ?? '';
    form.name = props.country?.name ?? '';
    form.confederationId = props.country?.federationRef?.id ?? '';
    form.externalUrl = props.country?.externalUrl ?? '';
    form.remark = props.country?.remark ?? '';
  },
  { immediate: true }
);

async function submit() {
  if (!form.uid.trim() || !form.name.trim()) {
    ElMessage.warning('请填写 UID 和国家名称。');
    return;
  }

  saving.value = true;

  try {
    const payload: CountryPayload = {
      uid: form.uid.trim(),
      name: form.name.trim(),
      confederationId: form.confederationId || undefined,
      externalUrl: form.externalUrl.trim() || undefined,
      remark: form.remark.trim() || undefined
    };
    const result = props.country
      ? await updateCountry(props.country.id, payload)
      : await createCountry(payload);

    optionStore.invalidate('countries');
    visible.value = false;
    emit('saved', result);
    ElMessage.success(props.country ? '国家已更新。' : '国家已新增。');
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '国家保存失败。');
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="country ? '编辑国家' : '新增国家'"
    width="560px"
    destroy-on-close
  >
    <el-form class="catalog-form" label-position="top" @submit.prevent="submit">
      <div class="catalog-form-grid">
        <el-form-item label="UID" required>
          <el-input v-model="form.uid" placeholder="例如 110，未知可填 -" />
        </el-form-item>
        <el-form-item label="国家名称" required>
          <el-input v-model="form.name" placeholder="请输入国家名称" />
        </el-form-item>
        <el-form-item label="足联">
          <ConfederationSelect v-model="form.confederationId" />
        </el-form-item>
        <el-form-item label="外部链接">
          <el-input v-model="form.externalUrl" placeholder="https://..." />
        </el-form-item>
      </div>
      <el-form-item label="备注">
        <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="补充说明" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="saving" @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="saving" @click="submit">保存</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.catalog-form {
  display: grid;
  gap: 4px;
}

.catalog-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 16px;
}

@media (max-width: 640px) {
  .catalog-form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
