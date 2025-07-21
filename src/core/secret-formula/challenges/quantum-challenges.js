export const quantumChallenges = [
  {
    id: 1,
    description: () => "Production from Antimatter Dimensions 3-8 are disabled.",
    goal: { am: new Decimal("e1.796e10"), ma: new Decimal("1.68e1088") },
    reward: {
      description: () =>
        `Add ${formatX(0.5)} to Electron's production factor for each QC completion
        and 1st & 2nd Antimatter Dimensions boosts Dilated Time production.`,
      effect: completions => AntimatterDimension(1).amount.mul(AntimatterDimension(2).amount)
        .plus(1).log10().pow(1 + (completions * 0.25)).plus(1),
      formatEffect: value => formatX(value, 2, 0),
    },
  },
  {
    id: 2,
    description: () => `The tickspeed multiplier is fixed at ${formatFloat(1.125, 3)}x.`,
    goal: { am: new Decimal("e5.891e10"), ma: new Decimal("4.8e1074") },
    reward: {
      description: () => "Gain more Tachyonic Galaxies.",
      effect: completions => (completions * 0.25) + 1,
      formatEffect: value => formatX(value, 0, 2),
    },
  },
  {
    id: 3,
    description: () => `Only Infinity Dimensions can be affected by Meta-Antimatter but
      Meta-Antimatter cannot affect Dimension Boosts.`,
    goal: { am: new Decimal("e3.147e10"), ma: new Decimal("2.67e1077") },
    reward: {
      description: () =>
        "Infinity Power also affects Meta Dimensions at a heavily reduced rate.",
      effect: completions =>
        Currency.infinityPower.value.plus(1).logPow(
          (completions * 0.03) + 0.1,
        ),
      formatEffect: value => formatX(value, 2, 2),
    },
  },
  {
    id: 4,
    description: () =>
      `Automatic Big Crunch Challenge is applied to all dimension types.
      Meta-Dimension Boosts scale slower but their effects are nullified.`,
    goal: { am: new Decimal("e6.221e10"), ma: new Decimal("3.68e462") },
    effect: () => 5,
    reward: {
      description: () =>
        "All even Meta Dimensions boosts all odd Meta Dimensions.",
      effect: (completions) => {
        let multiplier = new Decimal(1);
        for (const tier of Array.range(0, 8)) {
          if (tier % 2 === 0) continue;
          multiplier = multiplier.times(player.meta.dimensions[tier].amount);
        }
        multiplier = multiplier.max(1).logPow(0.2 + (completions * 0.1));
        return multiplier;
      },
      formatEffect: value => formatX(value, 2, 2),
    },
  },
  {
    id: 5,
    description: () =>
      `Dimension Supersonic scaling starts instantly and grows much faster. All galaxy types scale
      also grow much faster and nullify the AD per-10 multiplier.`,
    goal: { am: new Decimal("e2.084e9"), ma: new Decimal("1.12e1122") },
    reward: {
      description: () => "Dimension Boosts boosts the multiplier per-10 dimensions at a reduced rate.",
      effect: completions => DimBoost.totalBoosts.plus(1).log10().times(completions + 1),
      formatEffect: value => formatX(value, 2, 2),
    },
  },
  {
    id: 6,
    description: () =>
      "You are trapped in Infinity Challenges 2, 3, 6, 7, and 8 and you can't gain Dimension Boosts.",
    goal: { am: new Decimal("e1.124e9"), ma: new Decimal("3.6e1543") },
    reward: {
      description: () => "The IC3 base effect exponent is stronger.",
      effect: completions => 2 ** completions,
      formatEffect: value => formatPow(value),
    },
  },
  {
    id: 7,
    description: () =>
      `Antimatter & Meta Dimensions scale by 1.80e308x instead of their normal rates.
      The multiplier per-10 dimensions and Meta-Antimatter's effect is disabled.`,
    goal: { am: new Decimal("e1.558e10"), ma: new Decimal("6.6e1008") },
    effect: () => Number.MAX_VALUE,
    reward: {
      description: () => `Free tickspeed upgrade scales slower after ${format(FreeTickspeed.softcap)}.`,
      effect: completions => (completions * 0.25) + 1,
      formatEffect: value => `${formatPercents(value - 1)} slower`,
    },
  },
  {
    id: 8,
    description: () =>
      "Infinity and Time Dimensions are disabled and Meta-Dimension Boosts have no effect.",
    goal: { am: new Decimal("e7.14e10"), ma: new Decimal("2.7e902") },
    reward: {
      description: () => "Gain more Extra Replicanti Galaxies.",
      effect: completions => (completions * 0.2) + 1,
      formatEffect: value => formatPercents(value - 1, 0),
    },
  },
];
