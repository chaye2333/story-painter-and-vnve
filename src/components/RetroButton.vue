<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  active?: boolean;
  disabled?: boolean;
  icon?: boolean;
  noBorder?: boolean;
  noGrid?: boolean;
}>();

const emit = defineEmits(['click']);

const playClick = (e: MouseEvent) => {
  if (!props.disabled) {
    emit('click', e);
  }
};
</script>

<template>
  <button 
    class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
    :class="[
      icon ? 'h-9 w-9 p-0' : '',
      active ? 'bg-accent text-accent-foreground' : '',
      noBorder ? 'border-0' : ''
    ]"
    :disabled="disabled"
    @click="playClick"
  >
    <slot></slot>
  </button>
</template>
