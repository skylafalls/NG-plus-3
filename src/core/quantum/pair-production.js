import { GameMechanicState } from "../game-mechanics";

class ElectronsEffectState extends GameMechanicState {
  constructor() {
    super({});
    this.cachedEffectValue = new Lazy(() => {
      let eff = player.quantum.pair.electrons.pow(2.5);
      if (eff.gte(1e12)) {
        eff = eff.div(1e12).pow(0.7).mul(1e12);
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
    return (PlayerProgress.quantumUnlocked() && TimeStudy.pairProduction.isBought);
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
    return (PlayerProgress.quantumUnlocked() && TimeStudy.pairProduction.isBought);
  }
}

export const PairProduction = {
  electronEffect: new ElectronsEffectState(),
  positronEffect: new PositronsEffectState(),
};
