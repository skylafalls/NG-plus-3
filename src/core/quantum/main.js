import { DC } from "../constants.js";

/**
 * Resets all pre-quantum player mechanics back to default state.
 */
export function resetPreQuantumResources() {
  // We reset in order of when the player sees the game mechanic (eg. we reset dilation, then time studies, then eternities)
  // I'm not really sure why, but it seems like a nice way to organize it.
  // Stage Negative One: Pair Production & Quark Powers (i forgot^2)
  for (const color of ["red", "green", "blue"]) {
    player.quantum.quarkPowers[color] = new Decimal(0);
  }

  // Stage Zero: Meta Dimensions & Mastery Studies (I forgot)
  if (!QuantumSpeedrunMilestone(17).isReached) player.meta.boosts = new Decimal(0);
  MetaDimensions.reset();
  Currency.metaAntimatter.reset();
  if (!QuantumSpeedrunMilestone(16).isReached) player.timestudy.mastery = [];

  // Stage One: Time Dilation
  if (!QuantumSpeedrunMilestone(16).isReached) player.dilation.studies = [];
  player.dilation.active = false;
  if (!QuantumSpeedrunMilestone(6).isReached) player.dilation.upgrades.clear();
  player.dilation.rebuyables = {
    1: new Decimal(),
    2: new Decimal(),
    3: new Decimal(),
    4: new Decimal(),
    18: new Decimal(),
    19: new Decimal(),
    20: new Decimal(),
  };
  Currency.tachyonParticles.reset();
  player.dilation.nextThreshold = DC.E3;
  player.dilation.baseTachyonGalaxies = DC.D0;
  player.dilation.totalTachyonGalaxies = DC.D0;
  Currency.dilatedTime.reset();
  player.dilation.lastEP = DC.DM1;

  // Stage Two: Time Studies & Dimensions
  // For some reason the reset is handled within the currency reset function
  // for Time Theorems itself, which seems like a weird place to put it.
  if (!QuantumSpeedrunMilestone(11).isReached) Currency.timeTheorems.reset();
  ECTimeStudyState.invalidateCachedRequirements();
  fullResetTimeDimensions();
  Currency.timeShards.reset();
  player.totalTickGained = DC.D0;
  resetTimeDimensions();
  resetTickspeed();

  // Stage Three: Eternity Challenges
  player.eterc8ids = 50;
  player.eterc8repl = 40;
  if (!QuantumSpeedrunMilestone(3).isReached) {
    player.challenge.eternity.completions.fill(0);
    player.challenge.eternity.unlocked = 0;
    player.challenge.eternity.requirementBits = 0;
  }
  player.challenge.eternity.current = 0;

  // Stage Four: Rest of Eternity
  Currency.eternityPoints.reset();
  EternityUpgrade.epMult.reset();
  if (!QuantumSpeedrunMilestone(1).isReached) Currency.eternities.reset();
  if (!QuantumSpeedrunMilestone(3).isReached) player.eternityUpgrades.clear();
  resetEternityRuns();

  // Stage Five: Post-Break Infinity
  if (!QuantumSpeedrunMilestone(1).isReached) player.break = false;
  Replicanti.reset(!QuantumSpeedrunMilestone(1).isReached);
  InfinityDimensions.fullReset();
  InfinityDimensions.resetAmount();
  Currency.infinityPower.reset();
  initializeChallengeCompletions();
  playerInfinityUpgradesOnReset();

  // Stage Six: Pre-Break Infinity
  resetInfinityRuns();
  Currency.infinityPoints.reset();
  Currency.infinities.reset();
  Currency.infinitiesBanked.reset();
  player.partInfinityPoint = 0;
  player.partInfinitied = 0;
  player.IPMultPurchases = DC.D0;

  // Stage Seven: Base game
  player.respec = false;
  player.dimensionBoosts = DC.D0;
  player.galaxies = DC.D0;
  player.sacrificed = DC.D0;
  AntimatterDimensions.reset();
  if (!QuantumSpeedrunMilestone(1).isReached) secondSoftReset(false);
  Currency.antimatter.reset();

  // Stage Eight: Records & Requirements
  Player.resetRequirements("quantum");
  player.records.bestInfinity.time = DC.BEMAX;
  player.records.bestInfinity.realTime = DC.BEMAX;
  player.records.thisInfinity.time = DC.D0;
  player.records.thisInfinity.lastBuyTime = DC.D0;
  player.records.thisInfinity.realTime = DC.D0;
  player.records.thisEternity.time = DC.D0;
  player.records.thisEternity.realTime = DC.D0;
  player.records.bestEternity.time = DC.BEMAX;
  player.records.bestEternity.realTime = DC.BEMAX;
  player.records.thisQuantum.time = DC.D0;
  player.records.thisQuantum.realTime = DC.D0;
  player.records.thisQuantum.bestMA = DC.D0;
  player.records.thisInfinity.maxAM = DC.D0;
  player.records.thisEternity.maxAM = DC.D0;
  player.records.thisInfinity.bestIPmin = DC.D0;
  player.records.bestInfinity.bestIPminEternity = DC.D0;
  player.records.thisEternity.bestEPmin = DC.D0;
  player.records.thisEternity.bestInfinitiesPerMs = DC.D0;
  player.records.thisEternity.bestIPMsWithoutMaxAll = DC.D0;
  player.records.bestEternity.bestEPminReality = DC.D0;

  // Stage Nine: Miscellaneous stuff
  if (!QuantumSpeedrunMilestone(1).isReached) Autobuyers.reset();
  AchievementTimers.marathon2.reset();
  Tab.dimensions.antimatter.show();
  Lazy.invalidateAll();
}

function updateQuantumRecords() {
  player.records.bestQuantum.time = player.records.thisQuantum.time.clampMax(
    player.records.bestQuantum.time,
  );
  player.records.bestQuantum.realTime = player.records.thisQuantum.realTime
    .clampMax(player.records.bestQuantum.time);
  player.records.bestQuantum.trueTime = Math.min(
    player.records.bestQuantum.trueTime,
    player.records.thisQuantum.trueTime,
  );
}

function addQuantumTime(trueTime, time, realTime) {
  player.records.recentQuantums.unshift([trueTime, time, realTime]);
}

function giveQuantumRewards() {
  Currency.quarks.add(Quarks.gain);
  updateQuantumRecords();
  addQuantumTime(
    player.records.thisReality.trueTime,
    player.records.thisReality.time,
    player.records.thisReality.realTime,
  );
  if (QuantumChallenge.isRunning) {
    QuantumChallenge(player.challenge.quantum.current).complete();
  }
}

/**
 * Restores pre-quantum resources from the previous player state.
 */
export function restorePreQuantumResources() {
  if (QuantumSpeedrunMilestone(1).isReached) {
    player.eternities = (QuantumSpeedrunMilestone(18).isReached
      ? new Decimal(1e13)
      : new Decimal(20000)
    );
  }
  if (QuantumSpeedrunMilestone(3).isReached) {
    dev.beTests.completeChalleges.eternity();
  }
  if (QuantumSpeedrunMilestone(4).isReached) {
    player.dilation.studies.push(1);
  }
  if (QuantumSpeedrunMilestone(17).isReached) {
    player.dilation.studies.push(6);
  }
  if (QuantumSpeedrunMilestone(18).isReached) {
    Currency.metaAntimatter.bumpTo(5e25);
  }
  if (QuantumSpeedrunMilestone(22).isReached) {
    Currency.dilatedTime.bumpTo(1e100);
  }
  if (QuantumSpeedrunMilestone(27).isReached) {
    player.meta.boosts = new Decimal(4);
  }
}

/**
 * This function checks if you can perform a manual/non-forced quantum reset.
 * @returns {boolean} Returns if you can reset non-forcefully.
 */
export function canPerformQuantumReset() {
  if (QuantumChallenge.isRunning) {
    if (
      Currency.antimatter.lt(Player.quantumGoal.am)
      && Currency.metaAntimatter.lt(Player.quantumGoal.ma)
    ) {
      return false;
    }
  } else if (Currency.metaAntimatter.lt(Player.quantumGoal.ma)) {
    return false;
  }

  return true;
}

/**
 * Perform a Quantum reset (known in the UI as "study the quantum layer"),
 * giving the rewards as appropriate.
 * @param {boolean} force If this is true, then don't give rewards and skip to resetting everything.
 */
export function quantumReset(force = false) {
  if (!canPerformQuantumReset() && !force) {
    return;
  }
  if (!force) {
    EventHub.dispatch(GAME_EVENT.QUANTUM_RESET_BEFORE);
    giveQuantumRewards();
  }
  Currency.quantums.add(1);
  resetPreQuantumResources();
  player.challenge.quantum.current = 0;
  restorePreQuantumResources();
  EventHub.dispatch(GAME_EVENT.QUANTUM_RESET_AFTER);
}

/**
 * This function is equivalent to manually pressing the Quantum button in the UI.
 * @returns {boolean} Whether the reset was successful or failed/canceled.
 */
export function requestQuantumReset() {
  if (!canPerformQuantumReset()) return false;
  if (GameEnd.creditsEverClosed) return false;
  quantumReset(false);
  return true;
}

export function handleQuantumTick(diff) {
  Quarks.tick(diff);
}
