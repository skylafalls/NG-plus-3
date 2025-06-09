<script>
import PrimaryToggleButton from "@/components/PrimaryToggleButton.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ElectronPairSide",
  components: {
    PrimaryToggleButton,
    PrimaryButton,
  },
  data: () => ({
    antimatterGalaxies: new Decimal(0),
    electrons: new Decimal(0),
    autoBuy: new Decimal(0),
    multPer10After: "",
  }),
  computed: {
    dischargedGalaxies() {
      return format(player.quantum.pair.dischargedGalaxies, 2, 0);
    },
    dischargedPercentile() {
      return formatPercents(player.quantum.pair.dischargedGalaxies.div(this.antimatterGalaxies), 1);
    },
    electronEffect() {
      return formatX(PairProduction.electronEffect.effectValue, 2, 1);
    },
  },
  methods: {
    update() {
      this.antimatterGalaxies.copyFrom(player.galaxies);
      this.electrons.copyFrom(player.quantum.pair.electrons);
      this.autoBuy = player.auto.electrons.isActive;
      this.multPer10After = formatX(AntimatterDimensions.buyTenMultiplier, 2, 2);
    },
  },
});
</script>

<template>
  <div>
    <button
      class="o-primary-btn electron-button"
      onclick="sacrificeGalaxy"
      style="height: 60px;"
    >
      Discharge 1 Antimatter Galaxies for 1 Electron<br>
      (5 per antimatter galaxy)
    </button><br>
    <PrimaryToggleButton
      v-model="autoBuy"
      label="Auto electrons"
      class="l--spoon-btn-group__little-spoon o-primary-btn--small-spoon"
    />
    <br>
    <p>{{ dischargedGalaxies }} / {{ format(antimatterGalaxies, 2, 0) }} Antimatter Galaxies discharged ({{ dischargedPercentile }} discharged)</p>
    <br>
    <span
      style="font-size:35px"
      class="electron-text"
    >{{ formatInt(electrons) }}</span> electrons
    <br>
    Multiplier per ten dimensions: <span style="font-size:15px">{{ electronEffect }}</span> → <span
      style="font-size:25px"
      class="electron-text"
    >{{ multPer10After }}</span>
    <table style="margin: auto">
      <tbody>
        <tr>
          <td>
            <PrimaryButton
              class="electron-button--multiplier"
              @click="buyelectronUpg(1)"
            >
              +0.25x electrons (0)<br>10 Time Theorems
            </PrimaryButton>
          </td>
          <td>
            <PrimaryButton
              class="electron-button--multiplier"
              @click="buyelectronUpg(2)"
            >
              +0.25x electrons (0)<br>10 dilated time
            </PrimaryButton>
          </td>
        </tr><tr>
          <td>
            <PrimaryButton
              class="electron-button--multiplier"
              @click="buyelectronUpg(3)"
            >
              +0.25x electrons (0)<br>10 meta-Antimatter
            </PrimaryButton>
          </td>
          <td>
            <PrimaryButton
              class="electron-button--multiplier"
              @click="buyelectronUpg(4)"
            >
              +0.25x electrons (0)<br>1 Meta-Dimension Boosts
            </PrimaryButton>
          </td>
        </tr>
      </tbody>
    </table>
    <PrimaryButton
      style="height: 24px"
      @click="maxelectronUpg()"
    >
      Max all
    </PrimaryButton>
  </div>
</template>

<style scoped>
:root {
  --electron-color: rgb(0, 132, 255);
}

.electron-button {
  background-color: black;
  border-color: rgb(0, 132, 255);
  box-shadow: inset 0px 0px 20px 0px rgb(0, 132, 255);
  color: rgb(0, 132, 255);
}

.electron-button--multiplier {
  background-color: black;
  border-color: rgb(0, 132, 255);
  box-shadow: inset 0px 0px 20px 0px rgb(0, 132, 255);
  color: rgb(0, 132, 255);
  height: 80px;
  width: 200px;
}

.electron-text {
  border-color: rgb(0, 132, 255);
  color: rgb(0, 132, 255);
}
</style>
