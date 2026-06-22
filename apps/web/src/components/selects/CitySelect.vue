<script setup lang="ts">
import { computed, onMounted } from 'vue';
import BaseOptionSelect from './BaseOptionSelect.vue';
import { useOptionStore } from '@/stores/options';

const model = defineModel<string>({ default: '' });
const props = withDefaults(
  defineProps<{
    placeholder?: string;
    clearable?: boolean;
    disabled?: boolean;
    countryId?: string;
  }>(),
  {
    placeholder: '请选择城市',
    clearable: true,
    disabled: false,
    countryId: ''
  }
);

const optionStore = useOptionStore();
const cityOptions = computed(() => {
  if (!props.countryId) {
    return optionStore.cityOptions;
  }

  return optionStore.cityOptions.filter((option) => {
    const city = optionStore.cities.find((item) => item.id === option.id);

    return city?.countryId === props.countryId;
  });
});

onMounted(() => {
  void optionStore.ensureCities();
});
</script>

<template>
  <BaseOptionSelect
    v-model="model"
    :options="cityOptions"
    :loading="optionStore.loading.cities"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
  />
</template>
