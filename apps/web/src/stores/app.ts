import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    projectName: '天下足球',
    dataVersion: '紫禁之巅'
  })
});
