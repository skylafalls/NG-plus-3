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
    return QuantumSpeedrunMilestone(21).isReached ? 500 / 10 : 500;
  }

  get isUnlocked() {
    return QuantumSpeedrunMilestone(6).isReached;
  }

  get resetTickOn() {
    return PRESTIGE_EVENT.REALITY;
  }

  get hasUnlimitedBulk() {
    return QuantumSpeedrunMilestone(26).isReached;
  }

  tick() {
    super.tick();
    const upgradeName = this._upgradeName;
    DilationUpgrade[upgradeName].purchase(this.hasUnlimitedBulk ? Number.POSITIVE_INFINITY : 1);
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
