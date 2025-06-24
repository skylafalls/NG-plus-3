export const rgGluonUpgrades = [
  {
    id: 1,
    cost: () => new Decimal(1),
    description: () => "Remote Antimatter Galaxy scaling is 50% weaker.",
    effect: () => 1.5,
  },
  {
    id: 2,
    cost: () => new Decimal(2),
    description: () => "Tachyonic Galaxies strengthens all other galaxies.",
    effect: () => player.dilation.totalTachyonGalaxies.plus(1).log10().div(25).plus(1),
    formatEffect: value => `${formatPercents(value.sub(1), 2)} stronger`,
  },
  {
    id: 3,
    cost: () => new Decimal(5),
    description: () => "Dimension Boosts boosts 1st Meta Dimensions.",
    effect: () => DimBoost.totalBoosts.plus(1).pow(8),
    formatEffect: value => formatX(value, 2),
  },
  {
    id: 4,
    cost: () => new Decimal(100),
    description: () => "All Galaxies are 50% stronger.",
    effect: () => 1.5,
  },
  {
    id: 5,
    cost: () => new Decimal(7e15),
    description: () => "Gain more quarks based on current Antimatter.",
    effect: () => Currency.antimatter.value.plus(1).logPow(0.1),
    formatEffect: value => formatX(value, 2),
  },
  {
    id: 6,
    cost: () => new Decimal(4e19),
    description: () => `Distant Antimatter Galaxy scaling is ${formatPercents(0.132, 1)} weaker.`,
    effect: () => 1.132,
  },
  {
    id: 7,
    cost: () => new Decimal(3e25),
    description: () => `Remote Antimatter Galaxy scaling is ${formatPercents(0.15, 0)} weaker.`,
    effect: () => 1.15,
  },
  {
    id: 8,
    cost: () => new Decimal("1e570"),
    description: () => "RG Gluons raises the half-life of free preons.",
    effect: () => player.quantum.gluons.rg.plus(1).log10(),
    formatEffect: value => formatX(value, 2),
  },
];
