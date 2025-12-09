<template>
  <transition name="screen-fade">
    <div v-if="!isFinished" class="loading-screen" :class="{ 'exiting': startExit }">
      <!-- Shutter Curtains -->
      <div class="shutter top" :class="{ 'open': startExit }"></div>
      <div class="shutter bottom" :class="{ 'open': startExit }"></div>
      
      <div class="content-wrapper" :class="{ 'fade-out': startExit }">
        <transition name="text-fade" mode="out-in">
          <div v-if="step === 1" key="1" class="text-container flex items-center justify-center gap-4">
            <n-icon size="24" class="spin-slow text-gray-400"><Settings /></n-icon>
            <div class="glitch-text text-xl md:text-2xl" data-text="正在远离形象宇宙">
              正在远离形象宇宙
            </div>
            <n-icon size="24" class="spin-slow reverse text-gray-400"><Settings /></n-icon>
          </div>
          <div v-else-if="step === 2" key="2" class="text-container flex flex-col items-center">
            <div class="flex items-center justify-center gap-4">
              <n-icon size="24" class="spin-normal text-gray-400"><Settings /></n-icon>
              <div class="glitch-text text-xl md:text-2xl" data-text="齿轮与杠杆载入中">
                齿轮与杠杆载入中
              </div>
              <n-icon size="24" class="spin-normal reverse text-gray-400"><Settings /></n-icon>
            </div>
            <div class="mt-6 flex flex-col items-center gap-2">
              <div class="flex items-center gap-2">
                <span class="text-2xl font-light opacity-50">[</span>
                <div class="flex gap-1">
                  <div v-for="n in 10" :key="n" 
                       class="w-2 h-6 border border-white/30 transition-all duration-100"
                       :class="[ 
                         n <= activeSegments ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-transparent',
                         n === activeSegments ? 'scale-y-110' : ''
                       ]">
                  </div>
                </div>
                <span class="text-2xl font-light opacity-50">]</span>
              </div>
              <div class="font-mono text-xs opacity-60 tracking-widest mt-1">
                LOADING_MODULES... {{ activeSegments * 10 }}%
              </div>
            </div>
          </div>
          <div v-else-if="step === 3" key="3" class="text-container cursor-pointer" @click="enterSystem">
            <div class="glitch-text text-xl md:text-2xl blink" data-text="[ 点击接入神经漫游 ]">
              [ 点击沉入抽象宇宙 ]
            </div>
            <div class="text-xs mt-2 opacity-60">SYSTEM READY // WAITING FOR USER INPUT</div>
          </div>
        </transition>
      </div>
      
      <!-- Decorators (attached to shutters so they move away) -->
      <div class="corner top-left" :class="{ 'hide': startExit }"></div>
      <div class="corner top-right" :class="{ 'hide': startExit }"></div>
      <div class="corner bottom-left" :class="{ 'hide': startExit }"></div>
      <div class="corner bottom-right" :class="{ 'hide': startExit }"></div>
      <div class="scanline" :class="{ 'hide': startExit }"></div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { audioManager } from '~/utils/audio'
import { NIcon } from 'naive-ui'
import { Settings } from '@vicons/carbon'

const step = ref(0)
const startExit = ref(false)
const isFinished = ref(false)
const activeSegments = ref(0)

const enterSystem = () => {
  audioManager.startBgmDirect()
  audioManager.playClick()
  startExit.value = true
  
  setTimeout(() => {
    isFinished.value = true
  }, 1500) // Wait for shutter animation
}

onMounted(() => {
  // Check for no_intro parameter
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('no_intro') === 'true') {
    isFinished.value = true;
    
    // Clean up URL
    const newUrl = window.location.pathname;
    window.history.replaceState({}, '', newUrl);
    
    return;
  }

  // Sequence
  setTimeout(() => {
    step.value = 1
  }, 500)

  setTimeout(() => {
    step.value = 2
    const interval = setInterval(() => {
      if (activeSegments.value < 10) {
        activeSegments.value++
      } else {
        clearInterval(interval)
      }
    }, 200)
  }, 2500)

  setTimeout(() => {
    step.value = 3
  }, 4500)
})
</script>

<style lang="scss" scoped>
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9998;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-family: "Share Tech Mono", "Fusion Pixel 12px Monospaced", monospace;
  overflow: hidden;
}

/* Shutters */
.shutter {
  position: absolute;
  left: 0;
  width: 100%;
  height: 50%;
  background-color: #000;
  z-index: 1;
  transition: transform 1s cubic-bezier(0.7, 0, 0.3, 1);
  
  &.top {
    top: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    &.open {
      transform: translateY(-100%);
    }
  }
  
  &.bottom {
    bottom: 0;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    &.open {
      transform: translateY(100%);
    }
  }
}

.content-wrapper {
  text-align: center;
  position: relative;
  z-index: 2;
  transition: opacity 0.5s ease;
  
  &.fade-out {
    opacity: 0;
  }
}

/* Text Animation */
.text-fade-enter-active,
.text-fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.text-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.text-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.blink {
  animation: blink-anim 2s infinite;
}

@keyframes blink-anim {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Glitch Effect */
.glitch-text {
  position: relative;
  letter-spacing: 2px;
  
  &::before,
  &::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000;
  }

  &::before {
    left: 2px;
    text-shadow: -1px 0 #ff00c1;
    clip: rect(44px, 450px, 56px, 0);
    animation: glitch-anim 5s infinite linear alternate-reverse;
  }

  &::after {
    left: -2px;
    text-shadow: -1px 0 #00fff9;
    clip: rect(44px, 450px, 56px, 0);
    animation: glitch-anim2 5s infinite linear alternate-reverse;
  }
}

/* Loading Bar */
.loading-bar {
  width: 200px;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.loading-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: #fff;
  transform: translateX(-100%);
  animation: progress 2s ease-in-out infinite;
}

@keyframes progress {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0); }
  100% { transform: translateX(100%); }
}

/* Decorators */
.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid #fff;
  opacity: 0.5;
  z-index: 2;
  transition: opacity 0.5s ease;
  
  &.top-left { top: 20px; left: 20px; border-right: none; border-bottom: none; }
  &.top-right { top: 20px; right: 20px; border-left: none; border-bottom: none; }
  &.bottom-left { bottom: 20px; left: 20px; border-right: none; border-top: none; }
  &.bottom-right { bottom: 20px; right: 20px; border-left: none; border-top: none; }
  
  &.hide {
    opacity: 0;
  }
}

.scanline {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.5),
    rgba(0, 0, 0, 0.5) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
  z-index: 3;
  transition: opacity 0.5s ease;
  
  &.hide {
    opacity: 0;
  }
}

@keyframes glitch-anim {
  0% { clip: rect(30px, 9999px, 10px, 0); }
  5% { clip: rect(80px, 9999px, 90px, 0); }
  10% { clip: rect(10px, 9999px, 40px, 0); }
  15% { clip: rect(60px, 9999px, 20px, 0); }
  20% { clip: rect(20px, 9999px, 50px, 0); }
  100% { clip: rect(50px, 9999px, 30px, 0); }
}

@keyframes glitch-anim2 {
  0% { clip: rect(10px, 9999px, 80px, 0); }
  5% { clip: rect(50px, 9999px, 20px, 0); }
  10% { clip: rect(90px, 9999px, 10px, 0); }
  15% { clip: rect(30px, 9999px, 60px, 0); }
  20% { clip: rect(70px, 9999px, 40px, 0); }
  100% { clip: rect(20px, 9999px, 70px, 0); }
}

.spin-slow {
  animation: spin 8s linear infinite;
  
  &.reverse {
    animation-direction: reverse;
  }
}

.spin-normal {
  animation: spin 4s linear infinite;
  
  &.reverse {
    animation-direction: reverse;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
