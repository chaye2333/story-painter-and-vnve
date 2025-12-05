<script setup lang="ts">
import { ref } from 'vue';
import { audioManager } from '~/utils/audio';

const props = defineProps<{
  active?: boolean;
  disabled?: boolean;
}>();

const isClicking = ref(false);

const playHover = () => {
  if (!props.disabled) audioManager.playHover();
};

const playClick = () => {
  if (!props.disabled) {
    audioManager.playClick();
    isClicking.value = true;
    setTimeout(() => {
      isClicking.value = false;
    }, 200);
  }
};
</script>

<template>
  <button 
    class="retro-btn relative group overflow-hidden bg-[#0a0a0a] text-[#e0e0e0] transition-all duration-200 ease-out px-5 py-3 min-w-[120px]"
    :class="{ 
      'active': active, 
      'clicking': isClicking,
      'disabled': disabled
    }"
    :disabled="disabled"
    @mouseenter="playHover"
    @click="playClick"
  >
    <!-- Background Grid Pattern -->
    <div class="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:4px_4px]"></div>

    <!-- Borders -->
    <div class="absolute inset-0 border border-[#444] transition-colors duration-300 group-hover:border-[#888] group-hover:shadow-[0_0_8px_rgba(255,255,255,0.2)]"></div>
    
    <!-- Corner Brackets -->
    <div class="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#666] transition-all duration-300 group-hover:w-3 group-hover:h-3 group-hover:border-white"></div>
    <div class="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#666] transition-all duration-300 group-hover:w-3 group-hover:h-3 group-hover:border-white"></div>
    <div class="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#666] transition-all duration-300 group-hover:w-3 group-hover:h-3 group-hover:border-white"></div>
    <div class="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#666] transition-all duration-300 group-hover:w-3 group-hover:h-3 group-hover:border-white"></div>

    <!-- Content -->
    <div class="btn-content relative z-10 flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase group-hover:text-white transition-colors">
      <slot></slot>
    </div>

    <!-- Hover Scanline -->
    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-scan-fast pointer-events-none"></div>
    
    <!-- Click Flash -->
    <div v-if="isClicking" class="absolute inset-0 bg-white mix-blend-overlay animate-flash pointer-events-none"></div>
  </button>
</template>

<style scoped>
.retro-btn {
  /* Base styles handled by Tailwind classes */
}

.retro-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(100%);
}

.retro-btn.active {
  background: #e0e0e0;
  color: #000;
}

.retro-btn.active .absolute.border {
  border-color: #fff;
}

.retro-btn.active .btn-content {
  color: #000;
}

.retro-btn.active .corner-bracket {
  border-color: #000;
}

@keyframes scan-fast {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes flash {
  0% { opacity: 1; }
  100% { opacity: 0; }
}

.animate-scan-fast {
  animation: scan-fast 0.6s linear infinite;
}

.animate-flash {
  animation: flash 0.2s ease-out forwards;
}
</style>
