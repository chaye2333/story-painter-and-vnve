<template>
  <span class="typewriter-text">
    {{ displayedText }}<span v-if="showCursor && isTyping" class="cursor">{{ cursorChar }}</span>
  </span>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  speed: {
    type: Number,
    default: 50 // ms per char
  },
  delay: {
    type: Number,
    default: 0 // ms before starting
  },
  cursorBlink: {
    type: Boolean,
    default: true
  },
  cursorChar: {
    type: String,
    default: '█'
  },
  autoStart: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['finished']);

const displayedText = ref('');
const showCursor = ref(true);
const isTyping = ref(true);

let timeoutId: number | null = null;
let blinkIntervalId: number | null = null;

const startTyping = () => {
  console.log('Typewriter starting for:', props.text.substring(0, 10) + '...');
  displayedText.value = '';
  isTyping.value = true;
  showCursor.value = true;
  
  if (timeoutId) clearTimeout(timeoutId);

  // Initial delay
  timeoutId = window.setTimeout(() => {
    let currentIndex = 0;
    
    const typeChar = () => {
      if (currentIndex < props.text.length) {
        displayedText.value += props.text.charAt(currentIndex);
        currentIndex++;
        
        // Randomize speed slightly for realism
        const randomSpeed = props.speed + (Math.random() * 20 - 10);
        timeoutId = window.setTimeout(typeChar, randomSpeed);
      } else {
        isTyping.value = false;
        emit('finished');
      }
    };
    
    typeChar();
  }, props.delay);
};

// Expose startTyping to parent
defineExpose({ startTyping });

onMounted(() => {
  if (props.autoStart) {
    startTyping();
  } else {
    displayedText.value = '';
    showCursor.value = false;
    isTyping.value = false;
  }

  // Blink cursor logic
  if (props.cursorBlink) {
    blinkIntervalId = window.setInterval(() => {
      if (isTyping.value) {
        showCursor.value = !showCursor.value;
      } else {
        showCursor.value = false; // Hide cursor when done
      }
    }, 500);
  }
});

onUnmounted(() => {
  if (timeoutId) clearTimeout(timeoutId);
  if (blinkIntervalId) clearInterval(blinkIntervalId);
});
</script>

<style scoped>
.cursor {
  display: inline-block;
  width: 0.5em;
  background-color: transparent;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
