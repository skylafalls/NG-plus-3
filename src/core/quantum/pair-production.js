import { GameMechanicState, RebuyableMechanicState } from "../game-mechanics";

class ElectronsEffectState extends GameMechanicState {
  constructor() {
    super({});
    this.cachedEffectValue = new Lazy(() => {
      let eff = player.quantum.pair.electrons.pow(1.25);
      if (eff.gte(1e6)) {
        eff = eff.div(1e6).pow(0.7).mul(1e12);
      }
      return eff;
    });
  }

  get isCustomEffect() {
    return true;
  }

  get effectValue() {
    return this.cachedEffectValue.value;
  }

  get canBeApplied() {
    return (PlayerProgress.quantumUnlocked() && TimeStudy.pairProduction.isBought) || true;
  }

  get type() {
    return "Positron";
  }
}
class PositronsEffectState extends GameMechanicState {
  constructor() {
    super({});
    this.cachedEffectValue = new Lazy(() => {
      let eff = player.quantum.pair.positrons.plus(1);
      if (eff.gte(1e5)) {
        eff = eff.div(1e5).pow(0.5).mul(1e5);
      }
      return eff;
    });
  }

  get isCustomEffect() {
    return true;
  }

  get effectValue() {
    return this.cachedEffectValue.value;
  }

  get canBeApplied() {
    return (PlayerProgress.quantumUnlocked() && TimeStudy.pairProduction.isBought) || true;
  }
}

class ElectronsUpgradeState extends RebuyableMechanicState {
  constructor(config) {
    config.effect = () => this.boughtAmount.times(this.config.multiplierIncrement());
    super(config);
  }

  get cost() {
    return Decimal.pow(this.config.increment, Decimal.pow(this.boughtAmount.plus(1), 3)).times(this.config.initialCost).round();
  }

  get bulk() {
    return this.currency.max(1).cbrt().log(this.config.increment).div(this.config.initialCost).floor();
  }

  get currency() {
    switch (this.id) {
      case 1: {
        return player.timestudy.theorem;
      }
      case 2: {
        return player.dilation.dilatedTime;
      }
      case 3: {
        return player.meta.antimatter;
      }
      case 4: {
        return player.meta.boosts;
      }
      default: {
        throw new TypeError("Unknown currency");
      }
    }
  }

  set currency(amount) {
    switch (this.id) {
      case 1: {
        player.timestudy.theorem = amount;
        break;
      }
      case 2: {
        player.dilation.dilatedTime = amount;
        break;
      }
      case 3: {
        player.meta.antimatter = amount;
        break;
      }
      case 4: {
        player.meta.boosts = amount;
        break;
      }
      default: {
        throw new TypeError("Unknown currency");
      }
    }
  }

  get boughtAmount() {
    return player.quantum.pair.electronUpgrades[this.id - 1];
  }

  set boughtAmount(value) {
    player.quantum.pair.electronUpgrades[this.id - 1] = value;
  }

  get type() {
    return "electron";
  }

  /*
  purchase() {
    if (this.currency.lt(this.cost)) {
      return false;
    }
    this.boughtAmount = this.boughtAmount.max(this.bulk);
    this.currency = this.currency.sub(this.cost).max(0);
    return true;
  }
  */

  purchase() {
    while (this.currency.gte(this.cost)) {
      this.boughtAmount = this.boughtAmount.plus(1);
    }
  }
}
class PositronsUpgradeState extends RebuyableMechanicState {
  constructor(config) {
    config.effect = () => this.boughtAmount.times(this.config.multiplierIncrement());
    super(config);
  }

  get cost() {
    return Decimal.pow(this.config.increment, Decimal.pow(this.boughtAmount.plus(1), 3)).times(this.config.initialCost).round();
  }

  get bulk() {
    return this.currency.max(1).cbrt().log(this.config.increment).div(this.config.initialCost).floor();
  }

  get currency() {
    switch (this.id) {
      case 1: {
        return player.timestudy.theorem;
      }
      case 2: {
        return player.dilation.dilatedTime;
      }
      case 3: {
        return player.meta.antimatter;
      }
      case 4: {
        return player.meta.boosts;
      }
      default: {
        throw new TypeError("Unknown currency");
      }
    }
  }

  set currency(amount) {
    switch (this.id) {
      case 1: {
        player.timestudy.theorem = amount;
        break;
      }
      case 2: {
        player.dilation.dilatedTime = amount;
        break;
      }
      case 3: {
        player.meta.antimatter = amount;
        break;
      }
      case 4: {
        player.meta.boosts = amount;
        break;
      }
      default: {
        throw new TypeError("Unknown currency");
      }
    }
  }

  get boughtAmount() {
    return player.quantum.pair.positronUpgrades[this.id - 1];
  }

  set boughtAmount(value) {
    player.quantum.pair.positronUpgrades[this.id - 1] = value;
  }

  get type() {
    return "positron";
  }

  /*
  purchase() {
    if (this.currency.lt(this.cost)) {
      return false;
    }
    this.boughtAmount = this.boughtAmount.max(this.bulk);
    this.currency = this.currency.sub(this.cost).max(0);
    return true;
  }
  */

  purchase() {
    while (this.currency.gte(this.cost)) {
      this.boughtAmount = this.boughtAmount.plus(1);
    }
  }
}

export const ElectronUpgrade = ElectronsUpgradeState.createAccessor(GameDatabase.quantum.electronMultiplierUpgrades);
export const PositronUpgrade = PositronsUpgradeState.createAccessor(GameDatabase.quantum.positronMultiplierUpgrades);

export const PairProduction = {
  electronEffect: new ElectronsEffectState(),
  positronEffect: new PositronsEffectState(),

  get electronMultiplier() {
    let multiplier = new Decimal(1);
    for (const upgrade of [1, 2, 3, 4]) {
      multiplier = multiplier.plusEffectOf(ElectronUpgrade(upgrade));
    }
    return multiplier;
  },

  get positronMultiplier() {
    let multiplier = new Decimal(1);
    for (const upgrade of [1, 2, 3, 4]) {
      multiplier = multiplier.plusEffectOf(PositronUpgrade(upgrade));
    }
    return multiplier;
  },

  get canDischarge() {
    return player.galaxies.gt(player.quantum.pair.dischargedGalaxies);
  },

  sacrificeGalaxies() {
    if (!this.canDischarge) {
      return false;
    }
    player.quantum.pair.dischargedGalaxies = player.galaxies;

    player.quantum.pair.positrons = player.quantum.pair.positrons
      .plus(player.quantum.pair.dischargedGalaxies.mul(this.positronMultiplier));
    player.quantum.pair.electrons = player.quantum.pair.electrons
      .plus(player.quantum.pair.dischargedGalaxies.mul(this.electronMultiplier));

    this.electronEffect.cachedEffectValue.invalidate();
    this.positronEffect.cachedEffectValue.invalidate();
    return true;
  },
};
