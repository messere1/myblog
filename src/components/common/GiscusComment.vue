<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useThemeStore } from '@/stores/theme'

const GISCUS_REPO = import.meta.env.VITE_GISCUS_REPO || 'messere1/myblog'
const GISCUS_REPO_ID = import.meta.env.VITE_GISCUS_REPO_ID || 'R_kgDOSvnEWQ'
const GISCUS_CATEGORY = import.meta.env.VITE_GISCUS_CATEGORY || 'General'
const GISCUS_CATEGORY_ID = import.meta.env.VITE_GISCUS_CATEGORY_ID || 'DIC_kwDOSvnEWc4DC6x9'

defineProps<{ class?: string }>()

const themeStore = useThemeStore()
const container = ref<HTMLElement>()

function currentTheme() {
  return themeStore.isDark ? 'dark_dimmed' : 'light'
}

function mountGiscus() {
  if (!container.value) return

  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.setAttribute('data-repo', GISCUS_REPO)
  script.setAttribute('data-repo-id', GISCUS_REPO_ID)
  script.setAttribute('data-category', GISCUS_CATEGORY)
  script.setAttribute('data-category-id', GISCUS_CATEGORY_ID)
  script.setAttribute('data-mapping', 'pathname')
  script.setAttribute('data-strict', '1')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'top')
  script.setAttribute('data-theme', currentTheme())
  script.setAttribute('data-lang', 'zh-CN')
  script.setAttribute('data-loading', 'lazy')
  script.setAttribute('crossorigin', 'anonymous')
  script.async = true
  container.value.appendChild(script)
}

function updateTheme() {
  const frame = container.value?.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
  frame?.contentWindow?.postMessage(
    { giscus: { setConfig: { theme: currentTheme() } } },
    'https://giscus.app',
  )
}

onMounted(mountGiscus)
watch(() => themeStore.isDark, updateTheme)
onBeforeUnmount(() => container.value?.replaceChildren())
</script>

<template>
  <section :class="['giscus-wrap', $props.class]" aria-label="文章评论">
    <div ref="container" class="giscus-container" />
    <noscript>请启用 JavaScript 后查看和发布评论。</noscript>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.giscus-wrap {
  margin-top: 36px;
  padding-top: 28px;
  border-top: 1px solid $line;
}

.giscus-container { min-height: 200px; }

html.dark .giscus-wrap { border-top-color: #3a3630; }
</style>
