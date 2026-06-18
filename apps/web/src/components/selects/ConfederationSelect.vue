<script setup lang="ts">
import { onMounted } from 'vue';
import BaseOptionSelect from './BaseOptionSelect.vue';
import { useOptionStore } from '@/stores/options';

const model = defineModel<string>({ default: '' });
withDefaults(defineProps<{ placeholder?: string; clearable?: boolean; disabled?: boolean }>(), {
  placeholder: '全部足联',
  clearable: true,
  disabled: false
});

const optionStore = useOptionStore();

onMounted(() => {
  void optionStore.ensureConfederations();
});
</script>

<template>
  <BaseOptionSelect
    v-model="model"
    :options="optionStore.confederationOptions"
    :loading="optionStore.loading.confederations"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
  />
</template>
