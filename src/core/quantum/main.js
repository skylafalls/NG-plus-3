/**
 * Resets all pre-quantum player mechanics back to default state.
 */
export function resetPreQuantumResources() {
  // We reset in order of when the player sees the game mechanic (eg. we reset dilation, then time studies, then eternities)
  // I'm not really sure why, but it seems like a nice way to organize it.
  // Stage 1: Time Dilation
  player.dilation.studies = [];
  player.dilation.active = false;
  player.dilation.upgrades.clear();
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
  Currency.timeTheorems.reset();
  ECTimeStudyState.invalidateCachedRequirements();
  fullResetTimeDimensions();
  Currency.timeShards.reset();
  player.totalTickGained = DC.D0;
  resetTimeDimensions();
  resetTickspeed();

  // Stage Three: Eternity Challenges
  player.eterc8ids = 50;
  player.eterc8repl = 40;
  player.eternityChalls = {};
  player.challenge.eternity.current = 0;
  player.challenge.eternity.unlocked = 0;
  player.challenge.eternity.requirementBits = 0;

  // Stage Four: Rest of Eternity
  Currency.eternityPoints.reset();
  EternityUpgrade.epMult.reset();
  Currency.eternities.reset();
  player.eternityUpgrades.clear();
  resetEternityRuns();

  // Stage Five: Post-Break Infinity
  player.break = false;
  Replicanti.reset(true);
  InfinityDimensions.fullReset();
  InfinityDimensions.resetAmount();
  Currency.infinityPower.reset();
  initializeChallengeCompletions(true);
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
  secondSoftReset(false);
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
  AchievementTimers.marathon2.reset();
  Tab.dimensions.antimatter.show();
  Lazy.invalidateAll();
  EventHub.dispatch(GAME_EVENT.QUANTUM_RESET_AFTER);
}

function updateQuantumRecords() {
  player.records.bestQuantum.time = player.records.thisQuantum.time.clampMax(player.records.bestQuantum.time);
  player.records.bestQuantum.realTime = player.records.thisQuantum.realTime.clampMax(player.records.bestQuantum.time);
  player.records.bestQuantum.trueTime = Math.min(player.records.bestQuantum.trueTime, player.records.thisQuantum.trueTime);
}

function addQuantumTime(trueTime, time, realTime) {
  player.records.recentRealities.unshift([trueTime, time, realTime]);
}

function giveQuantumRewards() {
  Currency.quarks.add(Quarks.gain);
  updateQuantumRecords();
  addQuantumTime(
    player.records.thisReality.trueTime,
    player.records.thisReality.time,
    player.records.thisReality.realTime,
  );
  Currency.quantums.add(1);
}

/**
 * Perform a Quantum reset (known in the UI as "study the quantum physics"),
 * giving the rewards as appropriate.
 * @param {boolean} force If this is true, then don't give rewards and skip to resetting everything.
 */
export function quantumReset(force = false) {
  if (force) {
    Currency.quantums.add(1);
    resetPreQuantumResources();
    return;
  }

  EventHub.dispatch(GAME_EVENT.QUANTUM_RESET_BEFORE);
  giveQuantumRewards();
  resetPreQuantumResources();
}
