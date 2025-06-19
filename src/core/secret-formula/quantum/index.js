import { brGluonUpgrades } from "./gluons/br-upgrades.js";
import { gbGluonUpgrades } from "./gluons/gb-upgrades.js";
import { rgGluonUpgrades } from "./gluons/rg-upgrades.js";
import {
  electronMultiplierUpgrades,
  positronMultiplierUpgrades,
} from "./pair-production-upgrades.js";
import { quarkMultiplierConfig } from "./quarks/multiplier.js";

export const quantum = {
  quarkMultiplierConfig,
  brGluonUpgrades,
  gbGluonUpgrades,
  rgGluonUpgrades,
  electronMultiplierUpgrades,
  positronMultiplierUpgrades,
};
