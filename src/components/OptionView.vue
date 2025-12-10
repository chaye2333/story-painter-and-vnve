<script setup lang="ts">
import { useStore } from '~/store';
import { NCheckbox, NSpace } from 'naive-ui';

const option_store = useStore().exportOptions

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
</script>

<template>
  <div class="rounded-lg border border-border bg-card text-card-foreground shadow-sm">
    <div class="flex flex-col space-y-1.5 p-6 pb-4">
      <h3 class="text-2xl font-semibold leading-none tracking-tight">
        系统参数
      </h3>
    </div>
    <div class="p-6 pt-0">
      <div class="flex flex-col gap-3">
        <div v-for="opt in list" :key="opt.key" class="flex items-center justify-between p-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground">
          <div class="flex flex-col">
            <span class="font-medium text-sm">{{ opt.label }}</span>
            <span class="text-xs text-muted-foreground">{{ opt.desc }}</span>
          </div>
          <n-checkbox v-model:checked="option_store[opt.key]" size="medium" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Minimalist styles handled by Tailwind classes */
</style>
