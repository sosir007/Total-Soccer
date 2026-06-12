<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { useAppStore } from '@/stores/app';

const appStore = useAppStore();
const route = useRoute();

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
      { path: '/nations/honors', label: '国家荣誉' },
      { path: '/nations/detail', label: '国家详情' }
    ]
  },
  {
    label: '豪门殿堂',
    icon: '▣',
    children: [
      { path: '/clubs/overview', label: '豪门概览' },
      { path: '/clubs/honors', label: '豪门荣誉' },
      { path: '/clubs/detail', label: '豪门详情' }
    ]
  },
  {
    label: '巨星殿堂',
    icon: '◉',
    children: [
      { path: '/stars/overview', label: '巨星概览' },
      { path: '/stars/honors', label: '巨星荣誉' },
      { path: '/stars/detail', label: '巨星详情' }
    ]
  },
  {
    label: '天机阁',
    icon: '⚙',
    children: [
      { path: '/tianji/honor-rules', label: '荣誉规则' },
      { path: '/tianji/import', label: '数据导入' },
      { path: '/tianji/base', label: '基础配置' },
      { path: '/tianji/remarks', label: '备注管理' },
      { path: '/tianji/permissions', label: '权限管理' }
    ]
  }
];

const pageTitle = computed(() => String(route.meta.title ?? '世界概览'));
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
      <header class="topbar">
        <div>
          <div class="eyebrow">WORLD FOOTBALL ARCHIVE</div>
          <h1>{{ pageTitle }}</h1>
        </div>
        <div class="topbar-actions">
          <div class="search-box">搜索巨星 / 国家 / 豪门</div>
          <button class="icon-button" type="button">⌕</button>
        </div>
      </header>

      <RouterView />
    </main>
  </div>
</template>
