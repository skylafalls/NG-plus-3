<script>
import { defineComponent } from "vue";
import DischargeGalaxiesButton from "./DischargeGalaxiesButton.vue";
import PairProductionUpgradeRow from "./PairProductionUpgradeRow.vue";

export default defineComponent({
  name: "PairProductionTab",
  components: {
    DischargeGalaxiesButton,
    PairProductionUpgradeRow,
  },
  data: () => ({
    electrons: new Decimal(0),
    positrons: new Decimal(0),
    electronEffect: new Decimal(0),
    positronEffect: new Decimal(0),
  }),
  computed: {
    dischargedGalaxiesText() {
      const galaxies = player.galaxies;
      const discharged = player.quantum.pair.dischargedGalaxies;
      const percentile = discharged.div(galaxies);
      return `${formatInt(discharged)} / ${formatInt(galaxies)} ${pluralize("Antimatter Galaxy", discharged)} discharged (${formatPercents(percentile, 2)})`;
    },
    multPer10After() {
      return formatX(AntimatterDimensions.buyTenMultiplier, 2, 2);
    },
  },
  methods: {
    update() {
      this.electrons.copyFrom(player.quantum.pair.electrons);
      this.positrons.copyFrom(player.quantum.pair.positrons);
      this.electronEffect.copyFrom(PairProduction.electronEffect.effectOrDefault(1));
      this.positronEffect.copyFrom(PairProduction.positronEffect.effectOrDefault(1));
    },
  },
});
</script>

<template>
  <div>
    <DischargeGalaxiesButton />
    <p>{{ dischargedGalaxiesText }}</p>
    <span
      style="font-size:35px"
      class="electron-text"
    >{{ format(electrons, 2, 2) }}</span> Electrons
    <span style="font-size: 40px;">|</span>
    <span
      style="font-size:35px"
      class="positron-text"
    >{{ format(positrons, 2, 2) }}</span> Positrons
    <br>
    Multiplier per ten dimensions:
    <span
      style="font-size:15px"
      class="electron-text"
    >{{ formatX(electronEffect, 2, 2) }}</span>,
    <span
      style="font-size:15px"
      class="positron-text"
    >{{ formatPow(positronEffect, 2, 2) }}</span>
    → <span
      style="font-size:25px; color: rgb(255, 100, 100);"
    >{{ multPer10After }}</span>
    <br><br>
    <PairProductionUpgradeRow style="margin: auto;" />
  </div>
</template>

<style scoped>
.electron-text {
  border-color: rgb(0, 132, 255);
  color: rgb(0, 132, 255);
}

.positron-text {
  border-color: gold;
  color: gold;
}
</style>
