<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { createClub, updateClub, type ClubDetail, type ClubPayload } from '@/services/catalog';
import { ConfederationSelect, CountrySelect } from '@/components/selects';
import { useOptionStore } from '@/stores/options';

const visible = defineModel<boolean>({ default: false });
const props = defineProps<{
  club?: ClubDetail | null;
}>();
const emit = defineEmits<{
  saved: [club: ClubDetail];
}>();

const optionStore = useOptionStore();
const saving = ref(false);
const form = reactive({
  uid: '',
  name: '',
  countryId: '',
  confederationId: '',
  exists: true,
  externalUrl: '',
  remark: ''
});

watch(
  () => [visible.value, props.club] as const,
  () => {
    if (!visible.value) {
      return;
    }

    form.uid = props.club?.uid ?? '';
    form.name = props.club?.name ?? '';
    form.countryId = props.club?.countryRef?.id ?? '';
    form.confederationId = props.club?.federationRef?.id ?? '';
    form.exists = props.club?.exists ?? true;
    form.externalUrl = props.club?.externalUrl ?? '';
    form.remark = props.club?.remark ?? '';
  },
  { immediate: true }
);

async function submit() {
  if (!form.uid.trim() || !form.name.trim()) {
    ElMessage.warning('请填写 UID 和俱乐部名称。');
    return;
  }

  saving.value = true;

  try {
    const payload: ClubPayload = {
      uid: form.uid.trim(),
      name: form.name.trim(),
      countryId: form.countryId || undefined,
      confederationId: form.confederationId || undefined,
      exists: form.exists,
      externalUrl: form.externalUrl.trim() || undefined,
      remark: form.remark.trim() || undefined
    };
    const result = props.club
      ? await updateClub(props.club.id, payload)
      : await createClub(payload);

    optionStore.invalidate('clubs');
    visible.value = false;
    emit('saved', result);
    ElMessage.success(props.club ? '俱乐部已更新。' : '俱乐部已新增。');
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '俱乐部保存失败。');
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="club ? '编辑俱乐部' : '新增俱乐部'"
    width="560px"
    destroy-on-close
  >
    <el-form class="catalog-form" label-position="top" @submit.prevent="submit">
      <div class="catalog-form-grid">
        <el-form-item label="UID" required>
          <el-input v-model="form.uid" placeholder="例如 760，未知可填 -" />
        </el-form-item>
        <el-form-item label="俱乐部名称" required>
          <el-input v-model="form.name" placeholder="请输入俱乐部名称" />
        </el-form-item>
        <el-form-item label="国家">
          <CountrySelect v-model="form.countryId" />
        </el-form-item>
        <el-form-item label="足联">
          <ConfederationSelect v-model="form.confederationId" />
        </el-form-item>
        <el-form-item label="是否进入豪门库">
          <el-switch v-model="form.exists" active-text="展示" inactive-text="占位" />
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
