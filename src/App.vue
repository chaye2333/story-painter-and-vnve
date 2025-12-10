<script setup lang="ts">
import Main from "~/Main.vue";
import { GlobalThemeOverrides, darkTheme } from "naive-ui";
import { useDark } from "@vueuse/core";
import { computed } from "vue";

const isDark = useDark();

const theme = computed(() => (isDark.value ? darkTheme : null));

const themeOverrides = computed<GlobalThemeOverrides>(() => {
  if (isDark.value) {
    return {
      common: {
        primaryColor: '#ffffff',
        primaryColorHover: '#e0e0e0',
        primaryColorPressed: '#cccccc',
        textColorBase: '#ffffff',
        baseColor: '#000000',
        bodyColor: '#000000',
        cardColor: '#000000',
        modalColor: '#000000',
        popoverColor: '#000000',
        fontFamily: 'sans-serif',
      },
      Button: {
        textColor: '#ffffff',
        color: '#000000',
        border: '1px solid #333333',
        borderRadius: '0.5rem',
      },
      Input: {
        color: '#000000',
        textColor: '#ffffff',
        border: '1px solid #333333',
        borderRadius: '0.5rem',
      },
    }
  } else {
    return {
      common: {
        primaryColor: '#000000',
        primaryColorHover: '#333333',
        primaryColorPressed: '#666666',
        textColorBase: '#000000',
        baseColor: '#ffffff',
        bodyColor: '#ffffff',
        cardColor: '#ffffff',
        modalColor: '#ffffff',
        popoverColor: '#ffffff',
        fontFamily: 'sans-serif',
      },
      Button: {
        textColor: '#000000',
        color: '#ffffff',
        border: '1px solid #cccccc',
        borderRadius: '0.5rem',
      },
      Input: {
        color: '#ffffff',
        textColor: '#000000',
        border: '1px solid #cccccc',
        borderRadius: '0.5rem',
      },
    }
  }
})
</script>

<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-modal-provider>
        <n-notification-provider>
          <Main/>
        </n-notification-provider>
      </n-modal-provider>
    </n-message-provider>
  </n-config-provider>
</template>