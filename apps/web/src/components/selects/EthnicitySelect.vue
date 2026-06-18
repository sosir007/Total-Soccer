<script setup lang="ts">
import { onMounted } from 'vue';
import BaseOptionSelect from './BaseOptionSelect.vue';
import { useOptionStore } from '@/stores/options';

const model = defineModel<string>({ default: '' });
withDefaults(defineProps<{ placeholder?: string; clearable?: boolean; disabled?: boolean }>(), {
  placeholder: '全部种族',
  clearable: true,
  disabled: false
});

const optionStore = useOptionStore();

onMounted(() => {
  void optionStore.ensureEthnicities();
});
</script>

<template>
  <BaseOptionSelect
    v-model="model"
    :options="optionStore.ethnicityOptions"
    :loading="optionStore.loading.ethnicities"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
  />
</template>
