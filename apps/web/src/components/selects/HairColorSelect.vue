<script setup lang="ts">
import { onMounted } from 'vue';
import BaseOptionSelect from './BaseOptionSelect.vue';
import { useOptionStore } from '@/stores/options';

const model = defineModel<string>({ default: '' });
withDefaults(defineProps<{ placeholder?: string; clearable?: boolean; disabled?: boolean }>(), {
  placeholder: '全部发色',
  clearable: true,
  disabled: false
});

const optionStore = useOptionStore();

onMounted(() => {
  void optionStore.ensureHairColors();
});
</script>

<template>
  <BaseOptionSelect
    v-model="model"
    :options="optionStore.hairColorOptions"
    :loading="optionStore.loading.hairColors"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
  />
</template>
