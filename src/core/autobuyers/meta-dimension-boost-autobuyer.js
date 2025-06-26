import { AutobuyerState } from "./autobuyer";

export class MetaDimensionBoostAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.mdBoost;
  }

  get name() {
    return "Meta-Dimension Boost";
  }

  get isUnlocked() {
    return QuantumSpeedrunMilestone(15).isReached;
  }

  get hasUnlimitedBulk() {
    return QuantumSpeedrunMilestone(27).isReached;
  }

  tick() {
    if (this.hasUnlimitedBulk) {
      MetaDimensions.boost.maxBuy();
    } else {
      MetaDimensions.boost.request(1);
    }
  }
}
