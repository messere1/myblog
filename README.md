# MyBlog - 博客系统

基于 Vue 3 + Vite + TypeScript 的博客系统，包含前台展示和后台管理功能。

## 在线预览

> 部署后填写

- 前台首页：`https://your-blog.vercel.app`
- 后台地址：`https://your-blog.vercel.app/admin/login`
- 测试账号：`admin@blog.com` / `123456`

## 技术栈

- **框架**：Vue 3 (Composition API + `<script setup>`)
- **构建**：Vite 5
- **语言**：TypeScript
- **路由**：Vue Router 4（动态路由 + 懒加载）
- **状态**：Pinia
- **HTTP**：Axios（请求/响应拦截器）
- **Markdown**：md-editor-v3 编辑器 + markdown-it 渲染
- **工具**：@vueuse/core（`useDebounceFn`、`useInfiniteScroll`、`useBreakpoints`、`useTitle`、`useDark`）
- **Mock**：json-server
- **测试**：Vitest + @vue/test-utils

## 本地启动

```bash
npm install
npm run dev
```

启动后访问：
- 前台：http://localhost:5173
- 后台：http://localhost:5173/admin/login

## 运行测试

```bash
npm run test:run    # 单次运行
npm run test        # 监听模式
npm run test:ui     # 图形界面
```

## 构建

```bash
npm run build
```

## 项目结构

```
src/
├── api/          # Axios 封装 + 各模块接口
├── assets/       # 全局样式（SCSS）
├── components/   # 通用组件
├── layouts/      # 前台 / 后台布局
├── router/       # 路由配置 + 导航守卫
├── stores/       # Pinia 状态管理
├── types/        # TypeScript 类型定义
├── utils/        # 工具函数
└── views/        # 页面组件
    ├── front/    # 前台页面
    └── admin/    # 后台页面
```
