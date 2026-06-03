import { defineStore } from 'pinia'
import { useDark, useToggle, useStorage } from '@vueuse/core'

export const useThemeStore = defineStore('theme', () => {
  // 暗色模式
  const isDark = useDark()
  const toggleDark = useToggle(isDark)

  // Hero 背景图：为空字符串时使用默认山水 SVG，填入图片 URL（或 base64 DataURL）时用图片
  // 通过 useStorage 持久化到 localStorage，刷新后保持
  const heroBg = useStorage<string>('blog-hero-bg', '')

  function setHeroBg(url: string) {
    heroBg.value = url
  }
  function resetHeroBg() {
    heroBg.value = ''
  }

  return { isDark, toggleDark, heroBg, setHeroBg, resetHeroBg }
})
