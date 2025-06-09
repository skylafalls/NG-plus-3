import { DC } from "../../constants";

export const quantumChallenges = [
  {
    id: 1,
    description: () => "Antimatter & Meta Dimensions 3-8 are disabled but Electrons now also affect Meta Dimensions.",
    goal: { am: DC.BEMAX, ma: DC.BEMAX },
    reward: {
      description: () => `Add ${formatX(0.5)} to Electron's production factor for each QC completion and Electrons affects Dilated Time production.`,
      effect: completions => PairProduction.electronEffect.effectOrDefault(1).pow(completions),
      formatEffect: value => formatX(value, 2, 0),
    },
  },
  {
    id: 2,
    description: () => `The tickspeed multiplier is fixed at ${formatFloat(1.125, 3)}x.`,
    goal: { am: DC.BEMAX, ma: DC.BEMAX },
    reward: {
      description: () => "Gain more Tachyonic Galaxies.",
      effect: completions => completions ?? 1,
      formatEffect: value => formatX(value, 0, 1),
    },
  },
  {
    id: 3,
    description: () => `Swap the resources that Meta-Antimatter and Replicanti affects
      with their respective resources only being boosted by such.`,
    goal: { am: DC.BEMAX, ma: DC.BEMAX },
    reward: {
      description: () => "Infinity Power also affects Meta Dimensions at a heavily reduced rate.",
      effect: completions => Currency.infinityPower.value.plus(1).logPow(completions * 0.1),
      formatEffect: value => formatX(value, 2, 2),
    },
  },
  {
    id: 4,
    description: () => `Automatic Big Crunch Challenge is applied to all dimension types.
      Meta-Dimension Boosts scale slower but their effects are nullified.`,
    goal: { am: DC.BEMAX, ma: DC.BEMAX },
    reward: {
      description: () => "All even Meta Dimensions boosts all odd Meta Dimensions.",
      effect: (completions) => {
        let multiplier = new Decimal(1);
        for (const tier of Array.range(0, 8)) {
          multiplier = multiplier.times(player.meta.dimensions[tier].amount);
        }
        console.log(typeof completions)
        multiplier = multiplier.logPow(0.2 + (completions * 0.05));
        return multiplier;
      },
      formatEffect: value => formatX(value, 2, 2),
    },
  },
  {
    id: 5,
    description: () => `Normal & Meta Dimension Boosts and all galaxy types scale
      much faster and nullify the AD per-10 multiplier.`,
    goal: { am: DC.BEMAX, ma: DC.BEMAX },
    reward: {
      description: () => "Antimatter affects the Meta-Dimension Boost multiplier at a reduced rate.",
      effect: completions => player.antimatter.plus(1).logPow(0.03 + (completions / 100)),
      formatEffect: value => formatX(value, 2, 2),
    },
  },
  {
    id: 6,
    description: () => `You are trapped in Infinity Challenges 1, 3, and 7 and you
      can't gain Dimension Boosts. The AD per-10 multiplier is buffed to compensate.`,
    goal: { am: DC.BEMAX, ma: DC.BEMAX },
    reward: {
      description: () => "Electrons are stronger based on Dimension Boosts.",
      effect: completions => DimBoost.totalBoosts.pow(0.3 + (completions * 0.05)),
      formatEffect: value => formatX(value, 2, 2),
    },
  },
  {
    id: 7,
    description: () => `Antimatter & Meta Dimensions scale by 1.80e308x instead of their normal rates.
      Pair Production and Meta-Antimatter's effect is disabled.`,
    effect: Number.MAX_VALUE,
    reward: {
      description: () => `Meta-Dimensions post-${format(Number.MAX_VALUE, 2, 0)} scale slower.`,
      effect: completions => completions * 5,
      formatEffect: value => `${formatX(15)} ➜ ${formatX(15 - value)}`,
    },
  },
  {
    id: 8,
    description: () => "Infinity and Time Dimensions are disabled and Meta-Dimension Boosts have no effect.",
    goal: { am: DC.BEMAX, ma: DC.BEMAX },
    reward: {
      description: () => "Gain more Extra Replicanti Galaxies.",
      effect: completions => (completions * 0.1) + 1,
      formatEffect: value => formatPercents(value, 0),
    },
  },
];
