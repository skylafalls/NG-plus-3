<script>
import { defineComponent } from "vue";
import HeaderBlackHole from "./HeaderBlackHole.vue";
import HeaderChallengeDisplay from "./HeaderChallengeDisplay.vue";
import HeaderChallengeEffects from "./HeaderChallengeEffects.vue";
import HeaderPrestigeGroup from "./HeaderPrestigeGroup.vue";

import GameSpeedDisplay from "@/components/GameSpeedDisplay.vue";

export default defineComponent({
  name: "GameHeader",
  components: {
    HeaderChallengeDisplay,
    HeaderChallengeEffects,
    HeaderBlackHole,
    HeaderPrestigeGroup,
    GameSpeedDisplay,
  },
  data() {
    return {
      hasReality: false,
    };
  },
  methods: {
    update() {
      this.hasReality = PlayerProgress.realityUnlocked();
    },
  },
});
</script>

<template>
  <div>
    <HeaderChallengeDisplay />
    <HeaderChallengeEffects />
    <HeaderPrestigeGroup />
    <GameSpeedDisplay v-if="hasReality" />
    <br v-if="hasReality">
    <HeaderBlackHole />
  </div>
</template>

<style scoped>

</style>
