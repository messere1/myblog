<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
</script>

<template>
  <div class="settings">
    <header class="page-head">
      <span class="vbar" aria-hidden="true"></span>
      <div>
        <h2>站点设置</h2>
        <p>管理后台显示偏好，并查看 Portfolio v2 的内容来源。</p>
      </div>
    </header>

    <section class="setting-card">
      <div>
        <h3>后台深色模式</h3>
        <p>同时同步评论区的显示主题。</p>
      </div>
      <label class="switch" aria-label="切换深色模式">
        <input type="checkbox" :checked="themeStore.isDark" @change="themeStore.toggleDark()" />
        <span class="slider"></span>
      </label>
    </section>

    <section class="setting-card content-source">
      <div>
        <h3>内容来源</h3>
        <p>文章与分类来自 Supabase，项目与 GitHub 指标来自 GitHub API，并带有构建快照作为访问降级。</p>
      </div>
      <ul>
        <li><strong>文章管理：</strong>使用左侧“文章”与“分类”菜单。</li>
        <li><strong>个人资料：</strong>集中维护在 <code>src/data/portfolio.ts</code>。</li>
        <li><strong>项目数据：</strong>自动读取 messere1 的公开 GitHub 仓库。</li>
      </ul>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.settings { max-width: 780px; padding: 24px; }
.page-head { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 24px; }
.page-head h2 { margin: 0; color: $ink; font: 600 20px/1.4 $serif; }
.page-head p, .setting-card p { margin: 4px 0 0; color: $ink-faint; font-size: 13px; line-height: 1.7; }
.vbar { width: 4px; height: 24px; margin-top: 2px; border-radius: 2px; background: $dai; }
.setting-card { display: flex; justify-content: space-between; gap: 24px; margin-bottom: 20px; padding: 24px; border: 1px solid $line; border-radius: $radius-card; background: $card; }
.setting-card h3 { margin: 0; color: $ink; font: 600 16px/1.5 $serif; }
.content-source { display: block; }
.content-source ul { margin: 18px 0 0; padding-left: 20px; color: $ink-soft; font-size: 13px; line-height: 2; }
.content-source code { padding: 2px 6px; border-radius: 4px; background: $bg-soft; font-family: 'JetBrains Mono', 'SFMono-Regular', Consolas, monospace; }
.switch { position: relative; display: inline-block; flex: 0 0 auto; width: 46px; height: 24px; }
.switch input { width: 0; height: 0; opacity: 0; }
.slider { position: absolute; inset: 0; cursor: pointer; border-radius: 24px; background: $line; transition: .25s; }
.slider::before { position: absolute; bottom: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: $card; content: ''; transition: .25s; }
input:checked + .slider { background: $dai; }
input:checked + .slider::before { transform: translateX(22px); }

html.dark .settings {
  .page-head h2, .setting-card h3 { color: #d4cfc4; }
  .page-head p, .setting-card p { color: #8e887d; }
  .setting-card { border-color: #3a3630; background: #242220; }
  .content-source ul { color: #b0a898; }
  .content-source code { background: #1a1916; }
  .slider { background: #3a3630; }
  .slider::before { background: #d4cfc4; }
}

@media (max-width: 640px) {
  .settings { padding: 18px; }
  .setting-card { padding: 18px; }
}
</style>
