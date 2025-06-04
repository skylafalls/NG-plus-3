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
  computed: {
    upgrade() {
      return Quarks.multiplierUpgrade;
    },
    config() {
      return this.upgrade.config;
    },
  },
  methods: {
    buyMaxMult() {
      Quarks.multiplierUpgrade.buyMax();
    },
  },
});
</script>

<template>
  <div class="l-spoon-btn-group">
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
      name="Quarks"
    />
    <slot />
    <PrimaryButton
      class="l--spoon-btn-group__little-spoon o-primary-btn--small-spoon"
      @click="buyMaxMult()"
    >
      Max Quark Multiplier
    </PrimaryButton>
  </div>
</template>

<style scoped>

</style>
