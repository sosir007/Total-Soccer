<script setup lang="ts">
import { computed, onMounted } from 'vue';
import BaseOptionSelect from './BaseOptionSelect.vue';
import { useOptionStore } from '@/stores/options';

const model = defineModel<string | string[]>({ default: '' });
withDefaults(
  defineProps<{
    placeholder?: string;
    clearable?: boolean;
    disabled?: boolean;
    multiple?: boolean;
  }>(),
  {
    placeholder: '全部奖项',
    clearable: true,
    disabled: false,
    multiple: false
  }
);

const optionStore = useOptionStore();
const options = computed(() => optionStore.awardOptions);

onMounted(() => {
  void optionStore.ensureAwards();
});
</script>

<template>
  <BaseOptionSelect
    v-model="model"
    :options="options"
    :loading="optionStore.loading.awards"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    :multiple="multiple"
  />
</template>
