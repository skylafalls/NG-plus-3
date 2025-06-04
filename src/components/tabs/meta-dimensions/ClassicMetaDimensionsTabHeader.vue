<script>
import PrimaryButton from "@/components/PrimaryButton";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ClassicMetaDimensionsTabHeader",
  components: {
    PrimaryButton,
  },
  data() {
    return {
      isSacrificeUnlocked: false,
      isSacrificeAffordable: false,
      currentSacrifice: new Decimal(0),
      sacrificeBoost: new Decimal(0),
      disabledCondition: "",
      isFullyAutomated: false,
      metaAntimatter: new Decimal(0),
      dimBoostMultiplier: new Decimal(0),
    };
  },
  methods: {
    update() {
      this.metaAntimatter.copyFrom(Currency.metaAntimatter);
      this.dimBoostMultiplier.copyFrom(MetaDimensions.dimensionBoostMultiplier);
    },
    maxAll() {
      maxAll();
    },
  },
});
</script>

<template>
  <div>
    <div>
      <p>
        You have
        <span class="c-meta-dim-description__accent">{{ format(metaAntimatter, 2) }}</span>
        Meta-Antimatter,
        <br>
        which is then translated to a
        <span class="c-meta-dim-description__accent">{{ formatX(dimBoostMultiplier, 2) }}</span>
        multiplier on the effectiveness of Dimension Boosts.
      </p>
    </div>
    <div class="l-antimatter-dim-tab__header">
      <PrimaryButton
        class="o-primary-btn--buy-max"
        @click="maxAll"
      >
        Max all (M)
      </PrimaryButton>
    </div>
  </div>
</template>
