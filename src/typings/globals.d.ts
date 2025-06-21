import type { PairProduction as PP } from "@/core/quantum";
import type { MetaDimensions as MD } from "@/core/dimensions/meta-dimension.js";
import type { AntimatterDimensions as AD } from "@/core/dimensions/antimatter-dimension.js";
import type { TimeDimensions as TD } from "@/core/dimensions/time-dimension.js";
import type { InfinityDimensions as ID } from "@/core/dimensions/infinity-dimension.js";
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
  const dev: typeof D;
  const scale: typeof scaleFun;
  const softcap: typeof softcapFun;
  enum SOFTCAP_MODES {
    MULTIPLICATIVE = 1,
    POLYNOMIAL = 2,
    DILATION = 3,
    EXPONENTIAL = 4,
    LOGARITHMIC = 5,
    REPEATED_LOGARITHM = 6,
    SUPER_LOGARITHMIC = 7,
  }

  enum SCALING_TYPES {
    MULTIPLICATIVE = 1,
    POLYNOMIAL = 2,
    EXPONENTIAL = 3,
    DILATION = 4,
    DILATION_TIER_2 = 5,
    REPEATED_EXPONENTIATION = 6,
    TETRATION = 7,
  }

  interface Window {
    Decimal: typeof DecimalBE;
    scale: typeof scale;
    softcap: typeof softcap;
  }
  interface ArrayConstructor {
    range(start: number, count: number): Array<number>;
    repeat<T>(value: T, count: number): Array<T>;
    fromBitmask(mask: number): Array<number>;
    readonly dimensionTiers: [1, 2, 3, 4, 5, 6, 7, 8];
  }
  interface StringConstructor {
    isWhiteSpace(value: string): boolean;
  }
  interface Number {
    toDecimal(): Decimal;
  }
}
