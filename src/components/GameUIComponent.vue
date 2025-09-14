<script lang="ts">
import BackgroundAnimations from "@/components/BackgroundAnimations.vue";
import ClassicUi from "@/components/ui-modes/classic/ClassicUi.vue";
import GameUiComponentFixed from "@/components/GameUiComponentFixed.vue";
import ModernUi from "@/components/ui-modes/modern/ModernUi.vue";

import S12DesktopIcons from "@/components/ui-modes/s12/DesktopIcons.vue";
import S12Ui from "@/components/ui-modes/s12/S12Ui.vue";
import S12UiFixed from "@/components/ui-modes/s12/S12UiFixed.vue";
import { defineComponent } from "vue";
import TabComponents from "@/components/tabs/index.js";

export default defineComponent({
  name: "GameUIComponent",
  components: {
    ...TabComponents,
    ClassicUi,
    ModernUi,
    GameUiComponentFixed,
    BackgroundAnimations,
    S12Ui,
    S12UiFixed,
    S12DesktopIcons,
  },
  computed: {
    view() {
      return this.$viewModel;
    },
    isThemeS12() {
      return this.view.theme === "S12";
    },
    uiLayout() {
      if (this.isThemeS12) {
        return "S12Ui";
      }
      return this.view.newUI ? "ModernUi" : "ClassicUi";
    },
    containerClass() {
      return this.view.newUI ? "new-ui" : "old-ui";
    },
    page() {
      const subtab = Tabs.current[this.$viewModel.subtab];
      return subtab.config.component;
    },
    themeCss() {
      return `styles/theme-${this.view.theme}.css`;
    },
  },
});
</script>

<template>
  <div
    v-if="view.initialized"
    id="ui-container"
    :class="containerClass"
    class="ui-wrapper"
  >
    <div
      id="ui"
      class="c-game-ui"
    >
      <component :is="uiLayout">
        <component
          :is="page"
          class="c-game-tab"
        />
      </component>
      <S12DesktopIcons v-if="isThemeS12" />
      <link
        v-if="view.theme !== 'Normal'"
        type="text/css"
        rel="stylesheet"
        :href="themeCss"
      >
    </div>
    <GameUiComponentFixed v-if="!isThemeS12" />
    <BackgroundAnimations v-if="!isThemeS12" />
    <S12UiFixed v-if="isThemeS12" />
  </div>
</template>

<style scoped>
.ui-wrapper {
  display: flex;
  position: relative;
  justify-content: center;
}
</style>
