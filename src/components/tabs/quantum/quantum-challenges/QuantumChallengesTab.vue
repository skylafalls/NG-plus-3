<script>
import ChallengeGrid from "@/components/ChallengeGrid.vue";
import ChallengeTabHeader from "@/components/ChallengeTabHeader.vue";
import QuantumChallengeBox from "./QuantumChallengeBox.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "QuantumChallengesTab",
  components: {
    ChallengeGrid,
    ChallengeTabHeader,
    QuantumChallengeBox,
  },
  data() {
    return {
      showAllChallenges: false,
    };
  },
  computed: {
    challenges() {
      return QuantumChallenges.all;
    },
  },
  methods: {
    update() {
      this.showAllChallenges = player.options.showAllChallenges;
    },
    isChallengeVisible(challenge) {
      return challenge.isUnlocked || (this.showAllChallenges && PlayerProgress.quantumUnlocked());
    },
  },
});
</script>

<template>
  <div class="l-challenges-tab">
    <ChallengeTabHeader />
    Pair Production effects are disabled while in Quantum Challenges.
    <ChallengeGrid
      v-slot="{ challenge }"
      :challenges="challenges"
      :is-challenge-visible="isChallengeVisible"
    >
      <QuantumChallengeBox :challenge="challenge" />
    </ChallengeGrid>
  </div>
</template>

<style scoped>

</style>
