import { SetPurchasableMechanicState } from "../game-mechanics";

class BRGluonUpgradeState extends SetPurchasableMechanicState {
  get currency() {
    return player.quantum.gluons.br;
  }

  set currency(value) {
    player.quantum.gluons.br = value;
  }

  get isAvailableForPurchase() {
    return PlayerProgress.quantumUnlocked();
  }

  get cost() {
    return this.config.cost();
  }

  get set() {
    return player.quantum.gluonUpgrades.br;
  }
}

class GBGluonUpgradeState extends SetPurchasableMechanicState {
  get currency() {
    return player.quantum.gluons.gb;
  }

  set currency(value) {
    player.quantum.gluons.gb = value;
  }

  get isAvailableForPurchase() {
    return PlayerProgress.quantumUnlocked();
  }

  get cost() {
    return this.config.cost();
  }

  get set() {
    return player.quantum.gluonUpgrades.gb;
  }
}

class RGGluonUpgradeState extends SetPurchasableMechanicState {
  get currency() {
    return player.quantum.gluons.rg;
  }

  set currency(value) {
    player.quantum.gluons.rg = value;
  }

  get isAvailableForPurchase() {
    return PlayerProgress.quantumUnlocked();
  }

  get cost() {
    return this.config.cost();
  }

  get set() {
    return player.quantum.gluonUpgrades.rg;
  }
}

export const GluonUpgrade = {
  blueRed: BRGluonUpgradeState.createAccessor(GameDatabase.quantum.brGluonUpgrades),
  greenBlue: GBGluonUpgradeState.createAccessor(GameDatabase.quantum.gbGluonUpgrades),
  redGreen: RGGluonUpgradeState.createAccessor(GameDatabase.quantum.rgGluonUpgrades),
};
