<script>
import PrimaryButton from "@/components/PrimaryButton.vue";

export default {
  name: "ClassicMetaDimensionBoostRow",
  components: {
    PrimaryButton,
  },
  data() {
    return {
      requirement: {
        tier: 1,
        amount: new Decimal()
      },
      isBuyable: false,
      purchasedBoosts: new Decimal(),
      lockText: null,
      unlockedByBoost: null,
      creditsClosed: false,
      requirementText: null,
    };
  },
  computed: {
    isDoomed: () => Pelle.isDoomed,
    dimName() {
      return MetaDimension(this.requirement.tier).displayName;
    },
    boostCountText() {
      if (this.requirementText) return this.requirementText;
      const parts = [this.purchasedBoosts];
      const sum = parts.map(formatInt).join(" + ");
      if (parts.length >= 2) {
        return `${sum} = ${formatInt(parts.sum())}`;
      }
      return sum;
    },
    classObject() {
      return {
        "o-primary-btn--dimboost l-dim-row__prestige-button": true,
        "o-pelle-disabled-pointer": this.creditsClosed
      };
    }
  },
  methods: {
    update() {
      const requirement = DimBoost.requirement;
      this.requirement.tier = requirement.tier;
      this.requirement.amount.copyFrom(requirement.amount);
      this.isBuyable = requirement.isSatisfied && DimBoost.canBeBought;
      this.purchasedBoosts.copyFrom(DimBoost.purchasedBoosts);
      this.imaginaryBoosts.copyFrom(DimBoost.imaginaryBoosts);
      this.lockText = DimBoost.lockText;
      this.unlockedByBoost = DimBoost.unlockedByBoost;
      this.creditsClosed = GameEnd.creditsClosed;
      if (this.isDoomed) this.requirementText = formatInt(this.purchasedBoosts);
    },
    dimensionBoost(bulk) {
      if (!MetaDimensions.boost.requirement.isSatisfied || !MetaDimensions.boost.canBeBought) return;
      MetaDimensions.boost.manualRequest(bulk);
    }
  }
};
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
      <div
        v-if="hasTutorial"
        class="fas fa-circle-exclamation l-notification-icon"
      />
    </PrimaryButton>
  </div>
</template>

<style scoped>
.o-primary-btn--dimboost {
  width: 22rem;
  height: 5.5rem;
  position: relative;
  font-size: 0.9rem;
}
</style>
