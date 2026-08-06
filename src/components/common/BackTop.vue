<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useWindowScroll } from '@vueuse/core'

const { y } = useWindowScroll()
const show = ref(false)

function updateShow() {
  show.value = y.value > 400
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 组件挂载时绑定、卸载时解绑，避免内存泄漏
onMounted(() => {
  window.addEventListener('scroll', updateShow, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateShow)
})
</script>

<template>
  <Transition name="back-top">
    <button
      v-show="show"
      class="back-top"
      aria-label="回到顶部"
      @click="scrollToTop"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  </Transition>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.back-top {
  position: fixed;
  bottom: 40px;
  right: 36px;
  z-index: 800;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid $line;
  background: $card;
  color: $dai;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px rgba(0,0,0,.08);
  transition: all .3s ease;

  &:hover {
    background: $dai;
    color: #fff;
    border-color: $dai;
    transform: translateY(-3px);
    box-shadow: 0 4px 16px rgba(74,107,92,.25);
  }
}

.back-top-enter-active,
.back-top-leave-active {
  transition: all .3s ease;
}
.back-top-enter-from,
.back-top-leave-to {
  opacity: 0;
  transform: translateY(16px);
}

@include mobile {
  .back-top {
    bottom: 24px;
    right: 16px;
    width: 40px;
    height: 40px;
  }
}

html.dark {
  .back-top {
    background: #2a2724;
    border-color: #3a3630;
    color: #7d9471;
    box-shadow: 0 2px 12px rgba(0,0,0,.2);
    &:hover {
      background: #4a6b5c;
      color: #d4cfc4;
      border-color: #4a6b5c;
      box-shadow: 0 4px 16px rgba(74,107,92,.35);
    }
  }
}
</style>
