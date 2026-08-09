# Messere Portfolio

面向后端工程岗位的个人工程作品集，使用 Vue 3、TypeScript、Vite、Supabase 与 GitHub API 构建。

- 线上地址：<https://messere.cn>
- 后台入口：<https://messere.cn/admin/login>
- 托管平台：Tencent EdgeOne Pages

## 功能

- 工程师 Portfolio 首页：技术栈、真实 GitHub 项目、成长时间线与最新文章
- 技术博客：Supabase 实时文章、分类筛选、搜索、Markdown 渲染与 RSS
- 项目列表与详情：读取 GitHub 公开仓库、语言构成和工程指标，API 不可用时使用构建快照降级
- About 与 Resume：个人工程方向、实时数据和可打印简历
- 访客评论：Giscus（GitHub Discussions）
- 管理后台：管理员白名单鉴权、文章与分类管理
- 响应式设计：适配桌面和移动设备
- 工程质量：Vitest 单元测试与 GitHub Actions 自动构建检查

## 本地开发

要求 Node.js 20 或更高版本。

```bash
npm install
copy .env.example .env
npm run dev
```

在 `.env` 中填写：

```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SITE_URL=https://messere.cn
```

`VITE_SUPABASE_ANON_KEY` 可以出现在浏览器端，真正的数据安全必须由 Supabase RLS 策略保证。不要将 `service_role` 密钥放入任何 `VITE_` 环境变量。

## 内容来源

- 文章与分类：Supabase
- 项目和 GitHub 指标：GitHub API + `public/github-profile.json` 构建快照
- 姓名、技能、教育和时间线：`src/data/portfolio.ts`
- 评论：Giscus

## Supabase 初始化与迁移

新项目可在 Supabase SQL Editor 中运行 [`supabase/setup.sql`](supabase/setup.sql)。已有项目按顺序运行：

1. [`supabase/add-post-excerpt.sql`](supabase/add-post-excerpt.sql)，添加文章摘要并回填已有文章。
2. [`supabase/secure-admin-policies.sql`](supabase/secure-admin-policies.sql)，将写权限限制到管理员白名单。
3. 根据脚本末尾示例，将自己的 Auth 用户加入 `blog_admins`。

建议在 Supabase Authentication 设置中关闭公开注册，只通过 Dashboard 创建管理员账号。

## 验证与构建

```bash
npm run test:run
npm run build
```

生产构建会生成 `dist/feed.xml` 和 `dist/github-profile.json`。外部 API 临时不可用时会保留可用快照，避免页面失去主要内容。

## 项目结构

```text
src/api/          Supabase 与 GitHub 数据访问
src/components/   通用组件和 Portfolio 首页组件
src/data/         集中维护的个人资料
src/assets/styles/主题变量、全局样式和动效基础
src/layouts/      前台与后台布局
src/router/       页面路由与登录守卫
src/stores/       Pinia 状态
src/utils/        Markdown、日期与摘要处理
src/views/        Portfolio、博客与后台页面
supabase/         建表与数据库迁移脚本
tests/            Vitest 单元测试
.github/workflows GitHub Actions 持续集成
```

## 安全说明

- 后台路由守卫只负责界面跳转，最终写权限由 Supabase RLS 控制。
- Markdown 输出经过 DOMPurify 清洗后再插入页面。
- 管理员密码、`.env` 和 `service_role` 密钥不得提交到仓库。
