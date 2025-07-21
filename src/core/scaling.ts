export enum SOFTCAP_MODES {
  MULTIPLICATIVE = 1,
  POLYNOMIAL = 2,
  DILATION = 3,
  DILATION_TIER_2 = 4,
  LOGARITHMIC = 5,
  REPEATED_LOGARITHM = 6,
  SUPER_LOGARITHMIC = 7,
  NONE = 8,
};

export enum SCALING_TYPES {
  MULTIPLICATIVE = 1,
  POLYNOMIAL = 2,
  EXPONENTIAL = 3,
  DILATION = 4,
  DILATION_TIER_2 = 5,
  REPEATED_EXPONENTIATION = 6,
  TETRATION = 7,
  NONE = 8,
};

interface SoftcapParameters {
  baseResource: Decimal
  softcapStart: Decimal | number | string
  softcapPower: Decimal | number | string
  softcapType: SOFTCAP_MODES
}

interface ScaleParameters {
  baseResource: Decimal
  scaleStart: Decimal | number | string
  scalePower: Decimal | number | string
  scaleMode: SCALING_TYPES
  isInverted?: boolean
}

export function softcap(parameters: SoftcapParameters) {
  const start = new Decimal(parameters.softcapStart);
  const power = new Decimal(parameters.softcapPower);
  if (parameters.baseResource.lt(start)) {
    return parameters.baseResource;
  }

  switch (parameters.softcapType) {
    case SOFTCAP_MODES.MULTIPLICATIVE: {
      return parameters.baseResource.sub(start).div(power).plus(start);
    }

    case SOFTCAP_MODES.POLYNOMIAL: {
      return parameters.baseResource.div(start).pow(power).mul(start);
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

export function scale(parameters: ScaleParameters) {
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
        ? Decimal.pow10(parameters.baseResource.log10().div(s10).root(power).mul(s10))
        : Decimal.pow10(parameters.baseResource.log10().div(s10).pow(power).mul(s10));
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

interface SoftcapGradualParams {
  start: Decimal | string | number
  scalingStrength: Decimal | string | number
  initialPower: Decimal | string | number
  type: "polynomial" | "dilative"
}

/**
 * This function takes in the resource, the softcap start, the scaling power, and the initial power
 * and converts it into a softcap on the resource that gradually gets stronger the more
 * of the the resource you accumlate.
 *
 * Currently only polynomial (x^y) and dilative (10^log10(x)^y) equations are supported
 * but this function can be expanded to support more later down the line.
 */
export function softcapGradual(resource: Decimal, config: SoftcapGradualParams) {
  const { type } = config;
  const start = new Decimal(config.start);
  const scale = new Decimal(config.scalingStrength);
  const power = new Decimal(config.initialPower);
  if (resource.lt(start)) return resource;
  switch (type) {
    case "polynomial": {
      const exp = Decimal.div(power, resource.log10().div(start.log10()).pow(scale));
      return resource.div(start).pow(exp).mul(start);
    }
    case "dilative": {
      const exp = Decimal.div(power, resource.log10().max(1).log10().div(start.log10().max(1).log10()).pow(scale));
      return Decimal.pow(10, resource.log10().div(start).pow(exp).mul(start));
    }
    default: {
      throw new Error(`The ${type} softcap gradual type is not implemented.`);
    }
  }
}

export enum SCALE_LEVEL {
  NONE = 0,
  DISTANT = 1,
  FURTHER = 2,
  REMOTE = 3,
  OBSCURE = 4,
  INVISIBLE = 5,
  GHOSTLY = 6,
  ETHEREAL = 7,
}
