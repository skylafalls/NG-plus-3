import { DC } from "@/core/constants.js";

// This file exists purely so that the UI would work.
export const quarkMultiplierConfig = {
  id: "quarkMultiplierUpgrade",
  cost: () => DC.D5,
  costIncrease: () => DC.D5,
  description: () => `Multiply Quarks gain by ${formatX(2)}`,
  effect: () => DC.D2.pow(player.quantum.quarkMultiplierPurchases),
  cap: () => {},
  formatEffect: (value) => formatX(value, 2, 2),
};
