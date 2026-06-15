# 天下足球

天下足球是一个面向足球历史资料管理的数据平台，聚合球员、国家队、俱乐部、荣誉体系与能力评分，提供世界概览、排名统计、详情展示和数据导入能力。

## Monorepo 结构

- `apps/web`: Vue 3 前端应用
- `apps/api`: Node.js 后端应用
- `packages/shared`: 前后端共享类型与工具
- `docs`: 项目文档与 UI 设计稿
- `docs/ui-mockups`: 静态 UI 原型

## 项目文档

- [需求文档](docs/天下足球-需求文档.md)
- [可行性方案与实施计划](docs/天下足球-可行性方案与实施计划.md)
- [任务计划](docs/任务计划.md)
- [UI 设计稿](docs/ui-mockups/index.html)

## 产品导航

- `天下纵览`: 世界概览、紫禁之巅
- `国家圣殿`: 国家概览、国家荣誉、国家详情
- `豪门殿堂`: 豪门概览、豪门荣誉、豪门详情
- `巨星殿堂`: 巨星概览、巨星荣誉、巨星详情
- `天机阁`: 荣誉规则、数据导入、基础配置、备注管理、权限管理

## 常用命令

启动前后端应用：

```bash
pnpm install
pnpm dev
pnpm dev:web
pnpm dev:api
```

质量检查：

```bash
pnpm type-check
pnpm lint
pnpm build
```

## 前端基础依赖

- `Element Plus`: 后台 UI 组件
- `ECharts`: 数据图表
- `dayjs`: 日期处理
- `NProgress`: 路由跳转进度条
- `vue-i18n`: 国际化
- `axios`: HTTP 请求
- `sass`: 样式预处理器

## 本地端口

- 前端 Web: `http://localhost:9248`
- 后端 API: `http://localhost:9249`

## 后端基础接口

- `GET http://localhost:9249/health`: 健康检查
- `GET http://localhost:9249/docs`: Swagger/OpenAPI 文档
- `POST http://localhost:9249/import-preview`: 文件上传导入预览接口

## 数据库

项目使用 PostgreSQL + Prisma。Prisma schema 位于 `apps/api/prisma/schema.prisma`。

项目不强制依赖 Docker。只要 `apps/api/.env` 中的 `DATABASE_URL` 指向可用 PostgreSQL，就可以直接使用本机 PostgreSQL 或云数据库：

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/total_soccer?schema=public"
```

初始化数据库：

```bash
pnpm prisma:migrate
pnpm --filter @total-soccer/api prisma:generate
pnpm prisma:studio
```

如果本机没有安装 PostgreSQL，也可以使用 Docker Compose 作为可选方案：

```bash
pnpm db:up
pnpm db:down
```

## 提交前检查

提交前建议执行：

```bash
pnpm type-check
pnpm lint
pnpm build
```

## 提交规范

项目使用 Husky、lint-staged、Commitlint 和 cz-git 管理提交质量。

```bash
pnpm commit
```

提交信息格式：

```bash
chore: 搭建项目工程基础
feat: 新增巨星概览页面
fix: 修复数据导入状态判断
```

提交类型建议使用规范类型；描述可以使用中文或英文。后续由 Codex 协助提交时，默认优先使用中文描述。
