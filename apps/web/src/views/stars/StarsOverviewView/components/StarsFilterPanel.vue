<script setup lang="ts">
import { toRef } from 'vue';
import IconFont from '@/components/IconFont.vue';
import {
  ClubSelect,
  ConfederationSelect,
  CountrySelect,
  PositionSelect
} from '@/components/selects';

interface StarsFilters {
  keyword: string;
  confederationId: string;
  countryId: string;
  clubId: string;
  position: string;
  minPa: number;
  maxPa: number;
}

const props = defineProps<{
  filters: StarsFilters;
  loading: boolean;
}>();

const emit = defineEmits<{
  submit: [];
  reset: [];
  create: [];
}>();

const filters = toRef(props, 'filters');
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <div>
        <h2>巨星概览</h2>
        <p>按真实导入数据浏览球员资料，支持基础筛选、分页和详情查看。</p>
      </div>
      <div class="panel-actions">
        <el-button type="primary" @click="emit('create')">
          <IconFont name="add" />
          新增球员
        </el-button>
      </div>
    </div>

    <el-form class="filter-grid" label-position="top" @submit.prevent="emit('submit')">
      <el-form-item label="关键词">
        <el-input
          v-model="filters.keyword"
          clearable
          placeholder="姓名 / 英文名 / UID / 国家 / 俱乐部"
          @keyup.enter="emit('submit')"
        />
      </el-form-item>
      <el-form-item label="足联">
        <ConfederationSelect v-model="filters.confederationId" />
      </el-form-item>
      <el-form-item label="国家">
        <CountrySelect v-model="filters.countryId" />
      </el-form-item>
      <el-form-item label="俱乐部">
        <ClubSelect v-model="filters.clubId" />
      </el-form-item>
      <el-form-item label="位置">
        <PositionSelect v-model="filters.position" placeholder="全部位置" />
      </el-form-item>
      <el-form-item label="PA 区间">
        <div class="range-fields">
          <el-input-number
            v-model="filters.minPa"
            :controls="false"
            :min="0"
            :max="250"
            placeholder="最低"
            @keyup.enter="emit('submit')"
          />
          <span>-</span>
          <el-input-number
            v-model="filters.maxPa"
            :controls="false"
            :min="0"
            :max="250"
            placeholder="最高"
            @keyup.enter="emit('submit')"
          />
        </div>
      </el-form-item>
      <div class="filter-actions">
        <el-button type="primary" :loading="loading" @click="emit('submit')">
          <IconFont name="filter" />
          筛选
        </el-button>
        <el-button :disabled="loading" @click="emit('reset')">
          <IconFont name="reset" />
          重置
        </el-button>
      </div>
    </el-form>
  </div>
</template>
