# 墨笺博客

基于 Vue 3、TypeScript、Vite 和 Supabase 的个人博客，包含文章展示、分类、搜索、Markdown 编辑和后台管理。

- 线上地址：<https://messere.cn>
- 后台入口：<https://messere.cn/admin/login>
- 托管平台：Tencent EdgeOne Pages

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

`VITE_SUPABASE_ANON_KEY` 可以出现在浏览器端，真正的数据安全必须由 Supabase RLS 策略保证。不要把 `service_role` 密钥放入任何 `VITE_` 环境变量。

## Supabase 初始化与迁移

新项目可在 Supabase SQL Editor 中运行 [`supabase/setup.sql`](supabase/setup.sql)。

已经存在的项目按顺序运行：

1. [`supabase/add-post-excerpt.sql`](supabase/add-post-excerpt.sql)，增加文章摘要并回填已有文章。
2. [`supabase/secure-admin-policies.sql`](supabase/secure-admin-policies.sql)，把写权限限制到管理员白名单。
3. 根据脚本末尾的示例，将自己的 Auth 用户加入 `blog_admins`。

建议同时在 Supabase Authentication 设置中关闭公开注册，只通过 Dashboard 创建管理员账号。

## 验证与构建

```bash
npm run test:run
npm run build
npm audit
```

生产构建会从 Supabase 读取最新文章并生成 `dist/feed.xml`。若 Supabase 临时不可用，会保留 Vite 已复制的上一份 RSS，不会把订阅覆盖为空文件。

## 项目结构

```text
src/api/          Supabase 数据访问
src/components/   页面组件
src/layouts/      前台和后台布局
src/router/       路由与登录守卫
src/stores/       Pinia 状态
src/utils/        Markdown、日期与摘要处理
src/views/        前台和后台页面
supabase/         建表和数据库迁移脚本
tests/            Vitest 单元测试
```

## 安全说明

- 后台路由守卫只负责界面跳转，最终写权限由 Supabase RLS 控制。
- 文章 Markdown 输出会经过 DOMPurify 清洗后再插入页面。
- 管理员密码、`.env` 和 `service_role` 密钥不得提交到仓库。
