<script>
import { defineComponent } from "vue";
import QuantumButton from "./QuantumButton.vue";

export default defineComponent({
  name: "HeaderQuantumContainer",
  components: {
    QuantumButton,
  },
  data() {
    return {
      showContainer: false,
      showQK: false,
      quarks: new Decimal(0),
    };
  },
  methods: {
    update() {
      this.showContainer = PlayerProgress.quantumUnlocked() || EternityChallenge(14).completions > 1;
      this.showQK = PlayerProgress.quantumUnlocked();
      this.quarks.copyFrom(Currency.quarks.value.floor());
    },
  },
});
</script>

<template>
  <div
    v-if="showContainer"
    class="c-prestige-button-container"
  >
    <div
      v-if="showQK"
      class="c-quarks"
    >
      You have
      <span class="c-game-header__qk-amount">{{ format(quarks, 2) }}</span>
      {{ pluralize("Quark", quarks) }}.
    </div>
    <QuantumButton />
  </div>
</template>

<style scoped>
.c-quarks {
  font-size: 1.2rem;
  padding-bottom: 0.5rem;
}
</style>
