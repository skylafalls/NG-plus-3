import { IntervaledAutobuyerState } from "./autobuyer";

export class DilationUpgradeAutobuyerState extends IntervaledAutobuyerState {
  get _upgradeName() {
    return ["dtGain", "galaxyThreshold", "tachyonGain", "tachyonExponent"][this.id - 1];
  }

  get data() {
    return player.auto.dilationUpgrades.all[this.id - 1];
  }

  get name() {
    return [
      "Dilated Time Multiplier",
      "Tachyon Galaxy Threshold",
      "Tachyon Particle Multiplier",
      "Tachyon Exponent Amplifier",
    ][this.id - 1];
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
    super.tick();
    const upgradeName = this._upgradeName;
    DilationUpgrade[upgradeName].purchase(Number.POSITIVE_INFINITY);
  }

  static get entryCount() {
    return 4;
  }

  static get autobuyerGroupName() {
    return "Dilation Upgrade";
  }

  static get isActive() {
    return player.auto.dilationUpgrades.isActive;
  }

  static set isActive(value) {
    player.auto.dilationUpgrades.isActive = value;
  }
}
