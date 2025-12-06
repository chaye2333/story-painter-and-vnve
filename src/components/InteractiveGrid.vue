<template>
  <canvas ref="canvasRef" class="interactive-grid"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useMouse, useWindowSize, useDevicePixelRatio } from '@vueuse/core';

const canvasRef = ref<HTMLCanvasElement | null>(null);
const { x, y } = useMouse({ type: 'client' });
const { width, height } = useWindowSize();
const { pixelRatio } = useDevicePixelRatio();

const GRID_SIZE = 40; // Match .retro-grid background-size
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
  canvas.style.width = `${width.value}px`;
  canvas.style.height = `${height.value}px`;
  
  const ctx = canvas.getContext('2d');
  if (ctx) ctx.scale(pixelRatio.value, pixelRatio.value);
};

onMounted(() => {
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
.interactive-grid {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 1;
}
</style>
