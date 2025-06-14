export const electronMultiplierUpgrades = [
  {
    id: 1,
    initialCost: new Decimal(100),
    increment: new Decimal(1.25),
    currencyDisplay: "Time Thorems",
    multiplierIncrement: () => new Decimal(0.25),
    formatCost: value => format(value, 2, 0),
  },
  {
    id: 2,
    initialCost: new Decimal(10),
    increment: new Decimal(3),
    currencyDisplay: "Dilated Time",
    multiplierIncrement: () => new Decimal(0.25),
    formatCost: value => format(value, 2, 0),
  },
  {
    id: 3,
    initialCost: new Decimal(100),
    increment: new Decimal(2.5),
    currencyDisplay: "Meta-Antimatter",
    multiplierIncrement: () => new Decimal(0.25),
    formatCost: value => format(value, 2, 0),
  },
  {
    id: 4,
    initialCost: new Decimal(5),
    increment: new Decimal(1.08),
    currencyDisplay: "Meta-Dimension Boosts",
    multiplierIncrement: () => new Decimal(0.25),
    formatCost: value => format(value, 2, 0),
  },
];

export const positronMultiplierUpgrades = [
  {
    id: 1,
    initialCost: new Decimal(100),
    increment: new Decimal(1.5),
    currencyDisplay: "Time Thorems",
    multiplierIncrement: () => new Decimal(0.1),
    formatCost: value => format(value, 2, 0),
  },
  {
    id: 2,
    initialCost: new Decimal(10),
    increment: new Decimal(4),
    currencyDisplay: "Dilated Time",
    multiplierIncrement: () => new Decimal(0.1),
    formatCost: value => format(value, 2, 0),
  },
  {
    id: 3,
    initialCost: new Decimal(100),
    increment: new Decimal(3),
    currencyDisplay: "Meta-Antimatter",
    multiplierIncrement: () => new Decimal(0.1),
    formatCost: value => format(value, 2, 0),
  },
  {
    id: 4,
    initialCost: new Decimal(5),
    increment: new Decimal(1.2),
    currencyDisplay: "Meta-Dimension Boosts",
    multiplierIncrement: () => new Decimal(0.1),
    formatCost: value => format(value, 2, 0),
  },
];
