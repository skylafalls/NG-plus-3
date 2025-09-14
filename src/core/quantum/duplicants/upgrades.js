import { DC } from "@/core/constants";
import { RebuyableMechanicState } from "@/core/game-mechanics";

class DuplicantUpgrade extends RebuyableMechanicState {
  constructor() {
    super({
      id: "NormalDuplicantRebuyable",
      cost: () => Decimal.pow(DC.E100000, player.quantum.duplicants.duplicantRebuyable).mul(DC.E3E6),
      description: () => "Reset Replicanti for a Normal Duplicant.",
      formatCost: value => format(value, 2, 2),
    });
  }

  get currency() {
    return Currency.replicanti.value;
  }

  set currency(newValue) {
    Currency.replicanti.value = newValue;
  }

  get boughtAmount() {
    return player.quantum.duplicants.duplicantRebuyable;
  }

  set boughtAmount(newValue) {
    player.quantum.duplicants.duplicantRebuyable = newValue;
  }

  get isAvailableForPurchase() {
    return true;
  }

  purchase(amount = 1, auto = false) {
    if (!this.canBeBought) {
      return false;
    }
    if (!auto) {
      Currency.quarks.subtract(Decimal.sumGeometricSeries(amount, this.cost, DC.E100000, 0));
    }
    this.boughtAmount = this.boughtAmount.add(amount);
    player.quantum.duplicants.normal = player.quantum.duplicants.normal.add(amount);
    GameUI.update();
    return true;
  }

  buyMax(auto = false) {
    if (!this.canBeBought) {
      return false;
    }
    const purchases = Decimal.affordGeometricSeries(this.currency, this.cost, DC.E100000, 0);
    if (purchases.lte(0)) {
      return false;
    }
    this.purchase(purchases, auto);
    return true;
  }
}

class WorkerLimitRebuyable extends RebuyableMechanicState {
  constructor() {
    // How the "workers limit" rebuybale upgrade works is a little strange...
    // If you don't have emperor dimensions, it is limited to 10 workers, otherwise
    // it upgrades the limit for each emperor dimension until ten, which then
    // it moves on to the next ED, until it hits the final ED (ED8) and then acts
    // like a normal upgrade without any special formulas.
    super({
      id: "WorkerLimitRebuyable",
      cost: () => Decimal.pow(DC.D6, player.quantum.duplicants.workerLimitRebuyable).mul(DC.E49),
      effect: () => player.quantum.duplicants.workerLimitRebuyable,
      formatEffect: (value) => {
        if (TimeStudy.emperorDimension.isBought) {
          if (value.lt(70)) {
            return `${formatInt(value.mod(10))} ED${formatInt(value.div(10))}`;
          }
        }
      },
      description: () => "Reset Replicanti for a Normal Duplicant.",
      formatCost: value => format(value, 2, 2),
    });
  }

  get currency() {
    return Currency.replicanti.value;
  }

  set currency(newValue) {
    Currency.replicanti.value = newValue;
  }

  get boughtAmount() {
    return player.quantum.duplicants.duplicantRebuyable;
  }

  set boughtAmount(newValue) {
    player.quantum.duplicants.duplicantRebuyable = newValue;
  }

  get isAvailableForPurchase() {
    return TimeStudy.emperorDimensions.isBought ? true : this.boughtAmount.lt(10);
  }

  purchase(amount = 1, auto = false) {
    if (!this.canBeBought) {
      return false;
    }
    if (!auto) {
      Currency.quarks.subtract(Decimal.sumGeometricSeries(amount, this.cost, DC.E100000, 0));
    }
    this.boughtAmount = this.boughtAmount.add(amount);
    player.quantum.duplicants.normal = player.quantum.duplicants.normal.add(amount);
    GameUI.update();
    return true;
  }

  buyMax(auto = false) {
    if (!this.canBeBought) {
      return false;
    }
    const purchases = Decimal.affordGeometricSeries(this.currency, this.cost, DC.E100000, 0);
    if (purchases.lte(0)) {
      return false;
    }
    this.purchase(purchases, auto);
    return true;
  }
}
