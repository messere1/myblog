<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { effectBudgets, resolveEffectQuality, seededValue, type EffectQuality } from '@/utils/effects'

const quality = ref<EffectQuality>('static')
const paused = ref(false)
let motionQuery: MediaQueryList | undefined

function detectQuality() {
  quality.value = resolveEffectQuality({
    reducedMotion: motionQuery?.matches ?? false,
    compactViewport: window.innerWidth < 768,
    hardwareConcurrency: navigator.hardwareConcurrency,
  })
}

function handleVisibility() {
  paused.value = document.hidden
}

const motes = computed(() => Array.from({ length: effectBudgets[quality.value].motes }, (_, index) => ({
  id: `mote-${index}`,
  x: Math.round(seededValue(index + 1) * 100),
  y: Math.round(seededValue(index + 31) * 100),
  size: 2 + Math.round(seededValue(index + 61) * 4),
  delay: -Math.round(seededValue(index + 91) * 18),
  duration: 13 + Math.round(seededValue(index + 121) * 15),
})))

const petals = computed(() => Array.from({ length: effectBudgets[quality.value].petals }, (_, index) => ({
  id: `petal-${index}`,
  x: Math.round(seededValue(index + 151) * 100),
  delay: -Math.round(seededValue(index + 181) * 24),
  duration: 18 + Math.round(seededValue(index + 211) * 18),
  drift: -42 + Math.round(seededValue(index + 241) * 84),
})))

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  detectQuality()
  handleVisibility()
  motionQuery.addEventListener('change', detectQuality)
  window.addEventListener('resize', detectQuality, { passive: true })
  document.addEventListener('visibilitychange', handleVisibility)
})

onBeforeUnmount(() => {
  motionQuery?.removeEventListener('change', detectQuality)
  window.removeEventListener('resize', detectQuality)
  document.removeEventListener('visibilitychange', handleVisibility)
})
</script>

<template>
  <div class="ambient-effects" :class="[`quality-${quality}`, { paused }]" aria-hidden="true">
    <div class="aurora aurora-one" />
    <div class="aurora aurora-two" />
    <span
      v-for="mote in motes"
      :key="mote.id"
      class="mote"
      :style="{
        '--x': `${mote.x}%`, '--y': `${mote.y}%`, '--size': `${mote.size}px`,
        '--delay': `${mote.delay}s`, '--duration': `${mote.duration}s`,
      }"
    />
    <i
      v-for="petal in petals"
      :key="petal.id"
      class="petal"
      :style="{
        '--x': `${petal.x}%`, '--delay': `${petal.delay}s`,
        '--duration': `${petal.duration}s`, '--drift': `${petal.drift}px`,
      }"
    />
  </div>
</template>

<style scoped>
.ambient-effects{position:fixed;z-index:0;inset:0;overflow:hidden;contain:strict;pointer-events:none}.aurora{position:absolute;width:44vw;height:44vw;border-radius:50%;filter:blur(72px);opacity:.2;will-change:transform;animation:aurora-drift 18s ease-in-out infinite alternate}.aurora-one{top:-24vw;left:-12vw;background:#f6b86f}.aurora-two{right:-16vw;bottom:-27vw;background:#ef9b82;animation-delay:-7s}.mote{position:absolute;top:var(--y);left:var(--x);width:var(--size);height:var(--size);border-radius:50%;background:rgba(189,116,53,.48);box-shadow:0 0 12px rgba(246,184,111,.35);opacity:.15;will-change:transform,opacity;animation:mote-float var(--duration) ease-in-out var(--delay) infinite alternate}.petal{position:absolute;top:-24px;left:var(--x);width:8px;height:12px;border-radius:70% 25% 65% 35%;background:linear-gradient(145deg,rgba(244,168,155,.72),rgba(246,197,151,.4));opacity:.4;will-change:transform,opacity;animation:petal-fall var(--duration) linear var(--delay) infinite}.quality-low .aurora{filter:blur(60px);opacity:.15}.quality-static .aurora{animation:none}.quality-static .mote,.quality-static .petal{animation:none;opacity:.14}.paused *{animation-play-state:paused!important}@keyframes aurora-drift{to{transform:translate3d(8vw,6vh,0) scale(1.08)}}@keyframes mote-float{0%{transform:translate3d(0,12px,0);opacity:.08}55%{opacity:.5}100%{transform:translate3d(18px,-28px,0);opacity:.16}}@keyframes petal-fall{0%{transform:translate3d(0,-8vh,0) rotate(0deg);opacity:0}10%{opacity:.38}90%{opacity:.28}100%{transform:translate3d(var(--drift),108vh,0) rotate(520deg);opacity:0}}@media(prefers-reduced-motion:reduce){.ambient-effects *{animation:none!important}}
</style>
