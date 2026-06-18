<script setup lang="ts">
import { onMounted } from 'vue';
import BaseOptionSelect from './BaseOptionSelect.vue';
import { useOptionStore } from '@/stores/options';

const model = defineModel<string>({ default: '' });
withDefaults(defineProps<{ placeholder?: string; clearable?: boolean; disabled?: boolean }>(), {
  placeholder: '全部位置',
  clearable: true,
  disabled: false
});

const optionStore = useOptionStore();

onMounted(() => {
  void optionStore.ensurePositions();
});
</script>

<template>
  <BaseOptionSelect
    v-model="model"
    :options="optionStore.positionOptions"
    :loading="optionStore.loading.positions"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
  />
</template>
