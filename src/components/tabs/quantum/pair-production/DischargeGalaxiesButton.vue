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
    canDischarge: false,
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
    classObject() {
      return {
        "o-discharge-galaxy-btn": true,
        "o-discharge-galaxy-btn--available": this.canDischarge,
        "o-discharge-galaxy-btn--unavailable": !this.canDischarge,
      };
    },
  },
  methods: {
    update() {
      this.dischargedGalaxies.copyFrom(player.quantum.pair.dischargedGalaxies);
      this.antimatterGalaxies.copyFrom(player.galaxies);
      this.dischargeMultElectron.copyFrom(PairProduction.electronMultiplier);
      this.dischargeMultPositron.copyFrom(PairProduction.positronMultiplier);
      this.canDischarge = PairProduction.canDischarge;
    },
    sacrificeGalaxy() {
      PairProduction.sacrificeGalaxies();
    },
  },
});
</script>

<template>
  <button
    :class="classObject"
    style="height: 70px;"
    :enabled="canDischarge"
    @click="sacrificeGalaxy"
  >
    Discharge {{ quantify("Antimatter Galaxy", sacrificableGalaxies) }} for {{ gainedFromDischarge }}<br>
    ({{ dischargeMultiplier }} per antimatter galaxy)
  </button>
</template>

<style scoped>
.o-discharge-galaxy-btn {
  font-family: Typewriter, serif;
  font-weight: bold;
  width: 60rem;
  border-radius: var(--var-border-radius, 0.5rem);
}

.o-discharge-galaxy-btn:hover {
  color: var(--color-text-inverted);
}

.o-discharge-galaxy-btn--available {
  background-color: black;
  border-color: rgb(131, 234, 255);
  box-shadow: inset 0px 0px 20px 0px rgb(131, 234, 255);
  color: rgb(131, 234, 255);
  transition: 200ms;
}

.o-discharge-galaxy-btn--available:hover {
  background-color: rgb(131, 234, 255);
  box-shadow: none;
  color: white;
}

.o-discharge-galaxy-btn--unavailable {
  color: white;
  background: #525252;
  border: 0.1rem solid var(--color-accent);
  cursor: default;
  transition: 200ms;
}
</style>
