import { DC } from "./constants";

/** @enum */
export const GALAXY_TYPE = Object.freeze({
  NORMAL: 0,
  DISTANT: 1,
  REMOTE: 2,
  OBSCURE: 3,
  INVISIBLE: 4,
  ETHEREAL: 5,
});

class GalaxyRequirement {
  /**
   * @param {number} tier
   * @param {Decimal} amount
   */
  constructor(tier, amount) {
    this.tier = tier;
    this.amount = amount;
  }

  get isSatisfied() {
    const dimension = AntimatterDimension(this.tier);
    return dimension.totalAmount.gte(this.amount);
  }
}

export const Galaxy = {
  get requirement() {
    return this.requirementAt(player.galaxies);
  },

  /**
   * Figure out what galaxy number we can buy up to
   * @param {Decimal} currency Either dim 8 or dim 6, depends on current challenge
   * @param {Decimal} minVal Minimum amount of galaxies we should be able to buy
   * @returns {Decimal} Max number of galaxies (total)
   */
  buyableGalaxies(currency, minVal = player.galaxies) {
    const costMult = this.costMult;
    const base = this.baseCost.sub(InfinityChallenge(5).isCompleted ? 1 : 0).minusEffectOf(InfinityUpgrade.resetBoost);
    const unscaledGalaxies = currency.sub(base).div(costMult);
    let calculatedGalaxies = unscaledGalaxies;

    if (QuantumChallenge(5).isRunning) {
      return currency.sub(base).div(costMult).log(1.05).floor().add(1);
    }

    if (this.typeAt(calculatedGalaxies) >= GALAXY_TYPE.DISTANT) {
      calculatedGalaxies = scale({
        baseResource: unscaledGalaxies,
        scaleStart: this.scalingStart[GALAXY_TYPE.DISTANT],
        scalePower: Decimal.pow(2, this.scalingPower[GALAXY_TYPE.DISTANT]),
        scaleMode: SCALING_TYPES.POLYNOMIAL,
        isInverted: true,
      });
    }

    if (this.typeAt(calculatedGalaxies) >= GALAXY_TYPE.REMOTE) {
      calculatedGalaxies = scale({
        baseResource: calculatedGalaxies,
        scaleStart: this.scalingStart[GALAXY_TYPE.REMOTE],
        scalePower: Decimal.pow(1.005, this.scalingPower[GALAXY_TYPE.REMOTE]),
        scaleMode: SCALING_TYPES.EXPONENTIAL,
        isInverted: true,
      });
    }

    if (this.typeAt(calculatedGalaxies) >= GALAXY_TYPE.OBSCURE) {
      calculatedGalaxies = scale({
        baseResource: calculatedGalaxies,
        scaleStart: this.scalingStart[GALAXY_TYPE.OBSCURE],
        scalePower: Decimal.pow(5, this.scalingPower[GALAXY_TYPE.OBSCURE]),
        scaleMode: SCALING_TYPES.POLYNOMIAL,
        isInverted: true,
      });
    }

    if (this.typeAt(calculatedGalaxies) >= GALAXY_TYPE.INVISIBLE) {
      calculatedGalaxies = scale({
        baseResource: calculatedGalaxies,
        scaleStart: this.scalingStart[GALAXY_TYPE.INVISIBLE],
        scalePower: Decimal.pow(3, this.scalingPower[GALAXY_TYPE.INVISIBLE]),
        scaleMode: SCALING_TYPES.DILATION,
        isInverted: true,
      });
    }

    if (this.typeAt(calculatedGalaxies) >= GALAXY_TYPE.ETHEREAL) {
      calculatedGalaxies = scale({
        baseResource: calculatedGalaxies,
        scaleStart: this.scalingStart[GALAXY_TYPE.ETHEREAL],
        scalePower: Decimal.pow(1.5, this.scalingPower[GALAXY_TYPE.ETHEREAL]),
        scaleMode: SCALING_TYPES.EXPONENTIAL,
        isInverted: true,
      });
    }

    return calculatedGalaxies.floor().add(1);
  },

  // The existing galaxy calculation was shit so i revamped it
  requirementAt(galaxies) {
    let equivGal = new Decimal(galaxies);
    const type = Galaxy.typeAt(galaxies);

    if (QuantumChallenge(5).isRunning) {
      return new GalaxyRequirement(this.requiredTier, this.baseCost
        .add(Decimal.pow(1.05, equivGal).times(this.costMult)));
    }

    if (type >= GALAXY_TYPE.ETHEREAL) {
      equivGal = scale({
        baseResource: equivGal,
        scaleStart: this.scalingStart[GALAXY_TYPE.ETHEREAL],
        scalePower: Decimal.pow(1.5, this.scalingPower[GALAXY_TYPE.ETHEREAL]),
        scaleMode: SCALING_TYPES.EXPONENTIAL,
      });
    }

    if (type >= GALAXY_TYPE.INVISIBLE) {
      equivGal = scale({
        baseResource: equivGal,
        scaleStart: this.scalingStart[GALAXY_TYPE.INVISIBLE],
        scalePower: Decimal.pow(3, this.scalingPower[GALAXY_TYPE.INVISIBLE]),
        scaleMode: SCALING_TYPES.DILATION,
      });
    }

    if (type >= GALAXY_TYPE.OBSCURE) {
      equivGal = scale({
        baseResource: equivGal,
        scaleStart: this.scalingStart[GALAXY_TYPE.OBSCURE],
        scalePower: Decimal.pow(5, this.scalingPower[GALAXY_TYPE.OBSCURE]),
        scaleMode: SCALING_TYPES.POLYNOMIAL,
      });
    }

    if (type >= GALAXY_TYPE.REMOTE) {
      equivGal = scale({
        baseResource: equivGal,
        scaleStart: this.scalingStart[GALAXY_TYPE.REMOTE],
        scalePower: Decimal.pow(1.005, this.scalingPower[GALAXY_TYPE.REMOTE]),
        scaleMode: SCALING_TYPES.EXPONENTIAL,
      });
    }

    if (type >= GALAXY_TYPE.DISTANT) {
      const distantStart = this.scalingStart[GALAXY_TYPE.DISTANT];
      const distantPower = this.scalingPower[GALAXY_TYPE.DISTANT];
      equivGal = scale({
        baseResource: equivGal,
        scaleStart: distantStart,
        scalePower: Decimal.pow(2, distantPower),
        scaleMode: SCALING_TYPES.POLYNOMIAL,
      });
    }

    let amount = Galaxy.baseCost.add(equivGal.times(Galaxy.costMult));
    amount = amount.sub(Effects.sum(InfinityUpgrade.resetBoost));
    if (InfinityChallenge(5).isCompleted) {
      amount = amount.sub(1);
    }

    amount = Decimal.floor(amount);
    const tier = Galaxy.requiredTier;
    return new GalaxyRequirement(tier, amount);
  },

  get scalingStart() {
    let etherealStart = new Decimal(1e6);
    let invisibleStart = new Decimal(3e5).min(etherealStart);
    let obscureStart = new Decimal(50000).min(invisibleStart);
    let remoteStart = new Decimal(800).plusEffectsOf(
      MasteryStudy(21),
      MasteryStudy(22),
      MasteryStudy(23),
    ).min(obscureStart);

    let distantStart = DC.E2.plusEffectsOf(
      TimeStudy(223),
      TimeStudy(224),
      TimeStudy(302),
      EternityChallenge(5).reward,
    ).add(GlyphInfo.power.sacrificeInfo.effect()).min(remoteStart);

    if (EternityChallenge(5).isRunning) {
      distantStart = new Decimal(0);
    }

    return {
      [GALAXY_TYPE.DISTANT]: distantStart.floor(),
      [GALAXY_TYPE.REMOTE]: remoteStart.floor(),
      [GALAXY_TYPE.OBSCURE]: obscureStart.floor(),
      [GALAXY_TYPE.INVISIBLE]: invisibleStart.floor(),
      [GALAXY_TYPE.ETHEREAL]: etherealStart.floor(),
    };
  },

  get scalingPower() {
    let distantPower = new Decimal(1)
      .dividedByEffectsOf(
        GluonUpgrade.redGreen(6),
        GluonUpgrade.greenBlue(6),
        GluonUpgrade.blueRed(6),
      );
    let remotePower = new Decimal(1)
      .dividedByEffectsOf(
        GluonUpgrade.redGreen(1),
        GluonUpgrade.redGreen(7),
        GluonUpgrade.greenBlue(7),
        GluonUpgrade.blueRed(7),
      );

    let obscurePower = new Decimal(1);
    let invisiblePower = new Decimal(1);
    let etherealPower = new Decimal(1);

    return {
      [GALAXY_TYPE.DISTANT]: distantPower,
      [GALAXY_TYPE.REMOTE]: remotePower,
      [GALAXY_TYPE.OBSCURE]: obscurePower,
      [GALAXY_TYPE.INVISIBLE]: invisiblePower,
      [GALAXY_TYPE.ETHEREAL]: etherealPower,
    };
  },

  get costMult() {
    return new Decimal(
      Effects.min(NormalChallenge(10).isRunning ? 90 : 60, TimeStudy(42)),
    );
  },

  get baseCost() {
    return NormalChallenge(10).isRunning ? DC.D99 : DC.D80;
  },

  get requiredTier() {
    return NormalChallenge(10).isRunning ? 6 : 8;
  },

  get canBeBought() {
    if (EternityChallenge(6).isRunning && !Enslaved.isRunning) {
      return false;
    }
    if (NormalChallenge(8).isRunning || InfinityChallenge(7).isRunning) {
      return false;
    }
    if (
      player.records.thisInfinity.maxAM.gt(Player.infinityGoal)
      && (!player.break || Player.isInAntimatterChallenge)
    ) {
      return false;
    }
    return true;
  },

  get lockText() {
    if (this.canBeBought) {
      return null;
    }
    if (EternityChallenge(6).isRunning) {
      return "Locked (Eternity Challenge 6)";
    }
    if (InfinityChallenge(7).isRunning) {
      return "Locked (Infinity Challenge 7)";
    }
    if (InfinityChallenge(1).isRunning) {
      return "Locked (Infinity Challenge 1)";
    }
    if (NormalChallenge(8).isRunning) {
      return "Locked (8th Antimatter Dimension Autobuyer Challenge)";
    }
    return null;
  },

  get type() {
    return this.typeAt(player.galaxies);
  },

  typeAt(galaxies) {
    if (galaxies.gte(this.scalingStart[GALAXY_TYPE.ETHEREAL])) {
      return GALAXY_TYPE.ETHEREAL;
    }
    if (galaxies.gte(this.scalingStart[GALAXY_TYPE.INVISIBLE])) {
      return GALAXY_TYPE.INVISIBLE;
    }
    if (galaxies.gte(this.scalingStart[GALAXY_TYPE.OBSCURE])) {
      return GALAXY_TYPE.OBSCURE;
    }
    if (galaxies.gte(this.scalingStart[GALAXY_TYPE.REMOTE])) {
      return GALAXY_TYPE.REMOTE;
    }
    if (galaxies.gte(this.scalingStart[GALAXY_TYPE.DISTANT])) {
      return GALAXY_TYPE.DISTANT;
    }
    return GALAXY_TYPE.NORMAL;
  },
};

export function galaxyReset() {
  EventHub.dispatch(GAME_EVENT.GALAXY_RESET_BEFORE);
  player.galaxies = player.galaxies.add(1);
  if (
    !Achievement(143).isUnlocked
    || (Pelle.isDoomed && !PelleUpgrade.galaxyNoResetDimboost.canBeApplied)
    || EternityMilestone.noADReset.canBeApplied
  ) {
    player.dimensionBoosts = DC.D0;
  }
  softReset(0);
  if (Notations.current === Notation.emoji) {
    player.requirementChecks.permanent.emojiGalaxies = player.requirementChecks
      .permanent.emojiGalaxies.add(1);
  }
  // This is specifically reset here because the check is actually per-galaxy and not per-infinity
  player.requirementChecks.infinity.noSacrifice = true;
  EventHub.dispatch(GAME_EVENT.GALAXY_RESET_AFTER);
}

export function manualRequestGalaxyReset(bulk) {
  if (!Galaxy.canBeBought || !Galaxy.requirement.isSatisfied) {
    return;
  }
  if (GameEnd.creditsEverClosed) {
    return;
  }
  if (RealityUpgrade(7).isLockingMechanics && player.galaxies.gt(0)) {
    RealityUpgrade(7).tryShowWarningModal();
    return;
  }
  if (player.options.confirmations.antimatterGalaxy) {
    Modal.antimatterGalaxy.show({
      bulk: bulk && EternityMilestone.autobuyMaxGalaxies.isReached,
    });
    return;
  }
  requestGalaxyReset(bulk);
}

// All galaxy reset requests, both automatic and manual, eventually go through this function; therefore it suffices
// to restrict galaxy count for RUPG7's requirement here and nowhere else
export function requestGalaxyReset(bulk, limit = Number.MAX_VALUE) {
  const restrictedLimit = RealityUpgrade(7).isLockingMechanics ? DC.D1 : limit;
  if (EternityMilestone.autobuyMaxGalaxies.isReached && bulk) {
    return maxBuyGalaxies(restrictedLimit);
  }
  if (
    player.galaxies.gte(restrictedLimit) || !Galaxy.canBeBought
    || !Galaxy.requirement.isSatisfied
  ) {
    return false;
  }
  Tutorial.turnOffEffect(TUTORIAL_STATE.GALAXY);
  galaxyReset();
  return true;
}

function maxBuyGalaxies(limit = DC.BEMAX) {
  if (
    player.galaxies.gte(limit) || !Galaxy.canBeBought
    || !Galaxy.requirement.isSatisfied
  ) {
    return false;
  }
  // Check for ability to buy one galaxy (which is pretty efficient)
  const req = Galaxy.requirement;
  if (!req.isSatisfied) {
    return false;
  }
  const dim = AntimatterDimension(req.tier);
  if (
    Galaxy.buyableGalaxies(Decimal.round(dim.totalAmount)).lte(player.galaxies)
  ) {
    return false;
  }
  const newGalaxies = Decimal.min(
    Galaxy.buyableGalaxies(Decimal.round(dim.totalAmount)),
    limit,
  );
  if (Notations.current === Notation.emoji) {
    player.requirementChecks.permanent.emojiGalaxies = player.requirementChecks
      .permanent.emojiGalaxies
      .add(newGalaxies.sub(player.galaxies));
  }
  // Galaxy count is incremented by galaxyReset(), so add one less than we should:
  player.galaxies = newGalaxies.sub(1);
  galaxyReset();
  if (Enslaved.isRunning && player.galaxies.gt(1)) {
    EnslavedProgress.c10.giveProgress();
  }
  Tutorial.turnOffEffect(TUTORIAL_STATE.GALAXY);
  return true;
}
