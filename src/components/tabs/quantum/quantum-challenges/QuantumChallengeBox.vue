<script>
import ChallengeBox from "@/components/ChallengeBox.vue";
import DescriptionDisplay from "@/components/DescriptionDisplay.vue";
import EffectDisplay from "@/components/EffectDisplay.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "QuantumChallengeBox",
  components: {
    ChallengeBox,
    DescriptionDisplay,
    EffectDisplay,
  },
  props: {
    challenge: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isUnlocked: false,
      isRunning: false,
      isCompleted: false,
    };
  },
  computed: {
    config() {
      return this.challenge.config;
    },
    rewardConfig() {
      const challenge = this.challenge;
      const config = this.config.reward;
      return {
        effect: () => config.effect(config.id === 7 ? challenge.completions + 1 : challenge.completions),
        formatEffect: config.formatEffect,
        cap: config.cap,
      };
    },
    name() {
      return `QC${this.challenge.id}`;
    },
  },
  methods: {
    update() {
      const challenge = this.challenge;
      this.isUnlocked = challenge.isUnlocked;
      this.isRunning = challenge.isRunning;
      this.isCompleted = challenge.isCompleted;
    },
  },
});
</script>

<template>
  <ChallengeBox
    :name="name"
    :is-unlocked="isUnlocked"
    :is-running="isRunning"
    :is-completed="isCompleted"
    class="c-challenge-box--quantum"
    @start="challenge.requestStart()"
  >
    <template #top>
      <DescriptionDisplay :config="config" />
      <EffectDisplay
        v-if="isRunning"
        :config="config"
      />
    </template>
    <template #bottom>
      <div class="l-challenge-box__bottom--quantum">
        <span>Goal: {{ format(config.goal.am) }} antimatter and {{ format(config.goal.ma) }} meta-antimatter</span>
        <DescriptionDisplay
          :config="config.reward"
          title="Reward:"
        />
        <EffectDisplay
          :config="rewardConfig"
        />
      </div>
    </template>
  </ChallengeBox>
</template>

<style scoped>
.c-challenge-box--quantum {
  height: 18rem;
  color: var(--color-text);
  background-color: var(--color-prestige--accent);
  border-color: var(--color-quantum);
}

.l-challenge-box__bottom--quantum {
  display: flex;
  flex-direction: column;
  height: 5.5rem;
  justify-content: flex-end;
  align-items: center;
}
</style>
