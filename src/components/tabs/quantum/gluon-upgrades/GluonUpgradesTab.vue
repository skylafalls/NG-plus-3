<script>
import { defineComponent } from "vue";
import GluonUpgradeSide from "./GluonUpgradeSide.vue";

export default defineComponent({
  name: "GluonUpgradesTab",
  components: {
    GluonUpgradeSide,
  },
  data: () => ({
    rgGluons: new Decimal(0),
    gbGluons: new Decimal(0),
    brGluons: new Decimal(0),
  }),
  computed: {
    grid() {
      const splitIntoChunks = (initialArray, perChunk) => initialArray.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / perChunk);
        if (!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = []; // start a new chunk
        }

        resultArray[chunkIndex].push(item);
        return resultArray;
      }, []);

      const redGreen = splitIntoChunks(Array.range(1, 8).map(value => GluonUpgrade.redGreen(value)), 2);
      const greenBlue = splitIntoChunks(Array.range(1, 8).map(value => GluonUpgrade.greenBlue(value)), 2);
      const blueRed = splitIntoChunks(Array.range(1, 8).map(value => GluonUpgrade.blueRed(value)), 2);

      return {
        redGreen,
        greenBlue,
        blueRed,
      };
    },
  },
  methods: {
    update() {
      this.rgGluons.copyFrom(player.quantum.gluons.rg);
      this.gbGluons.copyFrom(player.quantum.gluons.gb);
      this.brGluons.copyFrom(player.quantum.gluons.br);
    },
  },
});
</script>

<template>
  <table style="display: block; margin: auto;">
    <tbody>
      <tr>
        <td>
          <span class="red-green-gluons">
            {{ format(rgGluons) }}
          </span>
          red-green gluons
          <GluonUpgradeSide
            :grid="grid.redGreen"
            gluon-type="red-green"
          />
        </td>
        <td>
          <span class="green-blue-gluons">
            {{ format(gbGluons) }}
          </span>
          green-blue gluons
          <GluonUpgradeSide
            :grid="grid.greenBlue"
            gluon-type="green-blue"
          />
        </td>
        <td>
          <span class="blue-red-gluons">
            {{ format(brGluons) }}
          </span>
          blue-red gluons
          <GluonUpgradeSide
            :grid="grid.blueRed"
            gluon-type="blue-red"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style>
.red-green-gluons {
  animation: rg 5s infinite;
  font-size: 35px;
}

.green-blue-gluons {
  animation: gb 5s infinite;
  font-size: 35px;
}

.blue-red-gluons {
  animation: br 5s infinite;
  font-size: 35px;
}

@keyframes rg {
  0% {color: #bf0000}
  25% {color: #bfbf00}
  50% {color: #00bf00}
  75% {color: #bfbf00}
  100% {color: #bf0000}
}
@keyframes gb {
  0% {color: #00bf00}
  25% {color: #00bfbf}
  50% {color: #0000bf}
  75% {color: #00bfbf}
  100% {color: #00bf00}
}
@keyframes br {
  0% {color: #0000bf}
  25% {color: #bf00bf}
  50% {color: #bf0000}
  75% {color: #bf00bf}
  100% {color: #0000bf}
}
</style>
