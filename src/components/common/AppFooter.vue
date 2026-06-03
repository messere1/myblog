<template>
  <footer class="app-footer">
    <div class="foot-inner">
      <p>© {{ new Date().getFullYear() }} 墨笺 · Built with <span class="dai">Vue 3</span> and Vite</p>
      <p>一隅清净，长存于此</p>
    </div>
  </footer>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.app-footer {
  margin-top: 60px;
  border-top: 1px solid $line;
  background: $bg-soft;
}
.foot-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 36px;
  text-align: center;
  color: $ink-faint;
  font-size: 13px;
  line-height: 2;
  letter-spacing: 1px;
  .dai { color: $dai; }
}
</style>
