<script>
import PrimaryToggleButton from "@/components/PrimaryToggleButton.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "PositronPairSide",
  components: {
    PrimaryToggleButton,
    PrimaryButton,
  },
  data: () => ({
    antimatterGalaxies: new Decimal(0),
    positrons: new Decimal(0),
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
    positronEffect() {
      return formatPow(PairProduction.positronEffect.effectValue, 2, 1);
    },
  },
  methods: {
    update() {
      this.antimatterGalaxies.copyFrom(player.galaxies);
      this.positrons.copyFrom(player.quantum.pair.positrons);
      this.autoBuy = player.auto.positrons.isActive;
      this.multPer10After = formatX(AntimatterDimensions.buyTenMultiplier, 2, 2);
    },
  },
});
</script>

<template>
  <div>
    <button
      id="sacrificeGal"
      class="o-primary-btn positron-button"
      onclick="sacrificeGalaxy"
      style="height: 60px;"
    >
      Discharge 1 Antimatter Galaxies for 1 Positron<br>
      (5 per antimatter galaxy)
    </button><br>
    <PrimaryToggleButton
      v-model="autoBuy"
      label="Auto positrons"
      class="l--spoon-btn-group__little-spoon o-primary-btn--small-spoon"
    />
    <br>
    <p>{{ dischargedGalaxies }} / {{ format(antimatterGalaxies, 2, 0) }} Antimatter Galaxies discharged ({{ dischargedPercentile }} discharged)</p>
    <br>
    <span
      style="font-size:35px"
      class="positron-text"
    >{{ formatInt(positrons) }}</span> positrons
    <br>
    Multiplier per ten dimensions: <span style="font-size:15px">{{ positronEffect }}</span> → <span
      style="font-size:25px"
      class="positron-text"
    >{{ multPer10After }}</span>
    <table style="margin: auto">
      <tbody>
        <tr>
          <td>
            <PrimaryButton
              class="positron-button--multiplier"
              @click="buypositronUpg(1)"
            >
              +0.25x positrons (0)<br>10 Time Theorems
            </PrimaryButton>
          </td>
          <td>
            <PrimaryButton
              class="positron-button--multiplier"
              @click="buypositronUpg(2)"
            >
              +0.25x positrons (0)<br>10 dilated time
            </PrimaryButton>
          </td>
        </tr><tr>
          <td>
            <PrimaryButton
              class="positron-button--multiplier"
              @click="buypositronUpg(3)"
            >
              +0.25x positrons (0)<br>10 meta-Antimatter
            </PrimaryButton>
          </td>
          <td>
            <PrimaryButton
              class="positron-button--multiplier"
              @click="buypositronUpg(4)"
            >
              +0.25x positrons (0)<br>1 Meta-Dimension Boosts
            </PrimaryButton>
          </td>
        </tr>
      </tbody>
    </table>
    <PrimaryButton
      style="height: 24px"
      @click="maxpositronUpg()"
    >
      Max all
    </PrimaryButton>
  </div>
</template>

<style scoped>
.positron-button {
  background-color: black;
  border-color: gold;
  box-shadow: inset 0px 0px 20px 0px gold;
  color: gold;
}

.positron-button--multiplier {
  background-color: black;
  border-color: gold;
  box-shadow: inset 0px 0px 20px 0px gold;
  color: gold;
  height: 80px;
  width: 200px;
}

.positron-text {
  border-color: gold;
  color: gold;
}
</style>
