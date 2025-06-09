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

  amount: {
    get red() {
      return player.quantum.colors.red;
    },

    get green() {
      return player.quantum.colors.green;
    },

    get blue() {
      return player.quantum.colors.blue;
    },
  },

  powers: {
    get red() {
      return player.quantum.quarkPowers.red;
    },

    get green() {
      return player.quantum.quarkPowers.green;
    },

    get blue() {
      return player.quantum.quarkPowers.blue;
    },
  },

  powerEffects: {
    get red() {
      return Quarks.powers.red.plus(1).log10().sqrt().div(50).plus(1);
    },

    get green() {
      return Quarks.powers.green.plus(1).log10().root(5).plus(1);
    },

    get blue() {
      return Quarks.powers.blue.plus(1).logPow(0.5);
    },
  },

  getGain(type, color) {
    return new Decimal(0);
  },
};
