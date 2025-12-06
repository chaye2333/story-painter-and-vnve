<template>
  <div v-if="visible" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
    <div class="w-[90%] max-w-md border border-[#333] bg-[#0a0a0a] relative p-1 animate-scale-in overflow-hidden">
      <!-- Decorative corners -->
      <div class="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-white/30"></div>
      <div class="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-white/30"></div>
      <div class="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-white/30"></div>
      <div class="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-white/30"></div>

      <!-- Header -->
      <div class="flex items-center justify-between border-b border-[#333] pb-2 mb-4 px-2 pt-2">
        <div class="font-mono text-xs font-bold text-[#666] tracking-widest uppercase">
          MEMORY_ARCHIVE // REC
        </div>
        <div class="flex items-center gap-2">
          <div class="font-mono text-[10px] text-[#444] mr-2">{{ time }}</div>
          <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(74,222,128,1),0_0_30px_rgba(74,222,128,0.6)]"></div>
        </div>
      </div>

      <!-- Cassette Visualization (AudioCore Style) -->
      <div class="relative h-32 bg-[#050505] border border-[#222] overflow-hidden mb-4 mx-2">
        <!-- Grid Overlay -->
        <div class="absolute inset-0 pointer-events-none z-10 grid-overlay"></div>
        <canvas ref="canvasRef" class="w-full h-full relative z-20 opacity-80"></canvas>
      </div>

      <!-- Content -->
      <div class="px-4 pb-4 flex flex-col gap-3 font-mono text-xs md:text-sm">
        <div class="flex justify-between items-end">
          <span class="opacity-50 text-[10px] tracking-wider">STATUS_MONITOR</span>
          <span class="text-gray-300 font-bold animate-pulse text-xs">{{ status }}</span>
        </div>

        <!-- Progress Bar Container -->
        <div class="h-4 border border-[#333] bg-[#111] p-[1px] relative">
          <!-- Progress Fill -->
          <div 
            class="h-full bg-white/80 transition-all duration-100 ease-linear relative overflow-hidden"
            :style="{ width: `${progress}%` }"
          >
          </div>
          
          <!-- Percentage Text (Mix blend for visibility) -->
          <div class="absolute inset-0 flex items-center justify-center mix-blend-difference text-white font-bold tracking-wider text-[10px]">
            {{ Math.floor(progress) }}%
          </div>
        </div>

        <!-- Log Output -->
        <div class="h-20 border-t border-[#222] mt-2 pt-2 font-mono text-[10px] text-gray-500 flex flex-col justify-end">
          <div v-for="(log, i) in logs" :key="i" class="whitespace-nowrap overflow-hidden text-ellipsis">
            > {{ log }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  visible: boolean;
  progress: number;
  status: string;
}>();

const time = ref('');
const logs = ref<string[]>([]);
const canvasRef = ref<HTMLCanvasElement | null>(null);
let animationFrameId: number | null = null;

// Dreamy logs
watch(() => props.progress, (newVal) => {
  if (newVal < 5 && logs.value.length === 0) logs.value.push('INITIALIZING DREAM SEQUENCE...');
  if (newVal > 20 && logs.value.length < 2) logs.value.push('GATHERING MOON DUST...');
  if (newVal > 50 && logs.value.length < 3) logs.value.push('WEAVING MEMORIES...');
  if (newVal > 80 && logs.value.length < 4) logs.value.push('ETCHING TO TAPE...');
  if (newVal >= 100 && logs.value.length < 5) logs.value.push('ARCHIVE COMPLETE.');
});

watch(() => props.visible, (newVal) => {
  if (newVal) {
    logs.value = ['INITIALIZING DREAM SEQUENCE...'];
    startAnimation();
  } else {
    logs.value = [];
    stopAnimation();
  }
});

let timer: number;

const drawCassette = () => {
  if (!canvasRef.value) return;
  
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
  }

  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  // Draw tape reels
  const time = Date.now() / 1000;
  const rotation = time * 1.5; // Slightly faster than AudioCore to indicate activity
  
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'; // Match AudioCore style (faint)
  ctx.lineWidth = 2 * dpr;
  
  // Left Reel
  ctx.translate(width * 0.25, height * 0.5);
  ctx.rotate(rotation);
  ctx.beginPath();
  ctx.arc(0, 0, height * 0.3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-height * 0.3, 0);
  ctx.lineTo(height * 0.3, 0);
  ctx.moveTo(0, -height * 0.3);
  ctx.lineTo(0, height * 0.3);
  ctx.stroke();
  ctx.rotate(-rotation);
  ctx.translate(-width * 0.25, -height * 0.5);

  // Right Reel
  ctx.translate(width * 0.75, height * 0.5);
  ctx.rotate(rotation);
  ctx.beginPath();
  ctx.arc(0, 0, height * 0.3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-height * 0.3, 0);
  ctx.lineTo(height * 0.3, 0);
  ctx.moveTo(0, -height * 0.3);
  ctx.lineTo(0, height * 0.3);
  ctx.stroke();
  ctx.restore();

  if (props.visible) {
    animationFrameId = requestAnimationFrame(drawCassette);
  }
};

const startAnimation = () => {
  if (!animationFrameId) {
    drawCassette();
  }
};

const stopAnimation = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
};

onMounted(() => {
  timer = window.setInterval(() => {
    const now = new Date();
    time.value = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  }, 1000);
  
  if (props.visible) {
    startAnimation();
  }
});

onUnmounted(() => {
  clearInterval(timer);
  stopAnimation();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

.animate-scale-in {
  animation: scaleIn 0.4s cubic-bezier(0.19, 1, 0.22, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.grid-overlay {
  background-size: 20px 20px;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
}
</style>
