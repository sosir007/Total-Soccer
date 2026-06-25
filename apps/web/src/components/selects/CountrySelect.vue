<script setup lang="ts">
import { computed, onMounted } from 'vue';
import BaseOptionSelect from './BaseOptionSelect.vue';
import { useOptionStore } from '@/stores/options';

const model = defineModel<string | string[]>({ default: '' });
const props = withDefaults(
  defineProps<{
    placeholder?: string;
    clearable?: boolean;
    disabled?: boolean;
    multiple?: boolean;
    includeHidden?: boolean;
    includeHistorical?: boolean;
  }>(),
  {
    placeholder: '全部国家',
    clearable: true,
    disabled: false,
    multiple: false,
    includeHidden: false,
    includeHistorical: false
  }
);

const optionStore = useOptionStore();
const localOptions = computed(() => {
  if (!props.includeHidden && !props.includeHistorical) {
    return optionStore.countryOptions;
  }

  const countries = optionStore.countries.filter((country) => {
    if (country.isHistorical) {
      return props.includeHistorical;
    }

    if (country.visibleInCatalog === false) {
      return props.includeHidden;
    }

    return true;
  });

  return countries
    .slice()
    .sort((a, b) => {
      const aSort = Number(a.uid);
      const bSort = Number(b.uid);
      const aNumeric = Number.isFinite(aSort);
      const bNumeric = Number.isFinite(bSort);

      if (aNumeric && bNumeric) {
        return aSort - bSort;
      }

      if (aNumeric) {
        return -1;
      }

      if (bNumeric) {
        return 1;
      }

      return a.name.localeCompare(b.name, 'zh-Hans-CN');
    })
    .map((country) => ({
      id: country.id,
      value: country.id,
      label: country.name,
      uid: country.uid,
      description: country.federation ?? undefined
    }));
});

onMounted(() => {
  void optionStore.ensureCountries();
});
</script>

<template>
  <BaseOptionSelect
    v-model="model"
    :options="localOptions"
    :loading="optionStore.loading.countries"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    :multiple="multiple"
  />
</template>
