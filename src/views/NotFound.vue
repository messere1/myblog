<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <p>页面不存在</p>
      <RouterLink to="/">返回首页</RouterLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
.not-found {
  min-height: 60vh;
  display: grid;
  place-items: center;
  text-align: center;
  .content {
    h1 { font-size: 80px; margin: 0; color: #ddd; }
    p { color: #999; margin: 8px 0 24px; }
    a {
      padding: 10px 24px;
      background: #4a90e2;
      color: #fff;
      border-radius: 6px;
      text-decoration: none;
      &:hover { background: #3a7bc8; }
    }
  }
}
</style>
