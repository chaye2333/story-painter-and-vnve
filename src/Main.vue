<template>
  <n-layout class="min-h-screen relative overflow-hidden bg-black">
    <div id="top-anchor" class="absolute top-0 left-0 w-full h-1 pointer-events-none"></div>
    <!-- Parallax Background Scene -->
    <parallax-scene @openIntro="showIntro = true">
      <template #moon>
        <div class="black-moon">
          <div class="moon-crater c1"></div>
          <div class="moon-crater c2"></div>
          <div class="moon-crater c3"></div>
        </div>
      </template>
    </parallax-scene>
    
    <interactive-grid class="opacity-30" />
    
    <!-- Retro Header -->
    <header class="mb-8 relative z-10 pt-6 px-4 md:px-8 pointer-events-none">
      <!-- Top decorative line (Optional, kept minimal) -->
      <div class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

      <div class="relative flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pointer-events-none">
        
        <!-- Left: Title Section -->
        <div class="flex flex-col gap-1 relative pointer-events-auto">
          <!-- Decorative Corner for Title Area -->
          <div class="absolute -left-4 -top-4 w-8 h-8 border-t border-l border-white/30 hidden md:block"></div>

          <!-- Small decorative label -->
          <div class="flex items-center gap-2 text-[10px] md:text-xs text-gray-400 font-mono tracking-[0.2em] opacity-70 mb-1 pl-1">
             <span class="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
             <span>SYSTEM_ONLINE</span>
             <span class="hidden md:inline">::</span>
             <span class="hidden md:inline">V2.5.4</span>
          </div>

          <!-- Main Title -->
          <h1 class="relative text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none select-none cursor-pointer glitch-hover mix-blend-screen animate-glitch-enter" data-text="Story Painter" @click="reloadPage">
            <!-- Core text -->
            <span class="relative z-10 text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-100 to-gray-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] block md:inline">Story</span>
            <span class="relative z-10 text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-100 to-gray-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] block md:inline">Painter</span>
            
            <!-- Decorative elements around title -->
            <div class="absolute -left-6 top-0 h-full w-1 bg-white/10 hidden md:block"></div>
          </h1>
          
          <!-- Subtitle / Description -->
          <div class="flex items-center gap-3 mt-3 text-xs md:text-sm font-mono text-gray-300 tracking-widest uppercase pl-1">
            <span class="bg-white/10 border border-white/20 px-1 text-[10px]">LOG_PROC</span>
            <span class="opacity-70 text-[10px] md:text-xs">日志处理器 // READY</span>
            <!-- Decorative line extending right -->
            <div class="h-[1px] w-12 bg-white/30"></div>
          </div>
        </div>

        <!-- Right: Controls & Status (Simplified Background) -->
        <div class="flex flex-col items-end gap-2 w-full md:w-auto pointer-events-auto">
          <!-- Decorative metrics (Moved to be very subtle and right-aligned) -->
          <div class="hidden md:flex gap-4 text-[10px] font-mono text-gray-500/60 tracking-wider">
            <span>CPU: <span class="text-gray-400">NORMAL</span></span>
            <span>NET: <span class="text-gray-400">CONNECTED</span></span>
          </div>

          <!-- Button Group (Transparent background) -->
          <div class="flex items-center gap-4">
            <retro-button icon @click="toggleBgm" no-border no-grid class="hover:text-green-400 transition-colors opacity-80 hover:opacity-100">
              <n-icon size="20">
                <VolumeUpFilled v-if="isBgmOn" />
                <VolumeMuteFilled v-else />
              </n-icon>
            </retro-button>
            
            <retro-button icon @click="openGithub" no-border no-grid class="hover:text-blue-400 transition-colors opacity-80 hover:opacity-100">
              <n-icon size="20">
                <logo-github />
              </n-icon>
            </retro-button>

            <retro-button @click="backV1" class="!px-2 !py-1 !text-[10px] !h-auto tracking-widest opacity-80 hover:opacity-100" no-border>
              官网
            </retro-button>
          </div>
        </div>
      </div>
      
      <!-- Bottom Divider (Gradient to be less intrusive) -->
      <div class="w-full h-[1px] bg-gradient-to-r from-white/50 via-white/10 to-transparent mt-6"></div>
    </header>

    <n-layout-content class="px-4 pb-12 bg-transparent relative z-10 pointer-events-none">
      <div class="max-w-[1200px] mx-auto border border-white p-1 relative bg-black/90 backdrop-blur-sm animate-scanline-sweep pointer-events-auto">
        <!-- Decorative corners -->
        <div class="absolute -top-1 -left-1 w-2 h-2 bg-white"></div>
        <div class="absolute -top-1 -right-1 w-2 h-2 bg-white"></div>
        <div class="absolute -bottom-1 -left-1 w-2 h-2 bg-white"></div>
        <div class="absolute -bottom-1 -right-1 w-2 h-2 bg-white"></div>

        <div class="border border-white p-6 animate-pulse-glow">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-white pb-2 gap-2">
            <h2 class="text-sm md:text-xl font-bold uppercase animate-typing inline-block align-middle break-all">>> 处理单元 // PROCESSING UNIT</h2>
            <n-text class="text-xs self-end md:self-auto">SealDice Group: 524364253</n-text>
          </div>

          <div class="flex flex-col lg:flex-row gap-6 items-start">
            <!-- Left Sidebar: Options -->
            <div class="w-full lg:w-1/4 min-w-[280px] flex flex-col gap-6 animate-slide-in-left">
              <option-view></option-view>
              
              <!-- Audio Core (Tape + Waveform) -->
              <audio-core :is-bgm-on="isBgmOn" @toggle="toggleBgm" />
            </div>

            <!-- Right Content: Config & Editor -->
            <div class="w-full lg:flex-1 min-w-0 animate-fade-in-up" style="animation-delay: 0.2s;">
              <n-spin :show="loading">
                <template #description>
                  LOADING_REMOTE_DATA...
                </template>
            
                <!-- PC List / Character Configuration -->
            <div class="mb-8">
              <h3 class="text-lg font-bold mb-4 uppercase border-b border-white border-dashed inline-block pr-8">
                实体配置 // ENTITY CONFIG
              </h3>
              <div class="pc-list space-y-2 animate-stagger">
                <div v-for="(i, index) in store.pcList" :key="index" class="flex flex-wrap items-center gap-2 p-2 border border-white/20 hover:border-white transition-colors" @mouseenter="playHover">
                   <retro-button class="px-2" @click="deletePc(index, i)"
                    :disabled="isShowPreview || isShowPreviewBBS || isShowPreviewBBSPineapple || isShowPreviewTRG">
                      <n-icon><icon-delete /></n-icon>
                  </retro-button>

                  <n-input :disabled="isShowPreview || isShowPreviewBBS || isShowPreviewBBSPineapple || isShowPreviewTRG"
                    v-model:value="i.name" class="w-40" placeholder="名字 // NAME" @focus="() => { nameFocus(i); playClick() }"
                    @change="nameChanged(i)" />

                  <n-input :disabled="true" v-model:value="i.IMUserId" class="w-64" placeholder="ID" />

                  <n-select v-model:value="i.role" class="w-32"
                    :options="[{ value: '主持人', label: 'KP/HOST' }, { value: '角色', label: 'PL/ACTOR' }, { value: '骰子', label: 'DICE' }, { value: '隐藏', label: 'HIDDEN' }]" 
                    @update:value="playClick"/>

                  <n-color-picker v-model:value="i.color" :show-alpha="false" show-preview :swatches="colors"
                    :on-update:value="(v) => { colorChanged(v, i); playClick() }" class="w-32" />
                </div>
              </div>
            </div>

            <!-- Control Panel -->
            <div class="mb-8 border-t border-b border-white py-4">
              <div class="flex flex-wrap justify-between items-center gap-4">
                <div class="flex gap-2 flex-wrap">
                   <retro-button @click="exportRecordRaw">原始文件 // RAW</retro-button>
                   <retro-button @click="exportRecordDOC">带图WORD // DOC_IMG</retro-button>
                   <retro-button @click="exportRecordTalkDOC">对话WORD // DOC_TALK</retro-button>
                   <retro-button @click="exportRecordDocx">标准DOCX // DOCX</retro-button>
                </div>
                
                <div class="flex gap-4 items-center flex-wrap">
                  <div class="flex gap-2">
                    <n-checkbox label="预览 // PREVIEW" v-model:checked="isShowPreview" @click="() => { previewClick('preview'); playClick() }" />
                    <n-checkbox label="论坛代码 // BBS" v-model:checked="isShowPreviewBBS" @click="() => { previewClick('bbs'); playClick() }" />
                    <n-checkbox label="多行代码 // MULTI" v-model:checked="isShowPreviewBBSPineapple" @click="() => { previewClick('bbspineapple'); playClick() }" />
                    <n-checkbox label="回声工坊 // TRG" v-model:checked="isShowPreviewTRG" @click="() => { previewClick('trg'); playClick() }" />
                  </div>
                  <n-divider vertical />
                  <retro-button @click="refreshColors">刷新色板 // REFRESH</retro-button>
                </div>
              </div>
            </div>

            <!-- Editor Area -->
            <div class="relative" v-show="!(isShowPreview || isShowPreviewBBS || isShowPreviewBBSPineapple || isShowPreviewTRG)">
              <div :class="isMobile ? 'flex justify-end gap-2 p-2 bg-black border-b border-white' : 'absolute right-0 top-0 z-10 flex gap-2 p-2 bg-black border-b border-l border-white'">
                 <retro-button @click="clearText" :class="{ '!min-w-0 !px-3': isMobile }">{{ isMobile ? '清空' : '清空 // CLEAR' }}</retro-button>
                 <retro-button @click="doFlush" :class="{ '!min-w-0 !px-3': isMobile }">{{ isMobile ? '刷新' : '刷新 // FLUSH' }}</retro-button>
                 <div class="flex items-center">
                   <n-checkbox :label="isMobile ? '染色' : '染色 // HIGHLIGHT'" v-model:checked="store.doEditorHighlight" size="small" @click="playClick" />
                 </div>
              </div>
              <code-mirror ref="editor" class="border border-white min-h-[500px]" @change="onChange"></code-mirror>
            </div>

            <!-- Previews -->
            <n-message-provider>
              <preview-main :is-show="isShowPreview" :preview-items="previewItems"></preview-main>
              <preview-bbs :is-show="isShowPreviewBBS" :preview-items="previewItems"></preview-bbs>
              <preview-bbs-pineapple :is-show="isShowPreviewBBSPineapple" :preview-items="previewItems"></preview-bbs-pineapple>
              <preview-trg :is-show="isShowPreviewTRG" :preview-items="previewItems"></preview-trg>
            </n-message-provider>

          </n-spin>
            </div>
          </div>
        </div>
      </div>

      <footer class="max-w-[1200px] mx-auto border-t border-white/20 p-6 mt-8 bg-black/80 backdrop-blur-sm text-xs text-[#666] relative z-10 pointer-events-auto">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex flex-col gap-2 items-center md:items-start">
             <div>QQ反馈群: 241639081</div>
             <div class="opacity-70">被拖入抽象宇宙被世人忘却的月亮，现在你重新看到了它</div>
          </div>
          
          <div class="flex flex-col gap-2 items-center md:items-end">
             <button @click="scrollToTop" class="hover:text-white transition-colors uppercase tracking-widest cursor-pointer">
               [ ▲ RETURN_TO_TOP ]
             </button>
             <div class="font-mono">{{ currentTime }}</div>
          </div>
        </div>
      </footer>
    </n-layout-content>
    
    <download-modal 
      :visible="downloadModalVisible" 
      :progress="downloadModalProgress" 
      :status="downloadModalStatus" 
    />

    <intro-view v-if="showIntro" @close="showIntro = false" />
  </n-layout>
</template>

<script setup lang="ts">
import { nextTick, ref, onMounted, onUnmounted, watch, h, render, renderList, computed } from "vue";
import { useStore } from './store'
import CodeMirror from './components/CodeMirror.vue'
import RetroButton from './components/RetroButton.vue'
import AudioCore from './components/AudioCore.vue'
import { debounce, delay } from 'lodash-es'
import { exportFileRaw, exportFileQQ, exportFileIRC, exportFileDoc, exportFileDocx } from "./utils/exporter";
import type { DocxExportEntry } from "./utils/exporter";
import { strFromU8, unzlibSync } from 'fflate';
import uaParser from 'ua-parser-js'

import { logMan } from './logManager/logManager'
import { ViewUpdate } from "@codemirror/view";
import { TextInfo } from "./logManager/importers/_logImpoter";
import previewMain from "./components/previews/preview-main.vue";
import previewBbs from "./components/previews/preview-bbs.vue";
import previewBbsPineapple from "./components/previews/preview-bbs-pineapple.vue";
import previewTrg from "./components/previews/preview-trg.vue";
import PreviewItem from './components/previews/preview-main-item.vue'
import PreviewTableTR from './components/previews/preview-table-tr.vue'
import { LogItem, CharItem, packNameId } from "./logManager/types";
import { setCharInfo } from './logManager/importers/_logImpoter'
import { msgCommandFormat, msgImageFormat, msgIMUseridFormat, msgOffTopicFormat, msgAtFormat } from "./utils";
import { NButton, NText, useMessage, useModal, useNotification } from "naive-ui";
import { User, LogoGithub, Delete as IconDelete, VolumeUpFilled, VolumeMuteFilled } from '@vicons/carbon'
import { breakpointsTailwind, useBreakpoints, useDark, useToggle } from '@vueuse/core'
import OptionView from "./components/OptionView.vue";
import randomColor from "randomcolor";

import { parquetReadObjects } from 'hyparquet'
import { asyncBufferFrom } from 'hyperparam'
import { compressors } from 'hyparquet-compressors'
import { audioManager } from "./utils/audio";
import InteractiveGrid from "./components/InteractiveGrid.vue";
import ParallaxScene from "./components/ParallaxScene.vue";
import DownloadModal from "./components/DownloadModal.vue";
import IntroView from "./components/IntroView.vue";


const breakpoints = useBreakpoints(breakpointsTailwind)
const notMobile = breakpoints.greater('sm')

const isDark = useDark()
const toggleDark = useToggle(isDark)

// 不用他了 虽然很不错，但是没有屏幕取色
// import { ColorPicker } from 'vue-color-kit'
// import 'vue-color-kit/dist/vue-color-kit.css'

const message = useMessage()
const modal = useModal()
const notification = useNotification()

const loading = ref<boolean>(false)
const isBgmOn = ref(false)
const showIntro = ref(false)

const currentTime = ref('')
let timeInterval: number | null = null

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString()
}

const scrollToTop = () => {
  const el = document.getElementById('top-anchor')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

onMounted(() => {
  updateTime()
  timeInterval = window.setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
})


const playHover = () => {
  audioManager.playHover()
}

const playClick = () => {
  audioManager.playClick()
}

const toggleBgm = () => {
  playClick()
  isBgmOn.value = audioManager.toggleBgm()
}

const isMobile = breakpoints.smaller('lg')
const downloadUsableRank = ref(0)

const isShowPreview = ref(false)
const isShowPreviewBBS = ref(false)
const isShowPreviewBBSPineapple = ref(false)
const isShowPreviewTRG = ref(false)

const colors = ref<string[]>([])
const refreshColors = () => {
  colors.value = randomColor({ count: 16, luminosity: 'light' })
  message.success("COLORS_REFRESHED", { duration: 800 })
}

const colorChanged = debounce((v: string, i: CharItem) => {
  i.color = v
  store.pcNameColorMap.set(i.name, v)
  store.colorMapSave();
}, 300)

const backV1 = () => {
  // location.href = location.origin + '/v1/' + location.search + location.hash;
  location.href = 'https://dice.weizaima.com';
}

const openGithub = () => {
  window.open('https://github.com/sealdice/story-painter', '_blank');
}

// 清空文本
const clearText = () => {
  store.editor.dispatch({
    changes: { from: 0, to: store.editor.state.doc.length, insert: '' }
  })
}

const doFlush = () => {
  console.log('flush')
  logMan.flush();
}

const previewClick = (mode: 'preview' | 'bbs' | 'bbspineapple' | 'trg') => {
  switch (mode) {
    case 'preview':
      isShowPreviewBBS.value = false
      isShowPreviewBBSPineapple.value = false
      isShowPreviewTRG.value = false
      break;
    case 'bbs':
      isShowPreview.value = false
      isShowPreviewBBSPineapple.value = false
      isShowPreviewTRG.value = false
      store.exportOptions.imageHide = true
      break;
    case 'bbspineapple':
      isShowPreview.value = false
      isShowPreviewBBS.value = false
      isShowPreviewTRG.value = false
      store.exportOptions.imageHide = true
      break;
    case 'trg':
      isShowPreview.value = false
      isShowPreviewBBS.value = false
      isShowPreviewBBSPineapple.value = false
      store.exportOptions.imageHide = true
      break;
  }
  showPreview();
}

const reloadPage = () => {
  // Clear query parameters to return to "Home" state, effectively resetting the app
  window.location.href = window.location.pathname;
}

function setupUA() {
  const parser = new uaParser.UAParser()
  parser.setUA(navigator.userAgent)
  const deviceType = parser.getDevice()

  const browser = parser.getBrowser().name
  downloadUsableRank.value = 1

  isMobile.value = deviceType.type === 'mobile'
  if (deviceType.type === 'mobile') {
    // 经测可以使用的
    switch (browser) {
      // case '360 Browser': // 手机360 但是手机360无特征，自己是Chrome WebView
      // 手机:X浏览器 Chrome WebView无特征
      case 'Edge':
      case 'Chrome':
      case 'Chromium':
      case 'Firefox':
      case 'MIUI Browser':
      case 'Opera':
        downloadUsableRank.value = 2
    }

    // 经测无法使用的
    switch (browser) {
      case 'baiduboxapp': // 手机:百度浏览器
      case 'QQBrowser': // 手机:搜狗浏览器极速版，手机:QQ浏览器
      // 手机:万能浏览器，Chrome WebView无特征，会直接崩溃
      case 'UCBrowser': // 手机:UC浏览器
      case 'Quark': // 手机:夸克
      // 手机:Via浏览器，Chrome WebView无特征，会直接崩溃
      case 'QQ': // 手机:QQ
      case 'WeChat':
        downloadUsableRank.value = 0
    }
  }
}

setupUA()

const browserAlert = () => {
  if (downloadUsableRank.value === 0) {
    message.warning('你目前所使用的浏览器无法下载文件，请更换对标准支持较好的浏览器。建议使用Chrome/Firefox/Edge')
  }
  if (downloadUsableRank.value === 1) {
    if (isMobile.value) {
      message.warning('你目前所使用的浏览器可能在下载文件时遇到乱码，或无法下载文件，最好更换对标准支持较好的浏览器。建议使用Chrome/Firefox/Edge')
    }
  }
  // 2 不做提示 因为兼容良好
}

onMounted(async () => {
  isBgmOn.value = audioManager.isPlaying;
  audioManager.subscribe((playing) => {
    isBgmOn.value = playing;
  });
  
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop as any)
  })
  const key = (params as any).key
  const password = location.hash.slice(1)

  const showHl = () => {
    setTimeout(() => {
      if (!isMobile.value) {
        store.doEditorHighlight = true
        store.reloadEditor()
      }
    }, 1000)
  }

  if (key && password) {
    loading.value = true
    try {
      const record = await store.tryFetchLog(key, password) as {
        client: 'SealDice' | 'Parquet',
        created_at: string,
        data: string,
        name: string,
        note: string,
        updated_at: string,
      }

      switch (record.client) {
        case 'Parquet': {
          const uint8 = Uint8Array.from(atob(record.data), c => c.charCodeAt(0))
          const asyncBuffer = await asyncBufferFrom({ file: new File([uint8], 'default'), byteLength: uint8.byteLength })
          const res = await parquetReadObjects({
            file: asyncBuffer,
            compressors,
          })
          nextTick(() => {
            const text = JSON.stringify({
              items: res.map(v => {
                v.id = Number(v.id)
                v.time = Number(v.time)
                v.commandId = Number(v.commandId)
                return v
              }),
              version: 105
            })
            store.pcList.length = 0

            logMan.lastText = '';
            logMan.syncChange(text, [0, store.editor.state.doc.length], [0, text.length])
          });
        }
          break
        case 'SealDice':
        default:
          {
            const log = unzlibSync(Uint8Array.from(atob(record.data), c => c.charCodeAt(0)));

            nextTick(() => {
              const text = strFromU8(log)
              store.pcList.length = 0

              logMan.lastText = '';
              logMan.syncChange(text, [0, store.editor.state.doc.length], [0, text.length])

            });
          }
          break
      }


      loading.value = false
      showHl()
    } catch (e) {
      console.log(e)
      notification['error']({
        content: '错误',
        meta: '加载日志失败，可能是序号或密码不正确',
        duration: 5000
      })
      loading.value = false
      browserAlert()
      return true
    }
  } else {
    store.editor.dispatch({
      changes: { from: 0, to: store.editor.state.doc.length, insert: store.editor.state.doc.toString() }
    })
    showHl()
  }

  // cminstance.value = cmRefDom.value?.cminstance;
  // cminstance.value?.focus();
  // console.log(cminstance.value)
  colors.value = randomColor({ count: 16 })
  browserAlert()
  await nextTick(() => {
    setTimeout(() => {
      doFlush()
    }, 3000)
  })
});

const downloadModalVisible = ref(false);
const downloadModalProgress = ref(0);
const downloadModalStatus = ref('');

const startDownloadAnimation = (callback: () => void) => {
  downloadModalVisible.value = true;
  downloadModalProgress.value = 0;
  downloadModalStatus.value = 'INITIALIZING';
  
  let progress = 0;
  const interval = setInterval(() => {
    // Random increment for natural feel
    const increment = Math.random() * 15 + 5;
    progress += increment;
    
    if (progress > 100) progress = 100;
    downloadModalProgress.value = progress;
    
    if (progress < 30) {
      downloadModalStatus.value = 'GATHERING MOON DUST...';
    } else if (progress < 70) {
      downloadModalStatus.value = 'WEAVING MEMORIES...';
    } else if (progress < 95) {
      downloadModalStatus.value = 'RECORDING TO TAPE...';
    } else {
      downloadModalStatus.value = 'READY';
    }
    
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        callback();
        setTimeout(() => {
          downloadModalVisible.value = false;
        }, 500);
      }, 500);
    }
  }, 200);
};

function exportRecordRaw() {
  browserAlert()
  startDownloadAnimation(() => {
    exportFileRaw(store.editor.state.doc.toString())
  })
}

function exportRecordQQ() {
  browserAlert()
  showPreview()
  exportFileQQ(previewItems.value, store.exportOptions)
}

function exportRecordIRC() {
  browserAlert()
  showPreview()
  exportFileIRC(previewItems.value, store.exportOptions)
}

function exportRecordDOC() {
  browserAlert()
  if (isMobile.value) {
    message.warning('你当前处于移动端环境，已知只有WPS能够查看生成的Word文件，且无法看图！使用PC打开可以查看图片。')
  }

  startDownloadAnimation(() => {
    const solveImg = (el: Element) => {
      if (el.tagName === 'IMG') {
        let width = el.clientWidth;
        let height = el.clientHeight;
        if (width === 0) {
          width = 300;
          height = 300;
        }
        el.setAttribute('width', `${width}`)
        el.setAttribute('height', `${height}`)
      }
      for (let i = 0; i < el.children.length; i += 1) {
        solveImg(el.children[i])
      }
    }

    const el = document.createElement('span');
    const elRoot = document.createElement('div');
    const items = [];

    showPreview()
    for (let i of previewItems.value) {
      if (i.isRaw) continue;
      if (store.isHiddenLogItem(i)) continue;

      const html = h(PreviewItem, { source: i });
      render(html, el);

      const c = el;
      solveImg(c);
      items.push(c.innerHTML);
    }

    exportFileDoc(items.join('\n'));
  })
}

function exportRecordTalkDOC() {
  browserAlert()
  if (isMobile.value) {
    message.warning('你当前处于移动端环境，已知只有WPS能够查看生成的Word文件，且无法看图！使用PC打开可以查看图片。')
  }

  startDownloadAnimation(() => {
    const solveImg = (el: Element) => {
      if (el.tagName === 'IMG') {
        let width = el.clientWidth;
        let height = el.clientHeight;
        if (width === 0) {
          width = 300;
          height = 300;
        }
        el.setAttribute('width', `${width}`)
        el.setAttribute('height', `${height}`)
      }
      for (let i = 0; i < el.children.length; i += 1) {
        solveImg(el.children[i])
      }
    }

    const el = document.createElement('span');
    const elRoot = document.createElement('div');
    const items: string[] = [];

    showPreview()
    for (let i of previewItems.value) {
      if (i.isRaw) continue;
      if (store.isHiddenLogItem(i)) continue;

      const html = h(PreviewTableTR, { source: i });
      render(html, el);

      const c = el;
      solveImg(c);
      items.push(c.innerHTML);
    }
    exportFileDoc(`<table style="border-collapse: collapse;"><tbody>${items.join('\n')}</tbody></table>`);
  })
}

const readElementColor = (el: HTMLElement | null): string | undefined => {
  if (!el) return undefined;
  if (el.style && el.style.color) {
    return el.style.color;
  }
  const computed = window.getComputedStyle(el);
  return computed?.color || undefined;
};

const extractMessageLines = (el: HTMLElement | null): string[] => {
  if (!el) return [''];
  const clone = el.cloneNode(true) as HTMLElement;
  const doc = el.ownerDocument || document;

  clone.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src') || '';
    const placeholder = src ? `[图:${src}]` : '[图:无可用链接]';
    img.replaceWith(doc.createTextNode(placeholder));
  });

  const blockTags = new Set(['P', 'DIV', 'LI', 'UL', 'OL', 'BLOCKQUOTE']);
  const lines: string[] = [];
  let current = '';

  const pushLine = (forceEmpty = false) => {
    const normalized = current.replace(/\u00A0/g, ' ').replace(/\s+$/g, '');
    if (normalized || forceEmpty || lines.length === 0) {
      lines.push(normalized);
    }
    current = '';
  };

  const appendText = (text: string | null) => {
    if (!text) return;
    const normalized = text.replace(/\u00A0/g, ' ');
    const segments = normalized.split(/\r?\n/);
    segments.forEach((segment, index) => {
      current += segment;
      if (index < segments.length - 1) {
        pushLine();
      }
    });
  };

  const processNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      appendText(node.textContent);
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return;
    }

    const element = node as HTMLElement;

    if (element.tagName === 'BR') {
      pushLine(true);
      return;
    }

    if (blockTags.has(element.tagName)) {
      if (current) {
        pushLine();
      }

      if (element.tagName === 'LI') {
        const parent = element.parentElement;
        if (parent?.tagName === 'OL') {
          const siblings = Array.from(parent.children).filter((child) => child.tagName === 'LI');
          const index = siblings.indexOf(element);
          appendText(`${index + 1}. `);
        } else {
          appendText('• ');
        }
      }

      const before = lines.length;
      Array.from(element.childNodes).forEach(processNode);

      if (current) {
        pushLine();
      } else if (lines.length === before) {
        pushLine(true);
      }
      return;
    }

    Array.from(element.childNodes).forEach(processNode);
  };

  Array.from(clone.childNodes).forEach(processNode);

  if (current !== '' || lines.length === 0) {
    pushLine(lines.length === 0);
  }

  while (lines.length > 1 && lines[lines.length - 1].trim() === '') {
    lines.pop();
  }

  if (lines.length === 0) {
    lines.push('');
  }

  return lines;
};

function exportRecordDocx() {
  browserAlert()
  startDownloadAnimation(() => {
    showPreview()

    const entries: DocxExportEntry[] = []

    for (const item of previewItems.value) {
      if (item.isRaw) continue
      if (store.isHiddenLogItem(item)) continue

      const mountPoint = document.createElement('div')
      const vnode = h(PreviewItem, { source: item })
      render(vnode, mountPoint)

      const host = mountPoint.firstElementChild as HTMLElement | null
      if (!host) {
        render(null, mountPoint)
        continue
      }

      const timeEl = host.querySelector('._time') as HTMLElement | null
      const nicknameEl = host.querySelector('._nickname') as HTMLElement | null
      const messageEl = host.querySelector('._message') as HTMLElement | null

      const entry: DocxExportEntry = {
        time: (timeEl?.textContent ?? '').trim(),
        timeColor: readElementColor(timeEl),
        nickname: (nicknameEl?.textContent ?? '').trim(),
        nicknameColor: readElementColor(nicknameEl),
        messageLines: extractMessageLines(messageEl),
        messageColor: readElementColor(messageEl),
      }

      entries.push(entry)
      render(null, mountPoint)
    }

    if (!entries.length) {
      message.warning('没有可导出的内容')
      return
    }

    exportFileDocx(entries, '跑团记录.docx').catch((err) => {
      console.error(err)
      message.error('Docx 导出失败，请稍后重试')
    })
  })
}

const previewItems = ref<LogItem[]>([])

function showPreview() {
  const tmp: LogItem[] = [];
  let index = 0;
  const offTopicHide = store.exportOptions.offTopicHide;
  console.log('当前日志条目数量: ', logMan.curItems.length)

  for (let i of logMan.curItems) {
    if (i.isRaw) continue;
    if (store.isHiddenLogItem(i)) continue;

    // // 处理ot
    // if (offTopicHide && !i.isDice) {
    //   const msg = i.message.replaceAll(/^[(（].+?$/gm, '') // 【
    //   if (msg.trim() === '') continue;
    // }
    let msg = msgImageFormat(i.message, store.exportOptions);
    msg = msgAtFormat(msg, store.pcList);
    msg = msgOffTopicFormat(msg, store.exportOptions, i.isDice);
    msg = msgCommandFormat(msg, store.exportOptions);
    msg = msgIMUseridFormat(msg, store.exportOptions, i.isDice);
    msg = msgOffTopicFormat(msg, store.exportOptions, i.isDice); // 再过滤一次
    if (msg.trim() === '') continue;

    i.index = index;
    tmp.push(i);
    index += 1;
  }
  previewItems.value = tmp;
}

const store = useStore()
store.colorMapLoad();

// 修改ot选项后重建items
watch(() => store.exportOptions.offTopicHide, showPreview)
watch(
  () => store.pcList.map(pc => `${pc.IMUserId}-${pc.role}-${pc.name}`),
  () => showPreview(),
  { deep: false }
)

const editor = ref()
watch(isDark, () => {
  console.log('dark watch')
  store.reloadEditor()
})

const deletePc = (index: number, i: CharItem) => {
  const now = Date.now();
  if (now - lastNameChange < 100) return;
  lastNameChange = now;

  const m = modal.create({
    title: '删除角色',
    preset: 'card',
    style: {
      width: '30rem',
    },
    content: `即将删除角色「${i.name}」及其全部发言，确定吗？`,
    footer: () => [
      h(
        NButton,
        { type: 'default', onClick: () => m.destroy(), style: { marginRight: '1rem' } },
        () => '取消',
      ),
      h(
        NButton,
        {
          type: 'primary', onClick: () => {
            try {
              store.pcList.splice(index, 1);
              logMan.deleteByCharItem(i);
            } finally {
              m.destroy()
            }
          }
        },
        () => '确定'
      ),
    ]
  })
}

let lastPCName = ''

const nameFocus = (i: CharItem) => {
  lastPCName = i.name
}

let lastNameChange = 0;
const nameChanged = (i: CharItem) => {
  const now = Date.now();
  if (now - lastNameChange < 100) return;
  lastNameChange = now;

  const oldName = lastPCName; // 这样做的原因是，如果按回车确认，那么 nameFocus 会在promise触发前触发一遍导致无效
  const newName = i.name;
  if (oldName && newName) {
    const el = document.createElement('span');

    render(h('span', `${oldName}`), el);
    const name1 = el.innerHTML;

    render(h('span', `${newName}`), el);
    const name2 = el.innerHTML;

    render(h('span', `<${oldName}>`), el);
    const name1w = el.innerHTML;

    render(h('span', `<${newName}>`), el);
    const name2w = el.innerHTML;

    const m = modal.create({
      title: '名字变更',
      preset: 'card',
      style: {
        width: '30rem',
      },
      content: () => [
        h(
          NText,
          { innerHTML: `即将进行名字变更 <b>${name1} -> ${name2}</b><br />将修改信息行，并在文本中进行批量替换（${name1w} 替换为 ${name2w}），确定吗？` },
        ),
      ],
      footer: () => [
        h(
          NButton,
          { type: 'default', onClick: () => m.destroy(), style: { marginRight: '1rem' } },
          () => '取消',
        ),
        h(
          NButton,
          {
            type: 'primary', onClick: () => {
              try {
                logMan.rename(i, oldName, newName)
              } catch (_e) {
                i.name = oldName;
              } finally {
                m.destroy()
              }
            }
          },
          () => '确定'
        ),
      ]
    })
  }
}


logMan.ev.on('textSet', (text) => {
  store.editor.dispatch({
    changes: { from: 0, to: store.editor.state.doc.length, insert: text }
  });

  let m = new Map<string, CharItem>();
  for (let i of logMan.curItems) {
    if (i.isRaw) continue;
    setCharInfo(m, i);
  }
  store.updatePcList(m);
});

logMan.ev.on('parsed', (ti: TextInfo) => {
  store.updatePcList(ti.charInfo);
})

const onChange = (v: ViewUpdate) => {
  let payloadText = '';
  if (v) {
    if (v.docChanged) {
      // 有一种我不太清楚的特殊情况会导致二次调用，从而使得pclist清零
      // 看不出明显变化，只是一个隐藏参数flags为0
      // 破案了，是flush
      if (!v.viewportChanged && (v as any).flags === 0) {
        return;
      }

      const ranges = (v as any).changedRanges;
      if (ranges.length) {
        for (let i = ranges.length - 1; i >= 0; i--) {
          const payloadText = store.editor.state.doc.toString()

          const r1 = [ranges[i].fromA, ranges[i].toA];
          const r2 = [ranges[i].fromB, ranges[i].toB];

          console.log('XXX', v, r1, r2);
          if (r1[0] === 0 && r1[1] === logMan.lastText.length) {
            console.log('全部文本被删除，清除pc列表');
            store.pcList = [];
          }
          logMan.syncChange(payloadText, r1, r2);
        }
      }
    }
  }

  // payloadText = store.editor.state.doc.toString()
  // let isLog = false
}

const doEditorHighlightClick = (e: any) => {
  // 因为原生click事件会执行两次，第一次在label标签上，第二次在input标签上，故此处理
  if (e.target.tagName === 'INPUT') return;

  const doHl = () => {
    // 编辑器染色
    setTimeout(() => {
      store.reloadEditor()
    }, 500)
  }

  if (store.doEditorHighlight) {
    // 如果要开启
    if (isMobile.value) {
      const m = modal.create({
        title: '开启编辑器染色？',
        preset: 'card',
        style: {
          width: '30rem',
        },
        content: '部分移动设备上的特定浏览器可能会因为兼容性问题而卡死，继续吗？',
        footer: () => [
          h(
            NButton,
            {
              type: 'default',
              onClick: () => {
                store.doEditorHighlight = false
                m.destroy()
                setTimeout(() => {
                  doFlush()
                }, 3000)
              },
              style: { marginRight: '1rem' }
            },
            () => '取消',
          ),
          h(
            NButton,
            {
              type: 'primary', onClick: () => {
                try {
                  doHl()
                } catch (_e) {
                  // 重新关闭
                  setTimeout(() => {
                    store.doEditorHighlight = false
                    store.reloadEditor()
                  }, 500)
                } finally {
                  m.destroy()
                }
              }
            },
            () => '确定'
          ),
        ]
      })

      return
    }
  }

  doHl()
}

const reloadFunc = () => {
  store.reloadEditor()
}
const pcList = computed(() => store.pcList)
watch(pcList, reloadFunc, { deep: true })

const exportOptions = computed(() => store.exportOptions)
watch(exportOptions, reloadFunc, { deep: true })

const code = ref("")

</script>

<style lang="scss">
.element-plus-logo {
  width: 50%;
}

.options>div {
  width: 30rem;
  max-width: 30rem;
  margin-bottom: 2rem;
}

.options>div>.switch {
  display: flex;
  align-items: center;
  justify-content: center;

  &>h4 {
    margin-top: 0rem;
    margin-bottom: 0rem;
    margin-left: 1rem;
  }
}

.myLineDecoration {
  // background: lightblue;
  margin-bottom: 20px;
  font-size: large;
}

.pc-list {
  display: flex;
  align-items: center;
  flex-direction: column;
}

#app {
  overflow-y: auto;
}

.preview {
  word-break: break-all;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  position: relative;
  // font-family: monospace;
}


.list-dynamic {
  width: 100%;
  height: 500px;
  overflow-y: auto;
}

.list-item-dynamic {
  // display: flex;
  // align-items: center;
  padding: 0.5em 0;
  border-color: lightgray;
}

.scroller {
  height: 95vh;
}

.black-moon {
  position: fixed;
  top: -150px;
  right: -150px;
  width: 400px;
  height: 400px;
  background: #050505;
  border-radius: 50%;
  box-shadow: 
    0 0 120px rgba(255, 255, 255, 0.4),
    inset -20px -20px 60px rgba(255, 255, 255, 0.2),
    0 0 10px rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 0;
  animation: floatAndRotate 60s linear infinite;
  pointer-events: none;
}

@media (min-width: 1024px) {
  .black-moon {
    width: 700px;
    height: 700px;
    top: -250px;
    right: -250px;
  }
}

.moon-crater {
  position: absolute;
  background: rgba(30, 30, 30, 1);
  border-radius: 50%;
  box-shadow: inset 1px 1px 3px rgba(0, 0, 0, 0.8);
}

.c1 { top: 65%; left: 15%; width: 5%; height: 5%; }
.c2 { top: 80%; left: 35%; width: 10%; height: 10%; }
.c3 { top: 55%; left: 40%; width: 3%; height: 3%; }

@keyframes floatAndRotate {
  0% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-30px) rotate(90deg); }
  50% { transform: translateY(0) rotate(180deg); }
  75% { transform: translateY(-30px) rotate(270deg); }
  100% { transform: translateY(0) rotate(360deg); }
}

/* Tape Control Styles */
.tape-container {
  width: 100%;
  height: 160px;
  position: relative;
  perspective: 1000px;
}

.tape-body {
  width: 100%;
  height: 100%;
  background: #1a1a1a;
  border: 2px solid #444;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.tape-body::before {
  /* Tape texture/noise */
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
  pointer-events: none;
}

.tape-body.playing {
  border-color: #fff;
  box-shadow: 0 0 20px rgba(255,255,255,0.15);
}

.tape-label {
  width: 94%;
  height: 88%;
  background: #d0d0d0;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 4px;
  position: relative;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
}

.tape-title {
  font-family: 'Share Tech Mono', monospace;
  font-weight: bold;
  font-size: 14px;
  color: #111;
  margin-bottom: 10px;
  letter-spacing: 2px;
  border-bottom: 2px solid #111;
  padding-bottom: 2px;
  width: 90%;
  text-align: center;
}

.tape-circles {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: auto;
  margin-bottom: auto;
}

.tape-circle {
  width: 40px;
  height: 40px;
  background: #fff;
  border: 3px solid #1a1a1a;
  border-radius: 50%;
  position: relative;
  box-shadow: 0 0 0 1px #999;
}

.tape-circle::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background: #1a1a1a;
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}

.tape-window {
  width: 50px;
  height: 28px;
  background: #222;
  border-radius: 2px;
  border: 1px solid #222;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  overflow: hidden;
}

.tape-reel {
  width: 20px;
  height: 20px;
  background: #eee;
  border-radius: 50%;
  border: 1px solid #666;
  position: relative;
  opacity: 0.8;
}

.tape-reel::before, .tape-reel::after {
  content: '';
  position: absolute;
  background: #444;
}
.tape-reel::before { top: 50%; left: 2px; right: 2px; height: 2px; transform: translateY(-50%); }
.tape-reel::after { left: 50%; top: 2px; bottom: 2px; width: 2px; transform: translateX(-50%); }

.animate-spin-slow {
  animation: spin 4s linear infinite;
}

@keyframes floatMoon {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Waveform Visualization */
.waveform-container {
  background: rgba(0,0,0,0.5);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 4px;
  overflow: hidden;
}

.waveform-bars {
  height: 100%;
}

.waveform-bar {
  width: 2px;
  background: rgba(255,255,255,0.7);
  transition: height 0.05s ease;
}
</style>
