<script setup lang="ts">
/** 骨架卡片 —— 加载态占位，微光动画 */
</script>

<template>
  <div class="skeleton-card">
    <div class="sk-cover shimmer"></div>
    <div class="sk-body">
      <div class="sk-meta shimmer"></div>
      <div class="sk-title shimmer"></div>
      <div class="sk-text shimmer"></div>
      <div class="sk-text short shimmer"></div>
      <div class="sk-tags">
        <div class="sk-tag shimmer"></div>
        <div class="sk-tag shimmer"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.skeleton-card {
  background: $card;
  border: 1px solid $line;
  border-radius: $radius-card;
  overflow: hidden;
  display: grid;
  grid-template-columns: 200px 1fr;
}

.sk-cover {
  min-height: 150px;
  background: $bg-soft;
}

.sk-body {
  padding: 22px 26px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sk-meta {
  height: 12px;
  width: 120px;
  background: $bg-soft;
  border-radius: 3px;
}

.sk-title {
  height: 22px;
  width: 70%;
  background: $bg-soft;
  border-radius: 3px;
}

.sk-text {
  height: 14px;
  width: 100%;
  background: $bg-soft;
  border-radius: 3px;

  &.short { width: 60%; }
}

.sk-tags {
  display: flex;
  gap: 10px;
  margin-top: 6px;
}

.sk-tag {
  height: 18px;
  width: 48px;
  background: $bg-soft;
  border-radius: 3px;
}

/* 微光动画 */
.shimmer {
  position: relative;
  overflow: hidden;
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.4) 50%,
      transparent 100%
    );
    animation: shimmer 1.8s infinite;
  }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@include mobile {
  .skeleton-card {
    grid-template-columns: 1fr;
  }
  .sk-cover { min-height: 160px; }
}

/* 暗色模式 */
html.dark {
  .skeleton-card {
    background: #242220;
    border-color: #3a3630;
  }
  .sk-cover,
  .sk-meta,
  .sk-title,
  .sk-text,
  .sk-tag {
    background: #2a2724;
  }
  .shimmer::after {
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.06) 50%,
      transparent 100%
    );
  }
}
</style>
