import { AutobuyerState } from "./autobuyer";

export class DischargeGalaxyAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.pairProduction;
  }

  get name() {
    return "Galaxy Discharge";
  }

  get isUnlocked() {
    return TimeStudy.pairProduction.isBought;
  }

  get hasUnlimitedBulk() {
    return true;
  }

  tick() {
    PairProduction.sacrificeGalaxies();
  }
}
