import { DC } from "./constants";

/** @enum */
export const GALAXY_TYPE = Object.freeze({
  NORMAL: 0,
  DISTANT: 1,
  REMOTE: 2,
  OBSCURE: 3,
  INVISIBLE: 4,
});

class GalaxyRequirement {
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
  get remoteStart() {
    return this.scalingStart[GALAXY_TYPE.REMOTE];
  },

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
    const alter = GlyphAlteration.isAdded("power")
      ? getSecondaryGlyphEffect("powerpow")
      : DC.D1;
    const dis = Galaxy.costScalingStart;
    const scale = Galaxy.costMult;
    let base = Galaxy.baseCost.sub(Effects.sum(InfinityUpgrade.resetBoost));
    if (InfinityChallenge(5).isCompleted) {
      base = base.sub(1);
    }

    if (QuantumChallenge(5).isRunning) {
      return Decimal.log(
        currency.div(Galaxy.requirementAt(new Decimal(0)).amount),
        1.05,
      ).floor().max(minVal);
    }

    // Why does this mod use bulkBuyBinarySearch? Simple, it's because it simply will not
    // scale properly. Especially if we were trying to implement custom powers and formulas.
    return new Decimal(
      bulkBuyBinarySearch(
        new Decimal(currency),
        {
          costFunction: x => this.requirementAt(new Decimal(x)).amount,
          cumulative: false,
        },
        0,
        true,
      ).quantity,
    ).floor().add(1).max(minVal);

    // Plz no ask how exponential math work i dont know i just code, see https://discord.com/channels/351476683016241162/439241762603663370/1210707188964659230m
    // oxlint-disable no-unreachable
    const minV = Galaxy.costScalingStart.min(Galaxy.remoteStart); // Take the smallest of the two values
    if (
      currency.lt(
        Galaxy.requirementAt(minV).amount, /* Pre exponential/quadratic? */
      )
    ) {
      return Decimal.max(currency.sub(base).div(scale).floor().add(1), minVal);
    }

    if (currency.lt(Galaxy.requirementAt(Galaxy.remoteStart).amount)) {
      // Quadratic equation https://discord.com/channels/351476683016241162/1131505261903880244/1261706311901511691
      const a = DC.D1;
      const b = scale.add(1).sub(dis.mul(2));
      const c = base.add(dis.pow(2)).sub(dis).sub(scale).sub(currency.div(alter));
      const quad = decimalQuadraticSolution(a, b, c).floor();
      return Decimal.max(quad, minVal);
    }

    let remoteStart = Decimal.max(1e6, Galaxy.remoteStart);
    let power = this.scalingPower[GALAXY_TYPE.REMOTE];

    if (Galaxy.requirementAt(remoteStart).amount.lt(currency)) {
      return Decimal.log(currency.div(Galaxy.requirementAt(remoteStart)), power)
        .add(remoteStart).floor().max(minVal);
    }
    // oxlint-enable no-unreachable
  },

  requirementAt(galaxies) {
    // Beyond 1e6 (or further if remote is beyond that) the other effects are so small in changes that it doesn't matter
    // This does technically make it slightly weaker than vanilla, but its so minor you would rarely ever notice, and it
    // allows the inverse to be correct beyond 1e6 without using any really annoying math methods that i dont understand
    let equivGal = Decimal.min(
      Decimal.max(1e6, Galaxy.remoteStart),
      galaxies,
    );
    const type = Galaxy.typeAt(galaxies);
    let amount = Galaxy.baseCost.add(equivGal.times(Galaxy.costMult));

    if (type === GALAXY_TYPE.DISTANT || type === GALAXY_TYPE.REMOTE) {
      const galaxyCostScalingStart = this.costScalingStart;
      const galaxiesAfterDistant = Decimal.clampMin(equivGal.sub(galaxyCostScalingStart)
        .times(this.scalingPower[GALAXY_TYPE.DISTANT]).add(1), 0);
      amount = amount.add(Decimal.pow(galaxiesAfterDistant, 2).add(galaxiesAfterDistant));
    }

    if (type === GALAXY_TYPE.REMOTE || QuantumChallenge(5).isRunning) {
      const galaxiesAmount = QuantumChallenge(5).isRunning
        ? galaxies
        : galaxies.sub(Galaxy.remoteStart.sub(1)).times(this.scalingPower[GALAXY_TYPE.REMOTE]);
      amount = amount.times(Decimal.pow(1.002, galaxiesAmount));
    }

    amount = amount.sub(Effects.sum(InfinityUpgrade.resetBoost));
    if (InfinityChallenge(5).isCompleted) {
      amount = amount.sub(1);
    }

    if (GlyphAlteration.isAdded("power")) {
      amount = amount.mul(getSecondaryGlyphEffect("powerpow"));
    }

    amount = Decimal.floor(amount);
    const tier = Galaxy.requiredTier;
    return new GalaxyRequirement(tier, amount);
  },

  get scalingStart() {
    let invisibleStart = new Decimal(3e5);
    let obscureStart = new Decimal(50000).min(invisibleStart);
    let remoteStart = new Decimal(800).plusEffectsOf(
      MasteryStudy(21),
      MasteryStudy(22),
      MasteryStudy(23),
      GluonUpgrade.blueRed(7),
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
    };
  },

  get scalingPower() {
    let distantPower = new Decimal(1)
      .dividedByEffectsOf(
        GluonUpgrade.redGreen(6),
        GluonUpgrade.greenBlue(6),
      );
    let remotePower = new Decimal(1)
      .dividedByEffectsOf(
        GluonUpgrade.redGreen(1),
        GluonUpgrade.redGreen(7),
        GluonUpgrade.greenBlue(7),
      );

    let obscurePower = new Decimal(1);
    let invisiblePower = new Decimal(1);

    return {
      [GALAXY_TYPE.DISTANT]: distantPower,
      [GALAXY_TYPE.REMOTE]: remotePower,
      [GALAXY_TYPE.OBSCURE]: obscurePower,
      [GALAXY_TYPE.INVISIBLE]: invisiblePower,
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

  get costScalingStart() {
    return this.scalingStart[GALAXY_TYPE.DISTANT];
  },

  get type() {
    return this.typeAt(player.galaxies);
  },

  typeAt(galaxies) {
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
