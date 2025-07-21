<script>
import { defineComponent } from "vue";
import HeaderCenterContainer from "./prestige-header/HeaderCenterContainer.vue";
import HeaderEternityContainer from "./prestige-header/HeaderEternityContainer.vue";
import HeaderInfinityContainer from "./prestige-header/HeaderInfinityContainer.vue";
import HeaderQuantumContainer from "./prestige-header/HeaderQuantumContainer.vue";

export default defineComponent({
  name: "HeaderPrestigeGroup",
  components: {
    HeaderCenterContainer,
    HeaderEternityContainer,
    HeaderQuantumContainer,
    HeaderInfinityContainer,
  },
  data: () => ({ extendedContainer: false }),
  computed: {
    classObject() {
      return {
        "c-prestige-info-blocks": !this.extendedContainer,
        "c-prestige-info-blocks--extended": this.extendedContainer,
      };
    },
    percentile() {
      return this.extendedContainer ? "45%" : "0%";
    }
  },
  methods: {
    update() {
      this.extendedContainer = Player.canStudyQuantum || PlayerProgress.quantumUnlocked();
    },
  },
});
</script>

<template>
  <div :class="classObject">
    <HeaderEternityContainer class="l-game-header__eternity" />
    <HeaderQuantumContainer class="l-game-header__quantum" />
    <HeaderInfinityContainer class="l-game-header__infinity" />
    <HeaderCenterContainer class="l-game-header__center" />
  </div>
</template>

<style scoped>
.c-prestige-info-blocks {
  display: flex;
  flex-direction: row;
  height: 14rem;
  width: 100%;
  color: var(--color-text);
}

.c-prestige-info-blocks--extended {
  display: flex;
  flex-direction: row;
  height: 25.5rem;
  width: 100%;
  color: var(--color-text);
}

.l-game-header__eternity {
  position: absolute;
  left: calc(25% - 22rem);
  width: 22rem;
}

.l-game-header__center {
  position: relative;
  left: calc(50% - 25rem);
  top: v-bind(percentile);
  width: 50rem;
}

.l-game-header__infinity {
  position: absolute;
  right: calc(25% - 22rem);
  width: 22rem;
}

.l-game-header__quantum {
  position: absolute;
  left: calc(50% - 11rem);
  width: 22rem;
}
</style>
