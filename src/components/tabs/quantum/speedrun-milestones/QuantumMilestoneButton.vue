<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "QuantumMilestoneButton",
  props: {
    getMilestone: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      isReached: false,
      isLocked: false,
    };
  },
  computed: {
    milestone() {
      return this.getMilestone();
    },
    config() {
      return this.milestone.config;
    },
    timeRequired() {
      return this.config.resetWithin;
    },
    reward() {
      const reward = this.config.reward;
      return typeof reward === "function" ? reward() : reward;
    },
    rewardClassObject() {
      return {
        "o-quantum-milestone__reward": true,
        "o-quantum-milestone__reward--locked": !this.isReached,
        "o-quantum-milestone__reward--reached": this.isReached,
        "o-quantum-milestone__reward--small-font": this.reward.length > 80,
      };
    },
  },
  methods: {
    update() {
      this.isReached = this.milestone.isReached;
    },
    toStringTime(seconds) {
      return TimeSpan.fromSeconds(seconds).toString();
    },
  },
});
</script>

<template>
  <div
    v-if="!config.invisible"
    class="l-quantum-milestone"
  >
    <span class="o-quantum-milestone__goal">
      {{ toStringTime(timeRequired) }}:
    </span>
    <button
      :class="rewardClassObject"
    >
      <span>
        {{ reward }}
      </span>
    </button>
  </div>
</template>

<style scoped>
.o-quantum-milestone__goal {
  text-align: left;
  font-size: 1.3rem;
}

.o-quantum-milestone__reward {
  width: 25rem;
  height: 8rem;
  font-family: Typewriter, serif;
  font-size: 1.2rem;
  font-weight: bold;
  color: black;
  border: 0.1rem solid var(--color-quantum);
  border-radius: var(--var-border-radius, 0.4rem);
  transition-duration: 0.2s;
}

.o-quantum-milestone__reward--locked {
  background-color: dimgrey;
}

.o-quantum-milestone__reward--reached {
  background-color: var(--color-quantum);
  border-color: black;
}

.o-quantum-milestone__reward--small-font {
  font-size: 1.1rem;
}

.l-quantum-milestone {
  display: flex;
  flex-direction: column;
}
</style>
