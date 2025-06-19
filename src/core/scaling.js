/**
 * @enum
 */
export const SoftcapModes = {
  Multiplicative: 1,
  Polynomial: 2,
  Dilation: 3,
  Logarithmic: 4,
  LogarithmicExponential: 5,
  RepeatedLogarithm: 6,
  SuperLogarithmic: 7,
};

/**
 * @enum
 */
export const ScalingTypes = {
  Multiplicative: 1,
  Polynomial: 2,
  Exponential: 3,
  Dilation: 4,
  DilationTier2: 5,
  RepeatedExponentiation: 6,
  Tetration: 7,
};

/**
 * @typedef SoftcapParameters
 * @property {Decimal} BaseResource
 * @property {Decimal | number | string} SoftcapStart
 * @property {Decimal | number | string} SoftcapPower
 * @property {SoftcapModes} SoftcapType
 * @property {boolean?} IsDisabled
 */

/**
 * @typedef ScaleParameters
 * @property {Decimal} BaseResource
 * @property {Decimal | number | string} ScaleStart
 * @property {Decimal | number | string} ScalePower
 * @property {ScalingTypes} ScaleMode
 * @property {boolean?} IsInverted
 */

/**
 * @param {SoftcapParameters} parameters
 * @returns {Decimal}
 */
export function softcap(parameters) {
  const start = new Decimal(parameters.SoftcapStart);
  const power = new Decimal(parameters.SoftcapPower);
  if (!parameters.IsDisabled && parameters.BaseResource.lt(start)) {
    return parameters.BaseResource;
  }

  switch (parameters.SoftcapType) {
    case SoftcapModes.Polynomial: {
      return parameters.BaseResource.div(start).max(1).pow(power).mul(start);
    }

    case SoftcapModes.Multiplicative: {
      return parameters.BaseResource.sub(start).div(power).plus(start);
    }

    case SoftcapModes.Dilation: {
      return Decimal.pow10(
        parameters.BaseResource.div(start).log10().pow(power),
      ).mul(start);
    }

    case SoftcapModes.Logarithmic: {
      return parameters.BaseResource.div(start).log(power).plus(1).mul(start);
    }

    case SoftcapModes.DilationTier2: {
      return Decimal.pow10(
        parameters.BaseResource.div(start).log10().log10().pow(power).pow10(),
      ).mul(start);
    }

    case SoftcapModes.RepeatedLogarithm: {
      return Decimal.iteratedlog(
        parameters.BaseResource.div(start),
        10,
        power.toNumber(),
      ).plus(1).mul(start);
    }

    case SoftcapModes.SuperLogarithmic: {
      return Decimal.slog(parameters.BaseResource.div(start), power).plus(1)
        .mul(start);
    }

    default: {
      return parameters.BaseResource;
    }
  }
}

/**
 * @param {ScaleParameters} parameters
 * @returns {Decimal}
 */
export function scale(parameters) {
  const start = new Decimal(parameters.ScaleStart);
  const power = new Decimal(parameters.ScalePower);
  if (parameters.BaseResource.lt(start)) {
    return parameters.BaseResource;
  }

  switch (parameters.ScaleMode) {
    case ScalingTypes.Multiplicative: {
      return parameters.IsInverted
        ? parameters.BaseResource.sub(start).div(power).add(start)
        : parameters.BaseResource.sub(start).mul(power).add(start);
    }

    case ScalingTypes.Polynomial: {
      return parameters.IsInverted
        ? parameters.BaseResource.div(start).root(power).mul(start)
        : parameters.BaseResource.div(start).pow(power).mul(start);
    }

    case ScalingTypes.Exponential: {
      return parameters.IsInverted
        ? parameters.BaseResource.div(start).log(power).mul(start)
        : Decimal.pow(power, parameters.BaseResource.div(start).sub(1)).mul(
          start,
        );
    }

    case ScalingTypes.Dilation: {
      const s10 = Decimal.log10(start);
      return parameters.IsInverted
        ? Decimal.pow10(
          parameters.BaseResource.log10().div(s10).root(power).mul(s10),
        )
        : Decimal.pow10(
          parameters.BaseResource.log10().div(s10).pow(power).mul(s10),
        );
    }

    case ScalingTypes.DilationTier2: {
      const s10 = Decimal.log10(start).plus(1).log10();
      return parameters.IsInverted
        ? parameters.BaseResource.log10().plus(1).log10().div(s10).root(power)
          .mul(s10).pow10().pow10()
        : parameters.BaseResource.log10().plus(1).log10().div(s10).pow(power)
          .mul(s10).pow10().pow10();
    }

    case ScalingTypes.RepeatedExponentiation: {
      return parameters.IsInverted
        ? Decimal.iteratedlog(
          parameters.BaseResource.div(start).max(1),
          10,
          power.toNumber(),
        ).mul(start)
        : Decimal.iteratedexp(
          parameters.BaseResource.div(start),
          power.toNumber(),
        ).mul(start);
    }

    case ScalingTypes.Tetration: {
      return parameters.IsInverted
        ? parameters.BaseResource.div(start).slog(power).plus(1).mul(start)
        : parameters.BaseResource.div(start).tetrate(power.toNumber()).mul(
          start,
        );
    }

    default: {
      return parameters.BaseResource;
    }
  }
}

const ScaleNames = [
  "super",
  "hyper",
  "ultra",
  "meta",
  "exotic",
  "supercritical",
  "instant",
  "mega",
  "extreme",
  "absolute",
  "intense",
  "collapsed",
  "maximal",
];
const ScaleNamestoScaleTypes = new Map([
  ["super", ScalingTypes.Multiplicative],
  ["hyper", ScalingTypes.Polynomial],
  ["ultra", ScalingTypes.Polynomial],
  ["meta", ScalingTypes.Exponential],
  ["exotic", ScalingTypes.Polynomial],
  ["supercritical", ScalingTypes.Polynomial],
  ["instant", ScalingTypes.Dilation],
  ["mega", ScalingTypes.Exponential],
  ["extreme", ScalingTypes.Dilation],
  ["absolute", ScalingTypes.Dilation],
  ["intense", ScalingTypes.DilationTier2],
  ["collapsed", ScalingTypes.RepeatedExponentiation],
  ["maximal", ScalingTypes.Tetration],
]);
/**
 * @typedef scaleLevelsParameters
 * @property {Decimal} baseResource
 * @property {Decimal[]} scaleStart
 * @property {Decimal[]} scalingPower
 * @property {boolean} isInverted
 */

/**
 * @param {scaleLevelsParameters} parameters
 * @returns {Decimal}
 */
export function scaleAllLevels(parameters) {
  let resource = parameters.baseResource;
  for (let index = ScaleNames.length + 1; index--; index > 0) {
    if (
      parameters.scaleStart[index] === undefined ||
      parameters.scaleStart[index] === null
    ) {
      continue;
    }
    resource = scale({
      BaseResource: resource,
      ScaleStart: parameters.scaleStart[index],
      ScalePower: parameters.scaleStart[index],
      ScaleMode: ScaleNamestoScaleTypes.get(ScaleNames[index]),
      IsInverted: false,
    });
  }
  return resource;
}

/**
 * CostHandler is a simple class that abstracts away and standardizes how cost and
 * bulk purchase calculations are handled.
 *
 * This is an opinionated tool for handling costs and purchases, it's not recommended to define
 * something custom unless you are trying to achieve something specific.
 */
export class CostHandler {
  constructor(config) {
    this.config = config;
  }

  /**
   * @returns {Decimal}
   */
  get baseCost() {
    return this.config.formula(new Decimal(0));
  }

  /**
   * @returns {Decimal}
   */
  get cost() {
    return this.getCostOf(this.config.baseResource);
  }

  /**
   * @returns {Decimal}
   */
  get bulk() {
    return this.getBulkFor(this.config.currency);
  }

  /**
   * Assuming we have "x" resource, how much will it cost to buy X resources?
   * @@param {import("break_eternity.js").DecimalSource} baseResource
   */
  getCostOf(baseResource) {
    const decimalResource = new Decimal(baseResource);
    switch (this.config.scaleObj.scales) {
      case "once": {
        return scale({
          BaseResource: this.config.formula(decimalResource),
          ScaleStart: this.config.scaleObj.scaleStart(),
          ScalePower: this.config.scaleObj.scalePower(),
          ScaleMode: this.config.scaleObj.type,
          IsInverted: false,
        });
      }
      case "hybrid": {
        return scaleAllLevels({
          baseResource: this.config.formula(decimalResource),
          scaleStart: this.config.scaleObj.scaleStart(),
          scalingPower: this.config.scaleObj.scalePower(),
          isInverted: false,
        });
      }
      case "flex": {
        let resource = this.config.formula(decimalResource);
        for (let index = this.config.scaleObj.levels; index--; index >= 0) {
          resource = scale({
            BaseResource: resource,
            ScaleStart: this.config.scaleObj.scaleStart()[index],
            ScalePower: this.config.scaleObj.scalePower()[index],
            ScaleMode: this.config.scaleObj.scaleType[index],
            IsInverted: false,
          });
        }
        return resource;
      }

      default: {
        return this.config.formula(baseResource);
      }
    }
  }

  /**
   * Assuming we have "x" currency, how much of resource Y we can get?
   * @param {import("break_eternity.js").DecimalSource} currency
   */
  getBulkFor(currency) {
    const decimalCurrency = new Decimal(currency);
    switch (this.config.scaleObj.scales) {
      case "once": {
        return scale({
          BaseResource: this.config.inverseFormula(decimalCurrency),
          ScaleStart: this.config.scaleObj.scaleStart(),
          ScalePower: this.config.scaleObj.scalePower(),
          ScaleMode: this.config.scaleObj.type,
          IsInverted: true,
        });
      }
      case "hybrid": {
        return scaleAllLevels({
          baseResource: this.config.inverseFormula(decimalCurrency),
          scaleStart: this.config.scaleObj.scaleStart(),
          scalingPower: this.config.scaleObj.scalePower(),
          isInverted: true,
        });
      }
      case "flex": {
        let resource = this.config.inverseFormula(decimalCurrency);
        for (let index = this.config.scaleObj.levels; index--; index >= 0) {
          resource = scale({
            BaseResource: resource,
            ScaleStart: this.config.scaleObj.scaleStart()[index],
            ScalePower: this.config.scaleObj.scalePower()[index],
            ScaleMode: this.config.scaleObj.scaleType[index],
            IsInverted: true,
          });
        }
        return resource;
      }

      default: {
        return this.config.inverseFormula(decimalCurrency);
      }
    }
  }

  buyOnce() {
    if (this.cost.gt(this.config.currency)) {
      return false;
    }
    this.config.currency = this.config.currency.sub(this.cost);
    this.config.baseResource = this.config.baseResource.plus(1);
    return true;
  }

  buy() {
    return this.buyMax();
  }

  buyMax() {
    if (this.cost.gt(this.config.currency)) {
      return false;
    }
    const currency = this.config.currency;
    const resource = this.config.baseResource;

    // First case: Player has enough for one of baseResource but not anything higher.
    // This would be exactly the same as purchase() in that case.
    if (currency.gte(this.getCostOf(1)) && currency.lt(this.getCostOf(2))) {
      return this.buyOnce();
    }

    // Second case: Player has enough for >= 2 baseResource.
    // Use the getBulkFor() function defined above, then subtract the required cost.
    // Sanity check: Is the baseResource/currency NaN?
    if (!Decimal.isFinite(currency) || !Decimal.isFinite(resource)) {
      return false;
    }

    // Now here's the actual calulation.
    this.config.currency = currency.sub(this.getCostOf(resource));
    this.config.baseResource = resource.add(this.getBulkFor(currency));
    return true;
  }
}
