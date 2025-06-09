<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "InfinityChallengeStartModal",
  components: {
    ModalWrapperChoice,
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  computed: {
    challenge() {
      return QuantumChallenge(this.id);
    },
    challengeIsCompleted() {
      return this.challenge.isCompleted;
    },
    message() {
      return `You will reset quantum physics (if possible) and start a new Quantum within the Challenge with all the
        Challenge-specific restrictions and modifiers active.
        To complete the Challenge${this.challengeIsCompleted ? "" : " and gain its reward"},
        you must reach the Challenge goal of
        ${format(QuantumChallenge(this.id).goal.am)} Antimatter and ${format(QuantumChallenge(this.id).goal.ma)} Meta-Antimatter.
        Positrons are disabled regardless of upgrades.`;
    },
    entranceLabel() {
      return `You are about to enter Quantum Challenge ${this.id}`;
    },
    reward() {
      let rewardDescription = this.challenge._config.reward.description;
      if (typeof rewardDescription === "function") {
        rewardDescription = rewardDescription();
      }
      return `The reward for completing this challenge is: ${rewardDescription}`;
    },
    condition() {
      let conditionOfChallenge = this.challenge._config.description;
      if (typeof conditionOfChallenge === "function") {
        conditionOfChallenge = conditionOfChallenge();
      }
      return `Inside this Quantum Challenge, ${conditionOfChallenge}`;
    },
  },
  created() {
    this.on$(GAME_EVENT.ETERNITY_RESET_AFTER, this.emitClose);
    this.on$(GAME_EVENT.REALITY_RESET_AFTER, this.emitClose);
  },
  methods: {
    handleYesClick() {
      this.challenge.start();
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="challenges"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ entranceLabel }}
    </template>
    <div class="c-modal-message__text">
      {{ message }}
      <br><br>
      {{ condition }}
    </div>
    <div
      v-if="!challengeIsCompleted"
      class="c-modal-message__text"
    >
      <br>
      {{ reward }}
    </div>
    <template #confirm-text>
      Begin
    </template>
  </ModalWrapperChoice>
</template>
