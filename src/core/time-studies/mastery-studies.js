import { TimeStudyState } from "./time-studies";

export class MasteryStudyState extends TimeStudyState {
  constructor(config) {
    const type = TIME_STUDY_TYPE.NORMAL;
    super(config, type);
  }

  get isUnlocked() {
    return this.config.unlocked?.() ?? true;
  }

  get isBought() {
    return player.timestudy.mastery.includes(this.id);
  }

  checkRequirement() {
    const check = req => (typeof req === "number" ? MasteryStudy(req).isBought : req());
    switch (this.config.reqType) {
      case TS_REQUIREMENT_TYPE.AT_LEAST_ONE: {
        return this.config.requirement.some(r => check(r));
      }
      case TS_REQUIREMENT_TYPE.ALL: {
        return this.config.requirement.every(r => check(r));
      }
      default: {
        throw new Error(`Unrecognized TS requirement type: ${this.reqType}`);
      }
    }
  }

  get canBeBought() {
    return this.checkRequirement();
  }

  get isEffectActive() {
    return this.isBought;
  }

  purchase(auto = false) {
    if (this.isBought || !this.isAffordable || !this.canBeBought) {
      return false;
    }
    if (GameEnd.creditsEverClosed) {
      return false;
    }
    player.timestudy.mastery.push(this.id);
    Currency.timeTheorems.subtract(this.cost);
    TimeStudyTree.commitToGameState([MasteryStudy(this.id)]);
    return true;
  }
}

MasteryStudyState.studies = mapGameData(
  GameDatabase.eternity.timeStudies.mastery,
  config => new MasteryStudyState(config),
);

MasteryStudyState.all = MasteryStudyState.studies.filter(e =>
  e !== undefined,
);

/**
 * @returns {MasteryStudyState}
 */
export function MasteryStudy(id) {
  return MasteryStudyState.studies[`M${id}`];
}
