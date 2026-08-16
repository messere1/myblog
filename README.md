# Messere Blog

Messere 的个人技术博客，聚焦 Java 后端、Spring 生态、数据库与分布式系统。站点使用 Next.js 16、React 19、TypeScript、Tailwind CSS 4 和 Supabase PostgreSQL，部署目标为 Vercel。

- 域名：<https://messere.cn>
- GitHub：<https://github.com/messere1>
- 数据库：Supabase PostgreSQL
- 管理员认证：Supabase Auth + `blog_admins` 白名单
- AI 助手：GLM 5.3（OpenAI 兼容接口，服务端调用）

## 架构

页面与 `/api/*` 接口均由同一个 Next.js 应用提供，不需要额外配置前端 API 地址。服务端通过 Supabase 的 pooled database connection string 访问隔离的 `mblog` schema；旧 Vue 博客的 `public.posts` 和 `public.categories` 保持原样。

管理员密码由 Supabase Auth 以不可逆形式管理，数据库中没有可读取的明文密码。后台管理系统使用原 Supabase Auth 邮箱和密码登录，并检查该用户是否存在于 `public.blog_admins`。

## 首次配置 Supabase

1. 在 Supabase Dashboard 的 SQL Editor 中运行 [`supabase/mblog-schema.sql`](supabase/mblog-schema.sql)。
2. 脚本会创建完整的 `mblog` schema，并复制现有文章、分类和标签，不会删除旧表。
3. 确认管理员 Auth 用户已加入白名单：

```sql
insert into public.blog_admins (user_id)
select id from auth.users where email = '3023209092@tju.edu.cn'
on conflict (user_id) do nothing;
```

4. 在 Supabase Dashboard 的 Connect 面板复制 Transaction pooler 或 Session pooler 连接串，作为 `SUPABASE_DATABASE_URL`。连接串属于服务端密钥，不可使用 `NEXT_PUBLIC_` 前缀。
5. 配置连接串后运行 `npm run sync:github`，把 `messere1` 的非 fork、未归档项目同步到项目页。

## 本地开发

要求 Node.js 20 或更高版本。

```powershell
cd D:\myproject\MBlog
npm ci
Copy-Item .env.example .env.local
npm run dev
```

`.env.local` 至少填写：

```dotenv
NEXT_PUBLIC_SITE_URL=https://messere.cn
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_DATABASE_URL=postgresql://...
JWT_SECRET=至少32位随机字符串
```

后台入口：<http://localhost:3000/admin/login>。

在没有 `SUPABASE_DATABASE_URL` 时，开发和自动化测试仍可使用 `TURSO_DATABASE_URL=file:local.db` 作为本地兼容数据库；生产环境只使用 Supabase。

## GLM 助手

聊天请求由 Next.js 服务端转发到 GLM 的 OpenAI 兼容接口，API Key 不会暴露给浏览器。配置如下：

```dotenv
GLM_BASE_URL=https://glm.llm.autos
GLM_API_KEY=你的服务端密钥
GLM_MODEL=glm-5.3
```

模型名只接受 `glm-*` 格式。`glm-5.3` 会使用 `low` 思考强度，以兼顾响应速度和回答质量。所有 `GLM_*` 变量均为服务端变量，不得添加 `NEXT_PUBLIC_` 前缀。

## SMTP 留言通知

通知收件人与默认发件账号已设为 `3023209092@tju.edu.cn`。还需提供学校邮箱实际支持的 SMTP 主机和 SMTP 密码或授权码：

```dotenv
SMTP_HOST=
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=3023209092@tju.edu.cn
SMTP_PASS=
MESSAGE_NOTIFY_TO=3023209092@tju.edu.cn
```

如果该邮箱不支持 SMTP，可换用其他发件邮箱，收件地址仍保持天津大学邮箱。

## Vercel 部署

1. 将仓库导入 Vercel，Framework Preset 选择 Next.js。
2. 从 EdgeOne Pages 复制现有 Supabase URL 和 anon key。
3. 在 Vercel 添加 `.env.example` 中对应的生产环境变量，尤其是 `SUPABASE_DATABASE_URL`、`JWT_SECRET` 和三个 `GLM_*` 变量。
4. Build Command 使用 `npm run build`。
5. 在 Vercel Domains 中绑定 `messere.cn` 和需要时的 `www.messere.cn`，按提示修改 DNS。

站点未备案时，不展示 ICP 信息。若域名解析到中国大陆境外的 Vercel 节点，通常不要求 ICP；最终仍应以域名服务商和部署地区的要求为准。

## 检查命令

```powershell
npm run lint
npm test
npm run build
npm start
```

## 个性化入口

- 站点身份、头像、微信、QQ、主题及 AI：`siteConfig.ts`
- 关于页：`app/about/about.md`
- 全局主题：`app/globals.css`
- SEO：`app/layout.tsx`、`app/sitemap.ts`、`app/robots.ts`
- 页脚：`components/SiteFooter.tsx`
- Supabase 完整结构：`supabase/mblog-schema.sql`

不要提交 `.env.local`、Supabase 数据库连接串、JWT 密钥、SMTP 密码或 Vercel OIDC 令牌。
