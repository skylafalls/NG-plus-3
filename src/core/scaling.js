/**
 * @enum
 */
export const SOFTCAP_MODES = Object.freeze({
  MULTIPLICATIVE: 1,
  POLYNOMIAL: 2,
  DILATION: 3,
  EXPONENTIAL: 4,
  LOGARITHMIC: 5,
  REPEATED_LOGARITHM: 6,
  SUPER_LOGARITHMIC: 7,
});

/**
 * @enum
 */
export const SCALING_TYPES = Object.freeze({
  MULTIPLICATIVE: 1,
  POLYNOMIAL: 2,
  EXPONENTIAL: 3,
  DILATION: 4,
  DILATION_TIER_2: 5,
  REPEATED_EXPONENTIATION: 6,
  TETRATION: 7,
});

/**
 * @typedef SoftcapParameters
 * @property {Decimal} baseResource
 * @property {Decimal | number | string} softcapStart
 * @property {Decimal | number | string} softcapPower
 * @property {SOFTCAP_MODES} softcapType
 * @property {boolean?} isDisabled
 */

/**
 * @typedef ScaleParameters
 * @property {Decimal} baseResource
 * @property {Decimal | number | string} scaleStart
 * @property {Decimal | number | string} scalePower
 * @property {SCALING_TYPES} scaleMode
 * @property {boolean?} isInverted
 */

/**
 * @param {SoftcapParameters} parameters
 * @returns {Decimal}
 */
export function softcap(parameters) {
  const start = new Decimal(parameters.softcapStart);
  const power = new Decimal(parameters.softcapPower);
  if (!parameters.isDisabled && parameters.baseResource.lt(start)) {
    return parameters.baseResource;
  }

  switch (parameters.softcapType) {
    case SOFTCAP_MODES.POLYNOMIAL: {
      return parameters.baseResource.div(start).max(1).pow(power).mul(start);
    }

    case SOFTCAP_MODES.MULTIPLICATIVE: {
      return parameters.baseResource.sub(start).div(power).plus(start);
    }

    case SOFTCAP_MODES.DILATION: {
      return Decimal.pow10(
        parameters.baseResource.div(start).log10().pow(power),
      ).mul(start);
    }

    case SOFTCAP_MODES.LOGARITHMIC: {
      return parameters.baseResource.div(start).log(power).plus(1).mul(start);
    }

    case SOFTCAP_MODES.DILATION_TIER_2: {
      return Decimal.pow10(
        parameters.baseResource.div(start).log10().log10().pow(power).pow10(),
      ).mul(start);
    }

    case SOFTCAP_MODES.REPEATED_LOGARITHM: {
      return Decimal.iteratedlog(
        parameters.baseResource.div(start),
        10,
        power.toNumber(),
      ).plus(1).mul(start);
    }

    case SOFTCAP_MODES.SUPER_LOGARITHMIC: {
      return Decimal.slog(parameters.baseResource.div(start), power).plus(1)
        .mul(start);
    }

    default: {
      return parameters.baseResource;
    }
  }
}

/**
 * @param {ScaleParameters} parameters
 * @returns {Decimal}
 */
export function scale(parameters) {
  const start = new Decimal(parameters.scaleStart);
  const power = new Decimal(parameters.scalePower);
  if (parameters.baseResource.lt(start)) {
    return parameters.baseResource;
  }

  switch (parameters.scaleMode) {
    case SCALING_TYPES.MULTIPLICATIVE: {
      return parameters.isInverted
        ? parameters.baseResource.sub(start).div(power).add(start)
        : parameters.baseResource.sub(start).mul(power).add(start);
    }

    case SCALING_TYPES.POLYNOMIAL: {
      return parameters.isInverted
        ? parameters.baseResource.sub(start).root(power).add(start)
        : parameters.baseResource.sub(start).pow(power).add(start);
    }

    case SCALING_TYPES.EXPONENTIAL: {
      return parameters.isInverted
        ? parameters.baseResource.sub(start).log(power).add(start)
        : Decimal.pow(power, parameters.baseResource.sub(start).sub(1)).add(
            start,
          );
    }

    case SCALING_TYPES.DILATION: {
      const s10 = Decimal.log10(start);
      return parameters.isInverted
        ? Decimal.pow10(
            parameters.baseResource.log10().div(s10).root(power).mul(s10),
          )
        : Decimal.pow10(
            parameters.baseResource.log10().div(s10).pow(power).mul(s10),
          );
    }

    case SCALING_TYPES.DILATION_TIER_2: {
      const s10 = Decimal.log10(start).plus(1).log10();
      return parameters.isInverted
        ? parameters.baseResource.log10().plus(1).log10().div(s10).root(power)
            .mul(s10).pow10().pow10()
        : parameters.baseResource.log10().plus(1).log10().div(s10).pow(power)
            .mul(s10).pow10().pow10();
    }

    case SCALING_TYPES.REPEATED_EXPONENTIATION: {
      return parameters.isInverted
        ? Decimal.iteratedlog(
            parameters.baseResource.div(start).max(1),
            10,
            power.toNumber(),
          ).mul(start)
        : Decimal.iteratedexp(
            parameters.baseResource.div(start),
            power.toNumber(),
          ).mul(start);
    }

    case SCALING_TYPES.TETRATION: {
      return parameters.isInverted
        ? parameters.baseResource.div(start).slog(power).plus(1).mul(start)
        : parameters.baseResource.div(start).tetrate(power.toNumber()).mul(
            start,
          );
    }

    default: {
      return parameters.baseResource;
    }
  }
}
