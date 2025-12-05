<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useMouse, useWindowSize, useDevicePixelRatio } from '@vueuse/core';

const { x, y } = useMouse({ type: 'client' });
const { width, height } = useWindowSize();
const { pixelRatio } = useDevicePixelRatio();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const ruinsCanvasRef = ref<HTMLCanvasElement | null>(null);

// Mouse normalized position (-0.5 to 0.5)
const mouseXNorm = computed(() => {
  // Smooth out the mouse movement if needed, but raw is fine for responsiveness
  return (x.value / width.value) - 0.5;
});

const mouseYNorm = computed(() => {
  return (y.value / height.value) - 0.5;
});

// Parallax settings
const SCENE_WIDTH_RATIO = 1.5; // The scene is 1.5x wider than screen
const CITY_PARALLAX = -100; // City moves slightly
const RUINS_PARALLAX = -400; // Ruins move a lot

// Building generation data
interface Building {
  x: number;
  w: number;
  h: number;
  windows: { x: number, y: number, w: number, h: number, lit: boolean }[];
}
const buildings: Building[] = [];
const ruins: { points: {x:number, y:number}[] }[] = [];
const particles: { x: number, y: number, size: number, speedY: number, alpha: number }[] = [];

const generateParticles = (w: number, h: number) => {
  particles.length = 0;
  const particleCount = 100;
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 1.5 + 0.2,
      speedY: Math.random() * 0.5 + 0.1,
      alpha: Math.random() * 0.8 + 0.2
    });
  }
};

const generateCity = (w: number, h: number) => {
  buildings.length = 0;
  const count = Math.floor(w / 30); // Density
  
  for (let i = 0; i < count; i++) {
    const bw = 30 + Math.random() * 50;
    const bh = h * 0.2 + Math.random() * (h * 0.5); // 20% to 70% height
    const bx = (Math.random() * w * 1.2) - (w * 0.1); // Spread wider than screen
    
    // Windows
    const winCount = Math.floor(Math.random() * 10);
    const wins = [];
    for(let j=0; j<winCount; j++) {
        wins.push({
            x: Math.random() * (bw - 6),
            y: Math.random() * (bh - 10),
            w: 2 + Math.random() * 4,
            h: 2 + Math.random() * 6,
            lit: Math.random() > 0.7
        });
    }

    buildings.push({ x: bx, w: bw, h: bh, windows: wins });
  }
  // Sort by height for layering (optional, but z-index usually implies draw order)
  buildings.sort((a, b) => a.h - b.h); // Draw smaller (further?) first? No, height usually random.
};

const generateRuins = (w: number, h: number) => {
    ruins.length = 0;
    // Left Ruin (Massive broken structure)
    // Polygon points
    ruins.push({
        points: [
            {x: -w * 0.2, y: h},
            {x: -w * 0.2, y: h * 0.3},
            {x: w * 0.1, y: h * 0.3}, // Jagged top
            {x: w * 0.15, y: h * 0.5},
            {x: w * 0.1, y: h * 0.7},
            {x: w * 0.2, y: h},
        ]
    });
    
    // Right Ruin
    ruins.push({
        points: [
            {x: w * 1.2, y: h},
            {x: w * 1.2, y: h * 0.2},
            {x: w * 0.9, y: h * 0.4}, 
            {x: w * 0.85, y: h * 0.6},
            {x: w * 0.9, y: h * 0.8},
            {x: w * 0.8, y: h},
        ]
    });
}

const draw = () => {
  if (!canvasRef.value || !ruinsCanvasRef.value) return;
  
  const dpr = pixelRatio.value || 1;
  const w = width.value;
  const h = height.value;
  
  // 1. Draw City (Midground)
  const ctx = canvasRef.value.getContext('2d');
  if (ctx) {
      canvasRef.value.width = w * dpr;
      canvasRef.value.height = h * dpr;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);
      
      // Offset based on mouse
      const offsetX = mouseXNorm.value * CITY_PARALLAX;
      const offsetY = mouseYNorm.value * 20; // Subtle vertical movement
      
      ctx.save();
      ctx.translate(offsetX, offsetY);
      
      // Draw Buildings
      ctx.fillStyle = '#1a1a1a'; // Lighter buildings for better visibility
      ctx.strokeStyle = '#444'; // Clearer edges
      ctx.lineWidth = 1;
      
      buildings.forEach(b => {
          const y = h - b.h; // Bottom aligned
          
          // Main body
          ctx.fillRect(b.x, y, b.w, b.h);
          ctx.strokeRect(b.x, y, b.w, b.h);
          
          // Windows (Lit up occasionally)
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          b.windows.forEach(win => {
              if (win.lit) { 
                  ctx.fillRect(b.x + win.x, y + win.y, win.w, win.h);
              }
          });
          ctx.fillStyle = '#0a0a0a'; // Reset
      });

      // Draw Particles
      ctx.fillStyle = '#fff';
      particles.forEach(p => {
          p.y -= p.speedY;
          if (p.y < 0) p.y = h;
          
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
      });
      ctx.globalAlpha = 1.0;
      
      ctx.restore();
  }
  
  // 2. Draw Ruins (Foreground)
  const ctxRuins = ruinsCanvasRef.value.getContext('2d');
  if (ctxRuins) {
      ruinsCanvasRef.value.width = w * dpr;
      ruinsCanvasRef.value.height = h * dpr;
      ctxRuins.scale(dpr, dpr);
      ctxRuins.clearRect(0, 0, w, h);
      
      const offsetX = mouseXNorm.value * RUINS_PARALLAX;
      
      ctxRuins.save();
      ctxRuins.translate(offsetX, 0);
      
      // Fill Pattern for Ruins (Hatching)
      
      ruins.forEach(r => {
          ctxRuins.beginPath();
          if (r.points.length > 0) ctxRuins.moveTo(r.points[0].x, r.points[0].y);
          for(let i=1; i<r.points.length; i++) ctxRuins.lineTo(r.points[i].x, r.points[i].y);
          ctxRuins.closePath();
          
          ctxRuins.fillStyle = '#000'; // Silhouette
          ctxRuins.fill();
          ctxRuins.strokeStyle = '#333';
          ctxRuins.stroke();
          
          // Add texture/noise?
      });
      
      ctxRuins.restore();
  }
  
  requestAnimationFrame(draw);
}

onMounted(() => {
    generateCity(width.value, height.value);
    generateParticles(width.value, height.value);
    generateRuins(width.value, height.value);
    draw();
});

watch([width, height], () => {
    generateCity(width.value, height.value);
    generateParticles(width.value, height.value);
    generateRuins(width.value, height.value);
});

</script>

<template>
  <div class="parallax-scene fixed inset-0 overflow-hidden pointer-events-none z-0 bg-black">
    <!-- Stars / Fog (Static Background) -->
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,20,20,1)_0%,rgba(0,0,0,1)_100%)]"></div>
    
    <!-- Moon (Parallax Layer 1 - Furthest) -->
    <!-- Moves OPPOSITE to mouse, very slowly -->
    <div class="absolute transition-transform duration-75 ease-out will-change-transform z-10"
         :style="{ 
            top: '10%', 
            left: '50%', 
            transform: `translate(calc(-50% + ${mouseXNorm * 50}px), ${mouseYNorm * 20}px)` 
         }">
      <div class="relative">
        <!-- Main Moon (Slot) -->
        <div class="moon-wrapper relative">
          <slot name="moon"></slot>
          <!-- Moon Halo -->
          <div class="absolute inset-0 rounded-full animate-halo-pulse-1 pointer-events-none mix-blend-screen"></div>
        </div>

        <!-- Secondary Planet (Orbiting/Positioned away) -->
        <div class="absolute -right-32 -bottom-12 w-12 h-12 rounded-full bg-[#111] border border-gray-600 overflow-hidden shadow-[inset_-4px_-4px_10px_rgba(0,0,0,0.8)] animate-float-slow">
          <!-- Craters -->
          <div class="absolute top-2 left-3 w-2 h-2 bg-black/40 rounded-full"></div>
          <div class="absolute bottom-3 right-4 w-3 h-3 bg-black/30 rounded-full"></div>
          
          <!-- Planet Halo -->
          <div class="absolute inset-0 rounded-full animate-halo-pulse-2 pointer-events-none mix-blend-screen"></div>
        </div>
      </div>
    </div>

    <!-- City (Parallax Layer 2 - Mid) -->
    <canvas ref="canvasRef" class="absolute inset-0 opacity-100"></canvas>

    <!-- Ruins (Parallax Layer 3 - Foreground) -->
    <canvas ref="ruinsCanvasRef" class="absolute inset-0"></canvas>
    
    <!-- Vignette -->
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,black_100%)] pointer-events-none"></div>
  </div>
</template>

<style scoped>
.parallax-scene {
    /* Ensure it stays behind content */
    z-index: 0;
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-float-slow {
  animation: float-slow 6s ease-in-out infinite;
}

@keyframes halo-pulse-1 {
  0%, 100% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.1); }
  50% { box-shadow: 0 0 60px rgba(255, 255, 255, 0.3), 20px 0 80px rgba(255, 255, 255, 0.1); }
}

@keyframes halo-pulse-2 {
  0%, 100% { box-shadow: 0 0 15px rgba(200, 220, 255, 0.1); }
  50% { box-shadow: 0 0 50px rgba(200, 220, 255, 0.3), -20px 0 60px rgba(200, 220, 255, 0.1); }
}

.animate-halo-pulse-1 {
  animation: halo-pulse-1 8s ease-in-out infinite;
}

.animate-halo-pulse-2 {
  animation: halo-pulse-2 8s ease-in-out infinite 1s; /* Offset slightly */
}
</style>