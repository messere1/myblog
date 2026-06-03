<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { useDebounceFn } from '@vueuse/core'
import { usePostStore } from '@/stores/post'
import { useCategoryStore } from '@/stores/category'
import { getPost } from '@/api/posts'

const route = useRoute()
const router = useRouter()
const postStore = usePostStore()
const catStore = useCategoryStore()

const isEdit = computed(() => !!route.params.id)
const postId = computed(() => Number(route.params.id))

const form = reactive({
  title: '',
  content: '',
  categoryId: 0,
  tags: [] as string[],
})

const tagsInput = ref('')
const loading = ref(false)

onMounted(async () => {
  await catStore.fetchAll()
  if (isEdit.value) {
    const post = await getPost(postId.value)
    form.title = post.title
    form.content = post.content
    form.categoryId = post.categoryId
    form.tags = post.tags || []
    tagsInput.value = form.tags.join(', ')
  } else {
    // 恢复草稿
    const draft = localStorage.getItem('draft_new')
    if (draft) {
      try {
        const saved = JSON.parse(draft)
        Object.assign(form, saved)
        tagsInput.value = form.tags.join(', ')
      } catch {}
    }
  }
})

// VueUse 加分：防抖自动保存草稿
const autosave = useDebounceFn(() => {
  localStorage.setItem(
    `draft_${postId.value || 'new'}`,
    JSON.stringify(form)
  )
}, 1000)

function onContentChange() {
  autosave()
}

async function handleSubmit() {
  if (!form.title.trim()) return alert('标题不能为空')
  if (!form.content.trim()) return alert('内容不能为空')

  form.tags = tagsInput.value.split(',').map(t => t.trim()).filter(Boolean)

  loading.value = true
  try {
    if (isEdit.value) {
      await postStore.update(postId.value, form)
    } else {
      await postStore.create(form)
    }
    localStorage.removeItem(`draft_${postId.value || 'new'}`)
    router.push('/admin/posts')
  } catch (e) {
    console.error(e)
    alert('保存失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="post-editor">
    <div class="header">
      <h2>{{ isEdit ? '编辑文章' : '发布文章' }}</h2>
      <div class="actions">
        <button class="btn" @click="router.back()">取消</button>
        <button class="btn primary" :disabled="loading" @click="handleSubmit">
          {{ loading ? '保存中...' : '保存' }}
        </button>
      </div>
    </div>

    <div class="meta-bar">
      <input v-model="form.title" class="title-input" placeholder="文章标题" />

      <select v-model="form.categoryId">
        <option :value="0" disabled>选择分类</option>
        <option v-for="c in catStore.categories" :key="c.id" :value="c.id">
          {{ c.name }}
        </option>
      </select>

      <input v-model="tagsInput" placeholder="标签（逗号分隔）" />
    </div>

    <MdEditor
      v-model="form.content"
      preview-theme="github"
      code-theme="atom"
      :style="{ height: 'calc(100vh - 220px)' }"
      @on-change="onContentChange"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.post-editor {
  padding: 16px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    h2 { margin: 0; }
  }

  .meta-bar {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 8px;
    margin-bottom: 12px;
    input, select {
      padding: 8px 12px;
      border: 1px solid $border-color;
      border-radius: 6px;
      font-size: 14px;
      outline: none;
      &:focus { border-color: $primary; }
    }
    .title-input { font-size: 18px; font-weight: 600; }
  }

  .actions { display: flex; gap: 8px; }

  .btn {
    padding: 8px 18px;
    border: 1px solid $border-color;
    background: #fff;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    &.primary {
      background: $primary;
      color: #fff;
      border-color: $primary;
      &:hover { background: $primary-dark; }
    }
    &:disabled { opacity: .6; cursor: not-allowed; }
  }

  @include mobile {
    .meta-bar { grid-template-columns: 1fr; }
  }
}
</style>
