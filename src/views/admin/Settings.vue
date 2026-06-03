<script setup lang="ts">
import { ref } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const fileInput = ref<HTMLInputElement | null>(null)
const tip = ref('')

function showTip(msg: string) {
  tip.value = msg
  setTimeout(() => (tip.value = ''), 2500)
}

// 选择本地图片 → 转 DataURL 存入 themeStore（持久化到 localStorage）
function onFile(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (!f) return
  if (!f.type.startsWith('image/')) { showTip('请选择图片文件'); return }
  if (f.size > 3 * 1024 * 1024) { showTip('图片建议小于 3MB'); return }
  const reader = new FileReader()
  reader.onload = ev => {
    themeStore.setHeroBg(ev.target?.result as string)
    showTip('背景已更新 ✓')
  }
  reader.readAsDataURL(f)
}

function resetBg() {
  themeStore.resetHeroBg()
  showTip('已恢复默认山水背景 ✓')
}

function trigger() {
  fileInput.value?.click()
}
</script>

<template>
  <div class="settings">
    <div class="page-head">
      <span class="vbar"></span>
      <h2 class="page-title">站点设置</h2>
    </div>

    <!-- 首页 Hero 背景 -->
    <section class="setting-card">
      <div class="card-head">
        <h3>首页背景</h3>
        <p class="desc">更换首页 Hero 区域的背景。留空则使用默认的水墨山水插画。</p>
      </div>

      <!-- 预览 -->
      <div class="preview">
        <div
          v-if="themeStore.heroBg"
          class="preview-img"
          :style="{ backgroundImage: `url(${themeStore.heroBg})` }"
        >
          <span class="badge">自定义图片</span>
        </div>
        <div v-else class="preview-svg">
          <svg viewBox="0 0 1200 520" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#dce4dd"/><stop offset="55%" stop-color="#e8e4d8"/><stop offset="100%" stop-color="#f0ece0"/>
              </linearGradient>
              <linearGradient id="ma" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#8fa593"/><stop offset="100%" stop-color="#a9b8a6"/></linearGradient>
              <linearGradient id="mb" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#5e7867"/><stop offset="100%" stop-color="#728a76"/></linearGradient>
              <linearGradient id="mc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3c5547"/><stop offset="100%" stop-color="#4a6354"/></linearGradient>
            </defs>
            <rect width="1200" height="520" fill="url(#sky2)"/>
            <circle cx="930" cy="130" r="58" fill="#f7f3e8" opacity="0.9"/>
            <path d="M0 320 Q200 240 420 300 Q650 360 880 290 Q1050 250 1200 300 L1200 520 L0 520Z" fill="url(#ma)" opacity="0.7"/>
            <path d="M0 380 Q250 310 480 360 Q720 410 950 350 Q1100 320 1200 360 L1200 520 L0 520Z" fill="url(#mb)" opacity="0.85"/>
            <path d="M0 450 Q300 400 560 440 Q820 480 1050 430 Q1130 415 1200 435 L1200 520 L0 520Z" fill="url(#mc)"/>
          </svg>
          <span class="badge">默认山水</span>
        </div>
      </div>

      <!-- 操作 -->
      <div class="actions">
        <button class="btn primary" @click="trigger">上传图片</button>
        <button class="btn" :disabled="!themeStore.heroBg" @click="resetBg">恢复默认</button>
        <input ref="fileInput" type="file" accept="image/*" hidden @change="onFile" />
        <span v-if="tip" class="tip">{{ tip }}</span>
      </div>
      <p class="hint">建议尺寸 1600×600 左右的横图，文件小于 3MB。图片保存在本地浏览器（localStorage），刷新不丢失。</p>
    </section>

    <!-- 外观（接现有暗色模式开关） -->
    <section class="setting-card">
      <div class="card-head">
        <h3>外观</h3>
        <p class="desc">切换站点的明暗主题。</p>
      </div>
      <div class="row">
        <span class="row-label">暗色模式</span>
        <label class="switch">
          <input type="checkbox" :checked="themeStore.isDark" @change="themeStore.toggleDark()" />
          <span class="slider"></span>
        </label>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.settings {
  padding: 24px;
  max-width: 780px;

  .page-head {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
    .vbar { width: 4px; height: 22px; background: $dai; border-radius: 2px; }
    .page-title { margin: 0; font-family: $serif; font-size: 20px; color: $ink; }
  }

  .setting-card {
    background: $card;
    border: 1px solid $line;
    border-radius: $radius-card;
    padding: 24px;
    margin-bottom: 20px;

    .card-head {
      margin-bottom: 18px;
      h3 { margin: 0 0 6px; font-family: $serif; font-size: 16px; color: $ink; }
      .desc { margin: 0; font-size: 13px; color: $ink-faint; line-height: 1.6; }
    }
  }

  .preview {
    border-radius: $radius-card;
    overflow: hidden;
    border: 1px solid $line;
    margin-bottom: 16px;
    .preview-img, .preview-svg {
      position: relative;
      width: 100%;
      height: 200px;
      background-size: cover;
      background-position: center;
      svg { width: 100%; height: 100%; display: block; object-fit: cover; }
    }
    .badge {
      position: absolute;
      left: 12px;
      bottom: 12px;
      background: rgba(43,41,37,0.6);
      backdrop-filter: blur(6px);
      color: #f7f4ec;
      font-size: 12px;
      padding: 4px 12px;
      border-radius: $radius;
      letter-spacing: 1px;
    }
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 12px;
    .tip { font-size: 13px; color: $dai; }
  }
  .hint {
    margin: 14px 0 0;
    font-size: 12px;
    color: $ink-faint;
    line-height: 1.6;
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .row-label { font-size: 14px; color: $ink-soft; }
  }

  .btn {
    padding: 8px 18px;
    border: 1px solid $line;
    background: $card;
    border-radius: $radius;
    cursor: pointer;
    font-size: 14px;
    color: $ink;
    transition: all 0.2s;
    &:hover:not(:disabled) { border-color: $dai; color: $dai; }
    &:disabled { opacity: 0.45; cursor: not-allowed; }
    &.primary {
      background: $dai;
      border-color: $dai;
      color: #f7f4ec;
      &:hover { background: $dai-deep; border-color: $dai-deep; color: #f7f4ec; }
    }
  }

  /* 开关 */
  .switch {
    position: relative;
    display: inline-block;
    width: 46px;
    height: 24px;
    input { opacity: 0; width: 0; height: 0; }
    .slider {
      position: absolute;
      cursor: pointer;
      inset: 0;
      background: $line;
      border-radius: 24px;
      transition: 0.3s;
      &::before {
        content: '';
        position: absolute;
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background: $card;
        border-radius: 50%;
        transition: 0.3s;
      }
    }
    input:checked + .slider { background: $dai; }
    input:checked + .slider::before { transform: translateX(22px); }
  }
}

/* 暗色模式 */
html.dark {
  .settings {
    .page-head .page-title { color: #d4cfc4; }
    .setting-card {
      background: #242220;
      border-color: #3a3630;
      .card-head { h3 { color: #d4cfc4; } .desc { color: #6a6458; } }
    }
    .preview { border-color: #3a3630; }
    .hint { color: #6a6458; }
    .row .row-label { color: #b0a898; }
    .btn {
      background: #2a2724;
      border-color: #3a3630;
      color: #d4cfc4;
      &:hover:not(:disabled) { border-color: #4a6b5c; color: #7d9471; }
      &.primary { background: #3a5c4c; border-color: #3a5c4c; &:hover { background: #2e4a3c; } }
    }
    .actions .tip { color: #7d9471; }
    .switch .slider { background: #3a3630; &::before { background: #d4cfc4; } }
    .switch input:checked + .slider { background: #4a6b5c; }
  }
}
</style>
