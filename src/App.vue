<script setup lang="ts">
import Main from "~/Main.vue";
import CustomCursor from "~/components/CustomCursor.vue";
import LoadingScreen from "~/components/LoadingScreen.vue";
import { darkTheme, GlobalThemeOverrides } from "naive-ui";

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#ffffff',
    primaryColorHover: '#cccccc',
    primaryColorPressed: '#999999',
    textColorBase: '#ffffff',
    baseColor: '#000000',
    bodyColor: '#000000',
    cardColor: '#000000',
    modalColor: '#000000',
    popoverColor: '#000000',
    fontFamily: '"Share Tech Mono", "Fusion Pixel 12px Monospaced", "Courier New", Courier, monospace',
  },
  Button: {
    textColor: '#ffffff',
    color: '#000000',
    border: '1px solid #ffffff',
    borderRadius: '0px',
  },
  Input: {
    color: '#000000',
    textColor: '#ffffff',
    border: '1px solid #ffffff',
    borderRadius: '0px',
  },
}
</script>

<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="themeOverrides">
    <CustomCursor />
    <LoadingScreen />
    <n-message-provider>
      <n-modal-provider>
        <n-notification-provider>
          <Main/>
        </n-notification-provider>
      </n-modal-provider>
    </n-message-provider>
  </n-config-provider>
</template>