import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import AppLayout from '@/layouts/AppLayout.vue';
import DashboardView from '@/views/DashboardView.vue';
import PlayersView from '@/views/PlayersView.vue';
import CountriesView from '@/views/CountriesView.vue';
import ClubsView from '@/views/ClubsView.vue';
import HonorsView from '@/views/HonorsView.vue';
import BestLineupView from '@/views/BestLineupView.vue';
import ImportView from '@/views/ImportView.vue';
import ConfigView from '@/views/ConfigView.vue';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: DashboardView,
        meta: { title: '数据看板' }
      },
      { path: 'players', name: 'players', component: PlayersView, meta: { title: '球员资料库' } },
      {
        path: 'countries',
        name: 'countries',
        component: CountriesView,
        meta: { title: '国家资料库' }
      },
      { path: 'clubs', name: 'clubs', component: ClubsView, meta: { title: '俱乐部资料库' } },
      { path: 'honors', name: 'honors', component: HonorsView, meta: { title: '荣誉规则' } },
      {
        path: 'best-lineup',
        name: 'best-lineup',
        component: BestLineupView,
        meta: { title: '最佳阵容' }
      },
      { path: 'import', name: 'import', component: ImportView, meta: { title: '数据导入' } },
      { path: 'config', name: 'config', component: ConfigView, meta: { title: '基础配置' } }
    ]
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});
