import { RebuyableMechanicState } from "../game-mechanics/rebuyable.js";
import { DC } from "../constants.js";

class QuarkMultUpgrade extends RebuyableMechanicState {
  constructor() {
    super({
      id: "quarkMultiplierUpgrade",
      cost: () => Decimal.pow(DC.D5, player.quantum.multiplierUpgrades),
      description: () => `Multiply Quarks gain by ${formatX(2)}`,
      effect: () => DC.D2.pow(player.quantum.multiplierUpgrades),
      formatEffect: value => formatX(value, 2, 2),
      formatCost: value => format(value, 2, 2),
    });
  }

  get currency() {
    return Currency.quarks.value;
  }

  set currency(newValue) {
    Currency.quarks.value = newValue;
  }

  get boughtAmount() {
    return player.quantum.multiplierUpgrades;
  }

  set boughtAmount(newValue) {
    player.quantum.multiplierUpgrades = newValue;
  }

  get isCapped() {
    return false;
  }

  get isBought() {
    return this.isCapped;
  }

  get isAvailableForPurchase() {
    return true;
  }

  purchase(amount = 1) {
    if (!this.canBeBought) {
      return false;
    }
    Currency.quarks.subtract(
      Decimal.sumGeometricSeries(amount, this.cost, DC.D5, 0),
    );
    player.quantum.multiplierUpgrades = player.quantum.multiplierUpgrades.add(
      amount,
    );
    GameUI.update();
    return true;
  }

  buyMax() {
    if (!this.canBeBought) {
      return false;
    }
    const availableQuarks = Currency.quarks.value;
    const purchases = Decimal.affordGeometricSeries(
      availableQuarks,
      this.cost,
      DC.D5,
      0,
    );
    if (purchases.lte(0)) {
      return false;
    }
    this.purchase(purchases);
    return true;
  }
}

export const QUARK_TYPES = Object.freeze({
  RED: "RED",
  GREEN: "GREEN",
  BLUE: "BLUE"
})

export const Quarks = {
  multiplierUpgrade: new QuarkMultUpgrade(),

  get netTotal() {
    let total = Currency.quarks.value;
    total = total.plus(Quarks.amount.red).plus(Quarks.amount.green).plus(
      Quarks.amount.blue,
    );
    return total;
  },

  get red() {
    return {
      amount: player.quantum.colors.red,
      powers: player.quantum.quarkPowers.red,
      effect: () =>
        player.quantum.quarkPowers.red.plus(1).log10().sqrt().div(30).plus(1),
      gain: () => player.quantum.colors.red.pow(2.5),
    };
  },

  get green() {
    return {
      amount: player.quantum.colors.green,
      powers: player.quantum.quarkPowers.green,
      effect: () => player.quantum.quarkPowers.green.plus(1).log10().sqrt().plus(1),
      gain: () => player.quantum.colors.green.pow(0.9),
    };
  },

  get blue() {
    return {
      amount: player.quantum.colors.blue,
      powers: player.quantum.quarkPowers.blue,
      effect: () => player.quantum.quarkPowers.blue.plus(1).logPow(0.75),
      gain: () => player.quantum.colors.blue.pow(0.6),
    };
  },

  get gain() {
    const logDivisor = 616.5094311198335;
    let baseGain = player.meta.antimatter.plus(1).log10().div(logDivisor).max(
      0,
    );
    baseGain = baseGain.timesEffectsOf(
      this.multiplierUpgrade,
      Achievement(156),
    );
    return baseGain.round();
  },

  tick(diff) {
    for (const color of ["red", "green", "blue"]) {
      player.quantum.quarkPowers[color] = player.quantum.quarkPowers[color]
        .add(this[color].gain().times(diff.div(1000)));
    }
  },

  assortTo(amount, color) {
    Currency.quarks.purchase(amount);
    switch (color) {
      case QUARK_TYPES.RED: {
        player.quantum.colors.red = player.quantum.colors.red.plus(amount);
        break;
      }
      case QUARK_TYPES.GREEN: {
        player.quantum.colors.green = player.quantum.colors.green.plus(amount);
        break;
      }
      case QUARK_TYPES.BLUE: {
        player.quantum.colors.blue = player.quantum.colors.blue.plus(amount);
        break;
      }
      default: {
        throw new TypeError("Unrecongized Quark color");
      }
    }
  },
};
