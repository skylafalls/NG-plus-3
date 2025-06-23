export const quantumChallenges = [
  {
    id: 1,
    description: () => "Production from Antimatter Dimensions 3-8 are disabled.",
    goal: { am: new Decimal("e5.49e9"), ma: new Decimal("9.4e881") },
    reward: {
      description: () =>
        `Add ${formatX(0.5)} to Electron's production factor for each QC completion
        and 1st & 2nd Antimatter Dimensions boosts Dilated Time production.`,
      effect: completions => AntimatterDimension(1).amount.mul(AntimatterDimension(2).amount)
        .plus(1).log10().pow(1 + (completions * 0.25)),
      formatEffect: value => formatX(value, 2, 0),
    },
  },
  {
    id: 2,
    description: () => `The tickspeed multiplier is fixed at ${formatFloat(1.125, 3)}x.`,
    goal: { am: new Decimal("e8.983e10"), ma: new Decimal("1.8e797") },
    reward: {
      description: () => "Gain more Tachyonic Galaxies.",
      effect: completions => (completions * 0.25) + 1,
      formatEffect: value => formatX(value, 0, 1),
    },
  },
  {
    id: 3,
    description: () => `Only Infinity Dimensions can be affected by Meta-Antimatter but
      Meta-Antimatter cannot affect Dimension Boosts.`,
    goal: { am: new Decimal("e3.73e9"), ma: new Decimal("7.4e782") },
    reward: {
      description: () =>
        "Infinity Power also affects Meta Dimensions at a heavily reduced rate.",
      effect: completions =>
        Currency.infinityPower.value.plus(1).logPow(
          (completions * 0.025) + 0.1,
        ),
      formatEffect: value => formatX(value, 2, 2),
    },
  },
  {
    id: 4,
    description: () =>
      `Automatic Big Crunch Challenge is applied to all dimension types.
      Meta-Dimension Boosts scale slower but their effects are nullified.`,
    goal: { am: new Decimal("e6.67e10"), ma: new Decimal("1.5e395") },
    effect: () => 5,
    reward: {
      description: () =>
        "All even Meta Dimensions boosts all odd Meta Dimensions.",
      effect: (completions) => {
        let multiplier = new Decimal(1);
        for (const tier of Array.range(0, 8)) {
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
    goal: { am: new Decimal("e1.657e9"), ma: new Decimal("4.7e924") },
    reward: {
      description: () => "Antimatter affects the Meta-Dimension Boost multiplier at a reduced rate.",
      effect: completions =>
        player.antimatter.plus(1).log10().pow(0.1 + (completions * 0.015)),
      formatEffect: value => formatX(value, 2, 2),
    },
  },
  {
    id: 6,
    description: () =>
      `You are trapped in Infinity Challenges 2, 3, 6, and 7 and you
      can't gain Dimension Boosts. The AD per-10 multiplier is buffed to compensate.`,
    goal: { am: new Decimal("e3.684e7"), ma: new Decimal("8.5e1093") },
    effect: () => new Decimal("1e33"),
    reward: {
      description: () => "Electrons are stronger based on Dimension Boosts.",
      effect: completions =>
        DimBoost.totalBoosts.pow(0.2 + (completions * 0.02)),
      formatEffect: value => formatX(value, 2, 2),
    },
  },
  {
    id: 7,
    description: () =>
      `Antimatter & Meta Dimensions scale by 1.80e308x instead of their normal rates.
      The multiplier per-10 dimensions and Meta-Antimatter's effect is disabled.`,
    goal: { am: new Decimal("e4.024e7"), ma: new Decimal("6.4e1192") },
    effect: () => Number.MAX_VALUE,
    reward: {
      description: () => "Free tickspeed upgrade threshold is reduced (before scaling).",
      effect: completions => completions * 0.05,
      formatEffect: value => `-${format(value, 0, 2)}x`,
    },
  },
  {
    id: 8,
    description: () =>
      "Infinity and Time Dimensions are disabled and Meta-Dimension Boosts have no effect.",
    goal: { am: new Decimal("e8.864e10"), ma: new Decimal("4e771") },
    reward: {
      description: () => "Gain more Extra Replicanti Galaxies.",
      effect: completions => (completions * 0.2) + 1,
      formatEffect: value => formatPercents(value - 1, 0),
    },
  },
];
