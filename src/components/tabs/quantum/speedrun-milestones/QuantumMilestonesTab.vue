<script>
import { defineComponent } from "vue";
import QuantumMilestoneButton from "./QuantumMilestoneButton.vue";

export default defineComponent({
  name: "QuantumMilestonesTab",
  components: {
    QuantumMilestoneButton,
  },
  data() {
    return {
      bestTime: new TimeSpan(new Decimal(0)),
    };
  },
  computed: {
    milestones() {
      return Object.values(GameDatabase.quantum.speedrunMilestones)
        .map(config => new QuantumSpeedrunState(config));
    },
    rows() {
      return Math.ceil(this.milestones.length / 4);
    },
  },
  methods: {
    update() {
      this.bestTime = Time.bestQuantum;
    },
    getMilestone(row, column) {
      return () => QuantumSpeedrunMilestone(((row - 1) * 4 + column));
    },
  },
});
</script>

<template>
  <div class="l-eternity-milestone-grid">
    <div>Your best quantum speedrun time is {{ bestTime.toString() }}.</div>
    <div
      v-for="row in rows"
      :key="row"
      class="l-eternity-milestone-grid__row"
    >
      <QuantumMilestoneButton
        v-for="column in 4"
        :key="row * 4 + column"
        :get-milestone="getMilestone(row, column)"
        class="l-eternity-milestone-grid__cell"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
