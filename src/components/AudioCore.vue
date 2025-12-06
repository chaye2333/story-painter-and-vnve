<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { audioManager } from '~/utils/audio';
import RetroButton from './RetroButton.vue';

const props = defineProps<{
  isBgmOn: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggle'): void;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let animationFrameId: number | null = null;
const sampleCount = 128; // More detail for line chart

const playHover = () => audioManager.playHover();
const playClick = () => audioManager.playClick();

const toggle = () => {
  playClick();
  emit('toggle');
};

const updateWaveform = () => {
  if (!audioManager.analyser || !canvasRef.value) {
    animationFrameId = requestAnimationFrame(updateWaveform);
    return;
  }

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

  // Draw tape reels background (faint)
  const time = Date.now() / 1000;
  const rotation = props.isBgmOn ? time : 0;
  
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
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


  // Draw Waveform
  const bufferLength = audioManager.analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  audioManager.analyser.getByteTimeDomainData(dataArray); // Use TimeDomain for waveform line

  ctx.beginPath();
  ctx.lineWidth = 2 * dpr;
  ctx.strokeStyle = props.isBgmOn ? '#fff' : '#444';

  const sliceWidth = width * 1.0 / bufferLength;
  let x = 0;
  
  const points: {x: number, y: number}[] = [];

  for (let i = 0; i < bufferLength; i++) {
    const v = dataArray[i] / 128.0;
    // Increase amplitude: (v - 1) is deviation from center. Multiply by scale factor (e.g. 3)
    const amplitude = 10.0; 
    const y = ((v - 1) * amplitude + 1) * height / 2;
    
    // Clamp y to be within canvas somewhat, or let it clip
    points.push({ x, y });
    x += sliceWidth;
  }

  // Smooth curve drawing
  if (points.length > 0) {
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const midX = (p0.x + p1.x) / 2;
      const midY = (p0.y + p1.y) / 2;
      ctx.quadraticCurveTo(p0.x, p0.y, midX, midY);
    }
    
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
  }

  ctx.stroke();

  animationFrameId = requestAnimationFrame(updateWaveform);
};

onMounted(() => {
  updateWaveform();
});

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<template>
  <div class="audio-core-container border border-[#333] bg-[#0a0a0a] p-3 flex flex-col gap-3 relative overflow-hidden group">
    <!-- Header -->
    <div class="flex justify-between items-center border-b border-[#333] pb-2">
      <div class="text-xs font-bold text-[#666] tracking-widest uppercase">
        AUDIO_CORE // {{ isBgmOn ? 'ONLINE' : 'OFFLINE' }}
      </div>
      <div class="status-light w-3 h-3 rounded-full transition-all duration-300"
           :class="isBgmOn ? 'bg-green-400 shadow-[0_0_15px_rgba(74,222,128,1),0_0_30px_rgba(74,222,128,0.6)]' : 'bg-[#333]'">
      </div>
    </div>

    <!-- Waveform Display -->
    <div class="waveform-area relative h-32 bg-[#050505] border border-[#222] overflow-hidden">
      <!-- Grid Overlay -->
      <div class="absolute inset-0 pointer-events-none z-10 grid-overlay"></div>
      
      <canvas ref="canvasRef" class="w-full h-full relative z-20 opacity-80"></canvas>
    </div>

    <!-- Control Button -->
    <retro-button 
      class="w-full"
      @click="toggle"
    >
      {{ isBgmOn ? 'TERMINATE_SIGNAL' : 'INITIALIZE_SIGNAL' }}
    </retro-button>
  </div>
</template>

<style scoped>
.grid-overlay {
  background-size: 20px 20px;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
}
</style>
