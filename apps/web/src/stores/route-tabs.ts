import { defineStore } from 'pinia';
import type { RouteLocationNormalizedLoaded } from 'vue-router';

export interface RouteTabItem {
  fullPath: string;
  title: string;
  fixed?: boolean;
}

const FIXED_TAB_PATH = '/overview/world';

export const useRouteTabsStore = defineStore('route-tabs', {
  state: () => ({
    tabs: [] as RouteTabItem[]
  }),
  getters: {
    hasTabs: (state) => state.tabs.length > 0
  },
  actions: {
    ensureRoute(route: RouteLocationNormalizedLoaded) {
      const fullPath = route.fullPath;
      const existing = this.tabs.find((tab) => tab.fullPath === fullPath);

      if (existing) {
        if (!existing.title || existing.title === '详情') {
          existing.title = this.resolveRouteTitle(route);
        }
        return;
      }

      this.tabs.push({
        fullPath,
        title: this.resolveRouteTitle(route),
        fixed: fullPath === FIXED_TAB_PATH
      });
    },
    setTitle(fullPath: string, title: string) {
      const tab = this.tabs.find((item) => item.fullPath === fullPath);
      const cleaned = title.trim();

      if (tab && cleaned) {
        tab.title = cleaned;
      }
    },
    remove(fullPath: string) {
      const tab = this.tabs.find((item) => item.fullPath === fullPath);

      if (tab?.fixed) {
        return;
      }

      this.tabs = this.tabs.filter((item) => item.fullPath !== fullPath);
    },
    removeOthers(fullPath: string) {
      this.tabs = this.tabs.filter((tab) => tab.fixed || tab.fullPath === fullPath);
    },
    removeAll() {
      this.tabs = this.tabs.filter((tab) => tab.fixed);
    },
    resolveRouteTitle(route: RouteLocationNormalizedLoaded) {
      return String(route.meta.title ?? '未命名页面');
    }
  }
});

export { FIXED_TAB_PATH };
