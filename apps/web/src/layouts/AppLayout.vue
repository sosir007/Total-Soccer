<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app';
import { FIXED_TAB_PATH, useRouteTabsStore } from '@/stores/route-tabs';

const appStore = useAppStore();
const route = useRoute();
const router = useRouter();
const routeTabsStore = useRouteTabsStore();
const navRef = ref<HTMLElement | null>(null);

const navItems = [
  {
    label: '天下纵览',
    icon: '⌂',
    children: [
      { path: '/overview/world', label: '世界概览' },
      { path: '/overview/forbidden-summit', label: '紫禁之巅' }
    ]
  },
  {
    label: '国家圣殿',
    icon: '⚑',
    children: [
      { path: '/nations/overview', label: '国家概览' },
      { path: '/nations/honors', label: '国家荣誉' }
    ]
  },
  {
    label: '豪门殿堂',
    icon: '▣',
    children: [
      { path: '/clubs/overview', label: '豪门概览' },
      { path: '/clubs/honors', label: '豪门荣誉' }
    ]
  },
  {
    label: '巨星殿堂',
    icon: '◉',
    children: [
      { path: '/stars/overview', label: '巨星概览' },
      { path: '/stars/honors', label: '巨星荣誉' }
    ]
  },
  {
    label: '天机阁',
    icon: '⚙',
    children: [
      { path: '/tianji/honor-rules', label: '荣誉规则' },
      { path: '/tianji/competitions', label: '赛事管理' },
      { path: '/tianji/awards', label: '奖项管理' },
      { path: '/tianji/import', label: '数据导入' },
      { path: '/tianji/base', label: '基础配置' },
      { path: '/tianji/remarks', label: '备注管理' },
      { path: '/tianji/permissions', label: '权限管理' }
    ]
  }
];

const pageTitle = computed(() => String(route.meta.title ?? '世界概览'));
const currentTabPath = computed(() => route.fullPath);

function scrollActiveNavIntoView() {
  void nextTick(() => {
    const activeItem = navRef.value?.querySelector('.nav-item.router-link-active');

    if (activeItem instanceof HTMLElement) {
      activeItem.scrollIntoView({
        block: 'nearest'
      });
    }
  });
}

function findNextTabPath(closedPath: string) {
  const tabs = routeTabsStore.tabs;
  const index = tabs.findIndex((tab) => tab.fullPath === closedPath);
  const nextTab = tabs[index + 1] ?? tabs[index - 1] ?? tabs.find((tab) => tab.fixed);

  return nextTab?.fullPath ?? FIXED_TAB_PATH;
}

function openTab(path: string) {
  void router.push(path);
}

function closeTab(path: string) {
  const nextPath = findNextTabPath(path);
  routeTabsStore.remove(path);

  if (path === route.fullPath) {
    void router.push(nextPath);
  }
}

function closeOtherTabs() {
  routeTabsStore.removeOthers(route.fullPath);
}

function closeAllTabs() {
  routeTabsStore.removeAll();

  if (route.fullPath !== FIXED_TAB_PATH) {
    void router.push(FIXED_TAB_PATH);
  }
}

watch(
  () => route.fullPath,
  () => {
    routeTabsStore.ensureRoute(route);
    scrollActiveNavIntoView();
  },
  { immediate: true }
);

onMounted(scrollActiveNavIntoView);
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">天</div>
        <div>
          <div class="brand-name">{{ appStore.projectName }}</div>
          <div class="brand-subtitle">Total Soccer DB</div>
        </div>
      </div>

      <nav ref="navRef" class="nav">
        <div v-for="group in navItems" :key="group.label" class="nav-section">
          <div class="nav-group">
            <span class="nav-icon">{{ group.icon }}</span>
            {{ group.label }}
          </div>
          <RouterLink
            v-for="item in group.children"
            :key="item.path"
            class="nav-item sub"
            :to="item.path"
          >
            {{ item.label }}
          </RouterLink>
        </div>
      </nav>

      <div class="sidebar-card">
        <div class="sidebar-card-title">当前数据版本</div>
        <div class="sidebar-card-main">{{ appStore.dataVersion }}</div>
        <div class="sidebar-card-meta">等待接入天机阁导入</div>
      </div>
    </aside>

    <main class="workspace">
      <header class="global-header">
        <div>
          <div class="eyebrow">WORLD FOOTBALL ARCHIVE</div>
          <h1>{{ pageTitle }}</h1>
        </div>
        <div class="global-header-actions">
          <div class="search-box">搜索巨星 / 国家 / 豪门</div>
          <button class="icon-button" type="button" title="全局搜索">⌕</button>
          <button class="header-tool" type="button">中文</button>
          <div class="avatar-placeholder">本</div>
        </div>
      </header>

      <div class="route-tabs">
        <button
          v-for="tab in routeTabsStore.tabs"
          :key="tab.fullPath"
          class="route-tab"
          :class="{ active: tab.fullPath === currentTabPath, fixed: tab.fixed }"
          type="button"
          @click="openTab(tab.fullPath)"
        >
          <span>{{ tab.title }}</span>
          <button
            v-if="!tab.fixed"
            class="route-tab-close"
            type="button"
            title="关闭"
            @click.stop="closeTab(tab.fullPath)"
          >
            ×
          </button>
        </button>

        <div class="route-tab-actions">
          <button type="button" @click="closeOtherTabs">关闭其他</button>
          <button type="button" @click="closeAllTabs">关闭全部</button>
        </div>
      </div>

      <RouterView v-slot="{ Component, route: viewRoute }">
        <KeepAlive :max="24" :exclude="/DetailView$/">
          <component :is="Component" :key="viewRoute.fullPath" />
        </KeepAlive>
      </RouterView>
    </main>
  </div>
</template>
