<template>
  <div class="fixed inset-0 z-[100] bg-black font-mono overflow-y-auto scrollbar-thin">
    <!-- Loading Overlay -->
    <div 
      class="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center transition-transform duration-1000 ease-in-out will-change-transform font-mono"
      :class="{ 'translate-y-full': !isLoading }"
    >
       <!-- Decorative Corners -->
       <div class="corner top-left" :class="{'opacity-0': !isLoading}"></div>
       <div class="corner top-right" :class="{'opacity-0': !isLoading}"></div>
       <div class="corner bottom-left" :class="{'opacity-0': !isLoading}"></div>
       <div class="corner bottom-right" :class="{'opacity-0': !isLoading}"></div>

       <!-- Scanline for loading screen -->
       <div class="absolute inset-0 pointer-events-none scanline z-[201]" :class="{'opacity-0': !isLoading}"></div>

       <svg viewBox='0 0 50 50' class="w-20 h-20 mb-8 overflow-visible transition-opacity duration-300 relative z-[202]" :class="{'opacity-0': !isLoading}">
            <circle r='25' cx='25' cy='25' class="fill-none stroke-white stroke-[2] origin-center animate-circle-rotate"></circle>
       </svg>
       
       <div class="relative z-[202] flex flex-col items-center gap-2">
         <p class="text-2xl font-black text-white tracking-widest transition-opacity duration-300 glitch-text" 
            :class="{'opacity-0': !isLoading}"
            data-text="[正在载入个体信息]">
           [正在载入个体信息]
         </p>
         <p class="text-xs text-gray-500 tracking-[0.3em] transition-opacity duration-300 font-bold" 
            :class="{'opacity-0': !isLoading}">
           LOADING INDIVIDUAL DATA...
         </p>
       </div>
    </div>

    <!-- Close Button (Moved to Top Left, Fixed position to remain accessible) -->
    <button 
      @click="handleClose" 
      class="fixed top-6 left-8 text-gray-500 hover:text-white transition-colors z-[150] flex items-center gap-2 group mix-blend-difference"
    >
      <span class="font-mono text-xl group-hover:rotate-90 transition-transform">×</span>
      <span class="text-xs tracking-widest group-hover:animate-pulse">EJECT</span>
    </button>

    <!-- Interactive Grid Canvas (Top Layer relative to background, Fixed to viewport) -->
    <canvas ref="canvasRef" class="fixed inset-0 z-[5] pointer-events-none"></canvas>

    <!-- Scrollable Wrapper to ensure background stretches with content -->
    <div class="relative min-h-full w-full">
      <!-- Background Image Layer (Absolute to Wrapper) -->
      <div ref="bgRef" class="absolute inset-0 z-0 overflow-hidden group h-[50vh] md:h-full">
        <img :src="xufuImg" alt="Xu Fu" class="w-full h-full object-cover object-top opacity-90 glitch-img" />
        
        <!-- Enhanced Scanline overlay -->
        <div class="absolute inset-0 pointer-events-none bg-scanlines opacity-50"></div>
        
        <!-- Moving Scan Bar -->
        <div class="absolute top-0 left-0 w-full h-1 bg-white/30 shadow-[0_0_10px_rgba(255,255,255,0.5)] animate-scan-bar pointer-events-none z-10"></div>
        
        <!-- Noise Texture -->
        <div class="absolute inset-0 pointer-events-none opacity-[0.15] bg-noise z-10 mix-blend-overlay"></div>

        <!-- Vignette for edges -->
        <div class="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-60 z-20"></div>
      </div>

      <!-- Right Content Layer (Relative in Wrapper) -->
      <div class="relative z-10 w-full md:w-[65%] lg:w-[55%] ml-auto md:bg-gradient-to-l md:from-black md:via-black/95 md:to-transparent min-h-screen flex flex-col md:pl-20 md:pr-16 md:py-12">
        
        <!-- Mobile Spacer to show image -->
        <div class="h-[45vh] md:hidden shrink-0"></div>

        <!-- Content Area with Mobile Background -->
        <div class="relative md:bg-transparent bg-black flex-1 pl-4 pr-4 pb-12 md:p-0" :class="{'animate-content-entry': !isLoading}">
          
          <!-- Mobile Top Gradient Fade -->
          <div class="absolute -top-24 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent pointer-events-none md:hidden"></div>

          <!-- Header -->
          <div class="mb-8 border-b border-white/20 pb-4 relative content-item">
            <div class="absolute -left-4 top-0 bottom-0 w-1 bg-white/20"></div>
            <h2 class="text-3xl md:text-4xl font-black text-white tracking-tighter mb-2">
              徐福<span class="text-sm font-normal text-gray-400 tracking-widest align-middle ml-2">// 豹系公骰</span>
            </h2>
            <div class="text-xs text-gray-500 font-mono tracking-[0.2em] uppercase">
              Class: Investigator / Date: 2025-12
            </div>
          </div>

          <!-- Main Text -->
          <div class="space-y-6 text-sm md:text-base text-gray-300 leading-relaxed font-sans">
            <p class="text-gray-400 italic border-l-2 border-white/30 pl-4 py-1 content-item">
              “一些前情提要还是需要的，我想，那些因向未知邪神献祭而走上末路的案例已经足够了。”
            </p>
            
            <div class="flex items-center gap-4 opacity-50 my-6 content-item">
               <div class="h-[1px] flex-1 bg-white/30"></div>
               <div class="w-2 h-2 rotate-45 border border-white"></div>
               <div class="h-[1px] flex-1 bg-white/30"></div>
            </div>

            <p class="content-item">你好，这里是豹系公骰<strong class="text-white">【徐福】</strong></p>
            
            <p class="text-white/90 bg-white/10 p-3 rounded-sm border-l-2 border-white/50 text-xs md:text-sm content-item">
              注：骰60天未使用自动退群，若需要log重新拉入群即可！
            </p>

            <p class="content-item">
              *为《降魔专家》的同人角色骰，乃是嫉恶如仇，逢鬼必斩，遇恶必杀，又走在向邪神献祭上恶人为取得力量道路的邪道武术家，克系背景，魔幻都市日轻小说，语录大部分摘自原著，也混有不少骰主的个人理解，ooc致歉。
            </p>

            <div class="grid grid-cols-1 gap-4 text-xs md:text-sm bg-black/40 p-4 border border-white/10 content-item">
              <p>
                <span class="text-white font-bold block mb-1">>> 规则与语录</span>
                *coc和dnd语录已个性化，鉴定附加词很长！可输入“开启/关闭纯净模式”来使用简洁语录！<br>
                *帮助文档内COC包括coc7th，coc魔法大典，怪物之锤查询，DND包括dnd5e，dnd3r，pf的规则法术查询。
              </p>
              <p>
                <span class="text-white font-bold block mb-1">>> 版权声明</span>
                *徐福目前所使用图片主要一为骰主自己花钱约稿，所约稿件均为私人所有（目前大部分已替换为骰主所约稿件，感谢当初LOF愿意给咱使用同人图的老师）二为lof上询问过老师使用权的图，三为骰主自己画的，禁止未经允许搬运、转载、二传等操作。
              </p>
            </div>

            <p class="content-item">
              *功能骰，使用前请确定自己的需求，诸如“？/乐/早上好”之类的回复词没有，插件主要加了跑团辅助类的还有部分娱乐
            </p>

            <p class="content-item">
              *已上云服务器24h在线，每周会维修，可能在凌晨会下线维修10～30分钟。
            </p>

            <div class="border border-white/20 p-4 relative group hover:border-white/40 transition-colors content-item">
              <div class="absolute top-0 left-0 bg-white text-black text-[10px] px-1 font-bold">COMMANDS</div>
              <ul class="space-y-2 mt-2 font-mono text-xs md:text-sm">
                <li class="flex justify-between"><span class="text-gray-400">退群</span> <span class="text-white">.dismiss / .bot bye</span></li>
                <li class="flex justify-between"><span class="text-gray-400">开关骰子</span> <span class="text-white">.bot on / off</span></li>
                <li class="flex justify-between"><span class="text-gray-400">自定义回复</span> <span class="text-white">.reply on / off</span></li>
              </ul>
            </div>

            <!-- Contact / QQ Link -->
            <div class="border border-white/20 p-4 relative group hover:bg-white/5 transition-colors content-item cursor-pointer">
              <div class="absolute top-0 left-0 bg-white text-black text-[10px] px-1 font-bold">CONTACT</div>
              <a href="https://res.abeim.cn/api/qq/?qq=3197624806" target="_blank" class="flex justify-between items-center mt-2 text-decoration-none">
                 <span class="text-gray-400 font-mono text-xs">QQ LINK (Mobile)</span>
                 <span class="text-white font-mono font-bold hover:text-pink-500 transition-colors">3197624806 <span class="text-[10px] align-top">↗</span></span>
              </a>
            </div>

            <p class="text-xs text-gray-500 mt-4 content-item">
              更详细请看徐福空间转发的公骰协议，使用骰娘即默认同意该协议。
            </p>

            <div class="mt-8 pt-6 border-t border-dashed border-white/20 content-item">
               <p class="italic text-gray-400 text-sm leading-relaxed">
                “如果你真的变成那种令人恶心的渣滓，我只好干脆利落地将你献祭了，好成为我路上的助力，也为河狸市的空气净化助一份力，想必就算是某个本就手段不干净的警察也指不出我的一分过错。”
                <span class="block text-right mt-2 text-xs opacity-50">—— (那种理所当然的口吻)</span>
              </p>
            </div>
          </div>
        </div>
        
        <!-- Decorative Bottom Tape Strip -->
        <div class="absolute bottom-0 right-0 w-full h-2 bg-gradient-to-r from-transparent via-white/20 to-white/10"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useMouse, useWindowSize, useDevicePixelRatio } from '@vueuse/core';
import xufuImg from '../assets/xufu_avatar.png';
import { audioManager } from '../utils/audio';

const bgRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const isLoading = ref(true);

const emit = defineEmits<{
  (e: 'close'): void
}>();

const handleClose = () => {
  audioManager.playClick();
  emit('close');
};

// Grid Logic
const { x, y } = useMouse({ type: 'client' });
const { width, height } = useWindowSize();
const { pixelRatio } = useDevicePixelRatio();

const GRID_SIZE = 40; // Match main interface
const FADE_SPEED = 0.03; 
const HIGHLIGHT_COLOR = 'rgba(255, 255, 255, '; 

// Store active cells: key = "x,y", value = opacity
const activeCells = new Map<string, number>();
let animationFrameId: number;

const draw = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update and draw active cells
  for (const [key, opacity] of activeCells) {
    if (opacity <= 0) {
      activeCells.delete(key);
      continue;
    }

    const [cx, cy] = key.split(',').map(Number);
    
    // Draw outline (stroke)
    ctx.strokeStyle = `${HIGHLIGHT_COLOR}${opacity * 0.8})`; // High visibility for stroke
    ctx.lineWidth = 1;
    ctx.strokeRect(cx * GRID_SIZE + 0.5, cy * GRID_SIZE + 0.5, GRID_SIZE - 1, GRID_SIZE - 1);

    // Draw faint fill
    ctx.fillStyle = `${HIGHLIGHT_COLOR}${opacity * 0.1})`; 
    ctx.fillRect(cx * GRID_SIZE, cy * GRID_SIZE, GRID_SIZE, GRID_SIZE);

    // Decay
    activeCells.set(key, opacity - FADE_SPEED);
  }

  // Check current mouse position
  // Only add if mouse is within window
  if (x.value >= 0 && x.value <= width.value && y.value >= 0 && y.value <= height.value) {
    const col = Math.floor(x.value / GRID_SIZE);
    const row = Math.floor(y.value / GRID_SIZE);
    const key = `${col},${row}`;
    
    // Reset opacity to 1 if hovered (or add new)
    activeCells.set(key, 1.0);
  }

  animationFrameId = requestAnimationFrame(draw);
};

const resize = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  
  // Handle high DPI
  canvas.width = width.value * pixelRatio.value;
  canvas.height = height.value * pixelRatio.value;
  // Since it's fixed inset-0, we can just use window dimensions
  // But to be safe with styles:
  canvas.style.width = `${width.value}px`;
  canvas.style.height = `${height.value}px`;
  
  const ctx = canvas.getContext('2d');
  if (ctx) ctx.scale(pixelRatio.value, pixelRatio.value);
};

onMounted(() => {
  // Start loading animation
  setTimeout(() => {
    isLoading.value = false;
  }, 1500);

  // Start grid animation
  resize();
  window.addEventListener('resize', resize);
  animationFrameId = requestAnimationFrame(draw);
});

onUnmounted(() => {
  window.removeEventListener('resize', resize);
  cancelAnimationFrame(animationFrameId);
});
</script>

<style scoped>
.animate-circle-rotate {
  stroke-dasharray: 160;
  stroke-dashoffset: 160;
  animation: circle_rotate 3s ease-in infinite;
}

@keyframes circle_rotate {
    0% {
        transform: rotate(0deg);
        stroke-dashoffset: 160;
    }
    100% {
        transform: rotate(360deg);
        stroke-dashoffset: -160;
    }
}

.bg-scanlines {
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 2px,
    rgba(0, 0, 0, 0.3) 3px
  );
  background-size: 100% 3px;
}

.scanline {
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.5),
    rgba(0, 0, 0, 0.5) 1px,
    transparent 1px,
    transparent 2px
  );
  background-size: 100% 4px;
}

/* Glitch Effect */
.glitch-text {
  position: relative;
  letter-spacing: 2px;
  font-family: "Share Tech Mono", "Fusion Pixel 12px Monospaced", monospace;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
}



/* Image Scan Bar Animation */
.animate-scan-bar {
  animation: scan-bar-move 4s linear infinite;
}

@keyframes scan-bar-move {
  0% { top: -10%; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 110%; opacity: 0; }
}

/* Noise Background */
.bg-noise {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E");
}

/* Glitch Image */
.glitch-img {
  animation: glitch-img-anim 5s infinite;
}

@keyframes glitch-img-anim {
  0%, 90% { transform: translate(0); filter: hue-rotate(0deg); }
  92% { transform: translate(-2px, 1px); filter: hue-rotate(90deg) brightness(1.2); }
  94% { transform: translate(2px, -1px); filter: hue-rotate(-90deg) contrast(1.2); }
  96% { transform: translate(0); filter: hue-rotate(0deg); }
  98% { transform: translate(1px, 1px) scale(1.01); filter: invert(0.1); }
  100% { transform: translate(0); }
}

/* Staggered Content Entry */
.animate-content-entry .content-item {
  animation: slideInRight 0.8s cubic-bezier(0.2, 1, 0.3, 1) backwards;
}

.animate-content-entry .content-item:nth-child(1) { animation-delay: 0.1s; }
.animate-content-entry .content-item:nth-child(2) { animation-delay: 0.15s; }
.animate-content-entry .content-item:nth-child(3) { animation-delay: 0.2s; }
.animate-content-entry .content-item:nth-child(4) { animation-delay: 0.25s; }
.animate-content-entry .content-item:nth-child(5) { animation-delay: 0.3s; }
.animate-content-entry .content-item:nth-child(6) { animation-delay: 0.35s; }
.animate-content-entry .content-item:nth-child(7) { animation-delay: 0.4s; }
.animate-content-entry .content-item:nth-child(8) { animation-delay: 0.45s; }
.animate-content-entry .content-item:nth-child(9) { animation-delay: 0.5s; }
.animate-content-entry .content-item:nth-child(10) { animation-delay: 0.55s; }
.animate-content-entry .content-item:nth-child(11) { animation-delay: 0.6s; }
.animate-content-entry .content-item:nth-child(12) { animation-delay: 0.65s; }

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}


.glitch-text::before {
  left: 2px;
  text-shadow: -1px 0 #ff00c1;
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim 5s infinite linear alternate-reverse;
}

.glitch-text::after {
  left: -2px;
  text-shadow: -1px 0 #00fff9;
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim2 5s infinite linear alternate-reverse;
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

.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: #111;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #333;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Decorators */
.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid #fff;
  opacity: 0.5;
  z-index: 202;
  transition: opacity 0.5s ease;
}

.corner.top-left { top: 20px; left: 20px; border-right: none; border-bottom: none; }
.corner.top-right { top: 20px; right: 20px; border-left: none; border-bottom: none; }
.corner.bottom-left { bottom: 20px; left: 20px; border-right: none; border-top: none; }
.corner.bottom-right { bottom: 20px; right: 20px; border-left: none; border-top: none; }
</style>