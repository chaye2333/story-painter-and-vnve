<template>
  <div 
    class="custom-cursor" 
    :class="{ 'is-hovering': isHovering, 'is-clicking': isClicking, 'hidden': isMobile }"
    :style="{ left: `${x}px`, top: `${y}px` }"
  >
    <div class="cursor-dot"></div>
    <div class="cursor-ring"></div>
    <div class="cursor-crosshair"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useMouse, useEventListener, useBreakpoints, breakpointsTailwind } from '@vueuse/core'

const { x, y } = useMouse({ type: 'client' })
const isHovering = ref(false)
const isClicking = ref(false)

const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('sm')

// Update hover state based on target element
const updateHoverState = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  const computedStyle = window.getComputedStyle(target)
  if (
    target.tagName === 'BUTTON' || 
    target.tagName === 'A' || 
    target.tagName === 'INPUT' || 
    target.closest('button') || 
    target.closest('a') || 
    target.closest('.cursor-pointer') ||
    computedStyle.cursor === 'pointer'
  ) {
    isHovering.value = true
  } else {
    isHovering.value = false
  }
}

// Add event listeners
onMounted(() => {
  useEventListener(window, 'mouseover', updateHoverState)
  useEventListener(window, 'mousedown', () => isClicking.value = true)
  useEventListener(window, 'mouseup', () => isClicking.value = false)
})
</script>

<style lang="scss" scoped>
.custom-cursor {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s ease;
  mix-blend-mode: difference;

  &.hidden {
    opacity: 0;
  }
}

.cursor-dot {
  width: 4px;
  height: 4px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.cursor-ring {
  width: 32px;
  height: 32px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.15s ease-out;
}

.cursor-crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  transform: translate(-50%, -50%);
  
  &::before, &::after {
    content: '';
    position: absolute;
    background: rgba(255, 255, 255, 0.3);
    transition: all 0.2s ease;
  }

  &::before {
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    transform: scaleX(0);
  }

  &::after {
    left: 50%;
    top: 0;
    height: 100%;
    width: 1px;
    transform: scaleY(0);
  }
}

.is-hovering {
  .cursor-ring {
    width: 48px;
    height: 48px;
    background-color: rgba(255, 255, 255, 0.1);
    border-color: white;
  }
  
  .cursor-crosshair::before {
    transform: scaleX(1);
  }
  
  .cursor-crosshair::after {
    transform: scaleY(1);
  }
}

.is-clicking {
  .cursor-ring {
    width: 16px;
    height: 16px;
    background-color: rgba(255, 255, 255, 0.8);
  }
}
</style>
