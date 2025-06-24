import { IntervaledAutobuyerState } from "./autobuyer";

export class MetaDimensionAutobuyerState extends IntervaledAutobuyerState {
  get tier() {
    return this.id;
  }

  get name() {
    return MetaDimension(this.tier).shortDisplayName;
  }

  get fullName() {
    return `${this.name} Meta Dimension`;
  }

  get data() {
    return player.auto.metaDims.all[this.tier - 1];
  }

  get interval() {
    return 50;
  }

  get isUnlocked() {
    return true;
  }

  get resetTickOn() {
    return PRESTIGE_EVENT.REALITY;
  }

  get hasUnlimitedBulk() {
    return true;
  }

  tick() {
    const tier = this.tier;
    if (!MetaDimension(tier).isAvailableForPurchase) {
      return;
    }
    super.tick();
    MetaDimensions.buyMax(tier, Number.POSITIVE_INFINITY);
  }

  static get entryCount() {
    return 8;
  }

  static get autobuyerGroupName() {
    return "Meta Dimension";
  }

  static get isActive() {
    return player.auto.metaDims.isActive;
  }

  static set isActive(value) {
    player.auto.metaDims.isActive = value;
  }
}
