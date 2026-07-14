import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import NProgress from 'nprogress';
import AppLayout from '@/layouts/AppLayout.vue';
import WorldOverviewView from '@/views/overview/WorldOverviewView/index.vue';
import ForbiddenSummitView from '@/views/overview/ForbiddenSummitView/index.vue';
import NationsOverviewView from '@/views/nations/NationsOverviewView.vue';
import NationHonorsView from '@/views/nations/NationHonorsView.vue';
import NationDetailView from '@/views/nations/NationDetailView/index.vue';
import ClubsOverviewView from '@/views/clubs/ClubsOverviewView.vue';
import ClubHonorsView from '@/views/clubs/ClubHonorsView.vue';
import ClubDetailView from '@/views/clubs/ClubDetailView/index.vue';
import StarsOverviewView from '@/views/stars/StarsOverviewView/index.vue';
import StarHonorsView from '@/views/stars/StarHonorsView.vue';
import StarDetailView from '@/views/stars/StarDetailView/index.vue';
import StarFormView from '@/views/stars/StarFormView.vue';
import StarResumeView from '@/views/stars/StarResumeView.vue';
import HonorRulesView from '@/views/tianji/HonorRulesView/index.vue';
import CompetitionsView from '@/views/tianji/CompetitionsView/index.vue';
import CompetitionDetailView from '@/views/tianji/CompetitionDetailView/index.vue';
import AwardsView from '@/views/tianji/AwardsView/index.vue';
import DataImportView from '@/views/tianji/DataImportView/index.vue';
import BaseConfigView from '@/views/tianji/BaseConfigView/index.vue';
import ColorSystemView from '@/views/tianji/ColorSystemView/index.vue';
import RemarksView from '@/views/tianji/RemarksView/index.vue';
import PermissionsView from '@/views/tianji/PermissionsView/index.vue';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    redirect: '/overview/world',
    children: [
      {
        path: 'overview',
        redirect: '/overview/world'
      },
      {
        path: 'overview/world',
        name: 'overview-world',
        component: WorldOverviewView,
        meta: { title: '世界概览' }
      },
      {
        path: 'overview/forbidden-summit',
        name: 'overview-forbidden-summit',
        component: ForbiddenSummitView,
        meta: { title: '紫禁之巅' }
      },
      { path: 'nations', redirect: '/nations/overview' },
      {
        path: 'nations/overview',
        name: 'nations-overview',
        component: NationsOverviewView,
        meta: { title: '国家概览' }
      },
      {
        path: 'nations/honors',
        name: 'nations-honors',
        component: NationHonorsView,
        meta: { title: '国家荣誉' }
      },
      {
        path: 'nations/detail',
        name: 'nations-detail',
        component: NationDetailView,
        meta: { title: '国家详情' }
      },
      {
        path: 'nations/detail/:id',
        name: 'nations-detail-id',
        component: NationDetailView,
        meta: { title: '国家详情' }
      },
      { path: 'clubs', redirect: '/clubs/overview' },
      {
        path: 'clubs/overview',
        name: 'clubs-overview',
        component: ClubsOverviewView,
        meta: { title: '豪门概览' }
      },
      {
        path: 'clubs/honors',
        name: 'clubs-honors',
        component: ClubHonorsView,
        meta: { title: '豪门荣誉' }
      },
      {
        path: 'clubs/detail',
        name: 'clubs-detail',
        component: ClubDetailView,
        meta: { title: '豪门详情' }
      },
      {
        path: 'clubs/detail/:id',
        name: 'clubs-detail-id',
        component: ClubDetailView,
        meta: { title: '豪门详情' }
      },
      { path: 'stars', redirect: '/stars/overview' },
      {
        path: 'stars/overview',
        name: 'stars-overview',
        component: StarsOverviewView,
        meta: { title: '巨星概览' }
      },
      {
        path: 'stars/honors',
        name: 'stars-honors',
        component: StarHonorsView,
        meta: { title: '巨星荣誉' }
      },
      {
        path: 'stars/detail',
        name: 'stars-detail',
        component: StarDetailView,
        meta: { title: '巨星详情' }
      },
      {
        path: 'stars/detail/:id',
        name: 'stars-detail-id',
        component: StarDetailView,
        meta: { title: '巨星详情' }
      },
      {
        path: 'stars/new',
        name: 'stars-new',
        component: StarFormView,
        meta: { title: '新增球员' }
      },
      {
        path: 'stars/edit/:id',
        name: 'stars-edit-id',
        component: StarFormView,
        meta: { title: '编辑球员' }
      },
      {
        path: 'stars/resume/:id',
        name: 'stars-resume-id',
        component: StarResumeView,
        meta: { title: '履历管理' }
      },
      { path: 'tianji', redirect: '/tianji/honor-rules' },
      {
        path: 'tianji/honor-rules',
        name: 'tianji-honor-rules',
        component: HonorRulesView,
        meta: { title: '荣誉规则' }
      },
      {
        path: 'tianji/competitions',
        name: 'tianji-competitions',
        component: CompetitionsView,
        meta: { title: '赛事管理' }
      },
      {
        path: 'tianji/competitions/:id',
        name: 'tianji-competition-detail-id',
        component: CompetitionDetailView,
        meta: { title: '赛事详情' }
      },
      {
        path: 'tianji/awards',
        name: 'tianji-awards',
        component: AwardsView,
        meta: { title: '奖项管理' }
      },
      {
        path: 'tianji/awards/:id',
        name: 'tianji-award-detail-id',
        component: AwardsView,
        meta: { title: '奖项详情' }
      },
      {
        path: 'tianji/import',
        name: 'tianji-import',
        component: DataImportView,
        meta: { title: '数据导入' }
      },
      {
        path: 'tianji/base',
        name: 'tianji-base',
        component: BaseConfigView,
        meta: { title: '基础配置' }
      },
      {
        path: 'tianji/colors',
        name: 'tianji-colors',
        component: ColorSystemView,
        meta: { title: '色彩体系' }
      },
      {
        path: 'tianji/remarks',
        name: 'tianji-remarks',
        component: RemarksView,
        meta: { title: '备注管理' }
      },
      {
        path: 'tianji/permissions',
        name: 'tianji-permissions',
        component: PermissionsView,
        meta: { title: '权限管理' }
      }
    ]
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 120
});

router.beforeEach(() => {
  NProgress.start();
});

router.afterEach(() => {
  NProgress.done();
});

router.onError(() => {
  NProgress.done();
});
