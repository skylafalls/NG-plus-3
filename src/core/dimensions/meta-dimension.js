import { DC } from "../constants";
import { DimensionState } from "./dimension";

export function metaDimensionCommonMultiplier() {
  let multiplier = DC.D1;

  // multiplier = multiplier.times(Achievements.power);
  multiplier = multiplier.timesEffectsOf(
    DilationUpgrade.mdMultTickspeed,
    MasteryStudy(32),
    MasteryStudy(52),
    MasteryStudy(73),
    GluonUpgrade.blueRed(5),
    QuantumChallenge(3).reward,
  );

  if (Achievement(142).isUnlocked) {
    multiplier = multiplier.times(Achievements.power);
  }

  return multiplier;
}

function onBuyDimension(tier) {
  if (tier === 8) Achievement(142).unlock();
  return tier;
}

// This function doesn't do cost checking as challenges generally modify costs, it just buys and updates dimensions
function buyUntilTen(tier) {
  const dimension = MetaDimension(tier);
  dimension.amount = Decimal.round(
    dimension.amount.plus(dimension.remainingUntil10),
  );
  dimension.bought = dimension.bought.add(dimension.remainingUntil10);
  onBuyDimension(tier);
}

class MetaDimensionState extends DimensionState {
  constructor(tier) {
    super(() => player.meta.dimensions, tier);
    const BASE_COSTS = [
      null,
      DC.E1,
      DC.E2,
      DC.E4,
      DC.E6,
      DC.E9,
      DC.E13,
      DC.E18,
      DC.E24,
    ];
    this._baseCost = BASE_COSTS[tier];
    const BASE_COST_MULTIPLIERS = [
      null,
      DC.E3,
      DC.E4,
      DC.E5,
      DC.E6,
      DC.E8,
      DC.E10,
      DC.E12,
      DC.E15,
    ];
    this._baseCostMultiplier = BASE_COST_MULTIPLIERS[tier];
  }

  /**
   * @returns {ExponentialCostScaling}
   */
  get costScale() {
    return new ExponentialCostScaling({
      baseCost: this._baseCost,
      baseIncrease: this._baseCostMultiplier,
      costScale: QuantumChallenge(7).isRunning ? DC.NUMMAX : new Decimal(10),
      scalingCostThreshold: DC.NUMMAX,
    });
  }

  /**
   * @returns {Decimal}
   */
  get cost() {
    return this.costScale.calculateCost(
      this.bought.div(DC.E1).floor().add(this.costBumps),
    );
  }

  /** @returns {number} */
  get costBumps() {
    return this.data.costBumps;
  }

  /** @param {number} value */
  set costBumps(value) {
    this.data.costBumps = value;
  }

  /**
   * @returns {number}
   */
  get boughtBefore10() {
    return this.bought.mod(10);
  }

  /**
   * @returns {number}
   */
  get remainingUntil10() {
    return DC.E1.sub(this.boughtBefore10);
  }

  /**
   * @returns {Decimal}
   */
  get costUntil10() {
    return this.cost.times(this.remainingUntil10);
  }

  get howManyCanBuy() {
    const ratio = this.currencyAmount.dividedBy(this.cost);
    return ratio.min(this.remainingUntil10).max(0).floor();
  }

  /**
   * @returns {Decimal}
   */
  get rateOfChange() {
    const tier = this.tier;
    if (tier === 8 || (tier > 6 && QuantumChallenge(4).isRunning)) {
      return DC.D0;
    }

    let toGain = QuantumChallenge(4).isRunning
      ? MetaDimension(tier + 2).productionPerSecond
      : MetaDimension(tier + 1).productionPerSecond;
    return toGain.times(getGameSpeedupForDisplay()).div(10);
  }

  /**
   * @returns {boolean}
   */
  get isProducing() {
    if (QuantumChallenge(4).isRunning && tier > 6) {
      return false;
    }
    return this.totalAmount.gt(0);
  }

  /**
   * @returns {Decimal}
   */
  get currencyAmount() {
    return Currency.metaAntimatter.value;
  }

  /**
   * @param {Decimal} value
   */
  set currencyAmount(value) {
    Currency.metaAntimatter.value = value;
  }

  /**
   * @returns {number}
   */
  get continuumValue() {
    if (!this.isAvailableForPurchase) {
      return DC.D0;
    }
    // It's safe to use dimension.currencyAmount because this is
    // a dimension-only method (so don't just copy it over to tickspeed).
    // We need to use dimension.currencyAmount here because of different costs in NC6.
    const contVal = this.costScale.getContinuumValue(
      this.currencyAmount,
      DC.E1,
    );
    return contVal ? contVal.times(Laitela.matterExtraPurchaseFactor) : DC.D0;
  }

  /**
   * @returns {number}
   */
  get continuumAmount() {
    return DC.D0;
  }

  /**
   * @returns {Decimal} Total amount
   */
  get totalAmount() {
    return this.amount.max(this.continuumAmount);
  }

  /**
   * @returns {boolean}
   */
  get isAffordable() {
    return this.cost.lte(this.currencyAmount);
  }

  /**
   * @returns {boolean}
   */
  get isAffordableUntil10() {
    return this.costUntil10.lte(this.currencyAmount);
  }

  get isAvailableForPurchase() {
    if (MetaDimensions.boost.totalBoosts.add(4).lt(this.tier)) {
      return false;
    }
    const hasPrevTier = this.tier === 1
      || MetaDimension(this.tier - 1).totalAmount.gt(0);
    if (!hasPrevTier) {
      return false;
    }
    return TimeStudy.metaDimensions.isBought;
  }

  reset() {
    this.amount = DC.D0;
    this.bought = DC.D0;
  }

  resetAmount() {
    this.amount = DC.D0;
  }

  get multiplier() {
    let multiplier = GameCache.metaDimensionCommonMultiplier.value;
    if (this.tier % 2 === 1) {
      multiplier = multiplier.timesEffectOf(QuantumChallenge(4).reward);
    }

    if (this.tier === 1) {
      multiplier = multiplier.timesEffectOf(GluonUpgrade.redGreen(3));
    }

    multiplier = multiplier.mul(Decimal.pow(MetaDimensions.buyTenMultiplier, this.bought.div(10).floor()));
    multiplier = multiplier.mul(MetaDimensions.boost.multiplierToNDTier(this.tier));
    return multiplier;
  }

  get productionPerSecond() {
    let amount = this.totalAmount;
    let production = amount.times(this.multiplier);
    return production;
  }
}

/**
 * @function
 * @param {number} tier
 * @returns {MetaDimensionState}
 */
export const MetaDimension = MetaDimensionState.createAccessor();

class DimBoostRequirement {
  constructor(tier, amount) {
    this.tier = tier;
    this.amount = amount;
  }

  get isSatisfied() {
    const dimension = MetaDimension(this.tier);
    return dimension.totalAmount.gte(this.amount);
  }
}

export const MetaDimensions = {
  /**
   * @type {MetaDimensionState[]}
   */
  all: MetaDimension.index.compact(),

  get metaAMtoDimBoostExponent() {
    let exponent = QuantumChallenge(3).isRunning
      ? player.records.thisQuantum.bestMA.plus(1).log2().max(1)
      : new Decimal(8);
    exponent = Effects.max(exponent, DilationUpgrade.mdEffectBuff);
    exponent = exponent.plusEffectOf(EternityChallenge(13).reward);
    return exponent;
  },

  get dimensionBoostMultiplier() {
    let multiplier = player.records.thisQuantum.bestMA.sub(10).pow(
      this.metaAMtoDimBoostExponent,
    ).max(1);
    if (EternityChallenge(14).isRunning || QuantumChallenge(7).isRunning) {
      return new Decimal(1);
    }
    return multiplier;
  },

  reset() {
    for (const dimension of MetaDimensions.all) {
      dimension.reset();
    }
  },

  resetAmountUpToTier(maxTier) {
    for (const dimension of MetaDimensions.all.slice(0, maxTier)) {
      dimension.resetAmount();
    }
  },

  get buyTenMultiplier() {
    let mult = DC.D2;
    mult = mult.timesEffectOf(DilationUpgrade.mdBuffDT);
    mult = mult.timesEffectOf(QuantumChallenge(6));
    return mult;
  },

  tick(diff) {
    let maxTierProduced = 7;
    let nextTierOffset = 1;
    if (QuantumChallenge(4).isRunning) {
      maxTierProduced--;
      nextTierOffset++;
    }
    for (let tier = maxTierProduced; tier >= 1; --tier) {
      MetaDimension(tier + nextTierOffset).produceDimensions(
        MetaDimension(tier),
        diff.div(10),
      );
    }
    MetaDimension(1).produceCurrency(Currency.metaAntimatter, diff);
  },

  buyOne(tier) {
    const dimension = MetaDimension(tier);
    if (!dimension.isAvailableForPurchase || !dimension.isAffordable) {
      return false;
    }

    const cost = dimension.cost;

    dimension.currencyAmount = dimension.currencyAmount.minus(cost).max(0);
    dimension.amount = dimension.amount.plus(1);
    dimension.bought = dimension.bought.add(1);

    onBuyDimension(tier);

    return true;
  },

  buyMany(tier) {
    const dimension = MetaDimension(tier);
    if (!dimension.isAvailableForPurchase || !dimension.isAffordableUntil10) {
      return false;
    }
    const cost = dimension.costUntil10;

    dimension.currencyAmount = dimension.currencyAmount.minus(cost).max(0);
    dimension.amount = dimension.amount.plus(dimension.remainingUntil10);
    dimension.bought = dimension.bought.add(dimension.remainingUntil10);

    onBuyDimension(tier);

    return true;
  },

  buyAsManyAsYouCanBuy(tier) {
    const dimension = MetaDimension(tier);
    if (!dimension.isAvailableForPurchase || !dimension.isAffordable) {
      return false;
    }
    const howMany = dimension.howManyCanBuy;
    const cost = dimension.cost.times(howMany);

    dimension.currencyAmount = dimension.currencyAmount.minus(cost).max(0);
    dimension.amount = dimension.amount.plus(howMany);
    dimension.bought = dimension.bought.add(howMany);

    onBuyDimension(tier);

    return true;
  },

  buyMax(tier, bulk = Infinity) {
    const dimension = MetaDimension(tier);
    if (!dimension.isAvailableForPurchase || !dimension.isAffordableUntil10) {
      return;
    }
    const cost = dimension.costUntil10;
    let bulkLeft = new Decimal(bulk);

    // Buy any remaining until 10 before attempting to bulk-buy
    if (dimension.currencyAmount.gte(cost)) {
      dimension.currencyAmount = dimension.currencyAmount.minus(cost).max(0);
      buyUntilTen(tier);
      bulkLeft = bulkLeft.sub(1);
    }

    if (bulkLeft.lte(0)) {
      return;
    }

    // This is the bulk-buy math, explicitly ignored if abnormal cost increases are active
    const maxBought = dimension.costScale.getMaxBought(
      Decimal.floor(dimension.bought.div(10)).add(dimension.costBumps),
      dimension.currencyAmount,
      DC.E1,
    );
    if (maxBought === null) {
      return;
    }
    let buying = maxBought.quantity;
    if (buying.gt(bulkLeft)) {
      buying = new Decimal(bulkLeft);
    }
    dimension.amount = dimension.amount.plus(buying);
    dimension.bought = dimension.bought.add(buying);
    dimension.currencyAmount = dimension.currencyAmount.minus(
      Decimal.pow10(maxBought.logPrice),
    ).max(0);
  },

  maxAll() {
    for (let tier = 1; tier < 9; tier++) {
      this.buyMax(tier);
    }
  },

  boost: {
    get power() {
      let boost = new Decimal(2);
      boost = boost.timesEffectsOf(
        DilationUpgrade.mdBuffDT,
        QuantumChallenge(5).reward,
        MasteryStudy(82),
      );
      if (QuantumChallenge(4).isRunning || QuantumChallenge(8).isRunning) {
        return DC.D1;
      }
      return boost;
    },

    multiplierToNDTier(tier) {
      const normalBoostMult = this.power.pow(
        this.purchasedBoosts.add(1).sub(tier),
      ).clampMin(1);
      return normalBoostMult;
    },

    get maxDimensionsUnlockable() {
      return 8;
    },

    get canUnlockNewDimension() {
      return MetaDimensions.boost.purchasedBoosts.add(4).lt(
        MetaDimensions.boost.maxDimensionsUnlockable,
      );
    },

    get maxBoosts() {
      return DC.BEMAX;
    },

    get canBeBought() {
      if (MetaDimensions.boost.purchasedBoosts.gte(this.maxBoosts)) {
        return false;
      }
      return true;
    },

    get lockText() {
      return null;
    },

    get requirement() {
      return this.bulkRequirement(1);
    },

    get unlockedByBoost() {
      if (MetaDimensions.boost.lockText !== null) {
        return MetaDimensions.boost.lockText;
      }
      const boosts = MetaDimensions.boost.purchasedBoosts;
      const allNDUnlocked = EternityMilestone.unlockAllND.isReached;

      let newUnlock = "";
      if (
        !allNDUnlocked
        && boosts.lt(MetaDimensions.boost.maxDimensionsUnlockable - 4)
      ) {
        newUnlock = `unlock the ${formatInt(boosts.add(5))}th Dimension`;
      }

      const formattedMultText = `give a ${
        formatX(MetaDimensions.boost.power, 2, 1)
      } multiplier `;
      let dimensionRange = "to the 1st Dimension";
      if (boosts.gt(0)) {
        dimensionRange = `to Dimensions 1-${Decimal.min(boosts.add(1), 8)}`;
      }
      if (boosts.gte(MetaDimensions.boost.maxDimensionsUnlockable - 1)) {
        dimensionRange = "to all Dimensions";
      }

      let boostEffects;
      if (QuantumChallenge(4).isRunning || QuantumChallenge(8).isRunning) {
        boostEffects = newUnlock;
      } else if (newUnlock === "") {
        boostEffects = `${formattedMultText} ${dimensionRange}`;
      } else {
        boostEffects
          = `${newUnlock} and ${formattedMultText} ${dimensionRange}`;
      }

      if (boostEffects === "") {
        return "Dimension Boosts are currently useless";
      }
      const areDimensionsKept = false;
      if (areDimensionsKept) {
        return boostEffects[0].toUpperCase() + boostEffects.slice(1);
      }
      return `Reset your Dimensions to ${boostEffects}`;
    },

    get purchasedBoosts() {
      return Decimal.fromDecimal(player.meta.boosts.floor());
    },

    get totalBoosts() {
      return Decimal.floor(this.purchasedBoosts);
    },

    get startingDimensionBoosts() {
      return DC.D0;
    },

    manualRequest(bulk) {
      this.request(bulk);
    },

    request(bulk) {
      if (!MetaDimensions.boost.requirement.isSatisfied) {
        return false;
      }
      if (!MetaDimensions.boost.canBeBought) {
        return false;
      }
      if (bulk) {
        this.maxBuy();
      } else {
        this.dimensionBoostReset(1);
      }
    },

    bulkRequirement(bulk) {
      let targetResets = MetaDimensions.boost.purchasedBoosts.add(bulk);
      let amount = DC.D20;
      const tier = Decimal.min(
        targetResets.add(3),
        this.maxDimensionsUnlockable,
      ).toNumber();
      let discount = new Decimal(0);
      if (MasteryStudy(82)) {
        discount = discount.plus(1);
      }

      amount = amount.add(
        targetResets.sub(5).max(0).mul(DC.D15.sub(discount)).round(),
      );
      amount = Decimal.round(amount);

      return new DimBoostRequirement(tier, amount);
    },

    maxBuy() {
      // Boosts that unlock new dims are bought one at a time, unlocking the next dimension
      if (this.canUnlockNewDimension) {
        if (this.requirement.isSatisfied) {
          this.dimensionBoostReset(1);
        }
        return;
      }
      const req1 = this.bulkRequirement(1);
      if (!req1.isSatisfied) {
        return;
      }
      const req2 = this.bulkRequirement(2);
      if (!req2.isSatisfied) {
        this.dimensionBoostReset(1);
        return;
      }

      const tier = this.maxDimensionsUnlockable;
      let amount = DC.D20;
      let discount = DC.D0;
      if (MasteryStudy(82)) {
        discount = discount.plus(1);
      }
      let multiplierPerDB = DC.D15.sub(discount);

      const ad = MetaDimension(tier).totalAmount;
      let calcBoosts = ad.sub(amount).div(multiplierPerDB);

      calcBoosts = calcBoosts.add(4);
      // Dimension boosts 1-4 dont use 8th dims, 1-2 dont use 6th dims, so add those extras afterwards.

      // Add one cause (x-b)/i is off by one otherwise
      if (calcBoosts.floor().add(1).lte(this.purchasedBoosts)) {
        return;
      }
      calcBoosts = calcBoosts.sub(this.purchasedBoosts);
      const minBoosts = Decimal.min(DC.BEMAX, calcBoosts.floor().add(1));

      this.dimensionBoostReset(minBoosts);
    },

    dimensionBoostReset(
      tempBulk,
      forcedADReset = false,
      forcedAMReset = false,
    ) {
      const bulk = Decimal.min(
        tempBulk,
        this.maxBoosts.sub(player.meta.boosts),
      );
      EventHub.dispatch(GAME_EVENT.META_DIMBOOST_BEFORE, bulk);
      player.meta.boosts = Decimal.max(DC.D0, player.meta.boosts.add(bulk));
      if (!forcedADReset) MetaDimensions.reset();
      if (!forcedAMReset) Currency.metaAntimatter.reset();
      EventHub.dispatch(GAME_EVENT.META_DIMBOOST_AFTER, bulk);
    },
  },
};
