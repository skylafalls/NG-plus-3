<script>
import { defineComponent } from "vue";
import QuarksRow from "./QuarksRow.vue";
import QuarksMultiplierButton from "./QuarksMultiplierButton.vue";

export default defineComponent({
  name: "QuarksTab",
  components: {
    QuarksRow,
    QuarksMultiplierButton,
  },
});
</script>

<template>
  <div>
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
          format-type="multiplier"
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
