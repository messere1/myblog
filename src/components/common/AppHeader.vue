<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'
import { useAuthStore } from '@/stores/auth'
import { usePostStore } from '@/stores/post'
import { useThemeStore } from '@/stores/theme'

const router = useRouter()
const auth = useAuthStore()
const postStore = usePostStore()
const theme = useThemeStore()

const bp = useBreakpoints(breakpointsTailwind)
const isMobile = bp.smaller('md')

const menuOpen = ref(false)

function handleSearch() {
  if (postStore.keyword) {
    router.push('/search')
    menuOpen.value = false
  }
}
</script>

<template>
  <nav class="nav">
    <div class="nav-inner">
      <RouterLink to="/" class="logo">
        <span class="seal">墨</span>墨笺
      </RouterLink>

      <div class="nav-links" :class="{ 'nav-links--open': menuOpen }">
        <RouterLink to="/" @click="menuOpen = false">首页</RouterLink>
        <RouterLink to="/search" @click="menuOpen = false">搜索</RouterLink>
        <RouterLink v-if="auth.isLoggedIn" to="/admin/dashboard" @click="menuOpen = false">后台</RouterLink>
        <RouterLink v-else to="/admin/login" @click="menuOpen = false">登录</RouterLink>
        <button v-if="auth.isLoggedIn" class="logout-btn" @click="auth.logout(); menuOpen = false">退出</button>
      </div>

      <div class="nav-actions">
        <div class="icon-btn" title="搜索" @click="router.push('/search')">⌕</div>
        <div class="icon-btn" title="切换主题" @click="theme.toggleDark()">
          {{ theme.isDark ? '☀' : '☾' }}
        </div>
        <button class="hamburger" @click="menuOpen = !menuOpen" v-if="isMobile">
          {{ menuOpen ? '✕' : '☰' }}
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
  background: rgba(244, 241, 234, 0.85);
  border-bottom: 1px solid $line;
}

.nav-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: $serif;
  font-weight: 700;
  font-size: 21px;
  letter-spacing: 2px;
  color: $ink;
  text-decoration: none;

  .seal {
    width: 34px;
    height: 34px;
    border-radius: $radius;
    background: $dai;
    color: $card;
    display: grid;
    place-items: center;
    font-size: 17px;
    font-family: $serif;
    font-weight: 500;
  }
}

.nav-links {
  display: flex;
  gap: 36px;
  font-size: 15px;
  color: $ink-soft;
  letter-spacing: 1px;

  a {
    position: relative;
    transition: color .25s;
    padding: 2px 0;
    text-decoration: none;
    &:hover, &.router-link-active { color: $dai; }
    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -4px;
      width: 0;
      height: 1.5px;
      background: $dai;
      transition: width .3s;
    }
    &:hover::after, &.router-link-active::after { width: 100%; }
  }

  .logout-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 15px;
    color: $ink-soft;
    letter-spacing: 1px;
    padding: 2px 0;
    transition: color .25s;
    &:hover { color: $dai; }
  }
}

.nav-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.icon-btn {
  width: 38px;
  height: 38px;
  border-radius: $radius;
  border: 1px solid $line;
  background: $card;
  display: grid;
  place-items: center;
  cursor: pointer;
  color: $ink-soft;
  transition: all .25s;
  font-size: 16px;
  &:hover { color: $dai; border-color: $dai; }
}

.hamburger {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  color: $ink-soft;
}

@include mobile {
  .nav-inner { padding: 16px 20px; }
  .logo { font-size: 18px; .seal { width: 30px; height: 30px; font-size: 15px; } }
  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(244, 241, 234, 0.95);
    backdrop-filter: blur(12px);
    flex-direction: column;
    padding: 20px;
    border-bottom: 1px solid $line;
    gap: 16px;
    &.nav-links--open { display: flex; }
  }
}
</style>
