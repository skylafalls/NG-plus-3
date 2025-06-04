<script>
import PrimaryToggleButton from "@/components/PrimaryToggleButton.vue";
import { defineComponent, ref } from "vue";

export default defineComponent({
  components: {
    PrimaryToggleButton,
  },
  data: () => ({
    antimatterGalaxies: new Decimal(0),
    electrons: new Decimal(0),
    autoBuy: new Decimal(0),
  }),
  computed: {
    dischargedGalaxies() {
      return player.quantum.pair.dischargedGalaxies;
    },
    dischargedPercentile() {
      return formatPercents(player.quantum.pair.dischargedGalaxies.div(this.antimatterGalaxies), 1);
    },
    multPer10Before() {
      return formatX(AntimatterDimensions.buyTenMultiplierPreElectrons, 2, 2);
    },
    multPer10After() {
      return formatX(AntimatterDimensions.buyTenMultiplier, 2, 2);
    },
    electronsEffect() {
      return formatPow(PairProduction.electronEffect, 2, 1);
    },
  },
  methods: {
    update() {
      this.antimatterGalaxies.copyFrom(player.galaxies);
      this.electrons.copyFrom(Currency.electrons);
      this.autoBuy = player.auto.electrons.isActive;
    },
  },
});
</script>

<template>
  <button
    id="sacrificeGal"
    class="storebtn positron"
    onclick="sacrificeGalaxy"
  >
    Discharge <span id="sacrificeGals">1</span> galaxies for <span id="positronsGain">6</span> Positrons<br>(+<span id="positronsGainMult">6.00</span> per galaxy)
  </button><br>
  <PrimaryToggleButton
    v-model="autoBuy"
    label="Auto Electrons"
    class="l--spoon-btn-group__little-spoon o-primary-btn--small-spoon"
  />
  <br>
  <p>{{ dischargedGalaxies }} / {{ antimatterGalaxies }} Antimatter Galaxies discharged ({{ dischargedPercentile }} discharged)</p>
  <br><br>
  <span style="font-size:35px">{{ electrons }}</span>
  <p> Electrons</p>
  <br>
  <p>Multiplier per ten dimensions: </p>
  <span style="font-size:15px">{{ multPer10Before }}</span>
  <p>,</p>
  <span style="font-size:15px">{{ electronEffect }}</span>
  <p> → </p>
  <span style="font-size:25px">{{ multPer10After }}</span>
  <table style="margin: auto">
    <tbody>
      <tr>
        <td>
          <PrimaryButton
            class="unavailablebtn"
            @click="buyPositronUpg(1)"
          >
            +0.25x Positrons (0)<br>10 Time Theorems
          </PrimaryButton>
        </td>
        <td>
          <PrimaryButton
            class="storebtn positron"
            @click="buyPositronUpg(2)"
          >
            +0.25x Positrons (0)<br>10 dilated time
          </PrimaryButton>
        </td>
      </tr><tr>
        <td>
          <PrimaryButton
            class="storebtn positron"
            @click="buyPositronUpg(3)"
          >
            +0.25x Positrons (0)<br>10 meta-Antimatter
          </PrimaryButton>
        </td>
        <td>
          <PrimaryButton
            class="storebtn positron"
            @click="buyPositronUpg(4)"
          >
            +0.25x Positrons (0)<br>1 meta-Dimension Boosts
          </PrimaryButton>
        </td>
      </tr>
    </tbody>
  </table>
  <button
    class="storebtn"
    onclick="maxPositronUpg()"
    style="height: 24px"
  >
    Max all
  </button>
</template>

<style scoped>
.positron-button {
  background-color: black;
  border-color: gold;
  box-shadow: inset 0px 0px 20px 0px gold;
  color: gold;
}
</style>
