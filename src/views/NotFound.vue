<template>
  <div class="not-found">
    <div class="content">
      <div class="seal">迷</div>
      <h1>404</h1>
      <p class="jp">道に迷いました</p>
      <p class="cn">页面不存在，或许已随墨色淡去</p>
      <RouterLink to="/" class="back-link">← 返回首页</RouterLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.not-found {
  min-height: 60vh;
  display: grid;
  place-items: center;
  text-align: center;

  .content {
    .seal {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      border: 2px solid $dai;
      border-radius: 4px;
      font-family: $serif;
      font-size: 28px;
      font-weight: 700;
      color: $dai;
      margin-bottom: 20px;
    }
    h1 {
      font-size: 72px;
      margin: 0;
      font-family: $serif;
      color: $line;
      letter-spacing: 0.05em;
    }
    .jp {
      color: $ink-faint;
      font-size: 15px;
      margin: 8px 0 4px;
      letter-spacing: 0.2em;
    }
    .cn {
      color: $ink-soft;
      font-size: 14px;
      margin: 0 0 28px;
    }
    .back-link {
      display: inline-block;
      padding: 10px 28px;
      background: $dai;
      color: $card;
      border-radius: $radius;
      text-decoration: none;
      font-size: 14px;
      transition: background 0.2s;
      &:hover { background: $dai-deep; }
    }
  }
}

html.dark {
  .not-found .content {
    .seal { border-color: #4a6b5c; color: #7d9471; }
    h1 { color: #3a3630; }
    .jp { color: #6a6458; }
    .cn { color: #9a9488; }
    .back-link { background: #3a5c4c; &:hover { background: #2e4a3c; } }
  }
}
</style>
