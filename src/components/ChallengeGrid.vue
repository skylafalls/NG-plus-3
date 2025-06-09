<script>
import ChallengeGridCell from "@/components/ChallengeGridCell.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ChallengeGrid",
  components: {
    ChallengeGridCell,
  },
  props: {
    challenges: {
      type: Array,
      required: true,
    },
    isChallengeVisible: {
      type: Function,
      required: false,
      default: () => true,
    },
  },
});
</script>

<template>
  <div class="l-challenge-grid">
    <ChallengeGridCell
      v-for="challenge in challenges"
      :key="challenge.id"
      :challenge="challenge"
      :is-challenge-visible="isChallengeVisible"
    >
      <slot :challenge="challenge" />
    </ChallengeGridCell>
  </div>
</template>

<style scoped>

</style>
