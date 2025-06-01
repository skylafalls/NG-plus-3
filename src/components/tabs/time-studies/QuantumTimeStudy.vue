<script>
import DescriptionDisplay from "@/components/DescriptionDisplay.vue";
import EffectDisplay from "@/components/EffectDisplay.vue";
import HintText from "@/components/HintText.vue";
import TimeStudyButton from "./TimeStudyButton.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "QuantumTimeStudy",
  components: {
    DescriptionDisplay,
    EffectDisplay,
    HintText,
    TimeStudyButton
  },
  props: {
    setup: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    showCost: true,
  }),
  computed: {
    study() {
      return this.setup.study;
    },
    hintText() {
      const id = this.study.id;
      return id;
    },
  },
  methods: {
    update() {
      this.showCost = true;
    },
  }
});
</script>

<template>
  <TimeStudyButton
    :setup="setup"
    :show-cost="showCost"
    :show-st-cost="showSTCost"
  >
    <HintText
      type="studies"
      class="l-hint-text--time-study"
    >
      {{ hintText }}
    </HintText>
    <span :class="{ 'o-pelle-disabled': isUseless }">
      <DescriptionDisplay
        :config="study.config"
      />
      <EffectDisplay
        br
        :config="study.config"
      />
    </span>
  </TimeStudyButton>
</template>

<style scoped>

</style>
