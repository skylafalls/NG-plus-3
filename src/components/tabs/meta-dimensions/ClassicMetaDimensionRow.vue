<script>
import GenericDimensionRowText from "@/components/GenericDimensionRowText.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ClassicMetaDimensionRow",
  components: {
    GenericDimensionRowText,
    PrimaryButton
  },
  props: {
    tier: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      end: false,
      isUnlocked: false,
      isCapped: false,
      multiplier: new Decimal(0),
      amount: new Decimal(0),
      bought: new Decimal(0),
      boughtBefore10: new Decimal(0),
      rateOfChange: new Decimal(0),
      singleCost: new Decimal(0),
      until10Cost: new Decimal(0),
      isAffordable: false,
      isAffordableUntil10: false,
      isShown: false,
      isCostsAD: false,
      formattedAmount: null,
    };
  },
  computed: {
    isDoomed: () => Pelle.isDoomed,
    name() {
      return `${MetaDimension(this.tier).shortDisplayName} Meta Dimension`;
    },
    singleText() {
      if (this.isCapped) return "Capped";
      const prefix = this.showCostTitle(this.singleCost) ? "Cost: " : "";
      const suffix = this.isCostsAD ? `${this.costUnit}` : "M-AM";
      return `${prefix} ${format(this.singleCost)} ${suffix}`;
    },
    until10Text() {
      const prefix = `Until ${formatInt(10)},${this.showCostTitle(this.until10Cost) ? " Cost" : ""}`;
      const suffix = this.isCostsAD ? `${this.costUnit}` : "AM";
      return `${prefix} ${format(this.until10Cost)} ${suffix}`;
    },
    showRow() {
      return this.isShown || this.isUnlocked || this.amount.gt(0);
    },
    boughtTooltip() {
      return `Purchased ${quantifyInt("time", this.bought)}`;
    },
    costUnit() {
      return `${MetaDimension(this.tier - 2).shortDisplayName} MD`;
    },
    buySingleClass() {
      return {
        "o-primary-btn--buy-ad o-primary-btn--buy-single-ad c-dim-tooltip-container": true,
        "l-dim-row-small-text": this.isLongText(this.singleText) || !this.showCostTitle(this.singleCost),
      };
    },
    buyTenClass() {
      return {
        "o-primary-btn--buy-ad o-primary-btn--buy-dim c-dim-tooltip-container": true,
        "o-primary-btn--buy-10-ad": true,
        "l-dim-row-small-text": this.isLongText(this.until10Text)
      };
    }
  },
  methods: {
    update() {
      const tier = this.tier;
      if (tier === 8 && this.isDoomed) this.formattedAmount = formatInt(this.amount);
      if (tier > MetaDimensions.boost.maxDimensionsUnlockable) return;
      const dimension = MetaDimension(tier);
      this.isUnlocked = dimension.isAvailableForPurchase;
      this.isCapped = tier === 8 && Enslaved.isRunning && dimension.bought.gte(1);
      this.multiplier.copyFrom(dimension.multiplier);
      this.amount.copyFrom(dimension.totalAmount);
      this.bought.copyFrom(dimension.bought);
      this.boughtBefore10.copyFrom(dimension.boughtBefore10);
      this.singleCost.copyFrom(dimension.cost);
      this.until10Cost.copyFrom(dimension.costUntil10);
      this.rateOfChange.copyFrom(dimension.rateOfChange)
      this.isAffordable = dimension.isAffordable;
      this.isAffordableUntil10 = dimension.isAffordableUntil10;
      this.isShown = (MetaDimensions.boost.totalBoosts.gt(0) && MetaDimensions.boost.totalBoosts.add(3).gte(tier));
      this.isCostsAD = false; //NormalChallenge(6).isRunning && tier > 2 && !this.isContinuumActive;
    },
    buySingle() {
      MetaDimensions.buyOne(this.tier);
    },
    buyUntil10() {
      MetaDimensions.buyMany(this.tier);
    },
    showCostTitle(value) {
      return value.max(1).log10().lte(1e6);
    },
    isLongText(str) {
      return str.length > 20;
    },
    tutorialClass() {
      return {
        "l-glow-container": true,
        "tutorial--glow": this.isAffordable && this.hasTutorial
      };
    },
  }
});
</script>

<template>
  <div
    v-show="showRow"
    class="c-dimension-row c-antimatter-dim-row l-dimension-single-row"
    :class="{ 'c-dim-row--not-reached': !isUnlocked }"
  >
    <GenericDimensionRowText
      :tier="tier"
      :name="name"
      :multiplier-text="formatX(multiplier, 2, 2)"
      :amount="amount"
      :rate="rateOfChange"
    />
    <div class="l-dim-row-multi-button-container">
      <PrimaryButton
        :enabled="isAffordable && !isCapped && isUnlocked"
        :class="buySingleClass"
        @click="buySingle"
      >
        <div :class="tutorialClass()">
          {{ singleText }}
        </div>
        <div class="c-dim-purchase-count-tooltip">
          {{ boughtTooltip }}
        </div>
        <div
          v-if="hasTutorial"
          class="fas fa-circle-exclamation l-notification-icon"
        />
      </PrimaryButton>
      <PrimaryButton
        :enabled="isAffordableUntil10 && !isCapped && isUnlocked"
        :class="buyTenClass"
        @click="buyUntil10"
      >
        {{ until10Text }}
        <div class="c-dim-purchase-count-tooltip">
          {{ boughtTooltip }}
        </div>
      </PrimaryButton>
    </div>
  </div>
</template>

<style scoped>
.l-glow-container {
  display: flex;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  border-radius: var(--var-border-radius, inherit);
}
</style>
