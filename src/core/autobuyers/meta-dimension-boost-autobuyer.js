import { AutobuyerState } from "./autobuyer";

export class MetaDimensionBoostAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.mdBoost;
  }

  get name() {
    return "Meta-Dimension Boost";
  }

  get isUnlocked() {
    return TimeStudy.metaDimensions.isBought;
  }

  get hasUnlimitedBulk() {
    return true;
  }

  tick() {
    MetaDimensions.boost.maxBuy();
  }
}
