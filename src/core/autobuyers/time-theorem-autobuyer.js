import { AutobuyerState } from "./autobuyer";

export class TimeTheoremAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.timeTheorems;
  }

  get name() {
    return "Time Theorem";
  }

  get isUnlocked() {
    return QuantumSpeedrunMilestone(2).isReached;
  }

  get hasUnlimitedBulk() {
    return true;
  }

  tick() {
    TimeTheorems.buyMax(true);
  }
}
