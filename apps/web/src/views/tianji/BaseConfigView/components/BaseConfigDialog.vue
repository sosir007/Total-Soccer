<script setup lang="ts">
import { toRef } from 'vue';
import IconFont from '@/components/IconFont.vue';
import { CountrySelect } from '@/components/selects';
import type { BaseConfigPayload } from '@/services/types/base-config';

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

const props = defineProps<{
  visible: boolean;
  title: string;
  form: BaseConfigPayload;
  submitting: boolean;
  isConfederation: boolean;
  isCity: boolean;
  isPosition: boolean;
  isPotentialRange: boolean;
  showEnabled: boolean;
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
  save: [];
}>();

const form = toRef(props, 'form');
</script>

<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    width="560px"
    @update:model-value="emit('update:visible', $event)"
  >
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
      <el-button :disabled="submitting" @click="emit('update:visible', false)">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="emit('save')">
        <IconFont name="save" />
        保存
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.position-group-option {
  display: grid;
  gap: 2px;
  line-height: 1.35;

  span {
    color: var(--text-color-secondary);
    font-size: 12px;
  }
}
</style>
