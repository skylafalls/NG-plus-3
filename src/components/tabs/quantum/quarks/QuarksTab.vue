<script>
import { defineComponent } from "vue";
import QuarksRow from "./QuarksRow.vue";

export default defineComponent({
  name: "QuarksTab",
  components: {
    QuarksRow,
  },
});
</script>

<template>
  <div>
    <p>Hello, World!</p>
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
  </div>
</template>

<style>
.centered {
  margin-left: auto;
  margin-right: auto;
}
</style>
