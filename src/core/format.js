import { isDecimal } from "../utility/type-check";

function isEND() {
  const threshold = GameEnd.endState >= END_STATE_MARKERS.END_NUMBERS
    ? 1
    : (GameEnd.endState - END_STATE_MARKERS.FADE_AWAY) / 2;
  // Using the Pelle.isDoomed getter here causes this to not update properly after a game restart
  return player.celestials.pelle.doomed && Math.random() < threshold;
}

window.format = function format(value, places = 2, placesUnder1000 = 2) {
  if (isEND()) return "END";
  // eslint-disable-next-line no-param-reassign
  if (!isDecimal(value)) value = new Decimal(value);
  return formatInternal(value, places)
};

window.formatInt = function formatInt(value) {
  if (isEND()) return "END";
  if (typeof value === "number") {
    return value > 1e9 ? format(value, 2, 2) : formatWithCommas(value.toFixed(0));
  }
  return (!(value instanceof Decimal) || value.lt(1e9))
    ? formatWithCommas(value instanceof Decimal ? value.toNumber().toFixed(0) : 1) : format(value, 2, 2);
};

window.formatFloat = function formatFloat(value, digits) {
  if (isEND()) return "END";
  if (Notations.current.isPainful) {
    return format(value, Math.max(2, digits), digits);
  }
  return formatWithCommas(value.toFixed(digits));
};

window.formatPostBreak = function formatPostBreak(value, places, placesUnder1000) {
  if (isEND()) return "END";
  return format(value, places);
};

window.formatPlus = function formatX(value, places, placesUnder1000) {
  return `+${format(value, places, placesUnder1000)}`;
};

window.formatX = function formatX(value, places, placesUnder1000) {
  return `×${format(value, places, placesUnder1000)}`;
};

window.formatPow = function formatPow(value, places, placesUnder1000) {
  return `^${format(value, places, placesUnder1000)}`;
};

window.formatPercents = function formatPercents(value, places) {
  return `${format(Decimal.mul(value, 100), 2, places)}%`;
};

window.formatRarity = function formatRarity(value) {
  // We can, annoyingly, have rounding error here, so even though only rarities
  // are passed in, we can't trust our input to always be some integer divided by 10.
  const places = value.mod(1).eq(0) ? 0 : 1;
  return `${format(value, 2, places)}%`;
};

// We assume 2/0, 2/2 decimal places to keep parameter count sensible; this is used very rarely
window.formatMachines = function formatMachines(realPart, imagPart) {
  if (isEND()) return "END";
  const parts = [];
  if (Decimal.neq(realPart, 0)) parts.push(format(realPart, 2));
  if (Decimal.neq(imagPart, 0)) parts.push(`${format(imagPart, 2, 2)}i`);
  // This function is used for just RM and just iM in a few spots, so we have to push both parts conditionally
  // Nonetheless, we also need to special-case both zero so that it doesn't end up displaying as an empty string
  if (Decimal.eq(realPart, 0) && Decimal.eq(imagPart, 0)) return format(0);
  return parts.join(" + ");
};

window.formatTet = function formatTet(value, places, placesUnder1000) {
  return `^^${format(value, places, placesUnder1000)}`;
};

window.formatEffectPos = function formatEffectPos(effect, effectedValue, tet = true) {
  if (effect.lt(1000)) {
    // eslint-disable-next-line prefer-template
    return formatInt(effect, 2, 4) + "%";
  }
  if (effect.lt("1e100000") || effectedValue.lt(2)) {
    return formatX(effect, 2, 2);
  }
  if ((effect.lt("10^^100") && tet || effect.lt("10^^4")) || effectedValue.lt(10)) {
    return formatPow(effect.log10(), 2, 2);
  }
  if (tet) {
    // Not perfect, but idc
    return formatTet(value.slog(10), 2, 2);
  }
  val = new Decimal(effect);
  val.layer = 1;
  // eslint-disable-next-line prefer-template
  return formatInt(Math.floor(effect.slog() - 1)) + "th Expo " + formatPow(val, 2, 2);
};

// Does not take negative numbers fyi, just ints between 0-1 (excluding)
window.formatEffectNeg = function formatEffectNeg(effect, effectedValue) {
  if (effect.gt(0.001)) {
    // eslint-disable-next-line prefer-template
    return formatInt(effect, 2, 4) + "%";
  }
  if (effect.lt("1e100000") || effectedValue.lt(2)) {
    // eslint-disable-next-line prefer-template
    return "/" + format(effect.recip(), 2, 2);
  }
  if (effect.recip().lt("10^^4") || effectedValue.lt(10)) {
    return formatPow(effect.log10(), 2, 2);
  }
  val = new Decimal(effect);
  val.layer = 1;
  // eslint-disable-next-line prefer-template
  return formatInt(Math.floor(effect.recip().slog().toNumber() - 1)) + "th Expo " + formatPow(val, 2, 2);
};

window.formatEffectAuto = function formatEffectAuto(value, effectedValue) {
  if (value.gt(1)) {
    return formatEffectPos(value, effectedValue);
  }
  return formatEffectNeg(value, effectedValue, false);
};


window.timeDisplay = function timeDisplay(ms) {
  return TimeSpan.fromMilliseconds(ms).toString();
};

window.timeDisplayNoDecimals = function timeDisplayNoDecimals(ms) {
  return TimeSpan.fromMilliseconds(ms).toStringNoDecimals();
};

window.timeDisplayShort = function timeDisplayShort(ms) {
  return TimeSpan.fromMilliseconds(ms).toStringShort();
};

const commaRegexp = /\B(?=(\d{3})+(?!\d))/gu;
window.formatWithCommas = function formatWithCommas(value) {
  const decimalPointSplit = value.toString().split(".");
  decimalPointSplit[0] = decimalPointSplit[0].replace(commaRegexp, ",");
  return decimalPointSplit.join(".");
};

// Some letters in the english language pluralize in a different manner than simply adding an 's' to the end.
// As such, the regex match should be placed in the first location, followed by the desired string it
// should be replaced with. Note that $ refers to the EndOfLine for regex, and should be included if the plural occurs
// at the end of the string provided, which will be 99% of times. Not including it is highly likely to cause mistakes,
// as it will select the first instance that matches and replace that.
const PLURAL_HELPER = new Map([
  [/y$/u, "ies"],
  [/x$/u, "xes"],
  [/$/u, "s"]
]);

// Some terms require specific (or no) handling when plural. These terms should be added, in Word Case, to this Map.
// Words will be added to this Map when a valid plural for it is found on being run through the pluralize function.
const pluralDatabase = new Map([
  ["Antimatter", "Antimatter"],
  ["Dilated Time", "Dilated Time"],
]);

/**
 * A function that pluralizes a word based on a designated amount
 * @param  {string} word           - word to be pluralized
 * @param  {number|Decimal} amount - amount to be used to determine if the value is plural
 * @param  {string} [plural]       - if defined, a specific plural to override the generated plural
 * @return {string} - if the {amount} is anything other than one, return the {plural} provided or the
 *                    plural form of the input {word}. If the {amount} is singular, return {word}
 */
window.pluralize = function pluralize(word, amount, plural) {
  if (word === undefined || amount === undefined) throw "Arguments must be defined";

  if (Decimal.eq(amount, 1)) return word;
  const existingPlural = plural ?? pluralDatabase.get(word);
  if (existingPlural !== undefined) return existingPlural;

  const newWord = generatePlural(word);
  pluralDatabase.set(word, newWord);
  return newWord;
};

/**
 * Creates a new plural based on PLURAL_HELPER and adds it to pluralDatabase
 * @param  {string} word - a word to be pluralized using the regex in PLURAL_HELPER
 * @return {string} - returns the pluralized word. if no pluralized word is found, simply returns the word itself.
 */
window.generatePlural = function generatePlural(word) {
  for (const [match, replaceWith] of PLURAL_HELPER.entries()) {
    const newWord = word.replace(match, replaceWith);
    if (word !== newWord) return newWord;
  }
  return word;
};

/**
 * Returns the formatted value followed by a name, pluralized based on the value input.
 * @param  {string} name                  - name to pluralize and display after {value}
 * @param  {number|Decimal} value         - number to {format}
 * @param  {number} [places]              - number of places to display for the mantissa
 * @param  {number} [placesUnder1000]     - number of decimal places to display
 * @param  {function} [formatType=format] - how to format the {value}. defaults to format
 * @return {string} - the formatted {value} followed by the {name} after having been pluralized based on the {value}
 */
// eslint-disable-next-line max-params
window.quantify = function quantify(name, value, places, placesUnder1000, formatType = format) {
  if (name === undefined || value === undefined) throw "Arguments must be defined";

  const number = formatType(value, places, placesUnder1000);
  const plural = pluralize(name, value);
  return `${number} ${plural}`;
};

/**
 * Returns the value formatted to formatInt followed by a name, pluralized based on the value input.
 * @param  {string} name                  - name to pluralize and display after {value}
 * @param  {number|Decimal} value         - number to format
 * @return {string} - the formatted {value} followed by the {name} after having been pluralized based on the {value}
 */
window.quantifyInt = function quantifyInt(name, value) {
  if (name === undefined || value === undefined) throw "Arguments must be defined";

  const number = formatInt(value);
  const plural = pluralize(name, value);
  return `${number} ${plural}`;
};

/**
 * Creates an enumated string, using the oxford comma, such that "a"; "a and b"; "a, b, and c"
 * @param  {string[]} items - an array of items to enumerate
 * @return {string} - a string of {items}, separated by commas and/or and as needed.
 */
window.makeEnumeration = function makeEnumeration(items) {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  const commaSeparated = items.slice(0, - 1).join(", ");
  const last = items[items.length - 1];
  return `${commaSeparated}, and ${last}`;
};

window.exponentialFormat = function exponentialFormat(num, precision, mantissa = true) {
    let e = Decimal.log10(num).floor();
    let m = Decimal.div(num, Decimal.pow(10, e));
    if (m.toStringWithDecimalPlaces(precision) === "10") {
        m = new Decimal(1);
        e = e.add(1);
    }
    const eString = e.gte(1e6)
        ? format(e, Math.max(Math.max(precision, 3), 2))
        : e.gte(10000)
          ? commaFormat(e, 0)
          : e.toStringWithDecimalPlaces(0);
    if (mantissa) {
        return m.toStringWithDecimalPlaces(precision) + "e" + eString;
    } else {
        return "e" + eString;
    }
}

window.commaFormat = function commaFormat(num, precision) {
    if (num == null) {
        return "NaN";
    }
    num = new Decimal(num);
    if (num.mag < 0.001) {
        return (0).toFixed(precision);
    }
    const init = num.toStringWithDecimalPlaces(precision);
    const portions = init.split(".");
    portions[0] = portions[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    if (portions.length === 1) return portions[0];
    return portions[0] + "." + portions[1];
}

window.regularFormat = function regularFormat(num, precision) {
    if (num == null) {
        return "NaN";
    }
    num = new Decimal(num);
    if (num.mag < 0.0001) {
        return (0).toFixed(precision);
    }
    if (num.mag < 0.1 && precision !== 0) {
        precision = Math.max(
            Math.max(precision, num.log10().negate().ceil().toNumber()),
            2
        );
    }
    return num.toStringWithDecimalPlaces(precision);
}

const eeee1000 = new Decimal("eeee1000");
const e100000 = new Decimal("e100000");
const e1000 = new Decimal("e1000");
const e9 = new Decimal(1e9);
const e6 = new Decimal(1e6);
const e3 = new Decimal(1e3);
const nearOne = new Decimal(0.98);
const thousandth = new Decimal(0.001);
const zero = new Decimal(0);
function formatInternal(num, precision = 2, small = false) {
    num = new Decimal(num);
    if (isNaN(num.sign) || isNaN(num.layer) || isNaN(num.mag)) {
        return "NaN";
    }
    if (num.sign < 0) {
        return "-" + format(num.neg(), precision);
    }
    if (num.mag === Number.POSITIVE_INFINITY) {
        return "Infinity";
    }
    if (num.gte(eeee1000)) {
        const slog = num.slog();
        if (slog.gte(e6)) {
            return "F" + format(slog.floor());
        } else {
            return (
                Decimal.pow(10, slog.sub(slog.floor())).toStringWithDecimalPlaces(3) +
                "F" +
                commaFormat(slog.floor(), 0)
            );
        }
    } else if (num.gte("e1e6")) {
        return exponentialFormat(num, 0, false);
    } else if (num.gte(e6)) {
        return exponentialFormat(num, precision);
    } else if (num.gte(e3)) {
        return commaFormat(num, 0);
    } else if (num.gte(thousandth) || !small) {
        return regularFormat(num, precision);
    } else if (num.eq(zero)) {
        return (0).toFixed(precision);
    }

    num = invertOOM(num);
    if (num.lt(e1000)) {
        const val = exponentialFormat(num, precision);
        return val.replace(/([^(?:e|F)]*)$/, "-$1");
    } else {
        return format(num, precision) + "⁻¹";
    }
}

window.formatWhole = function formatWhole(num) {
    num = new Decimal(num);
    if (num.sign < 0) {
        return "-" + formatWhole(num.neg());
    }
    if (num.gte(e9)) {
        return format(num);
    }
    if (num.lte(nearOne) && !num.eq(zero)) {
        return format(num);
    }
    return format(num, 0);
}

function toPlaces(x, precision, maxAccepted) {
    x = new Decimal(x);
    let result = x.toStringWithDecimalPlaces(precision);
    if (new Decimal(result).gte(maxAccepted)) {
        result = Decimal.sub(maxAccepted, Math.pow(0.1, precision)).toStringWithDecimalPlaces(
            precision
        );
    }
    return result;
}

// Will also display very small numbers
window.formatSmall = function formatSmall(x, precision) {
    return format(x, precision, true);
}

function invertOOM(x) {
    let e = Decimal.log10(x).ceil();
    const m = Decimal.div(x, Decimal.pow(10, e));
    e = e.neg();
    x = new Decimal(10).pow(e).times(m);

    return x;
}

window.formatGain = function formatGain(base, gain, precision = 2) {
  let difference = gain.div(base);
  if (difference.lte(1e10)) {
    return `(+${format(gain, precision)}/sec)`;
  }

  difference = difference.log10()
  if (difference.lte(1e10)) {
    return `(+${format(difference.mul(player.options.updateRate ?? 20), precision)} OoM/sec)`;
  }

  difference = gain.plus(1).log10().div(base.plus(1).log10())
  if (difference.lte(1e10)) {
    return `(+${format(difference.mul(player.options.updateRate ?? 20), precision)} OoM^2/sec)`;
  }

  difference = gain.plus(1).log10().plus(1).log10().plus(1).log10().div(base.plus(1).log10().plus(1).log10().plus(1).log10())
  if (difference.lte(1e10)) {
    return `(+${format(difference.mul(player.options.updateRate ?? 20), precision)} OoM^3/sec)`;
  }

  difference = gain.plus(10).slog(10).div(base.plus(10).slog(10))
  return `(+${format(difference.mul(player.options.updateRate ?? 20), precision)} OoM^OoM/sec)`;
}
