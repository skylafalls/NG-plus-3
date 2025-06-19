<script>
import { defineComponent } from "vue";
import GluonUpgradeButton from "./GluonUpgradeButton.vue";

export default defineComponent({
  name: "GluonUpgradeSide",
  components: {
    GluonUpgradeButton,
  },
  props: {
    grid: {
      type: Array,
      required: true,
    },
    gluonType: {
      type: String,
      required: true,
    },
  },
});
</script>

<template>
  <div class="l-gluon-upgrades-grid">
    <div
      v-for="(row, i) in grid"
      :key="i"
      class="l-gluon-upgrades-grid__row"
    >
      <GluonUpgradeButton
        v-for="upgrade in row"
        :key="upgrade.id"
        :upgrade="upgrade"
        :type="gluonType"
        class="l-gluon-upgrades-grid__cell"
      />
    </div>
  </div>
</template>

<style scoped>
.l-gluon-upgrades-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
}

.l-gluon-upgrades-grid__row {
  display: flex;
  flex-direction: row;
}

.l-gluon-upgrades-grid__cell {
  margin: 0.5rem 0.8rem;
}
</style>
