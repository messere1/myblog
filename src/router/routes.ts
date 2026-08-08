import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  // === 前台 ===
  {
    path: '/',
    component: () => import('@/layouts/FrontLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/front/Home.vue'),
        meta: { title: '首页' },
      },
      {
        path: 'post/:id(\\d+)',
        name: 'post-detail',
        component: () => import('@/views/front/PostDetail.vue'),
        meta: { title: '文章' },
      },
      {
        path: 'category/:id(\\d+)',
        name: 'category',
        component: () => import('@/views/front/Category.vue'),
        meta: { title: '分类' },
      },
      {
        path: 'search',
        name: 'search',
        component: () => import('@/views/front/Search.vue'),
        meta: { title: '搜索' },
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('@/views/front/About.vue'),
        meta: { title: '关于' },
      },
      {
        path: 'archive',
        name: 'archive',
        component: () => import('@/views/front/Archive.vue'),
        meta: { title: '归档' },
      },
      {
        path: 'github',
        name: 'github',
        component: () => import('@/views/front/GitHub.vue'),
        meta: { title: 'GitHub' },
      },
      {
        path: 'blog',
        name: 'blog',
        component: () => import('@/views/front/Blog.vue'),
        meta: { title: 'Technical Blog' },
      },
      {
        path: 'projects',
        name: 'projects',
        component: () => import('@/views/front/Projects.vue'),
        meta: { title: 'Projects' },
      },
      {
        path: 'project',
        redirect: '/projects',
      },
      {
        path: 'resume',
        name: 'resume',
        component: () => import('@/views/front/Resume.vue'),
        meta: { title: 'Resume' },
      },
      {
        path: 'bangumi',
        redirect: '/github',
      },
    ],
  },

  // === 后台 ===
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('@/views/admin/Login.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
        meta: { title: '仪表盘' },
      },
      {
        path: 'posts',
        name: 'admin-posts',
        component: () => import('@/views/admin/PostManage.vue'),
        meta: { title: '文章管理' },
      },
      {
        path: 'posts/edit/:id(\\d+)?',
        name: 'admin-post-edit',
        component: () => import('@/views/admin/PostEditor.vue'),
        meta: { title: '编辑文章' },
      },
      {
        path: 'categories',
        name: 'admin-categories',
        component: () => import('@/views/admin/CategoryManage.vue'),
        meta: { title: '分类管理' },
      },
      {
        path: 'settings',
        name: 'admin-settings',
        component: () => import('@/views/admin/Settings.vue'),
        meta: { title: '站点设置' },
      },
    ],
  },

  // 404
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFound.vue'),
  },
]
