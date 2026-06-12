# 天下足球

天下足球是一个面向足球历史资料管理的数据平台，聚合球员、国家队、俱乐部、荣誉体系与能力评分，提供数据看板、排名统计、详情展示和数据导入能力。

## Monorepo 结构

- `apps/web`: Vue 3 前端应用
- `apps/api`: Node.js 后端应用
- `packages/shared`: 前后端共享类型与工具
- `docs`: 项目文档与 UI 设计稿
- `docs/ui-mockups`: 静态 UI 原型

## 项目文档

- [需求文档](docs/天下足球-需求文档.md)
- [可行性方案与实施计划](docs/天下足球-可行性方案与实施计划.md)
- [UI 设计稿](docs/ui-mockups/index.html)

## 常用命令

```bash
pnpm install
pnpm dev
pnpm dev:web
pnpm dev:api
pnpm type-check
pnpm lint
pnpm build
```

## 本地端口

- 前端 Web: `http://localhost:9248`
- 后端 API: `http://localhost:9249`

## 后端基础接口

- `GET http://localhost:9249/health`: 健康检查
- `POST http://localhost:9249/import-preview`: 数据导入预览占位接口

## 数据库

项目使用 PostgreSQL + Prisma。Prisma schema 位于 `apps/api/prisma/schema.prisma`。

```bash
pnpm --filter @total-soccer/api prisma:generate
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
feat: 新增球员列表页面
fix: 修复数据导入状态判断
```

提交类型建议使用规范类型；描述可以使用中文或英文。后续由 Codex 协助提交时，默认优先使用中文描述。
