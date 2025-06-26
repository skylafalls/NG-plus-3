export interface QuantumSpeedrunParameters {
  resetWithin: number
  reward: string | (() => string)
  invisible?: boolean
}

export class QuantumSpeedrunState {
  public config;
  constructor(config: QuantumSpeedrunParameters) {
    this.config = config;
  }

  get isReached() {
    return Time.bestQuantum.totalSeconds.lt(this.config.resetWithin);
  }

  static createAccessor(database: QuantumSpeedrunParameters[]) {
    const index: QuantumSpeedrunState[] = [];
    for (const config of database) {
      index.push(new QuantumSpeedrunState(config));
    }
    const accessor = (id: number) => index[id - 1];
    accessor.index = index;
    return accessor;
  }
}

export const QuantumSpeedrunMilestone = QuantumSpeedrunState.createAccessor(GameDatabase.quantum.speedrunMilestones);
