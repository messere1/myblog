<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { useCategoryStore } from '@/stores/category'
import type { Category } from '@/types'

const store = useCategoryStore()

const showForm = ref(false)
const editing = ref<Category | null>(null)
const form = reactive({ name: '', description: '' })

onMounted(() => store.fetchAll())

function openNew() {
  editing.value = null
  form.name = ''
  form.description = ''
  showForm.value = true
}

function openEdit(c: Category) {
  editing.value = c
  form.name = c.name
  form.description = c.description || ''
  showForm.value = true
}

async function handleSave() {
  if (!form.name.trim()) return alert('分类名不能为空')
  if (editing.value) {
    await store.update(editing.value.id, { ...form })
  } else {
    await store.create({ ...form })
  }
  showForm.value = false
}

async function handleDelete(c: Category) {
  if (!confirm(`确定删除分类「${c.name}」?`)) return
  await store.remove(c.id)
}
</script>

<template>
  <div class="category-manage">
    <div class="toolbar">
      <div class="page-head">
        <span class="vbar"></span>
        <h3>分类管理</h3>
      </div>
      <button class="btn primary" @click="openNew">+ 新建分类</button>
    </div>

    <table class="data-table">
      <thead>
        <tr><th>ID</th><th>名称</th><th>描述</th><th>操作</th></tr>
      </thead>
      <tbody>
        <tr v-for="c in store.categories" :key="c.id">
          <td>{{ c.id }}</td>
          <td>{{ c.name }}</td>
          <td>{{ c.description }}</td>
          <td class="actions">
            <button class="btn" @click="openEdit(c)">编辑</button>
            <button class="btn danger" @click="handleDelete(c)">删除</button>
          </td>
        </tr>
        <tr v-if="!store.categories.length">
          <td colspan="4" class="empty">暂无分类</td>
        </tr>
      </tbody>
    </table>

    <div v-if="showForm" class="modal" @click.self="showForm = false">
      <div class="modal-content">
        <h3>{{ editing ? '编辑分类' : '新建分类' }}</h3>
        <div class="field">
          <label>名称</label>
          <input v-model="form.name" placeholder="分类名称" />
        </div>
        <div class="field">
          <label>描述</label>
          <input v-model="form.description" placeholder="可选描述" />
        </div>
        <div class="modal-actions">
          <button class="btn" @click="showForm = false">取消</button>
          <button class="btn primary" @click="handleSave">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.category-manage {
  padding: 16px;

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .page-head {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .vbar {
    display: inline-block;
    width: 4px;
    height: 20px;
    background: $dai;
    border-radius: 2px;
  }
  h3 { margin: 0; font-family: $serif; }

  .data-table {
    width: 100%;
    background: $card;
    border-collapse: collapse;
    border: 1px solid $line;
    border-radius: $radius-card;
    overflow: hidden;
    th, td {
      padding: 12px 16px;
      border-bottom: 1px solid $line;
      text-align: left;
      font-size: 14px;
    }
    th {
      background: $bg;
      font-weight: 600;
      color: $ink-soft;
      font-size: 13px;
    }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: rgba($dai, 0.03); }
    .actions { display: flex; gap: 8px; }
    .empty { text-align: center; color: $ink-faint; padding: 40px; }
  }

  .btn {
    padding: 6px 14px;
    border: 1px solid $line;
    background: $card;
    border-radius: $radius;
    cursor: pointer;
    font-size: 13px;
    color: $ink;
    transition: all 0.2s;
    &:hover { border-color: $dai; color: $dai; }
    &.primary {
      background: $dai;
      color: $card;
      border-color: $dai;
      &:hover { background: $dai-deep; }
    }
    &.danger {
      background: $danger;
      color: #fff;
      border-color: $danger;
      &:hover { opacity: .85; }
    }
  }

  .modal {
    position: fixed;
    inset: 0;
    background: rgba($ink, 0.4);
    display: grid;
    place-items: center;
    z-index: 100;

    .modal-content {
      background: $card;
      padding: 28px;
      border-radius: $radius-card;
      border: 1px solid $line;
      width: 100%;
      max-width: 400px;
      h3 { margin: 0 0 20px; font-family: $serif; }
      .field {
        margin-bottom: 12px;
        label {
          display: block;
          margin-bottom: 4px;
          font-size: 13px;
          color: $ink-soft;
        }
        input {
          width: 100%;
          padding: 8px 10px;
          border: 1px solid $line;
          border-radius: $radius;
          background: $bg;
          color: $ink;
          box-sizing: border-box;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
          &:focus { border-color: $dai; }
          &::placeholder { color: $ink-faint; }
        }
      }
      .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 16px;
      }
    }
  }
}

html.dark {
  h3 { color: #d4cfc4; }
  .data-table {
    background: #242220 !important;
    border-color: #3a3630 !important;
    th { background: #1a1916; color: #9a9488; border-bottom-color: #3a3630; }
    td { border-bottom-color: #3a3630; color: #b0a898; }
    .empty { color: #6a6458; }
  }
  .btn {
    background: #242220;
    border-color: #3a3630;
    color: #d4cfc4;
    &:hover { border-color: #4a6b5c; color: #7d9471; }
    &.primary { background: #3a5c4c; border-color: #3a5c4c; color: #d4cfc4; &:hover { background: #2e4a3c; } }
    &.danger { background: #8b2020; border-color: #8b2020; }
  }
  .modal {
    background: rgba(0,0,0,0.6);
    .modal-content {
      background: #242220;
      border-color: #3a3630;
      h3 { color: #d4cfc4; }
      .field {
        label { color: #9a9488; }
        input { background: #1a1916; border-color: #3a3630; color: #d4cfc4; &::placeholder { color: #6a6458; } &:focus { border-color: #4a6b5c; } }
      }
    }
  }
}
</style>
