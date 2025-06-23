export const masteryStudies = [
  {
    id: "M11",
    cost: new Decimal("1e70"),
    requirement: [() => TimeStudy.masteryStudies.isBought],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Disable the Infinity Point 2x multiplier upgrade cap.",
  },
  {
    id: "M21",
    cost: new Decimal("1e81"),
    requirement: [11],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () =>
      `Remote Antimatter Galaxy scaling starts ${formatInt(1)} later per ${
        formatInt(3000)
      } dimension boosts`,
    effect: () => player.dimensionBoosts.div(3000).floor(),
    formatEffect: value => formatPlus(value, 0, 0),
  },
  {
    id: "M22",
    cost: new Decimal("1e81"),
    requirement: [11],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () =>
      `Remote Antimatter Galaxy scaling starts ${formatInt(1)} later per ${
        formatInt(7)
      } Tachyonic Galaxies`,
    effect: () => player.dilation.totalTachyonGalaxies.div(7).floor(),
    formatEffect: value => formatPlus(value, 0, 0),
  },
  {
    id: "M23",
    cost: new Decimal("1e82"),
    requirement: [11],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () =>
      `Remote Antimatter Galaxy scaling starts ${formatInt(1)} later per ${
        formatInt(4)
      } non-extra Replicanti Galaxies`,
    effect: () => player.replicanti.galaxies.div(4).floor(),
    formatEffect: value => formatPlus(value, 0, 0),
  },
  {
    id: "M31",
    cost: new Decimal("2e83"),
    requirement: [21],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () =>
      "Dimension Boosts scale by 1 less 8th Antimatter Dimension",
    effect: () => 1,
  },
  {
    id: "M32",
    cost: new Decimal("2e83"),
    requirement: [21],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () =>
      "Dimension Boosts boosts Meta Dimensions at a reduced rate",
    effect: () => DimBoost.totalBoosts.plus(1).sqrt(),
    formatEffect: value => formatX(value, 2),
  },
  {
    id: "M33",
    cost: new Decimal("2e83"),
    requirement: [22],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => "Meta-Dimension Boosts boosts Dilated Time production",
    effect: () => MetaDimensions.boost.totalBoosts.plus(1).pow(1.25),
    formatEffect: value => formatX(value, 2),
  },
  {
    id: "M34",
    cost: new Decimal("2e83"),
    requirement: [22],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () =>
      "Gain more Tachyon Particles based on Antimatter Galaxies",
    effect: () => player.galaxies.plus(1).cbrt(),
    formatEffect: value => formatX(value, 2),
  },
  {
    id: "M35",
    cost: new Decimal("2e83"),
    requirement: [23],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => "The Replicanti chance upgrade can go above 100%",
  },
  {
    id: "M36",
    cost: new Decimal("2e83"),
    requirement: [23],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => "Remote Replicanti Galaxy scaling is 30% weaker",
    effect: () => 0.7,
  },
  {
    id: "M41",
    cost: new Decimal("1e92"),
    requirement: [42],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => "Replicanti interval can go below 1 ms but the cost scales faster.",
    // oxlint-disable-next-line no-loss-of-precision
    effect: () => 1e-320,
  },
  {
    id: "M42",
    cost: new Decimal("1e92"),
    requirement: [() => TimeStudy.pairProduction],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => "You can buy all Time Studies in all three-way splits.",
  },
  {
    id: "M43",
    cost: new Decimal("1e92"),
    requirement: [42],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => "Replicanti chance strongly boosts itself.",
    effect: () => player.replicanti.chance.plus(1).pow(0.6),
    formatEffect: value => formatPow(value, 2, 2),
  },
  {
    id: "M51",
    cost: new Decimal("1e96"),
    requirement: [41],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => "Replicanti multiplier affects Dilated Time production.",
    effect: () => Decimal.pow(1.01, replicantiMult().plus(1).log10()),
    formatEffect: value => formatX(value, 2, 2),
  },
  {
    id: "M52",
    cost: new Decimal("1e96"),
    requirement: [43],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => "Replicanti multiplier affects Meta Dimensions.",
    effect: () => Decimal.pow(1.009, replicantiMult().plus(1).log10()),
    formatEffect: value => formatX(value, 2, 2),
  },
];
