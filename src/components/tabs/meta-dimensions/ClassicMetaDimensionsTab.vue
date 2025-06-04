<script>
import MetaDimensionRow from "./ClassicMetaDimensionRow.vue";
import MetaDimensionsTabHeader from "./ClassicMetaDimensionsTabHeader.vue";
import DimensionBoostRow from "./ClassicDimensionBoostRow.vue";

export default {
  name: "ClassicMetaDimensionsTab",
  components: {
    MetaDimensionRow,
    MetaDimensionsTabHeader,
    DimensionBoostRow,
  },
  data() {
    return {
      hasDimensionBoosts: false,
      buy10Mult: new Decimal(0),
      multiplierText: "",
    };
  },
  methods: {
    update() {
      this.hasDimensionBoosts = player.meta.boosts.gt(0);
      this.buy10Mult.copyFrom(MetaDimensions.buyTenMultiplier);
      this.multiplierText = `Buy 10 Dimension purchase multiplier: ${formatX(this.buy10Mult, 2, 2)}`;
    },
  },
};
</script>

<template>
  <div class="l-old-ui-antimatter-dim-tab">
    <MetaDimensionsTabHeader />
    {{ multiplierText }}
    <div class="l-dimensions-container">
      <MetaDimensionRow
        v-for="tier in 8"
        :key="tier"
        :tier="tier"
      />
      <DimensionBoostRow />
    </div>
    <div class="l-flex" />
  </div>
</template>

<style scoped>
.l-flex {
  flex: 1 0;
}
</style>
