import { DC } from "../../constants";

function rebuyableCost(initialCost, increment, id) {
  return Decimal.multiply(initialCost, Decimal.pow(increment, player.dilation.rebuyables[id]));
}
function rebuyable(config) {
  return {
    id: config.id,
    cost: () => rebuyableCost(config.initialCost, config.increment, config.id),
    initialCost: config.initialCost,
    increment: config.increment,
    description: config.description,
    effect: () => config.effect(player.dilation.rebuyables[config.id]),
    formatEffect: config.formatEffect,
    formatCost: config.formatCost,
    purchaseCap: config.purchaseCap,
    reachedCap: () => player.dilation.rebuyables[config.id].gte(config.purchaseCap),
    pelleOnly: Boolean(config.pelleOnly),
    rebuyable: true
  };
}

export const dilationUpgrades = {
  dtGain: rebuyable({
    id: 1,
    initialCost: 1e4,
    increment: 10,
    description: () =>
      ((SingularityMilestone.dilatedTimeFromSingularities.canBeApplied || Achievement(187).canBeApplied)
        ? `${formatX(Effects.product(
          SingularityMilestone.dilatedTimeFromSingularities,
          Achievement(187)
        ).mul(2), 2, 2)} Dilated Time gain`
        : "Double Dilated Time gain"),
    effect: bought => {
      const base = Effects.product(
        SingularityMilestone.dilatedTimeFromSingularities,
        Achievement(187)
      ).mul(2);
      return Decimal.pow(base, bought);
    },
    formatEffect: value => {
      const nonInteger = SingularityMilestone.dilatedTimeFromSingularities.canBeApplied ||
        Achievement(187).canBeApplied;
      return formatX(value, 2, nonInteger ? 2 : 0);
    },
    formatCost: value => format(value, 2),
    purchaseCap: DC.BEMAX
  }),
  galaxyThreshold: rebuyable({
    id: 2,
    initialCost: 1e6,
    increment: 100,
    description: () =>
      (Perk.bypassTGReset.isBought && !Pelle.isDoomed
        ? "Reset Tachyon Galaxies, but lower their threshold"
        : "Reset Dilated Time and Tachyon Galaxies, but lower their threshold"),
    // The 38th purchase is at 1e80, and is the last purchase.
    effect: bought => (bought.lt(38) ? Decimal.pow(0.8, bought) : new Decimal()),
    formatEffect: effect => {
      if (effect === 0) return `${formatX(getTachyonGalaxyMult(effect), 4, 4)}`;
      const nextEffect = effect === Decimal.pow(0.8, 37) ? new Decimal() : effect.mul(0.8);
      return `${formatX(getTachyonGalaxyMult(effect), 4, 4)} ➜
        Next: ${formatX(getTachyonGalaxyMult(nextEffect), 4, 4)}`;
    },
    formatCost: value => format(value, 2),
    purchaseCap: new Decimal(38)
  }),
  tachyonGain: rebuyable({
    id: 3,
    initialCost: 1e7,
    increment: 20,
    description: () => {
      if (Pelle.isDoomed) return `Multiply the amount of Tachyon Particles gained by ${formatInt(1)}`;
      if (Enslaved.isRunning) return `Multiply the amount of Tachyon Particles gained
      by ${Math.pow(3, Enslaved.tachyonNerf).toFixed(2)}`;
      return "Triple the amount of Tachyon Particles gained";
    },
    effect: bought => {
      if (Pelle.isDoomed) return DC.D1.pow(bought);
      return DC.D3.pow(bought);
    },
    formatEffect: value => formatX(value, 2),
    formatCost: value => format(value, 2),
    purchaseCap: DC.BEMAX
  }),
  tachyonExponent: rebuyable({
    id: 4,
    initialCost: 1e8,
    increment: 1e5,
    description: () => {
      return "Increase the exponent of the Tachyon Particle formula";
    },
    effect: bought => {
      let eff = Decimal.mul(0.75, bought);
      if (eff.gte(8)) {
        eff = eff.div(8).cbrt().mul(8);
      }
      return eff;
    },
    formatEffect: value => `+^${format(value, 2)}`,
    formatCost: value => format(value, 2),
    purchaseCap: DC.BEMAX
  }),
  doubleGalaxies: {
    id: 5,
    cost: 5e6,
    description: () => `Gain twice as many Tachyon Galaxies, up to ${formatInt(500)} base Galaxies`,
    effect: 2
  },
  tdMultReplicanti: {
    id: 6,
    cost: 1e9,
    description: () => {
      const rep10 = replicantiMult().pLog10();
      let multiplier = "0.1";
      if (rep10.gt(9000)) {
        const ratio = DilationUpgrade.tdMultReplicanti.effectValue.pLog10().div(rep10);
        if (ratio.lt(0.095)) {
          multiplier = ratio.toFixed(2);
        }
      }
      return `Time Dimensions are affected by Replicanti multiplier ${formatPow(multiplier, 1, 3)}, reduced
        effect above ${formatX(DC.E9000)}`;
    },
    effect: () => {
      let rep10 = replicantiMult().pLog10().div(10);
      rep10 = rep10.gt(9000) ? new Decimal(9000).add((rep10.sub(9e3)).div(2)) : rep10;
      return EternityChallenge(14).isRunning ? new Decimal(1) : Decimal.pow10(rep10);
    },
    formatEffect: value => formatX(value, 2, 1)
  },
  ndMultDT: {
    id: 7,
    cost: 5e7,
    description: "Antimatter Dimension multiplier based on Dilated Time, unaffected by Time Dilation",
    effect: () => Currency.dilatedTime.value.pow(308).clampMin(1),
    formatEffect: value => formatX(value, 2, 1)
  },
  dilatedTimeToReplicanti: {
    id: 8,
    cost: 1e20,
    description: "Replicanti increases faster based on Dilated Time",
    effect: () => Currency.dilatedTime.value.clampMin(1).pow(0.05),
    formatEffect: value => formatX(value, 2, 1)
  },
  ipMultDT: {
    id: 9,
    cost: 2e12,
    description: "Gain a multiplier to Infinity Points based on Dilated Time",
    effect: () => Currency.dilatedTime.value.clampMin(1).pow(500),
    formatEffect: value => formatX(value, 2, 1),
  },
  timeStudySplit: {
    id: 10,
    cost: 1e10,
    description: "You can buy all three Time Study paths from the Dimension Split"
  },
  dilationPenalty: {
    id: 11,
    cost: 1e11,
    description: () => `Reduce the Dilation penalty (${formatPow(1.05, 2, 2)} after reduction)`,
    effect: 1.05,
  },
  eternitiesDTSynergy: {
    id: 12,
    cost: 1e25,
    description: () => `Eternities and Dilated Time power up each other`,
    // The actual effect is handled somewhere else.
    effect: () => DC.D1,
    formatEffect: (_value) => `${formatX(Currency.eternities.value.clampMin(1).pow(0.15), 2)} to DT, ${formatX(Currency.dilatedTime.value.clampMin(1).pow(0.1), 2)} to eternities`,
  },
  mdMultTickspeed: {
    id: 13,
    cost: 1e50,
    description: "Meta Dimensions gain a multiplier based on tickspeed",
    effect: () => Tickspeed.perSecond.plus(1).log10().plus(1).log10(),
    formatEffect: value => `${formatX(value, 2, 1)}`
  },
  mdBuffDT: {
    id: 14,
    cost: 1e60,
    description: "Meta-Dimensions Boosts and MD per-10 multiplier are boosted by Dilated Time",
    effect: () => Currency.dilatedTime.value.plus(1).ln().plus(1).ln(),
    formatEffect: value => `${formatX(value, 2, 1)}`
  },
  mdEffectBuff: {
    id: 15,
    cost: 1e80,
    description: () => `Increase the meta-antimatter effect exponent to ${formatPow(9, 0)}`,
    effect: 9,
  },
  dtMultMA: {
    id: 16,
    cost: 1e100,
    description: () => `Dilated Time production is boosted based on Meta-Antimatter`,
    effect: () => Currency.metaAntimatter.value.plus(1).log10().pow(0.5),
    formatEffect: value => formatX(value, 2),
  },
  ttGenerator: {
    id: 17,
    cost: 1e15,
    description: "Generate Time Theorems based on Tachyon Particles",
    effect: () => Currency.tachyonParticles.value.div(20000),
    formatEffect: value => `${format(value, 2, 1)}/sec`
  },
  dtGainPelle: rebuyable({
    id: 18,
    initialCost: 1e14,
    increment: 100,
    pelleOnly: true,
    description: () => `${formatX(5)} Dilated Time gain`,
    effect: bought => Decimal.pow(5, bought),
    formatEffect: value => formatX(value, 2),
    formatCost: value => format(value, 2),
    purchaseCap: DC.BEMAX
  }),
  galaxyMultiplier: rebuyable({
    id: 19,
    initialCost: 1e15,
    increment: 1000,
    pelleOnly: true,
    description: "Multiply Tachyon Galaxies gained, applies after TG doubling upgrade",
    effect: bought => bought.add(1),
    formatEffect: value => `${formatX(value, 2)} ➜ ${formatX(value.add(1), 2)}`,
    formatCost: value => format(value, 2),
    purchaseCap: DC.BEMAX
  }),
  tickspeedPower: rebuyable({
    id: 20,
    initialCost: 1e16,
    increment: 1e4,
    pelleOnly: true,
    description: "Gain a power to Tickspeed",
    effect: bought => bought.mul(0.03).add(1),
    formatEffect: value => `${formatPow(value, 2, 2)} ➜ ${formatPow(value.add(0.03), 2, 2)}`,
    formatCost: value => format(value, 2),
    purchaseCap: DC.BEMAX
  }),
  galaxyThresholdPelle: {
    id: 21,
    cost: 1e45,
    pelleOnly: true,
    description: "Apply a cube root to the Tachyon Galaxy threshold",
    effect: 1 / 3
  },
  flatDilationMult: {
    id: 22,
    cost: 1e55,
    pelleOnly: true,
    description: () => `Gain more Dilated Time based on current EP`,
    effect: () => DC.E9.pow((Decimal.max(player.eternityPoints.max(1).log10().sub(1500), 0).div(2500)).pow(1.2).clampMax(1)),
    formatEffect: value => formatX(value, 2, 2)
  },
};
