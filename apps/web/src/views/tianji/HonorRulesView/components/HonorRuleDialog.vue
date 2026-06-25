<script setup lang="ts">
import { toRef } from 'vue';
import type {
  CompetitionStandingPlacement,
  CompetitionTargetType
} from '@/services/types/competitions';
import type { HonorRulePayload } from '@/services/types/honor-rules';
import IconFont from '@/components/IconFont.vue';

const props = defineProps<{
  title: string;
  form: HonorRulePayload;
  submitting: boolean;
  targetTypeOptions: Array<{ label: string; value: CompetitionTargetType }>;
  placementOptions: Array<{ label: string; value: CompetitionStandingPlacement }>;
}>();

const visible = defineModel<boolean>('visible', { required: true });
const form = toRef(props, 'form');

const emit = defineEmits<{
  save: [];
}>();
</script>

<template>
  <el-dialog v-model="visible" :title="title" width="620px">
    <el-form class="honor-rule-form" label-position="top">
      <el-form-item label="规则编码" required>
        <el-input v-model="form.code" placeholder="例如 WORLD_CUP_CHAMPION" />
      </el-form-item>
      <el-form-item label="规则名称" required>
        <el-input v-model="form.name" placeholder="例如 世界杯冠军" />
      </el-form-item>
      <el-form-item label="对象类型" required>
        <el-select v-model="form.targetType">
          <el-option
            v-for="option in targetTypeOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="赛事分类">
        <el-input v-model="form.category" placeholder="需要与赛事分类完全一致，例如 世界杯" />
      </el-form-item>
      <el-form-item label="名次" required>
        <el-select v-model="form.placement">
          <el-option
            v-for="option in placementOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="基础分" required>
        <el-input-number v-model="form.baseScore" :min="0" :precision="2" :controls="false" />
      </el-form-item>
      <el-form-item label="系数" required>
        <el-input-number v-model="form.coefficient" :min="0" :precision="2" :controls="false" />
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="form.sortOrder" :min="0" :max="9999" :controls="false" />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="form.enabled" active-text="启用" inactive-text="停用" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="3"
          placeholder="可填写评分口径说明"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button :disabled="submitting" @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="emit('save')">
        <IconFont name="save" />
        保存
      </el-button>
    </template>
  </el-dialog>
</template>
