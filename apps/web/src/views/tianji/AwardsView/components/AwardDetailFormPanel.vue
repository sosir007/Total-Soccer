<script setup lang="ts">
import { toRef } from 'vue';
import type { AwardDetail, AwardScopeType } from '@/services/types/awards';
import IconFont from '@/components/IconFont.vue';
import { ConfederationSelect, CountrySelect } from '@/components/selects';

const props = defineProps<{
  award: AwardDetail;
  form: {
    code: string;
    name: string;
    externalUrl: string;
    scopeType: AwardScopeType;
    category: string;
    level: string;
    description: string;
    confederationId: string;
    countryId: string;
    enabled: boolean;
    sortOrder: number;
  };
  saving: boolean;
  scopeTypeOptions: Array<{ label: string; value: AwardScopeType }>;
}>();

const form = toRef(props, 'form');

const emit = defineEmits<{
  save: [];
}>();
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <h3>奖项资料</h3>
      <span class="status-pill">{{ award.enabled ? '启用' : '停用' }}</span>
    </div>
    <el-form class="competition-form-grid" label-position="top" @submit.prevent="emit('save')">
      <el-form-item label="奖项编码">
        <el-input v-model="form.code" />
      </el-form-item>
      <el-form-item label="奖项名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="范围">
        <el-select v-model="form.scopeType">
          <el-option
            v-for="scopeType in scopeTypeOptions"
            :key="scopeType.value"
            :label="scopeType.label"
            :value="scopeType.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.scopeType === 'CONFEDERATION'" label="足联">
        <ConfederationSelect
          v-model="form.confederationId"
          placeholder="选择足联"
          :clearable="false"
        />
      </el-form-item>
      <el-form-item v-if="form.scopeType === 'COUNTRY'" label="国家">
        <CountrySelect v-model="form.countryId" placeholder="选择国家" :clearable="false" />
      </el-form-item>
      <el-form-item label="分类">
        <el-input v-model="form.category" />
      </el-form-item>
      <el-form-item label="级别">
        <el-input v-model="form.level" />
      </el-form-item>
      <el-form-item label="外链">
        <el-input v-model="form.externalUrl" placeholder="https://..." />
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="form.sortOrder" :min="0" :controls="false" />
      </el-form-item>
      <el-form-item label="描述" class="form-wide">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="奖项说明、统计口径或备注"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="form.enabled" active-text="启用" inactive-text="停用" />
      </el-form-item>
      <div class="competition-form-actions">
        <el-button type="primary" :loading="saving" @click="emit('save')">
          <IconFont name="save" />
          保存奖项资料
        </el-button>
      </div>
    </el-form>
  </div>
</template>
