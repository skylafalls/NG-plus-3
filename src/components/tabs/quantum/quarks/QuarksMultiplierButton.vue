<script>
import CostDisplay from "@/components/CostDisplay.vue";
import EffectDisplay from "@/components/EffectDisplay.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import DescriptionDisplay from "@/components/DescriptionDisplay.vue";
import PrimaryToggleButton from "@/components/PrimaryToggleButton.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "QuarksMultiplierButton",
  components: {
    PrimaryButton,
    EffectDisplay,
    CostDisplay,
    DescriptionDisplay,
  },
  data: () => ({
    canBeBought: false,
  }),
  computed: {
    upgrade() {
      return Quarks.multiplierUpgrade;
    },
    config() {
      return this.upgrade.config;
    },
    classObject() {
      return {
        "o-quark-multiplier-btn": true,
        "o-quark-multiplier-btn--available": this.canBeBought,
        "o-quark-multiplier-btn--unavailable": !this.canBeBought,
      };
    },
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.canBeBought = upgrade.canBeBought;
    },
    buyMaxMult() {
      Quarks.multiplierUpgrade.buyMax();
    },
  },
});
</script>

<template>
  <div>
    <button
      :class="classObject"
      @click="upgrade.purchase()"
    >
      <DescriptionDisplay
        :config="config"
      />
      <EffectDisplay
        br
        :config="config"
      />
      <CostDisplay
        br
        :config="config"
        name="Quark"
      />
      <slot />
    </button>
    <br>
    <PrimaryButton
      class="l--spoon-btn-group__little-spoon o-primary-btn--small-spoon"
      @click="upgrade.buyMax()"
    >
      Max Quark Multiplier
    </PrimaryButton>
  </div>
</template>

<style scoped>
.o-quark-multiplier-btn {
  width: 19rem;
  height: 9rem;
  font-family: Typewriter, serif;
  font-size: 11px;
  font-weight: bold;
  color: white;
  border: 0.1rem solid black;
  transition-duration: 0.2s;
  cursor: pointer;
  border-radius: var(--var-border-radius, 0.5rem);
}

.o-quark-multiplier-btn:hover {
  color: var(--color-text-inverted);
}

.o-quark-multiplier-btn--available {
  background-color: black;
  border-color: greenyellow;
  box-shadow: inset 0px 0px 20px 0px greenyellow;
  color: greenyellow;
  transition: 200ms;
}

.o-quark-multiplier-btn--available:hover {
  background-color: rgb(122, 255, 95);
  box-shadow: none;
  color: black;
}

.o-quark-multiplier-btn--unavailable {
  color: white;
  background: #525252;
  border: 0.1rem solid rgb(131, 255, 137);
  cursor: auto;
  transition: 200ms;
}
</style>
