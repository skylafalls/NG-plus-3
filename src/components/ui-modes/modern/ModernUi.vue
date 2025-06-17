<script>
import { defineComponent } from "vue";
import BigCrunchButton from "../BigCrunchButton.vue";
import HeaderBlackHole from "../HeaderBlackHole.vue";
import HeaderChallengeDisplay from "../HeaderChallengeDisplay.vue";
import HeaderChallengeEffects from "../HeaderChallengeEffects.vue";
import HeaderPrestigeGroup from "../HeaderPrestigeGroup.vue";
import NewsTicker from "../NewsTicker.vue";

import GameSpeedDisplay from "@/components/GameSpeedDisplay.vue";

export default defineComponent({
  name: "ModernUi",
  components: {
    BigCrunchButton,
    HeaderChallengeDisplay,
    HeaderChallengeEffects,
    NewsTicker,
    HeaderBlackHole,
    HeaderPrestigeGroup,
    GameSpeedDisplay,
  },
  data() {
    return {
      bigCrunch: false,
      hasReality: false,
      newGameKey: "",
    };
  },
  computed: {
    news() {
      return this.$viewModel.news;
    },
    topMargin() {
      return this.$viewModel.news ? "" : "margin-top: 3.9rem";
    },
  },
  methods: {
    update() {
      const crunchButtonVisible = !player.break && Player.canCrunch;
      this.bigCrunch = crunchButtonVisible && Time.bestInfinityRealTime.totalMinutes.gt(1);
      this.hasReality = PlayerProgress.realityUnlocked();
      // This only exists to force a key-swap after pressing the button to start a new game; the news ticker can break
      // if it isn't redrawn
      this.newGameKey = Pelle.isDoomed;
    },
    handleClick() {
      if (PlayerProgress.infinityUnlocked()) {
        manualBigCrunchResetRequest();
      } else {
        Modal.bigCrunch.show();
      }
    },
  },
});
</script>

<template>
  <div id="page">
    <link
      rel="stylesheet"
      type="text/css"
      href="/src/styles/new-ui-styles.css"
    >
    <div
      :key="newGameKey"
      class="game-container"
      :style="topMargin"
    >
      <NewsTicker
        v-if="news"
      />
      <BigCrunchButton />
      <div
        v-if="!bigCrunch"
        class="tab-container"
      >
        <HeaderPrestigeGroup />
        <div class="information-header">
          <HeaderChallengeDisplay />
          <HeaderChallengeEffects />
          <GameSpeedDisplay v-if="hasReality" />
          <br v-if="hasReality">
          <HeaderBlackHole />
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
