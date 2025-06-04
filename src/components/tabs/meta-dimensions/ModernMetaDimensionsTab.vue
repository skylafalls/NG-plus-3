<script>
import MetaDimensionRow from "@/components/tabs/meta-dimensions/ModernMetaDimensionRow.vue";
import DimensionBoostRow from "@/components/tabs/meta-dimensions/ModernDimensionBoostRow.vue";

export default {
  name: "ModernMetaDimensionsTab",
  components: {
    MetaDimensionRow,
    DimensionBoostRow,
  },
  data() {
    return {
      hasDimensionBoosts: false,
      buyUntil10: true,
      buy10Mult: new Decimal(0),
      disabledCondition: "",
      multiplierText: "",
      metaAntimatter: new Decimal(0),
      metaAntimatterBest: new Decimal(0),
      dimBoostMultiplier: new Decimal(0),
      dimBoostMultiplierPower: new Decimal(0),
    };
  },
  methods: {
    maxAll() {
      MetaDimensions.maxAll();
    },
    sacrifice() {
      sacrificeBtnClick();
    },
    changeBuyMode() {
      player.meta.buyUntil10 = !player.meta.buyUntil10;
      return;
    },
    getUntil10Display() {
      return this.buyUntil10 ? "Until 10" : "Buy 1";
    },
    update() {
      this.hasDimensionBoosts = player.meta.boosts.gt(0);
      this.buyUntil10 = player.meta.buyUntil10;

      this.buy10Mult.copyFrom(MetaDimensions.buyTenMultiplier);
      this.metaAntimatter.copyFrom(Currency.metaAntimatter);
      this.metaAntimatterBest.copyFrom(player.meta.bestAntimatter);
      this.dimBoostMultiplier.copyFrom(MetaDimensions.dimensionBoostMultiplier);
      this.dimBoostMultiplierPower.copyFrom(MetaDimensions.metaAMtoDimBoostExponent);

      this.multiplierText = `Buy 10 Dimension purchase multiplier: ${formatX(this.buy10Mult, 2, 2)}`;
    },
  },
};
</script>

<template>
  <div class="l-antimatter-dim-tab">
    <div class="modes-container">
      <button
        class="o-primary-btn l-button-container"
        @click="changeBuyMode"
      >
        {{ getUntil10Display() }}
      </button>
      <button
        class="o-primary-btn l-button-container"
        @click="maxAll"
      >
        Max All
      </button>
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
        multiplier on the effectiveness of Dimension Boosts.
      </p>
    </div>
    <span>{{ multiplierText }}</span>
    <div class="l-dimensions-container">
      <MetaDimensionRow
        v-for="tier in 8"
        :key="tier"
        :tier="tier"
      />
    </div>
    <div class="resets-container">
      <DimensionBoostRow />
    </div>
  </div>
</template>

<style scoped>
.l-button-container {
  width: 100px;
  height: 30px;
  padding: 0;
}
</style>
