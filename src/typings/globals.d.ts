import type { PairProduction as PP } from "@/core/quantum";
import type { MetaDimensions as MD } from "@/core/dimensions/meta-dimension.js";
import type { AntimatterDimensions as AD } from "@/core/dimensions/antimatter-dimension.js";
import type { TimeDimensions as TD } from "@/core/dimensions/time-dimension.js";
import type { InfinityDimensions as ID } from "@/core/dimensions/infinity-dimension.js";
import type {
  CostHandler,
  scale,
  scaleAllLevels,
  ScalingTypes,
  softcap,
  SoftcapModes,
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

  interface Window {
    Decimal: typeof DecimalBE;
    scale: typeof scale;
    scaleAllLevels: typeof scaleAllLevels;
    softcap: typeof softcap;
    SoftcapModes: typeof SoftcapModes;
    ScalingTypes: typeof ScalingTypes;
    CostHandler: typeof CostHandler;
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
