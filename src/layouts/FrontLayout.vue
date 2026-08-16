<script setup lang="ts">
import AppHeader from '@/components/common/AppHeader.vue'
import AppFooter from '@/components/common/AppFooter.vue'
import BackTop from '@/components/common/BackTop.vue'
import AmbientEffects from '@/components/common/AmbientEffects.vue'
</script>

<template>
  <div class="layout warm-site">
    <AmbientEffects />
    <AppHeader />
    <main class="main">
      <RouterView v-slot="{ Component }">
        <Transition name="fade-slide" mode="out-in">
          <component :is="Component" :key="$route.path" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter />
    <BackTop />
  </div>
</template>

<style scoped lang="scss">
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  .main { flex: 1; }
}

/* 页面切换过渡：淡入淡出 + 微上移 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity .28s ease, transform .28s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
