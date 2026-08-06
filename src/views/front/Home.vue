<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePostStore } from '@/stores/post'
import { useCategoryStore } from '@/stores/category'
import { useThemeStore } from '@/stores/theme'
import PostCard from '@/components/post/PostCard.vue'
import SkeletonCard from '@/components/post/SkeletonCard.vue'
import avatarUrl from '@/assets/hero.png'

const router = useRouter()
const postStore = usePostStore()
const catStore = useCategoryStore()
const themeStore = useThemeStore()

const pageSize = 6
const visibleCount = ref(pageSize)

const visiblePosts = computed(() =>
  postStore.filtered.slice(0, visibleCount.value)
)

function loadMore() {
  if (visibleCount.value < postStore.filtered.length) {
    visibleCount.value += pageSize
  }
}

onMounted(async () => {
  const results = await Promise.allSettled([postStore.fetchAll(), catStore.fetchAll()])
  if (results.some(result => result.status === 'rejected')) {
    console.warn('[home] Some content could not be loaded')
  }
})

function retry() {
  Promise.allSettled([postStore.fetchAll(true), catStore.fetchAll(true)])
}

function selectCategory(id: number | null) {
  postStore.currentCategoryId = id
  visibleCount.value = pageSize
}
</script>

<template>
  <div class="home">
    <!-- Hero 区域：和风山水场景（支持更换为图片背景） -->
    <header class="hero">
      <!-- 图片背景层：themeStore.heroBg 有值时显示 -->
      <div
        v-if="themeStore.heroBg"
        class="hero-img"
        :style="{ backgroundImage: `url(${themeStore.heroBg})` }"
      />
      <!-- 默认山水 SVG：仅在没有设置图片背景时显示 -->
      <div v-else class="hero-bg">
        <svg viewBox="0 0 1200 520" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#dce4dd"/>
              <stop offset="55%" stop-color="#e8e4d8"/>
              <stop offset="100%" stop-color="#f0ece0"/>
            </linearGradient>
            <linearGradient id="m1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#8fa593"/><stop offset="100%" stop-color="#a9b8a6"/>
            </linearGradient>
            <linearGradient id="m2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#5e7867"/><stop offset="100%" stop-color="#728a76"/>
            </linearGradient>
            <linearGradient id="m3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#3c5547"/><stop offset="100%" stop-color="#4a6354"/>
            </linearGradient>
          </defs>
          <rect width="1200" height="520" fill="url(#sky)"/>
          <circle cx="930" cy="130" r="58" fill="#f7f3e8" opacity="0.9"/>
          <circle cx="930" cy="130" r="58" fill="none" stroke="#e4dcc8" stroke-width="1"/>
          <g fill="#f4efe4" opacity="0.6">
            <ellipse cx="300" cy="110" rx="160" ry="14"/>
            <ellipse cx="500" cy="150" rx="120" ry="10"/>
            <ellipse cx="800" cy="90" rx="100" ry="9"/>
          </g>
          <path d="M0 320 Q200 240 420 300 Q650 360 880 290 Q1050 250 1200 300 L1200 520 L0 520Z" fill="url(#m1)" opacity="0.7"/>
          <path d="M0 380 Q250 310 480 360 Q720 410 950 350 Q1100 320 1200 360 L1200 520 L0 520Z" fill="url(#m2)" opacity="0.85"/>
          <path d="M0 450 Q300 400 560 440 Q820 480 1050 430 Q1130 415 1200 435 L1200 520 L0 520Z" fill="url(#m3)"/>
          <g stroke="#3c5547" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.7">
            <path d="M620 100 Q628 94 636 100 Q644 94 652 100"/>
            <path d="M680 120 Q686 115 692 120 Q698 115 704 120"/>
            <path d="M590 135 Q595 131 600 135 Q605 131 610 135"/>
          </g>
          <g stroke="#3c5547" stroke-width="3" fill="none" opacity="0.5" stroke-linecap="round">
            <line x1="1140" y1="180" x2="1145" y2="450"/>
            <line x1="1175" y1="220" x2="1178" y2="450"/>
            <path d="M1145 240 Q1175 235 1200 250" stroke-width="2"/>
            <path d="M1145 300 Q1110 295 1085 310" stroke-width="2"/>
            <path d="M1178 280 Q1150 276 1130 290" stroke-width="2"/>
          </g>
        </svg>
      </div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="greeting">ようこそ · WELCOME</div>
        <h1>记录代码与<br>热爱的山水之间</h1>
        <p>这里是墨笺。写一点前端、聊一些番剧、记录生活里值得留存的片刻。愿浮躁之外，尚有一隅清净。</p>
        <div class="hero-cta">
          <button class="btn-primary" @click="router.push('#latest')">开始阅读</button>
          <router-link to="/about" class="btn-ghost">关于我</router-link>
        </div>
      </div>
    </header>

    <!-- 最新文章 -->
    <section class="section" id="latest">
      <div class="section-head">
        <div class="title">
          <span class="vbar"></span>
          <div>
            <h2>最新文章</h2>
            <div class="jp">LATEST POSTS</div>
          </div>
        </div>
        <router-link to="/search" class="more">查看全部 →</router-link>
      </div>

      <div class="with-side">
        <!-- 文章列表 -->
        <div class="post-list-area">
          <div v-if="postStore.loading" class="post-list">
            <SkeletonCard v-for="i in 3" :key="i" />
          </div>
          <div v-else-if="postStore.error" class="empty error-state">
            <div class="err-text">😢 内容加载失败，可能服务暂时不可用</div>
            <button class="retry-btn" @click="retry">重试</button>
          </div>
          <div v-else-if="visiblePosts.length === 0" class="empty">
            还没有发布文章
          </div>
          <div v-else class="post-list">
            <PostCard
              v-for="post in visiblePosts"
              :key="post.id"
              :post="post"
            />
          </div>
          <div v-if="visibleCount < postStore.filtered.length" class="load-more" @click="loadMore">
            加载更多...
          </div>
        </div>

        <!-- 侧栏 -->
        <aside>
          <!-- 个人卡片 -->
          <div class="side-card profile-mini">
            <div class="pm-avatar">
              <img :src="avatarUrl" alt="头像" />
            </div>
            <div class="pm-name">墨笺 · Mo</div>
            <div class="pm-bio">前端学习者 · ACG 爱好者<br>于代码与山水间，记录所思</div>
            <div class="pm-stats">
              <div class="pm-stat"><span class="n">{{ postStore.posts.length }}</span><span class="l">文章</span></div>
              <div class="pm-stat"><span class="n">128</span><span class="l">标签</span></div>
              <div class="pm-stat"><span class="n">1.2k</span><span class="l">访问</span></div>
            </div>
          </div>

          <!-- 分类 -->
          <div class="side-card">
            <h4>分类</h4>
            <ul class="cat-list">
              <li
                :class="{ active: !postStore.currentCategoryId }"
                @click="selectCategory(null)"
              >
                全部 <span class="num">{{ postStore.posts.length }}</span>
              </li>
              <li
                v-for="c in catStore.categories"
                :key="c.id"
                :class="{ active: postStore.currentCategoryId === c.id }"
                @click="selectCategory(c.id)"
              >
                {{ c.name }} <span class="num">{{ postStore.posts.filter(p => p.categoryId === c.id).length }}</span>
              </li>
            </ul>
          </div>

          <!-- 标签云 -->
          <div class="side-card">
            <h4>标签</h4>
            <div class="tag-cloud">
              <span
                v-for="tag in [...new Set(postStore.posts.flatMap(p => p.tags || []))]"
                :key="tag"
                @click="postStore.keyword = tag; router.push('/search')"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

/* ===== Hero ===== */
.hero {
  position: relative;
  height: 520px;
  overflow: hidden;
  border-bottom: 1px solid $line;
}
.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 1;
  svg { width: 100%; height: 100%; object-fit: cover; }
}
.hero-img {
  position: absolute;
  inset: 0;
  z-index: 1;
  background-size: cover;
  background-position: center;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: linear-gradient(to right, rgba(43,41,37,0.55) 0%, rgba(43,41,37,0.25) 50%, transparent 100%);
}
.hero-content {
  position: relative;
  z-index: 3;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 36px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .greeting {
    font-size: 14px;
    color: #d8e0d4;
    letter-spacing: 6px;
    margin-bottom: 20px;
    font-weight: 300;
  }
  h1 {
    font-family: $serif;
    font-size: 46px;
    font-weight: 600;
    line-height: 1.45;
    color: #f7f4ec;
    margin-bottom: 22px;
    letter-spacing: 3px;
    text-shadow: 0 2px 20px rgba(0,0,0,0.2);
  }
  p {
    font-size: 16px;
    color: #e0ddd2;
    max-width: 420px;
    margin-bottom: 34px;
    line-height: 2;
    font-weight: 300;
  }
}
.hero-cta { display: flex; gap: 18px; align-items: center; }
.btn-primary {
  padding: 13px 32px;
  border-radius: $radius;
  font-size: 15px;
  font-weight: 500;
  background: $dai;
  color: #f7f4ec;
  border: none;
  cursor: pointer;
  letter-spacing: 1px;
  transition: all .3s;
  &:hover { background: $dai-deep; transform: translateY(-2px); }
}
.btn-ghost {
  padding: 12px 28px;
  border-radius: $radius;
  font-size: 15px;
  letter-spacing: 1px;
  color: #f7f4ec;
  border: 1px solid rgba(247,244,236,0.5);
  transition: all .25s;
  &:hover { border-color: #f7f4ec; background: rgba(247,244,236,0.1); }
}

/* ===== Section ===== */
.section {
  max-width: 1100px;
  margin: 0 auto;
  padding: 56px 36px;
}
.section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 40px;
  .title { display: flex; align-items: center; gap: 16px; }
  h2 {
    font-family: $serif;
    font-size: 27px;
    font-weight: 600;
    letter-spacing: 3px;
  }
  .jp { font-size: 12px; color: $ink-faint; letter-spacing: 3px; margin-top: 2px; }
  .more {
    font-size: 14px;
    color: $ink-soft;
    transition: color .25s;
    letter-spacing: 1px;
    &:hover { color: $dai; }
  }
}
.vbar { width: 3px; height: 38px; background: $dai; }

/* ===== 主体两栏 ===== */
.with-side {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 44px;
}

.post-list-area {
  .loading, .empty {
    text-align: center;
    padding: 60px;
    color: $ink-faint;
  }
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    .err-text { color: $ink-soft; font-size: 15px; }
    .retry-btn {
      padding: 8px 28px;
      border: 1px solid $dai;
      border-radius: $radius;
      background: transparent;
      color: $dai;
      cursor: pointer;
      font-size: 14px;
      transition: all .25s;
      &:hover { background: $dai; color: #fff; }
    }
  }
  .load-more {
    text-align: center;
    padding: 20px;
    color: $ink-soft;
    font-size: 14px;
    cursor: pointer;
    transition: color .25s;
    &:hover { color: $dai; }
  }
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ===== 侧栏 ===== */
.side-card {
  background: $card;
  border: 1px solid $line;
  border-radius: $radius-card;
  padding: 26px;
  margin-bottom: 24px;
  h4 {
    font-family: $serif;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 20px;
    letter-spacing: 2px;
    display: flex;
    align-items: center;
    gap: 10px;
    &::before { content: ''; width: 4px; height: 16px; background: $dai; }
  }
}

/* 个人卡片 */
.profile-mini { text-align: center; }
.pm-avatar {
  width: 78px;
  height: 78px;
  border-radius: 50%;
  margin: 0 auto 16px;
  overflow: hidden;
  border: 2px solid $dai-soft;
  svg { width: 100%; height: 100%; }
  img { width: 100%; height: 100%; object-fit: cover; display: block; }
}
.pm-name {
  font-family: $serif;
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 6px;
  letter-spacing: 1px;
}
.pm-bio {
  font-size: 13px;
  color: $ink-soft;
  margin-bottom: 18px;
  line-height: 1.8;
  font-weight: 300;
}
.pm-stats {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid $line;
  padding-top: 18px;
}
.pm-stat { display: flex; flex-direction: column; gap: 2px; }
.pm-stat .n { font-family: $serif; font-size: 19px; font-weight: 600; color: $dai; }
.pm-stat .l { font-size: 12px; color: $ink-faint; }

/* 分类列表 */
.cat-list { list-style: none; }
.cat-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 11px 0;
  font-size: 14px;
  color: $ink-soft;
  border-bottom: 1px solid $line;
  cursor: pointer;
  transition: color .25s, padding-left .25s;
  &:last-child { border-bottom: none; }
  &:hover, &.active { color: $dai; padding-left: 8px; }
}
.cat-list .num { font-size: 12px; color: $ink-faint; }

/* 标签云 */
.tag-cloud { display: flex; flex-wrap: wrap; gap: 10px; }
.tag-cloud span {
  font-size: 13px;
  padding: 5px 14px;
  border-radius: $radius;
  background: $bg-soft;
  color: $ink-soft;
  cursor: pointer;
  transition: all .25s;
  letter-spacing: .5px;
  &:hover { background: $dai-soft; color: $dai-deep; }
}

/* ===== 响应式 ===== */
@include mobile {
  .hero { height: 440px; }
  .hero-content {
    padding: 0 24px;
    h1 { font-size: 30px; letter-spacing: 2px; }
    p { font-size: 14px; margin-bottom: 24px; }
    .greeting { letter-spacing: 3px; }
  }
  .section { padding: 40px 20px; }
  .section-head { margin-bottom: 28px; h2 { font-size: 22px; } }
  .with-side { grid-template-columns: 1fr; gap: 32px; }
  aside { order: -1; }
  .profile-mini { display: none; }
}

/* ===== 暗色模式 ===== */
html.dark {
  .hero { border-bottom-color: #3a3630; }
  .hero-bg svg rect:first-child { fill: #2a2d2b; }

  .btn-primary { background: #3a5c4c; &:hover { background: #2e4a3c; } }
  .btn-ghost { border-color: rgba(#d4cfc4, 0.3); &:hover { border-color: #d4cfc4; background: rgba(#d4cfc4, 0.08); } }

  .section {
    .section-head {
      h2 { color: #d4cfc4; }
      .jp { color: #6a6458; }
      .more { color: #9a9488; &:hover { color: #7d9471; } }
    }
  }

  .side-card {
    background: #242220;
    border-color: #3a3630;
    h4::before { background: #4a6b5c; }
  }

  .pm-name { color: #d4cfc4; }
  .pm-bio { color: #9a9488; }
  .pm-stats { border-top-color: #3a3630; }
  .pm-stat .n { color: #7d9471; }
  .pm-stat .l { color: #6a6458; }

  .cat-list li {
    border-bottom-color: #3a3630;
    color: #9a9488;
    &:hover, &.active { color: #7d9471; }
  }
  .cat-list .num { color: #6a6458; }

  .tag-cloud span {
    background: #2a2724;
    color: #9a9488;
    &:hover { background: rgba(#4a6b5c, 0.25); color: #7d9471; }
  }

  .post-list-area {
    .loading, .empty { color: #6a6458; }
    .load-more { color: #9a9488; &:hover { color: #7d9471; } }
  }
}
</style>
