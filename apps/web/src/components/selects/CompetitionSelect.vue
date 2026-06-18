<script setup lang="ts">
import { computed, onMounted } from 'vue';
import BaseOptionSelect from './BaseOptionSelect.vue';
import type { CompetitionTargetType } from '@/services/competitions';
import { useOptionStore } from '@/stores/options';

const model = defineModel<string>({ default: '' });
const props = withDefaults(
  defineProps<{
    targetType?: CompetitionTargetType;
    placeholder?: string;
    clearable?: boolean;
    disabled?: boolean;
  }>(),
  {
    targetType: undefined,
    placeholder: '全部赛事',
    clearable: true,
    disabled: false
  }
);

const optionStore = useOptionStore();
const options = computed(() =>
  props.targetType
    ? optionStore.competitionOptions.filter((option) => option.targetType === props.targetType)
    : optionStore.competitionOptions
);

onMounted(() => {
  void optionStore.ensureCompetitions();
});
</script>

<template>
  <BaseOptionSelect
    v-model="model"
    :options="options"
    :loading="optionStore.loading.competitions"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
  />
</template>
