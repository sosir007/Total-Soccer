<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { useAppStore } from '@/stores/app';

const appStore = useAppStore();
const route = useRoute();

const navItems = [
  { path: '/dashboard', label: '数据看板', icon: '⌂' },
  { path: '/players', label: '球员资料库', icon: '◉' },
  { path: '/countries', label: '国家资料库', icon: '⚑' },
  { path: '/clubs', label: '俱乐部资料库', icon: '▣' },
  { path: '/honors', label: '荣誉规则', icon: '★' },
  { path: '/best-lineup', label: '最佳阵容', icon: '✦' },
  { path: '/import', label: '数据导入', icon: '⇪' },
  { path: '/config', label: '基础配置', icon: '⚙' }
];

const pageTitle = computed(() => String(route.meta.title ?? '数据看板'));
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

      <nav class="nav">
        <div class="nav-group">主导航</div>
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          class="nav-item"
          :to="item.path"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="sidebar-card">
        <div class="sidebar-card-title">当前数据版本</div>
        <div class="sidebar-card-main">{{ appStore.dataVersion }}</div>
        <div class="sidebar-card-meta">等待接入数据导入</div>
      </div>
    </aside>

    <main class="workspace">
      <header class="topbar">
        <div>
          <div class="eyebrow">WORLD FOOTBALL ARCHIVE</div>
          <h1>{{ pageTitle }}</h1>
        </div>
        <div class="topbar-actions">
          <div class="search-box">搜索球员 / 国家 / 俱乐部</div>
          <button class="icon-button" type="button">⌕</button>
        </div>
      </header>

      <RouterView />
    </main>
  </div>
</template>
