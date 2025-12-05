<script setup lang="ts">
import { useStore } from '~/store';
import { audioManager } from '~/utils/audio';
import { ref } from 'vue';

const option_store = useStore().exportOptions

const playHover = () => {
  audioManager.playHover()
}

const playClick = () => {
  audioManager.playClick()
}

const clickingKey = ref<string | null>(null);

interface Option {
  label: string
  desc: string
  key: keyof typeof option_store
}

// Simplified labels for grid layout
const list: Option[] = [
  { label: "指令过滤", desc: "隐藏指令内容", key: 'commandHide' },
  { label: "图像过滤", desc: "折叠图片消息", key: 'imageHide' },
  { label: "场外过滤", desc: "隐藏场外发言", key: 'offTopicHide' },
  { label: "时间过滤", desc: "隐藏时间显示", key: 'timeHide' },
  { label: "账号隐藏", desc: "隐藏用户账号", key: 'userIdHide' },
  { label: "日期简略", desc: "隐藏年份显示", key: 'yearHide' },
  { label: "缩进对齐", desc: "文本首行缩进", key: 'textIndentAll' },
]

const handleOptionClick = (key: string) => {
  // @ts-ignore
  option_store[key] = !option_store[key];
  playClick();
  clickingKey.value = key;
  setTimeout(() => {
    clickingKey.value = null;
  }, 200);
}
</script>

<template>
  <div class="mb-8 relative">
    <h3 class="text-lg font-bold mb-4 uppercase border-b border-white border-dashed inline-block pr-8">
      系统参数 // SYSTEM PARAMETERS
    </h3>
    
    <!-- Checkerboard Grid -->
    <div class="checkerboard-grid">
      <div v-for="(opt, index) in list" :key="opt.key"
           class="checker-cell"
           :class="{ 'active': option_store[opt.key] }"
           @mouseenter="playHover"
           @click="handleOptionClick(opt.key)">
        
        <!-- Corner markers -->
        <div class="corner-mark top-left"></div>
        <div class="corner-mark top-right"></div>
        <div class="corner-mark bottom-left"></div>
        <div class="corner-mark bottom-right"></div>

        <!-- Active Background Layer (Center Outward Animation) -->
        <div class="active-layer"></div>

        <!-- Content -->
        <div class="cell-content">
          <div class="flex justify-between items-start">
            <div class="cell-index">0{{ index + 1 }}</div>
            <div class="cell-status">{{ option_store[opt.key] ? 'ON' : 'OFF' }}</div>
          </div>
          <div class="cell-main">
            <div class="cell-label">{{ opt.label }}</div>
            <div class="cell-desc">{{ opt.desc }}</div>
          </div>
        </div>

        <!-- Scanline overlay for active state -->
        <div class="scanline-overlay"></div>
        
        <!-- Click Flash -->
        <div v-if="clickingKey === opt.key" class="absolute inset-0 bg-white mix-blend-overlay animate-flash pointer-events-none z-50"></div>
      </div>
      
      <!-- Fillers to complete the grid if needed, or just let it be -->
      <div class="checker-cell filler group">
        <div class="cell-content">
          <div class="cell-index">--</div>
          <div class="cell-label text-xl opacity-50 group-hover:opacity-100 transition-opacity">NULL</div>
          <div class="cell-desc mt-1 opacity-30 group-hover:opacity-80 transition-opacity text-[10px]">RESERVED</div>
        </div>
        <div class="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_20px)] pointer-events-none"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.checkerboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2px;
  background: transparent;
}

.checker-cell {
  position: relative;
  aspect-ratio: 1.6; /* Taller tiles to fit descriptions */
  border: 1px solid #333;
  background: #0a0a0a;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 12px;

  &:hover {
    border-color: #fff;
    background: #141414;
    
    .cell-label {
      letter-spacing: 1px;
    }
    .cell-desc {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:active {
    transform: scale(0.98);
  }

  &.active {
    border-color: #fff;
    
    .cell-content {
      color: #000;
    }
    
    .cell-status {
      color: #000;
      font-weight: bold;
    }
    
    .cell-desc {
      color: #333;
    }

    .corner-mark {
      border-color: #000;
    }
    
    .active-layer {
      clip-path: circle(150% at 50% 50%);
    }
  }

  &.filler {
    pointer-events: none;
    border: 1px solid #222;
    background: #050505;
    opacity: 1; /* Made more visible as requested */
  }
}

.active-layer {
  position: absolute;
  inset: 0;
  background: #e0e0e0;
  z-index: 1;
  clip-path: circle(0% at 50% 50%);
  transition: clip-path 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  pointer-events: none;
}

.cell-content {
  position: relative;
  z-index: 2;
  color: #888;
  transition: color 0.2s;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
}

.cell-index {
  font-size: 10px;
  opacity: 0.5;
  font-family: 'Share Tech Mono', monospace;
}

.cell-label {
  font-size: 14px;
  font-weight: bold;
  transition: letter-spacing 0.2s;
}

.cell-desc {
  font-size: 10px;
  opacity: 0.6;
  margin-top: 2px;
  transition: all 0.3s ease;
  font-family: "Fusion Pixel 12px Monospaced", monospace;
}

.cell-status {
  font-size: 10px;
  font-family: 'Share Tech Mono', monospace;
}

.corner-mark {
  position: absolute;
  width: 4px;
  height: 4px;
  border: 1px solid transparent;
  transition: border-color 0.2s;
  z-index: 2;
  
  &.top-left { top: 2px; left: 2px; border-top-color: #555; border-left-color: #555; }
  &.top-right { top: 2px; right: 2px; border-top-color: #555; border-right-color: #555; }
  &.bottom-left { bottom: 2px; left: 2px; border-bottom-color: #555; border-left-color: #555; }
  &.bottom-right { bottom: 2px; right: 2px; border-bottom-color: #555; border-right-color: #555; }
}

.checker-cell:hover .corner-mark {
  border-color: #fff;
}

@keyframes flash {
  0% { opacity: 1; }
  100% { opacity: 0; }
}

.animate-flash {
  animation: flash 0.2s ease-out forwards;
}
</style>
