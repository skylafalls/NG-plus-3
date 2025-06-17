<script>
import { defineComponent } from "vue";
import ElectronUpgradeButton from "./ElectronUpgradeButton.vue";
import PositronUpgradeButton from "./PositronUpgradeButton.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";

export default defineComponent({
  name: "InfinityUpgradesTab",
  components: {
    ElectronUpgradeButton,
    PositronUpgradeButton,
  },
  data: () => ({
    grid: {},
  }),
  computed: {
    allColumnUpgrades() {
      return this.grid.flat();
    },
  },
  methods: {
    update() {
      const upgradeObject = {
        positron: [],
        electron: [],
      };
      for (const upgrade of [1, 2, 3, 4]) {
        upgradeObject.electron.push(ElectronUpgrade(upgrade));
      }
      for (const upgrade of [1, 2, 3, 4]) {
        upgradeObject.positron.push(PositronUpgrade(upgrade));
      }
      this.grid = upgradeObject;
    },
  },
});
</script>

<template>
  <table>
    <tbody>
      <tr>
        <td
          v-for="upgrade of grid.electron"
          :key="upgrade.id"
        >
          <ElectronUpgradeButton :upgrade="upgrade" />
        </td>
      </tr>
      <tr>
        <td
          v-for="upgrade of grid.positron"
          :key="upgrade.id"
        >
          <PositronUpgradeButton :upgrade="upgrade" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
</style>
