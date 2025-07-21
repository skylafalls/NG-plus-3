import { GameMechanicState } from "../game-mechanics";
import { deepmergeAll } from "@/utility/deepmerge";

class QuantumChallengeRewardState extends GameMechanicState {
  constructor(config, challenge) {
    const configCopy = deepmergeAll([{}, config]);
    configCopy.effect = () => config.effect(challenge.completions);
    super(configCopy);
    this._challenge = challenge;
  }

  get isEffectActive() {
    return this._challenge.completions > 0;
  }
}

class QuantumChallengeState extends GameMechanicState {
  constructor(config) {
    super(config);
    this._reward = new QuantumChallengeRewardState(config.reward, this);
  }

  get isUnlocked() {
    if (this.id === 1) {
      return TimeStudy.quantumChallenges.isBought;
    }
    return TimeStudy.quantumChallenges.isBought && QuantumChallenge(this.id - 1).isCompleted;
  }

  get completions() {
    return player.challenge.quantum.completions[this.id - 1];
  }

  set completions(newValue) {
    player.challenge.quantum.completions[this.id - 1] = newValue;
  }

  get isRunning() {
    return player.challenge.quantum.current === this.id || dev.pairedQCs.includes(this.id);
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
    player.challenge.quantum.current = this.id;
  }

  get isCompleted() {
    return player.challenge.quantum.completions[this.id - 1] >= 1;
  }

  complete() {
    player.challenge.quantum.current = 0;
    player.challenge.quantum.completions[this.id - 1] = 1;
  }

  get isEffectActive() {
    return this.isRunning;
  }

  /**
   * @returns {QuantumChallengeRewardState}
   */
  get reward() {
    return this._reward;
  }

  get goal() {
    return this.config.goal;
  }

  exit() {
    player.challenge.quantum.current = 0;
    quantumReset(true);
  }
}

/**
 * @param {number} id
 * @returns {QuantumChallengeState}
 */
export const QuantumChallenge = QuantumChallengeState.createAccessor(
  GameDatabase.challenges.quantum,
);

/**
 * @returns {QuantumChallengeState}
 */
Object.defineProperty(QuantumChallenge, "current", {
  get: () => (player.challenge.quantum.current === 0
    ? undefined
    : QuantumChallenge(player.challenge.quantum.current)),
});

Object.defineProperty(QuantumChallenge, "isRunning", {
  get: () => QuantumChallenge.current !== undefined || dev.pairedQCs.length > 0,
});

export const QuantumChallenges = {
  /**
   * @type {QuantumChallengeState[]}
   */
  all: QuantumChallenge.index.compact(),
  completeAll() {
    for (const challenge of QuantumChallenges.all) {
      challenge.complete();
    }
  },
  clearCompletions() {
    player.challenge.quantum.completions = player.challenge.quantum.completions
      .fill(0);
  },
  /**
   * @returns {QuantumChallengeState[]}
   */
  get completed() {
    return QuantumChallenges.all.filter(qc => qc.isCompleted);
  },
};
