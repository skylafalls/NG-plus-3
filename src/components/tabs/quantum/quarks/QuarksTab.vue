<script>
import { defineComponent } from "vue";
import QuarksRow from "./QuarksRow.vue";
import QuarksMultiplierButton from "./QuarksMultiplierButton.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";

export default defineComponent({
  name: "QuarksTab",
  components: {
    QuarksRow,
    QuarksMultiplierButton,
    PrimaryButton,
  },
  data: () => ({
    netQuarks: new Decimal(0),
  }),
  methods: {
    update() {
      this.netQuarks.copyFrom(Quarks.netTotal);
    },
    distribute() {
      Quarks.distribute(0.1);
    },
  },
});
</script>

<template>
  <div>
    Your total net quarks (sum of all colored quarks + spare quarks) is currently {{ format(netQuarks, 2, 2) }}.
    <br>
    <PrimaryButton @click="distribute">
      Distribute 10%
    </PrimaryButton>
    <table class="centered">
      <tbody>
        <QuarksRow
          color="red"
          effect-display="stronger galaxies"
          format-type="percentile"
        />
        <QuarksRow
          color="green"
          effect-display="extra replicated galaxies"
          format-type="percentile"
        />
        <QuarksRow
          color="blue"
          effect-display="to Dilated Time production"
          format-type="multiplier"
        />
      </tbody>
    </table>
    <br>
    <QuarksMultiplierButton />
  </div>
</template>

<style>
.centered {
  margin-left: auto;
  margin-right: auto;
}
</style>
