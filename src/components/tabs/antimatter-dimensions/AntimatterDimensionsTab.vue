<script>
import { defineComponent } from "vue";
import ClassicAntimatterDimensionsTab from "./ClassicAntimatterDimensionsTab.vue";
import ModernAntimatterDimensionsTab from "./ModernAntimatterDimensionsTab.vue";

export default defineComponent({
  name: "AntimatterDimensionsTab",
  components: {
    ClassicAntimatterDimensionsTab,
    ModernAntimatterDimensionsTab,
  },
  computed: {
    activeComponent() {
      return this.$viewModel.newUI
        ? "ModernAntimatterDimensionsTab"
        : "ClassicAntimatterDimensionsTab";
    },
  },
});
</script>

<template>
  <component :is="activeComponent" />
</template>
