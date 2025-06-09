<script>
import { defineComponent } from "vue";
import ElectronPairSide from "./ElectronPairSide.vue";
import PositronPairSide from "./PositronPairSide.vue";

export default defineComponent({
  name: "PairProductionTab",
  components: {
    ElectronPairSide,
    PositronPairSide,
  },
});
</script>

<template>
  <table style="margin: auto">
    <tbody>
      <tr>
        <td>
          <ElectronPairSide />
        </td>
        <td>
          <PositronPairSide />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
</style>
