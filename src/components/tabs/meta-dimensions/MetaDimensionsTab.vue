<script>
import ClassicMetaDimensionsTab from "./ClassicMetaDimensionsTab.vue";
import ModernMetaDimensionsTab from "./ModernMetaDimensionsTab.vue";

export default {
  name: "MetaDimensionsTab",
  components: {
    ClassicMetaDimensionsTab,
    ModernMetaDimensionsTab,
  },
  computed: {
    activeComponent() {
      return this.$viewModel.newUI
        ? "ModernMetaDimensionsTab"
        : "ClassicMetaDimensionsTab";
    },
  },
};
</script>

<template>
  <component :is="activeComponent" />
</template>
