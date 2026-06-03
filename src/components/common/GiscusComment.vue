<script setup lang="ts">
import { watch, onMounted, onBeforeUnmount, ref } from 'vue'
import { useThemeStore } from '@/stores/theme'

// ═══════════════════════════════════════════════
//  Giscus 配置 — 填入你的 repoId 和 categoryId
//  获取方式：https://giscus.app → 填仓库 → 复制生成的值
// ═══════════════════════════════════════════════
const GISCUS_REPO = 'messere1/myblog'          // 仓库（owner/repo）
const GISCUS_REPO_ID = ''                       // ← 填 repoId
const GISCUS_CATEGORY = 'Announcements'          // Discussion 分类名
const GISCUS_CATEGORY_ID = ''                    // ← 填 categoryId
const GISCUS_MAPPING = 'pathname'                // 映射方式
const GISCUS_LANG = 'zh-CN'

const configured = GISCUS_REPO_ID && GISCUS_CATEGORY_ID

const props = defineProps<{ class?: string }>()
const themeStore = useThemeStore()
const container = ref<HTMLElement>()

/** 动态创建 / 更新 giscus <script> */
function renderGiscus() {
  if (!container.value) return
  container.value.innerHTML = ''

  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.setAttribute('data-repo', GISCUS_REPO)
  script.setAttribute('data-repo-id', GISCUS_REPO_ID)
  script.setAttribute('data-category', GISCUS_CATEGORY)
  script.setAttribute('data-category-id', GISCUS_CATEGORY_ID)
  script.setAttribute('data-mapping', GISCUS_MAPPING)
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'top')
  script.setAttribute('data-theme', themeStore.isDark ? 'dark_dimmed' : 'light')
  script.setAttribute('data-lang', GISCUS_LANG)
  script.setAttribute('crossorigin', 'anonymous')
  script.async = true
  container.value.appendChild(script)
}

onMounted(() => {
  if (configured) renderGiscus()
})

// 明暗切换时更新 giscus 主题
watch(() => themeStore.isDark, () => {
  if (configured) renderGiscus()
})

onBeforeUnmount(() => {
  container.value && (container.value.innerHTML = '')
})
</script>

<template>
  <div :class="['giscus-wrap', props.class]">
    <template v-if="configured">
      <div ref="container" class="giscus-container" />
    </template>
    <template v-else>
      <div class="giscus-hint">
        <p>💬 评论区尚未配置</p>
        <p class="sub">
          请在 <code>GiscusComment.vue</code> 顶部填写
          <strong>repoId</strong> 和 <strong>categoryId</strong>，
          详见
          <a href="https://giscus.app" target="_blank" rel="noopener">giscus.app</a>
        </p>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.giscus-wrap {
  margin-top: 36px;
  padding-top: 28px;
  border-top: 1px solid $line;
}
.giscus-container {
  min-height: 200px;
}
.giscus-hint {
  background: $bg-soft;
  border: 1px dashed $line;
  border-radius: $radius-card;
  padding: 32px 24px;
  text-align: center;
  p { margin: 0; color: $ink-soft; font-size: 15px; }
  .sub {
    margin-top: 10px;
    font-size: 13px;
    color: $ink-faint;
    code {
      background: $dai-soft;
      color: $dai;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 12px;
    }
    a {
      color: $dai;
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }
}

html.dark {
  .giscus-wrap { border-top-color: #3a3630; }
  .giscus-hint {
    background: #2a2724;
    border-color: #3a3630;
    p { color: #9a9488; }
    .sub {
      color: #6a6458;
      code { background: rgba(74,107,92,0.2); color: #7d9471; }
      a { color: #7d9471; }
    }
  }
}
</style>
