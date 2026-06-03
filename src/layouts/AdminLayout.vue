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
  { to: '/admin/dashboard', icon: '◫', label: '仪表盘' },
  { to: '/admin/posts', icon: '稿', label: '文章管理' },
  { to: '/admin/posts/edit', icon: '✎', label: '新建文章' },
  { to: '/admin/categories', icon: '笺', label: '分类管理' },
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
        <span class="logo">墨笺 · 后台</span>
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
  background: $bg;
}

.sidebar {
  width: 220px;
  background: $ink;
  color: $card;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: transform 0.3s;

  .sidebar-header {
    padding: 20px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    .logo {
      font-size: 16px;
      font-weight: 700;
      font-family: $serif;
      letter-spacing: 0.05em;
    }
    .close-btn {
      background: none;
      border: none;
      color: rgba(255,255,255,0.5);
      font-size: 18px;
      cursor: pointer;
    }
  }

  .sidebar-nav {
    flex: 1;
    padding: 12px 0;
    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 20px;
      color: rgba(255,255,255,0.55);
      text-decoration: none;
      transition: all 0.25s;
      font-size: 14px;
      .icon {
        font-size: 14px;
        width: 20px;
        text-align: center;
        font-family: $serif;
      }
      &:hover, &.router-link-active {
        color: $card;
        background: rgba(255,255,255,0.08);
      }
      &.router-link-active {
        border-right: 3px solid $dai;
        color: $card;
      }
    }
  }

  .sidebar-footer {
    padding: 16px;
    border-top: 1px solid rgba(255,255,255,0.08);
    .user-info {
      font-size: 12px;
      color: rgba(255,255,255,0.35);
      margin-bottom: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .logout-btn {
      width: 100%;
      padding: 8px;
      background: rgba(255,255,255,0.06);
      color: rgba(255,255,255,0.6);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: $radius;
      cursor: pointer;
      font-size: 13px;
      transition: all 0.2s;
      &:hover {
        background: rgba(255,255,255,0.12);
        color: $card;
      }
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
    background: $card;
    border-bottom: 1px solid $line;
    display: flex;
    align-items: center;
    padding: 0 16px;
    gap: 16px;
    .menu-btn {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: $ink;
    }
    .visit-front {
      font-size: 13px;
      color: $ink-soft;
      text-decoration: none;
      &:hover { color: $dai; }
    }
  }

  .admin-main { flex: 1; overflow-y: auto; }
}

// Mobile sidebar overlay
@media (max-width: 767px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    transform: translateX(-100%);
    &.sidebar--open {
      transform: translateX(0);
    }
  }
  .content-wrap {
    width: 100%;
  }
}

// 暗色模式
html.dark {
  .admin-layout { background: #1a1916; }
  .content-wrap {
    .admin-header {
      background: #242220;
      border-bottom-color: #3a3630;
      .menu-btn { color: #d4cfc4; }
      .visit-front { color: #9a9488; &:hover { color: #7d9471; } }
    }
  }
}
</style>
