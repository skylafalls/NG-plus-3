<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ModernMetaDimensionBoostRow",
  data() {
    return {
      requirement: {
        tier: 1,
        amount: new Decimal(),
      },
      isBuyable: false,
      purchasedBoosts: new Decimal(),
      imaginaryBoosts: new Decimal(),
      lockText: null,
      unlockedByBoost: null,
      creditsClosed: false,
      requirementText: null,
    };
  },
  computed: {
    isDoomed: () => Pelle.isDoomed,
    dimName() {
      return MetaDimension(this.requirement.tier).shortDisplayName;
    },
    boostCountText() {
      if (this.requirementText) {
        return this.requirementText;
      }
      const parts = [this.purchasedBoosts];
      if (this.imaginaryBoosts.neq(0)) {
        parts.push(this.imaginaryBoosts);
      }
      const sum = parts.map(formatInt).join(" + ");
      if (parts.length >= 2) {
        return `${sum} = ${formatInt(parts.sum())}`;
      }
      return sum;
    },
    classObject() {
      return {
        "o-primary-btn o-primary-btn--new o-primary-btn--dimension-reset": true,
        "o-primary-btn--disabled": !this.isBuyable,
        "o-pelle-disabled-pointer": this.creditsClosed,
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
      this.creditsClosed = GameEnd.creditsEverClosed;
      if (this.isDoomed) {
        this.requirementText = formatInt(this.purchasedBoosts);
      }
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
  <div class="reset-container dimboost">
    <h4>Meta-Dimension Boost ({{ boostCountText }})</h4>
    <span>Requires: {{ formatInt(requirement.amount) }} {{ dimName }} Meta Dimensions</span>
    <button
      :class="classObject"
      @click.exact="dimensionBoost(true)"
      @click.shift.exact="dimensionBoost(false)"
    >
      {{ unlockedByBoost }}
    </button>
  </div>
</template>
