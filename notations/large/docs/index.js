const inputContainer = document.querySelector("#inputContainer");

const parseWithoutE = function(value) {
  if (!/^[-+]?[,.0-9]*$/.test(value)) {
    return null;
  }
  if (value === "") {
    return new Decimal(1);
  }
  if (value === "-") {
    return new Decimal(-1);
  }
  if (!/\d/.test(value)) {
    return null;
  }
  return new Decimal(value.replaceAll(/,/g, ""));
};


// This function only works if the base is more than 1
const pow = function(a, b) {
  if (b === Infinity) {
    return new Decimal(Infinity);
  }if (b === -Infinity) {
    return new Decimal(0);
  } else {
    return Decimal.pow(a, b);
  }
}

const parse = function(value) {
  const stringParts = value.toLowerCase().split("e");
  if (!/\d/.test(stringParts[stringParts.length - 1])) {
    return null;
  }
  const numberParts = stringParts.map(parseWithoutE);
  if (numberParts.includes(null)) {
    return null;
  }
  return numberParts.reduceRight((a, b) => pow(10, a.toNumber()).times(b));
};

const NotationDisplay = function NotationDisplay(notationClass) {
  const notation = new notationClass();
  const span = document.createElement("span");
  inputContainer.after(span);
  return {
    update(value, placesValue) {
      const decimalValue = parse(value);
      const places = +placesValue;
      const formatted = decimalValue === null ? "???" : notation.format(decimalValue, places, places);
      if (notationClass === ADBNotations.BlobsNotation) {
        span.innerHTML = `${notation.name}: <span class="blob">${formatted}</span>`;
      } else {
        span.textContent = `${notation.name}: ${formatted}`;
      }
    }
  };
};

const communityHeaderSpan = function () {
  let span = document.createElement("span");
  span.textContent = "Community notations:";
  return span;
}

const displays = (function() {
  const N = ADBNotations;
  const CN = ADCommunityNotations;
  const notations = [
    N.ScientificNotation,
    N.EngineeringNotation,
    N.LettersNotation,
    N.StandardNotation,
    N.EmojiNotation,
    N.MixedScientificNotation,
    N.MixedEngineeringNotation,
    N.LogarithmNotation,
    N.MixedLogarithmSciNotation,
    N.BracketsNotation,
    N.InfinityNotation,
    N.RomanNotation,
    N.DotsNotation,
    N.ZalgoNotation,
    N.HexNotation,
    N.ImperialNotation,
    N.ClockNotation,
    N.PrimeNotation,
    N.BarNotation,
    N.ShiNotation,
    N.BlobsNotation,
    N.BlindNotation,
    N.AllNotation,
  ];
  let communityNotationsDisplay = notations.reverse().map((n) => new NotationDisplay(n));
}());

function updateValues() {
  const value = document.querySelector("#number").value;
  const placesValue = document.querySelector("#places").value;
  ADBNotations.Settings.exponentCommas.show = document.querySelector("#commas").checked;
  for (const display of displays) {
    display.update(value, placesValue);
  }
}

updateValues();
