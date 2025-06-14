<script>
import { defineComponent } from "vue";
import PrimaryButton from "@/components/PrimaryButton.vue";

export default defineComponent({
  name: "DischargeGalaxyButton",
  components: {
    PrimaryButton,
  },
  data: () => ({
    dischargedGalaxies: new Decimal(0),
    antimatterGalaxies: new Decimal(0),
    dischargeMultPositron: new Decimal(0),
    dischargeMultElectron: new Decimal(0),
  }),
  computed: {
    sacrificableGalaxies() {
      return this.antimatterGalaxies.sub(this.dischargedGalaxies).max(0);
    },
    gainedFromDischarge() {
      const gainedElectrons = this.dischargeMultElectron.times(this.sacrificableGalaxies);
      const gainedPositrons = this.dischargeMultPositron.times(this.sacrificableGalaxies);
      return `${quantify("Electron", gainedElectrons, 2, 2)} & ${quantify("Positron", gainedPositrons, 2, 2)}`;
    },
    dischargeMultiplier() {
      return `${quantify("Electron", this.dischargeMultElectron, 2, 2)} and ${quantify("Positron", this.dischargeMultPositron, 2, 2)}`;
    },
    canDischarge() {
      return PairProduction.canDischarge;
    },
  },
  methods: {
    update() {
      this.dischargedGalaxies.copyFrom(player.quantum.pair.dischargedGalaxies);
      this.antimatterGalaxies.copyFrom(player.galaxies);
      this.dischargeMultElectron.copyFrom(PairProduction.electronMultiplier);
      this.dischargeMultPositron.copyFrom(PairProduction.positronMultiplier);
    },
    sacrificeGalaxy() {
      PairProduction.sacrificeGalaxies();
    },
  },
});
</script>

<template>
  <PrimaryButton
    class="electron-button"
    style="height: 70px;"
    :enabled="canDischarge"
    @click="sacrificeGalaxy"
  >
    Discharge {{ quantify("Antimatter Galaxy", sacrificableGalaxies) }} for {{ gainedFromDischarge }}<br>
    ({{ dischargeMultiplier }} per antimatter galaxy)
  </PrimaryButton>
</template>

<style scoped>
.electron-button {
  background-color: black;
  border-color: rgb(0, 132, 255), gold;
  box-shadow: inset 0px 0px 20px 0px rgb(0, 132, 255), inset 0px 0px 20px 0px gold;
  color: rgb(0, 132, 255), gold;
}
</style>
