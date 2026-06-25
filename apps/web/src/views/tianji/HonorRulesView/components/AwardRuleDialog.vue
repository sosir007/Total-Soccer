<script setup lang="ts">
import { toRef } from 'vue';
import type { AwardRulePayload } from '@/services/types/award-rules';
import type { AwardScopeType } from '@/services/types/awards';

const props = defineProps<{
  title: string;
  form: AwardRulePayload;
  submitting: boolean;
  awardScopeOptions: Array<{ label: string; value: AwardScopeType }>;
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
        <el-input v-model="form.code" placeholder="例如 BALLON_DOR_RANK_1" />
      </el-form-item>
      <el-form-item label="规则名称" required>
        <el-input v-model="form.name" placeholder="例如 金球奖第一名" />
      </el-form-item>
      <el-form-item label="奖项范围">
        <el-select v-model="form.scopeType" clearable placeholder="不限范围">
          <el-option
            v-for="option in awardScopeOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="奖项分类">
        <el-input v-model="form.category" placeholder="例如 金球奖 / 世界足球先生" />
      </el-form-item>
      <el-form-item label="名次文本">
        <el-input v-model="form.placement" placeholder="例如 第一名 / 金奖，可留空" />
      </el-form-item>
      <el-form-item label="排名">
        <el-input-number
          v-model="form.rank"
          :min="1"
          :max="999"
          :controls="false"
          placeholder="可留空"
        />
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
      <el-form-item label="顶级奖项">
        <el-switch v-model="form.topAward" active-text="是" inactive-text="否" />
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
      <el-button type="primary" :loading="submitting" @click="emit('save')">保存</el-button>
    </template>
  </el-dialog>
</template>
