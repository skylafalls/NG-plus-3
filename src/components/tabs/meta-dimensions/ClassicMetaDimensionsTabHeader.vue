<script>
import PrimaryButton from "@/components/PrimaryButton.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ClassicMetaDimensionsTabHeader",
  components: {
    PrimaryButton,
  },
  data() {
    return {
      metaAntimatter: new Decimal(0),
      metaAntimatterBest: new Decimal(0),
      dimBoostMultiplier: new Decimal(0),
      dimBoostMultiplierPower: new Decimal(0),
      isQC3Running: new Decimal(0),
    };
  },
  methods: {
    update() {
      this.metaAntimatter.copyFrom(Currency.metaAntimatter);
      this.metaAntimatterBest.copyFrom(player.records.thisQuantum.bestMA);
      this.dimBoostMultiplier.copyFrom(MetaDimensions.dimensionBoostMultiplier);
      this.dimBoostMultiplierPower.copyFrom(MetaDimensions.metaAMtoDimBoostExponent);
      this.isQC3Running = QuantumChallenge(3).isRunning;
    },
    maxAll() {
      MetaDimensions.maxAll();
    },
  },
});
</script>

<template>
  <div>
    <div class="l-antimatter-dim-tab__header">
      <PrimaryButton
        class="o-primary-btn--buy-max"
        @click="maxAll"
      >
        Max all (M)
      </PrimaryButton>
    </div>
    <div>
      <p>
        You have
        <span class="c-meta-dim-description__accent">{{ format(metaAntimatter, 2) }}</span>
        Meta-Antimatter, which your best amount of
        <span class="c-meta-dim-description__accent">{{ format(metaAntimatterBest, 2) }}</span>
        is raised by <span class="c-meta-dim-description__accent">{{ formatPow(dimBoostMultiplierPower, 2) }}</span>,
        <br>
        which is translated to a
        <span class="c-meta-dim-description__accent">{{ formatX(dimBoostMultiplier, 2) }}</span>
        {{ isQC3Running ? "multiplier on all Infinity Dimensions" : "multiplier on the effectiveness of Dimension Boosts." }}
      </p>
    </div>
  </div>
</template>
