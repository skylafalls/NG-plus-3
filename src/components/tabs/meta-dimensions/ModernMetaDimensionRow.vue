<script>
import GenericDimensionRowText from "@/components/GenericDimensionRowText";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ModernMetaDimensionRow",
  components: {
    GenericDimensionRowText
  },
  props: {
    tier: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
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
      buyUntil10: true,
      howManyCanBuy: new Decimal(0),
      isShown: false,
      isCostsAD: false,
    };
  },
  computed: {
    isDoomed: () => Pelle.isDoomed,
    name() {
      return `${MetaDimension(this.tier).shortDisplayName} Meta Dimension`;
    },
    costDisplay() {
      return this.buyUntil10 ? format(this.until10Cost) : format(this.singleCost);
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
    buttonPrefix() {
      return `Buy ${formatInt(this.howManyCanBuy)}`;
    },
    buttonValue() {
      if (this.isCapped) return "";
      const prefix = this.showCostTitle(this.buyUntil10 ? this.until10Cost : this.singleCost) ? "Cost: " : "";
      const suffix = this.isCostsAD ? this.costUnit : "MA";
      return `${prefix}${this.costDisplay} ${suffix}`;
    },
    hasLongText() {
      return this.buttonValue.length > 20;
    },
  },
  methods: {
    update() {
      const tier = this.tier;
      if (tier > MetaDimensions.boost.maxDimensionsUnlockable && !this.isDoomed) return;
      const dimension = MetaDimension(tier);
      this.isUnlocked = dimension.isAvailableForPurchase;
      const buyUntil10 = player.meta.buyUntil10;
      this.isCapped = false;
      this.multiplier.copyFrom(MetaDimension(tier).multiplier);
      this.amount.copyFrom(dimension.totalAmount);
      this.bought.copyFrom(dimension.bought);
      this.boughtBefore10.copyFrom(dimension.boughtBefore10);
      this.howManyCanBuy.copyFrom(buyUntil10 ? dimension.howManyCanBuy : Decimal.min(dimension.howManyCanBuy, 1));
      this.singleCost.copyFrom(dimension.cost);
      this.until10Cost.copyFrom(dimension.cost.times(Decimal.max(dimension.howManyCanBuy, 1)));
      this.rateOfChange.copyFrom(dimension.rateOfChange)
      this.isAffordable = dimension.isAffordable;
      this.buyUntil10 = buyUntil10;
      this.isShown = (MetaDimensions.boost.totalBoosts.gt(0) && MetaDimensions.boost.totalBoosts.add(3).gte(tier));
      this.isCostsAD = false; // NormalChallenge(6).isRunning && tier > 2 && !this.isContinuumActive;
    },
    buy() {
      if (this.howManyCanBuy.eq(1)) {
        MetaDimensions.buyOne(this.tier);
      } else {
        MetaDimensions.buyAsManyAsYouCanBuy(this.tier);
      }
    },
    showCostTitle(value) {
      return value.lt("1e1000000");
    },
    buttonClass() {
      return {
        "o-primary-btn o-primary-btn--new": true,
        "o-primary-btn--disabled": !this.isAffordable || !this.isUnlocked || this.isCapped,
      };
    },
    buttonTextClass() {
      return {
        "button-content l-modern-buy-md-text": true,
      };
    }
  }
});
</script>

<template>
  <div
    v-show="showRow"
    class="c-dimension-row l-dimension-row-meta-dim c-antimatter-dim-row l-dimension-single-row"
    :class="{ 'c-dim-row--not-reached': !isUnlocked }"
  >
    <GenericDimensionRowText
      :tier="tier"
      :name="name"
      :multiplier-text="formatX(multiplier, 2, 2)"
      :amount="amount"
      :rate="rateOfChange"
    />
    <div class="l-dim-row-multi-button-container c-modern-dim-tooltip-container">
      <div class="c-modern-dim-purchase-count-tooltip">
        {{ boughtTooltip }}
      </div>
      <button
        :class="buttonClass()"
        @click="buy"
      >
        <div :class="buttonTextClass()">
          <div>
            {{ buttonPrefix }}
          </div>
          <div :class="{ 'l-dim-row-small-text': hasLongText }">
            {{ buttonValue }}
          </div>
        </div>
        <div
          v-if="isUnlocked && !isCapped"
          class="fill"
        >
          <div
            class="fill-purchased"
            :style="{ 'width': boughtBefore10.toNumber()*10 + '%' }"
          />
          <div
            class="fill-possible"
            :style="{ 'width': howManyCanBuy.toNumber()*10 + '%' }"
          />
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.l-modern-buy-ad-text {
  display: flex;
  flex-direction: column;
}

.o-non-clickable {
  cursor: auto;
}
</style>
