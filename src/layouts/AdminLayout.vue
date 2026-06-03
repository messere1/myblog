<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const bp = useBreakpoints(breakpointsTailwind)
const isMobile = bp.smaller('md')
const sidebarOpen = ref(!bp.isSmaller('md'))

const navItems = [
  { to: '/admin/dashboard', icon: '📊', label: '仪表盘' },
  { to: '/admin/posts', icon: '📝', label: '文章管理' },
  { to: '/admin/posts/edit', icon: '✏️', label: '新建文章' },
  { to: '/admin/categories', icon: '🏷️', label: '分类管理' },
]

function handleLogout() {
  auth.logout()
  router.push('/admin/login')
}
</script>

<template>
  <div class="admin-layout" :class="{ 'sidebar-collapsed': isMobile && !sidebarOpen }">
    <aside class="sidebar" :class="{ 'sidebar--open': sidebarOpen || !isMobile }">
      <div class="sidebar-header">
        <span class="logo">🛠 博客后台</span>
        <button v-if="isMobile" class="close-btn" @click="sidebarOpen = false">✕</button>
      </div>

      <nav class="sidebar-nav">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-item"
          @click="isMobile && (sidebarOpen = false)"
        >
          <span class="icon">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <div class="user-info">{{ auth.userEmail }}</div>
        <button class="logout-btn" @click="handleLogout">退出登录</button>
      </div>
    </aside>

    <div class="content-wrap">
      <header class="admin-header">
        <button v-if="isMobile" class="menu-btn" @click="sidebarOpen = !sidebarOpen">☰</button>
        <RouterLink to="/" class="visit-front">← 访问前台</RouterLink>
      </header>
      <main class="admin-main">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.admin-layout {
  display: flex;
  min-height: 100vh;
  background: $bg-light;
}

.sidebar {
  width: 220px;
  background: #1e293b;
  color: #fff;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  .sidebar-header {
    padding: 20px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    .logo { font-size: 16px; font-weight: 700; }
    .close-btn { background: none; border: none; color: #fff; font-size: 18px; cursor: pointer; }
  }

  .sidebar-nav {
    flex: 1;
    padding: 12px 0;
    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 20px;
      color: rgba(255,255,255,0.7);
      text-decoration: none;
      transition: all 0.2s;
      font-size: 14px;
      .icon { font-size: 16px; }
      &:hover, &.router-link-active {
        color: #fff;
        background: rgba(255,255,255,0.1);
      }
    }
  }

  .sidebar-footer {
    padding: 16px;
    border-top: 1px solid rgba(255,255,255,0.1);
    .user-info { font-size: 12px; color: rgba(255,255,255,0.5); margin-bottom: 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .logout-btn {
      width: 100%;
      padding: 8px;
      background: rgba(255,255,255,0.1);
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      &:hover { background: rgba(255,255,255,0.2); }
    }
  }
}

.content-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;

  .admin-header {
    height: 56px;
    background: #fff;
    border-bottom: 1px solid $border-color;
    display: flex;
    align-items: center;
    padding: 0 16px;
    gap: 16px;
    .menu-btn { background: none; border: none; font-size: 20px; cursor: pointer; }
    .visit-front { font-size: 13px; color: $text-secondary; text-decoration: none; &:hover { color: $primary; } }
  }

  .admin-main { flex: 1; overflow-y: auto; }
}

@include mobile {
  .sidebar {
    position: fixed;
    top: 0;
    left: -220px;
    height: 100vh;
    z-index: 200;
    transition: left 0.3s;
    &.sidebar--open { left: 0; }
  }
}
</style>
