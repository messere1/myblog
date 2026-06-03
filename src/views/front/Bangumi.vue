<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTitle } from '@vueuse/core'

useTitle('追番 | 墨笺')

type Status = 'watching' | 'finished' | 'planned'

interface Anime {
  title: string
  cover: string      // 封面图 URL，留空则用占位渐变
  rating: number     // 0~5
  status: Status
  comment?: string
}

// ── 番剧数据（占位，自行替换 title/cover/rating/comment）──
const animeList = ref<Anime[]>([
  { title: '示例番剧 · 进击的某某', cover: '', rating: 5, status: 'finished', comment: '神作，二刷依然震撼。' },
  { title: '示例番剧 · 孤独摇滚', cover: '', rating: 5, status: 'finished', comment: '后摇 + 社恐，太懂了。' },
  { title: '示例番剧 · 间谍过家家', cover: '', rating: 4, status: 'watching', comment: '阿尼亚太可爱了。' },
  { title: '示例番剧 · 葬送的芙莉莲', cover: '', rating: 5, status: 'watching', comment: '节奏舒缓，回味悠长。' },
  { title: '示例番剧 · 药屋少女', cover: '', rating: 4, status: 'watching', comment: '推理 + 宫斗，上头。' },
  { title: '示例番剧 · 想看的新番 A', cover: '', rating: 0, status: 'planned' },
  { title: '示例番剧 · 想看的新番 B', cover: '', rating: 0, status: 'planned' },
  { title: '示例番剧 · 紫罗兰永恒花园', cover: '', rating: 5, status: 'finished', comment: '画面与情感都顶级。' },
])

const filter = ref<Status | 'all'>('all')

const tabs: { key: Status | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'watching', label: '在追' },
  { key: 'finished', label: '已看完' },
  { key: 'planned', label: '想看' },
]

const statusMeta: Record<Status, { label: string; cls: string }> = {
  watching: { label: '在追', cls: 'st-watching' },
  finished: { label: '看完', cls: 'st-finished' },
  planned: { label: '想看', cls: 'st-planned' },
}

const filtered = computed(() =>
  filter.value === 'all'
    ? animeList.value
    : animeList.value.filter(a => a.status === filter.value)
)

function countOf(s: Status) {
  return animeList.value.filter(a => a.status === s).length
}

// 占位封面渐变（按标题取色，保证同一番颜色稳定）
function placeholderStyle(title: string) {
  const palettes = [
    'linear-gradient(135deg,#4a6b5c,#344e42)',
    'linear-gradient(135deg,#5a6b78,#3a4750)',
    'linear-gradient(135deg,#7d9471,#566b4d)',
    'linear-gradient(135deg,#9a8468,#6e5b40)',
    'linear-gradient(135deg,#6b5a78,#473a50)',
  ]
  let h = 0
  for (const c of title) h = (h + c.charCodeAt(0)) % palettes.length
  return { background: palettes[h] }
}
</script>

<template>
  <div class="bangumi">
    <div class="page-head">
      <span class="vbar"></span>
      <div>
        <h1>追番列表</h1>
        <div class="jp">BANGUMI · 我看过的动画</div>
      </div>
    </div>

    <!-- 筛选 -->
    <div class="tabs">
      <button
        v-for="t in tabs"
        :key="t.key"
        :class="['tab', { active: filter === t.key }]"
        @click="filter = t.key"
      >
        {{ t.label }}
        <span v-if="t.key !== 'all'" class="cnt">{{ countOf(t.key as any) }}</span>
        <span v-else class="cnt">{{ animeList.length }}</span>
      </button>
    </div>

    <!-- 卡片墙 -->
    <div class="grid">
      <article v-for="(a, i) in filtered" :key="i" class="card">
        <div class="cover">
          <img v-if="a.cover" :src="a.cover" :alt="a.title" />
          <div v-else class="ph" :style="placeholderStyle(a.title)">
            <span>{{ a.title.replace(/^示例番剧 · /, '').slice(0, 6) }}</span>
          </div>
          <span class="status" :class="statusMeta[a.status].cls">
            {{ statusMeta[a.status].label }}
          </span>
        </div>
        <div class="body">
          <h3>{{ a.title }}</h3>
          <div class="rating" v-if="a.rating > 0">
            <span class="stars">
              <span v-for="n in 5" :key="n" :class="['star', { on: n <= a.rating }]">★</span>
            </span>
            <span class="score">{{ a.rating }}.0</span>
          </div>
          <div class="rating no" v-else>暂未评分</div>
          <p v-if="a.comment" class="comment">{{ a.comment }}</p>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.bangumi {
  max-width: 1080px;
  margin: 0 auto;
  padding: 48px 32px 80px;

  .page-head {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 32px;
    .vbar { width: 4px; height: 40px; background: $dai; }
    h1 { font-family: $serif; font-size: 28px; font-weight: 600; letter-spacing: 2px; margin: 0; color: $ink; }
    .jp { font-size: 13px; color: $ink-faint; letter-spacing: 2px; margin-top: 4px; }
  }

  .tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 32px;
    flex-wrap: wrap;
    .tab {
      padding: 8px 18px;
      border: 1px solid $line;
      background: $card;
      border-radius: $radius;
      cursor: pointer;
      font-size: 14px;
      color: $ink-soft;
      transition: all .25s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      .cnt { font-size: 12px; color: $ink-faint; }
      &:hover { border-color: $dai; color: $dai; }
      &.active {
        background: $dai;
        border-color: $dai;
        color: #f7f4ec;
        .cnt { color: rgba(247,244,236,0.7); }
      }
    }
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 22px;
  }

  .card {
    background: $card;
    border: 1px solid $line;
    border-radius: $radius-card;
    overflow: hidden;
    transition: transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s, border-color .35s;
    &:hover {
      transform: translateY(-6px);
      box-shadow: 0 14px 30px rgba(43,41,37,0.12);
      border-color: $dai;
    }

    .cover {
      position: relative;
      aspect-ratio: 3 / 4;
      overflow: hidden;
      img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .ph {
        width: 100%; height: 100%;
        display: grid; place-items: center;
        color: rgba(255,255,255,0.9);
        font-family: $serif;
        font-size: 18px;
        letter-spacing: 2px;
        padding: 12px;
        text-align: center;
      }
      .status {
        position: absolute;
        top: 10px; right: 10px;
        font-size: 11px;
        padding: 4px 10px;
        border-radius: $radius;
        color: #fff;
        letter-spacing: 1px;
        backdrop-filter: blur(4px);
        &.st-watching { background: rgba(74,107,92,0.85); }
        &.st-finished { background: rgba(125,148,113,0.85); }
        &.st-planned { background: rgba(176,133,82,0.85); }
      }
    }

    .body {
      padding: 14px 16px 18px;
      h3 {
        font-size: 15px;
        font-weight: 500;
        margin: 0 0 8px;
        color: $ink;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .rating {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        .stars { letter-spacing: 1px; }
        .star { color: $line; font-size: 14px; &.on { color: #d9a441; } }
        .score { font-size: 13px; color: $ink-faint; font-family: $serif; }
        &.no { font-size: 12px; color: $ink-faint; }
      }
      .comment {
        font-size: 13px;
        color: $ink-soft;
        line-height: 1.7;
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  }

  @include mobile {
    padding: 32px 20px 60px;
    .grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
  }
}

/* 暗色模式 */
html.dark {
  .bangumi {
    .page-head { h1 { color: #d4cfc4; } .jp { color: #6a6458; } }
    .tabs .tab {
      background: #242220;
      border-color: #3a3630;
      color: #b0a898;
      .cnt { color: #6a6458; }
      &:hover { border-color: #4a6b5c; color: #7d9471; }
      &.active { background: #3a5c4c; border-color: #3a5c4c; color: #f7f4ec; }
    }
    .card {
      background: #242220;
      border-color: #3a3630;
      &:hover { border-color: #4a6b5c; }
      .body {
        h3 { color: #d4cfc4; }
        .rating { .star { color: #3a3630; &.on { color: #d9a441; } } .score { color: #6a6458; } &.no { color: #6a6458; } }
        .comment { color: #b0a898; }
      }
    }
  }
}
</style>
