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
      <h3>分类管理</h3>
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
          <td colspan="4" style="text-align:center; color:#999; padding:40px">暂无分类</td>
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
    h3 { margin: 0; }
  }

  .data-table {
    width: 100%;
    background: #fff;
    border-collapse: collapse;
    border: 1px solid $border-color;
    border-radius: 8px;
    overflow: hidden;
    th, td { padding: 12px 16px; border-bottom: 1px solid $border-color; text-align: left; font-size: 14px; }
    th { background: #fafbfc; font-weight: 600; }
    tr:last-child td { border-bottom: none; }
    .actions { display: flex; gap: 8px; }
  }

  .btn {
    padding: 6px 12px;
    border: 1px solid $border-color;
    background: #fff;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    &.primary { background: $primary; color: #fff; border-color: $primary; }
    &.danger { background: $danger; color: #fff; border-color: $danger; }
  }

  .modal {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.5);
    display: grid;
    place-items: center;
    z-index: 100;

    .modal-content {
      background: #fff;
      padding: 24px;
      border-radius: 8px;
      width: 100%;
      max-width: 400px;
      h3 { margin: 0 0 20px; }
      .field {
        margin-bottom: 12px;
        label { display: block; margin-bottom: 4px; font-size: 13px; color: $text-secondary; }
        input {
          width: 100%;
          padding: 8px 10px;
          border: 1px solid $border-color;
          border-radius: 4px;
          box-sizing: border-box;
          font-size: 14px;
          outline: none;
          &:focus { border-color: $primary; }
        }
      }
      .modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }
    }
  }
}
</style>
