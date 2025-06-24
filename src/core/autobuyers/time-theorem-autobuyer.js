import { AutobuyerState } from "./autobuyer";

export class TimeTheoremAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.timeTheorems;
  }

  get name() {
    return "Time Theorem";
  }

  get isUnlocked() {
    return true;
  }

  get hasUnlimitedBulk() {
    return true;
  }

  tick() {
    if (this.hasUnlimitedBulk) {
      TimeTheorems.buyMax(true);
    } else {
      TimeTheorems.buyOneOfEach();
    }
  }
}
