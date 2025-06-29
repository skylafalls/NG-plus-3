import type { PairProduction as PP } from "@/core/quantum";
import type { MetaDimensions as MD, MetaDimension as MDSingle } from "@/core/dimensions/meta-dimension.js";
import type { AntimatterDimensions as AD, AntimatterDimension as ADSingle } from "@/core/dimensions/antimatter-dimension.js";
import type { TimeDimensions as TD, TimeDimension as TDSingle } from "@/core/dimensions/time-dimension.js";
import type { InfinityDimensions as ID, InfinityDimension as IDSingle } from "@/core/dimensions/infinity-dimension.js";
import type {
  scale as scaleFun,
  softcap as softcapFun,
} from "@/core/scaling.js";
import type { dev as D } from "@/core/devtools";
import type DecimalBE from "./break_eternity";

declare global {
  /**
   * The value of the Decimal is sign * 10^10^10...^mag, with (layer) 10s. If the layer is not 0, then negative mag means it's the reciprocal of the corresponding number with positive mag.
   */
  class Decimal extends DecimalBE {
    valueOf(): never;
  }
  const PairProduction: typeof PP;
  const MetaDimensions: typeof MD;
  const AntimatterDimensions: typeof AD;
  const TimeDimensions: typeof TD;
  const InfinityDimensions: typeof ID;
  const MetaDimension: typeof MDSingle;
  const AntimatterDimension: typeof ADSingle;
  const TimeDimension: typeof TDSingle;
  const InfinityDimension: typeof IDSingle;
  const dev: typeof D;
  const scale: typeof scaleFun;
  const softcap: typeof softcapFun;
  enum SOFTCAP_MODES {
    MULTIPLICATIVE = 1,
    POLYNOMIAL = 2,
    DILATION = 3,
    DILATION_TIER_2 = 4,
    LOGARITHMIC = 5,
    REPEATED_LOGARITHM = 6,
    SUPER_LOGARITHMIC = 7,
    NONE = 8,
  }

  enum SCALING_TYPES {
    MULTIPLICATIVE = 1,
    POLYNOMIAL = 2,
    EXPONENTIAL = 3,
    DILATION = 4,
    DILATION_TIER_2 = 5,
    REPEATED_EXPONENTIATION = 6,
    TETRATION = 7,
    NONE = 8,
  }

  enum GAME_EVENT {
  // Ticks
    GAME_TICK_BEFORE = "GAME_TICK_BEFORE",
    GAME_TICK_AFTER = "GAME_TICK_AFTER",
    REPLICANTI_TICK_BEFORE = "REPLICANTI_TICK_BEFORE",
    REPLICANTI_TICK_AFTER = "REPLICANTI_TICK_AFTER",

    // Resets
    DIMBOOST_BEFORE = "DIMBOOST_BEFORE",
    DIMBOOST_AFTER = "DIMBOOST_AFTER",
    GALAXY_RESET_BEFORE = "GALAXY_RESET_BEFORE",
    GALAXY_RESET_AFTER = "GALAXY_RESET_AFTER",
    SACRIFICE_RESET_BEFORE = "SACRIFICE_RESET_BEFORE",
    SACRIFICE_RESET_AFTER = "SACRIFICE_RESET_AFTER",
    BIG_CRUNCH_BEFORE = "BIG_CRUNCH_BEFORE",
    BIG_CRUNCH_AFTER = "BIG_CRUNCH_AFTER",
    ETERNITY_RESET_BEFORE = "ETERNITY_RESET_BEFORE",
    ETERNITY_RESET_AFTER = "ETERNITY_RESET_AFTER",
    META_DIMBOOST_BEFORE = "META_DIMBOOST_BEFORE",
    META_DIMBOOST_AFTER = "META_DIMBOOST_AFTER",
    QUANTUM_RESET_BEFORE = "QUANTUM_RESET_BEFORE",
    QUANTUM_RESET_AFTER = "QUANTUM_RESET_AFTER",
    REALITY_RESET_BEFORE = "REALITY_RESET_BEFORE",
    REALITY_RESET_AFTER = "REALITY_RESET_AFTER",
    SINGULARITY_RESET_BEFORE = "SINGULARITY_RESET_BEFORE",
    SINGULARITY_RESET_AFTER = "SINGULARITY_RESET_AFTER",
    ARMAGEDDON_BEFORE = "ARMAGEDDON_BEFORE",
    ARMAGEDDON_AFTER = "ARMAGEDDON_AFTER",

    // Glyphs
    GLYPHS_EQUIPPED_CHANGED = "GLYPHS_EQUIPPED_CHANGED",
    GLYPHS_CHANGED = "GLYPHS_CHANGED",
    GLYPH_SACRIFICED = "GLYPH_SACRIFICED",
    GLYPH_SET_SAVE_CHANGE = "GLYPH_SET_SAVE_CHANGE",
    GLYPH_VISUAL_CHANGE = "GLYPH_VISUAL_CHANGE",

    // Break Infinity
    BREAK_INFINITY = "BREAK_INFINITY",
    FIX_INFINITY = "FIX_INFINITY",

    // Other
    INFINITY_DIMENSION_UNLOCKED = "INFINITY_DIMENSION_UNLOCKED",
    INFINITY_CHALLENGE_COMPLETED = "INFINITY_CHALLENGE_COMPLETED",
    INFINITY_UPGRADE_BOUGHT = "INFINITY_UPGRADE_BOUGHT",
    INFINITY_UPGRADE_CHARGED = "INFINITY_UPGRADE_CHARGED",
    INFINITY_UPGRADES_DISCHARGED = "INFINITY_UPGRADES_DISCHARGED",
    ACHIEVEMENT_UNLOCKED = "ACHIEVEMENT_UNLOCKED",
    CHALLENGE_FAILED = "CHALLENGE_FAILED",
    REALITY_UPGRADE_BOUGHT = "REALITY_UPGRADE_BOUGHT",
    REALITY_UPGRADE_TEN_BOUGHT = "REALITY_UPGRADE_TEN_BOUGHT",
    PERK_BOUGHT = "PERK_BOUGHT",
    BLACK_HOLE_UNLOCKED = "BLACK_HOLE_UNLOCKED",
    BLACK_HOLE_UPGRADE_BOUGHT = "BLACK_HOLE_UPGRADE_BOUGHT",
    GAME_LOAD = "GAME_LOAD",
    OFFLINE_CURRENCY_GAINED = "OFFLINE_CURRENCY_GAINED",
    SAVE_CONVERTED_FROM_PREVIOUS_VERSION = "SAVE_CONVERTED_FROM_PREVIOUS_VERSION",
    REALITY_FIRST_UNLOCKED = "REALITY_FIRST_UNLOCKED",
    AUTOMATOR_TYPE_CHANGED = "AUTOMATOR_TYPE_CHANGED",
    AUTOMATOR_SAVE_CHANGED = "AUTOMATOR_SAVE_CHANGED",
    AUTOMATOR_CONSTANT_CHANGED = "AUTOMATOR_CONSTANT_CHANGED",
    PELLE_STRIKE_UNLOCKED = "PELLE_STRIKE_UNLOCKED",

    // Used by events to signify that they are triggered by a particular
    // event, not handled by the event hub
    ACHIEVEMENT_EVENT_OTHER = "ACHIEVEMENT_EVENT_OTHER",

    ENTER_PRESSED = "ENTER_PRESSED",
    ARROW_KEY_PRESSED = "ARROW_KEY_PRESSED",

    // UI Events
    UPDATE = "UPDATE",
    TAB_CHANGED = "TAB_CHANGED",
    CLOSE_MODAL = "CLOSE_MODAL",
  }

  interface Window {
    Decimal: typeof DecimalBE
    scale: typeof scale
    softcap: typeof softcap
  }
  interface ArrayConstructor {
    range(start: number, count: number): Array<number>
    repeat<T>(value: T, count: number): Array<T>
    fromBitmask(mask: number): Array<number>
    readonly dimensionTiers: [1, 2, 3, 4, 5, 6, 7, 8]
  }
  interface StringConstructor {
    isWhiteSpace(value: string): boolean
  }
  interface Number {
    /**
     * Converts a number prmitive into a Decimal value.
     */
    toDecimal(): Decimal
  }

  interface Math {
    clampMax(value: number, maximum: number): number
    clampMin(value: number, minimum: number): number
    clamp(value: number, minimum: number, maximum: number): number
  }
}
