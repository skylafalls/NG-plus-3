import { GameMechanicState } from "../game-mechanics/game-mechanic.js";

class QuarkMultUpgrade extends GameMechanicState {
  get cost() {
    return Decimal.pow(this.costIncrease, this.purchaseCount.add(1));
  }

  get purchaseCount() {
    return player.quantum.multiplierUpgrades;
  }

  get hasIncreasedCost() {
    return this.purchaseCount.gte(this.purchasesAtIncrease);
  }

  get costIncrease() {
    return typeof this.config.costIncrese === "function" ? this.config.costIncrese() : this.config.costIncrese;
  }

  get isCapped() {
    return false;
  }

  get isBought() {
    return this.isCapped;
  }

  get isRequirementSatisfied() {
    return player.quantum.times.gte(1);
  }

  get canBeBought() {
    return !this.isCapped && Currency.quarks.gte(this.cost) && this.isRequirementSatisfied;
  }

  purchase(amount = 1) {
    if (!this.canBeBought) {
      return;
    }
    Currency.quarks.subtract(Decimal.sumGeometricSeries(amount, this.cost, this.costIncrease, 0));
    player.quantum.multiplierUpgrades = player.quantum.multiplierUpgrades.add(amount);
    GameUI.update();
  }

  buyMax() {
    if (!this.canBeBought) {
      return;
    }
    const availableQuarks = Currency.quarks.value.clampMax(this.config.costCap);
    const purchases = Decimal.affordGeometricSeries(availableQuarks, this.cost, this.costIncrease, 0);
    if (purchases.lte(0)) {
      return;
    }
    this.purchase(purchases);
  }
}

export const Quarks = {
  multiplierUpgrade: new QuarkMultUpgrade(GameDatabase.quantum.quarkMultiplierConfig),

  get netTotal() {
    let total = Currency.quarks.value;
    total = total.plus(Quarks.amount.red).plus(Quarks.amount.green).plus(Quarks.amount.blue);
    return total;
  },

  get red() {
    return {
      amount: player.quantum.colors.red,
      powers: player.quantum.quarkPowers.red,
      effect: () => player.quantum.quarkPowers.red.plus(1).log10().sqrt().div(50).plus(1),
      gain: () => new Decimal(0),
    };
  },

  get green() {
    return {
      amount: player.quantum.colors.green,
      powers: player.quantum.quarkPowers.green,
      effect: () => player.quantum.quarkPowers.green.plus(1).log10().root(5).plus(1),
      gain: () => new Decimal(0),
    };
  },

  get blue() {
    return {
      amount: player.quantum.colors.green,
      powers: player.quantum.quarkPowers.green,
      effect: () => player.quantum.quarkPowers.green.plus(1).logPow(0.5),
      gain: () => new Decimal(0),
    };
  },

  get gain() {
    const logDivisor = 924.7641466797505;
    let baseGain = player.meta.antimatter.plus(1).log10().div(logDivisor).max(0);
    return baseGain;
  },
};
