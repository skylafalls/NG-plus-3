import { GameMechanicState } from "../game-mechanics";

export interface PairedChallengeConfig {
  pair: [number, number]
  goal: {
    am: Decimal
    ma: Decimal
  }
}

class PairedChallengeState extends GameMechanicState {
  override get id() {
    return this.config.pair;
  }

  get isRunning() {
    return player.challenge.paired.active && player.challenge.paired.currentPair === this.combination;
  }

  get isUnlocked() {
    return TimeStudy.pairedChallenges.isBought;
  }

  get combination() {
    return player.challenge.paired.combos[this.id];
  }

  set combination(newValue) {
    if (!Array.isArray(newValue)) throw new TypeError("Paired Challenge combinations must be an array.");
    player.challenge.paired.combos[this.id] = newValue;
  }

  get completed() {
    return player.challenge.paired.completedCombos.includes(this.combination);
  }

  override get isEffectActive() {
    return this.isRunning;
  }

  get goal() {
    return this.config.goal;
  }

  complete() {
    player.challenge.paired.active = false;
    player.challenge.paired.completedCombos.push(this.combination);
    for (const challenge of this.combination) {
      QuantumChallenge(challenge).completions++;
    }
  }

  exit() {
    player.challenge.paired.active = false;
    quantumReset(true);
  }

  requestStart() {
    if (!this.isUnlocked) {
      return;
    }
    if (GameEnd.creditsEverClosed) {
      return;
    }
    if (!player.options.confirmations.challenges) {
      this.start();
      return;
    }
    Modal.startQuantumChallenge.show(this.id);
  }

  start() {
    if (!this.isUnlocked || this.isRunning) {
      return;
    }
    quantumReset(true);
    player.challenge.paired.active = true;
  }
}
