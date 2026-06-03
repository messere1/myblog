<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import avatarUrl from '@/assets/hero.png'

useTitle('关于 | 墨笺')

// ── 技能栈（占位，自行替换）──
const skills = [
  { group: '前端', items: ['Vue 3', 'TypeScript', 'Vite', 'Pinia', 'SCSS'] },
  { group: '工具', items: ['Git', 'VS Code', 'Figma', 'Vercel'] },
  { group: '在学', items: ['Node.js', 'Three.js', 'Rust'] },
]

// ── 时间线（占位，自行替换）──
const timeline = [
  { year: '2026', title: '搭建个人博客「墨笺」', desc: '用 Vue 3 + Vite 从零做了这个小站，记录代码与生活。' },
  { year: '2025', title: '开始系统学习前端', desc: '深入 Vue 生态，做了几个练手项目。' },
  { year: '2024', title: '入学 · 接触编程', desc: '第一次写下 Hello World，从此入坑。' },
]

// ── 社交链接（占位，把 href 换成你的真实地址）──
const socials = [
  { label: 'GitHub', icon: '⌥', href: 'https://github.com/messere1', text: '@messere1' },
  { label: 'Email', icon: '✉', href: 'mailto:you@example.com', text: 'you@example.com' },
  { label: 'Bilibili', icon: '▶', href: '#', text: '我的主页' },
  { label: 'RSS', icon: '✦', href: '#', text: '订阅本站' },
]
</script>

<template>
  <div class="about">
    <!-- 头部介绍 -->
    <section class="intro">
      <div class="intro-avatar">
        <img :src="avatarUrl" alt="头像" />
      </div>
      <div class="intro-text">
        <div class="hello">关于我 · ABOUT</div>
        <h1>你好，我是墨笺</h1>
        <p>
          一名热爱前端的学习者，也是个 ACG 爱好者。喜欢把想法写成代码，
          也喜欢把生活里的片刻记录下来。这个小站是我安放思考与热爱的地方，
          愿浮躁之外，尚有一隅清净。
        </p>
        <div class="quote">「 于代码与山水之间，记录所思所感。 」</div>
      </div>
    </section>

    <!-- 技能 -->
    <section class="block">
      <div class="block-head"><span class="vbar"></span><h2>技能栈</h2><span class="jp">SKILLS</span></div>
      <div class="skills">
        <div v-for="s in skills" :key="s.group" class="skill-row">
          <div class="skill-group">{{ s.group }}</div>
          <div class="skill-tags">
            <span v-for="it in s.items" :key="it" class="skill-tag">{{ it }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 时间线 -->
    <section class="block">
      <div class="block-head"><span class="vbar"></span><h2>历程</h2><span class="jp">TIMELINE</span></div>
      <div class="timeline">
        <div v-for="(t, i) in timeline" :key="i" class="tl-item">
          <div class="tl-dot"></div>
          <div class="tl-year">{{ t.year }}</div>
          <div class="tl-body">
            <h3>{{ t.title }}</h3>
            <p>{{ t.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 社交 -->
    <section class="block">
      <div class="block-head"><span class="vbar"></span><h2>联系我</h2><span class="jp">CONTACT</span></div>
      <div class="socials">
        <a
          v-for="s in socials"
          :key="s.label"
          :href="s.href"
          target="_blank"
          rel="noopener"
          class="social-card"
        >
          <span class="s-icon">{{ s.icon }}</span>
          <div class="s-text">
            <div class="s-label">{{ s.label }}</div>
            <div class="s-sub">{{ s.text }}</div>
          </div>
        </a>
      </div>
    </section>

    <!-- 关于本站 -->
    <section class="block">
      <div class="block-head"><span class="vbar"></span><h2>关于本站</h2><span class="jp">ABOUT SITE</span></div>
      <div class="site-card">
        <p>
          本站名为「墨笺」，基于 <b>Vue 3 + Vite + TypeScript</b> 构建，
          状态管理使用 Pinia，路由使用 Vue Router，文章以 Markdown 编写。
          整体采用水墨黛绿的和风配色，支持明暗主题切换。
        </p>
        <p>
          站点托管于 GitHub，通过 Vercel 自动部署。源码开放，欢迎交流指正。
          如果这里的某篇文章帮到了你，那便是它存在的意义。
        </p>
        <div class="site-meta">
          <span>Built with Vue 3</span>
          <span>·</span>
          <span>© 2026 墨笺</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.about {
  max-width: 820px;
  margin: 0 auto;
  padding: 48px 32px 80px;
}

/* 头部介绍 */
.intro {
  display: flex;
  gap: 36px;
  align-items: center;
  padding-bottom: 44px;
  margin-bottom: 12px;
  border-bottom: 1px solid $line;

  .intro-avatar {
    flex-shrink: 0;
    width: 130px;
    height: 130px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid $dai-soft;
    img { width: 100%; height: 100%; object-fit: cover; display: block; }
  }
  .intro-text {
    .hello {
      font-size: 13px;
      color: $dai;
      letter-spacing: 3px;
      margin-bottom: 12px;
    }
    h1 {
      font-family: $serif;
      font-size: 30px;
      font-weight: 600;
      letter-spacing: 1px;
      margin: 0 0 16px;
      color: $ink;
    }
    p {
      font-size: 15px;
      color: $ink-soft;
      line-height: 2;
      margin: 0 0 16px;
    }
    .quote {
      font-family: $serif;
      font-size: 15px;
      color: $dai-deep;
      letter-spacing: 1px;
    }
  }
}

/* 区块通用 */
.block {
  margin-top: 48px;
  .block-head {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 24px;
    .vbar { width: 3px; height: 24px; background: $dai; }
    h2 {
      font-family: $serif;
      font-size: 22px;
      font-weight: 600;
      letter-spacing: 2px;
      margin: 0;
      color: $ink;
    }
    .jp { font-size: 12px; color: $ink-faint; letter-spacing: 2px; }
  }
}

/* 技能 */
.skills {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.skill-row {
  display: flex;
  align-items: center;
  gap: 20px;
  .skill-group {
    flex-shrink: 0;
    width: 60px;
    font-family: $serif;
    font-size: 15px;
    color: $dai;
    font-weight: 500;
  }
  .skill-tags { display: flex; flex-wrap: wrap; gap: 10px; }
  .skill-tag {
    font-size: 13px;
    padding: 6px 16px;
    background: $card;
    border: 1px solid $line;
    border-radius: $radius;
    color: $ink-soft;
    transition: all .25s;
    cursor: default;
    &:hover { border-color: $dai; color: $dai; transform: translateY(-2px); }
  }
}

/* 时间线 */
.timeline {
  position: relative;
  padding-left: 20px;
  &::before {
    content: '';
    position: absolute;
    left: 4px;
    top: 6px;
    bottom: 6px;
    width: 2px;
    background: $line;
  }
}
.tl-item {
  position: relative;
  padding: 0 0 28px 28px;
  &:last-child { padding-bottom: 0; }
  .tl-dot {
    position: absolute;
    left: -20px;
    top: 4px;
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: $dai;
    border: 2px solid $bg;
  }
  .tl-year {
    font-family: $serif;
    font-size: 14px;
    color: $dai;
    font-weight: 600;
    margin-bottom: 6px;
  }
  .tl-body {
    h3 { font-size: 16px; font-weight: 500; margin: 0 0 6px; color: $ink; }
    p { font-size: 14px; color: $ink-soft; line-height: 1.8; margin: 0; }
  }
}

/* 社交 */
.socials {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}
.social-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  background: $card;
  border: 1px solid $line;
  border-radius: $radius-card;
  transition: all .25s;
  &:hover { border-color: $dai; transform: translateY(-2px); box-shadow: 0 4px 16px rgba(74,107,92,0.08); }
  .s-icon {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    border-radius: 50%;
    background: $dai-soft;
    color: $dai;
    display: grid;
    place-items: center;
    font-size: 18px;
  }
  .s-label { font-size: 14px; font-weight: 500; color: $ink; }
  .s-sub { font-size: 12px; color: $ink-faint; margin-top: 2px; }
}

/* 关于本站 */
.site-card {
  background: $card;
  border: 1px solid $line;
  border-radius: $radius-card;
  padding: 28px;
  p {
    font-size: 15px;
    color: $ink-soft;
    line-height: 2;
    margin: 0 0 14px;
    b { color: $dai-deep; font-weight: 600; }
  }
  .site-meta {
    display: flex;
    gap: 10px;
    margin-top: 18px;
    padding-top: 16px;
    border-top: 1px solid $line;
    font-size: 12px;
    color: $ink-faint;
    letter-spacing: 1px;
  }
}

/* 响应式 */
@include mobile {
  .about { padding: 32px 20px 60px; }
  .intro {
    flex-direction: column;
    text-align: center;
    gap: 20px;
    .intro-text h1 { font-size: 24px; }
  }
  .skill-row { flex-direction: column; align-items: flex-start; gap: 10px; }
  .socials { grid-template-columns: 1fr; }
}

/* 暗色模式 */
html.dark {
  .about {
    .intro {
      border-bottom-color: #3a3630;
      .intro-text {
        h1 { color: #d4cfc4; }
        p { color: #b0a898; }
        .hello { color: #7d9471; }
        .quote { color: #9ab592; }
      }
    }
    .block .block-head { h2 { color: #d4cfc4; } .jp { color: #6a6458; } }
    .skill-tag {
      background: #242220;
      border-color: #3a3630;
      color: #b0a898;
      &:hover { border-color: #4a6b5c; color: #7d9471; }
    }
    .skill-group { color: #7d9471; }
    .timeline::before { background: #3a3630; }
    .tl-dot { background: #4a6b5c; border-color: #1a1916; }
    .tl-year { color: #7d9471; }
    .tl-body { h3 { color: #d4cfc4; } p { color: #b0a898; } }
    .social-card {
      background: #242220;
      border-color: #3a3630;
      &:hover { border-color: #4a6b5c; }
      .s-icon { background: rgba(74,107,92,0.2); color: #7d9471; }
      .s-label { color: #d4cfc4; }
      .s-sub { color: #6a6458; }
    }
    .site-card {
      background: #242220;
      border-color: #3a3630;
      p { color: #b0a898; b { color: #9ab592; } }
      .site-meta { border-top-color: #3a3630; color: #6a6458; }
    }
  }
}
</style>
