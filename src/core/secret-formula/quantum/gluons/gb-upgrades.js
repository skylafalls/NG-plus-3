export const gbGluonUpgrades = [
  {
    id: 1,
    cost: () => new Decimal(1),
    description: () => "Tickspeed also affects Replicanti's production at a reduced rate.",
    effect: () => Tickspeed.perSecond.plus(1).log2(),
    formatEffect: value => `${formatX(value, 2)} faster`,
  },
  {
    id: 2,
    cost: () => new Decimal(2),
    description: () => `Replicanti slowdown is ${formatPercents(0.5, 0)} slower.`,
    effect: () => 0.5,
  },
  {
    id: 3,
    cost: () => new Decimal(5),
    description: () => `Bump the IP multiplier upgrade to ${formatX(3, 0, 0)}.`,
    effect: () => 3,
  },
  {
    id: 4,
    cost: () => new Decimal(100),
    description: () => `Decrease the tickspeed cost multiplier to ${formatX(1.25, 2)}.`,
    effect: () => 1.25,
  },
  {
    id: 5,
    cost: () => new Decimal(7e15),
    description: () => `Positron upgrade scales by ${format(1, 0)} level lower.`,
    effect: () => 1,
  },
  {
    id: 6,
    cost: () => new Decimal(4e19),
    description: () => "Infinity Power weakes Distant Antimatter Galaxy scaling.",
    effect: () => Currency.infinityPower.value.plus(1).log10().plus(1).log10().div(20).plus(1),
    formatEffect: value => `${formatPercents(value.sub(1), 2)} weaker`,
  },
  {
    id: 7,
    cost: () => new Decimal(3e25),
    description: () => "Replicanti slows down Remote Antimatter Galaxy scaling.",
    effect: () => Replicanti.amount.plus(1).log10().plus(1).log10().div(24).plus(1),
    formatEffect: value => `${formatPercents(value.sub(1), 2)} weaker`,
  },
  {
    id: 8,
    cost: () => new Decimal("1e570"),
    description: () => "GB Gluons raises the half-life of free preons.",
    effect: () => player.quantum.gluons.gb.plus(1).log10(),
    formatEffect: value => formatX(value, 2),
  },
];
