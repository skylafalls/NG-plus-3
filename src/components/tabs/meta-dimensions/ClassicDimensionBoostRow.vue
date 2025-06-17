<script>
import PrimaryButton from "@/components/PrimaryButton.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ClassicMetaDimensionBoostRow",
  components: {
    PrimaryButton,
  },
  data() {
    return {
      requirement: {
        tier: 1,
        amount: new Decimal(),
      },
      isBuyable: false,
      purchasedBoosts: new Decimal(),
      lockText: null,
      unlockedByBoost: null,
      requirementText: null,
    };
  },
  computed: {
    dimName() {
      return MetaDimension(this.requirement.tier).displayName;
    },
    boostCountText() {
      if (this.requirementText) {
        return this.requirementText;
      }
      const parts = [this.purchasedBoosts];
      const sum = parts.map(formatInt).join(" + ");
      if (parts.length >= 2) {
        return `${sum} = ${formatInt(parts.sum())}`;
      }
      return sum;
    },
    classObject() {
      return {
        "o-primary-btn--md-boost l-dim-row__prestige-button": true,
      };
    },
  },
  methods: {
    update() {
      const requirement = MetaDimensions.boost.requirement;
      this.requirement.tier = requirement.tier;
      this.requirement.amount.copyFrom(requirement.amount);
      this.isBuyable = requirement.isSatisfied && MetaDimensions.boost.canBeBought;
      this.purchasedBoosts.copyFrom(MetaDimensions.boost.purchasedBoosts);
      this.lockText = MetaDimensions.boost.lockText;
      this.unlockedByBoost = MetaDimensions.boost.unlockedByBoost;
    },
    dimensionBoost(bulk) {
      if (!MetaDimensions.boost.requirement.isSatisfied || !MetaDimensions.boost.canBeBought) {
        return;
      }
      MetaDimensions.boost.manualRequest(bulk);
    },
  },
});
</script>

<template>
  <div class="c-dimension-row c-antimatter-dim-row c-antimatter-prestige-row">
    <div class="l-dim-row__prestige-text c-dim-row__label c-dim-row__label--amount">
      Meta-Dimension Boost ({{ boostCountText }}):
      requires {{ formatInt(requirement.amount) }} {{ dimName }} Dimensions
    </div>
    <PrimaryButton
      :enabled="isBuyable"
      :class="classObject"
      @click.exact="dimensionBoost(true)"
      @click.shift.exact="dimensionBoost(false)"
    >
      {{ unlockedByBoost }}
    </PrimaryButton>
  </div>
</template>

<style scoped>
.o-primary-btn--md-boost {
  width: 25rem;
  height: 5rem;
  position: relative;
  font-size: 0.9rem;
}
</style>
