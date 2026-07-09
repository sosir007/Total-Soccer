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
    onlyVisibleInCatalog?: boolean;
  }>(),
  {
    placeholder: '全部俱乐部',
    clearable: true,
    disabled: false,
    multiple: false,
    onlyVisibleInCatalog: false
  }
);

const optionStore = useOptionStore();
const localOptions = computed(() => {
  if (!props.onlyVisibleInCatalog) {
    return optionStore.clubOptions;
  }

  const visibleClubIds = new Set(
    optionStore.clubs.filter((club) => club.visibleInCatalog !== false).map((club) => club.id)
  );

  return optionStore.clubOptions.filter((option) => visibleClubIds.has(option.id));
});

onMounted(() => {
  void optionStore.ensureClubs();
});
</script>

<template>
  <BaseOptionSelect
    v-model="model"
    :options="localOptions"
    :loading="optionStore.loading.clubs"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    :multiple="multiple"
  />
</template>
