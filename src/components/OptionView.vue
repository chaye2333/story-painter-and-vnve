<script setup lang="ts">
import { NSwitch, NGrid, NGridItem } from 'naive-ui';
import { useStore } from '~/store';
import { audioManager } from '~/utils/audio';

const option_store = useStore().exportOptions

const playHover = () => {
  audioManager.playHover()
}

const playClick = () => {
  audioManager.playClick()
}

interface Option {
  label: string
  desc: string
  key: keyof typeof option_store
}

const list: Option[] = [
  {
    label: "指令过滤 // CMD_FILTER",
    desc: "开启后，不显示PC指令，正常显示指令结果",
    key: 'commandHide',
  },
  {
    label: "图像过滤 // IMG_FILTER",
    desc: "开启后，文本内所有的表情包和图片将被隐藏",
    key: 'imageHide',
  },
  {
    label: "场外过滤 // OFF_TOPIC",
    desc: "开启后，所有以 ( 或 （ 开头的发言将被隐藏",
    key: 'offTopicHide',
  },
  {
    label: "时间过滤 // TIME_FILTER",
    desc: "开启后，隐藏所有日期和时间显示",
    key: 'timeHide',
  },
  {
    label: "账号隐藏 // ID_HIDE",
    desc: "开启后，隐藏IM平台账号（如QQ号）",
    key: 'userIdHide',
  },
  {
    label: "日期简略 // DATE_SHORT",
    desc: "开启后，仅显示时间，隐藏年月日",
    key: 'yearHide',
  },
  {
    label: "缩进对齐 // INDENT_ALIGN",
    desc: "开启后，文本缩进将以名字为基准对齐",
    key: 'textIndentAll',
  },
]
</script>

<template>
  <div class="border border-white p-4 mb-8 relative overflow-hidden group">
    <!-- Decorative corner scanline -->
    <div class="absolute top-0 right-0 w-8 h-8 border-t border-r border-white opacity-50"></div>
    
    <h3 class="text-lg font-bold mb-4 uppercase border-b border-white border-dashed inline-block pr-8">
      系统参数 // SYSTEM PARAMETERS
    </h3>
    <div class="flex flex-col gap-4">
      <div v-for="opt in list" :key="opt.key" 
           class="flex items-start gap-4 p-2 border border-white/20 hover:border-white transition-all hover:bg-white/5 cursor-pointer group/item"
           @mouseenter="playHover"
           @click="() => { option_store[opt.key] = !option_store[opt.key]; playClick() }">
        <n-switch :value="option_store[opt.key]" size="small" @click.stop="() => { option_store[opt.key] = !option_store[opt.key]; playClick() }" />
        <div>
          <div class="font-bold text-sm mb-1 group-hover/item:text-white transition-colors">{{ opt.label }}</div>
          <div class="text-xs opacity-70">{{ opt.desc }}</div>
        </div>
      </div>
    </div>
  </div>
</template>