# AD Notations for break_eternity (beyond e9e15)

All the notations that are included in the current version of Antimatter Dimensions break_eternity port (by Hexa).

## Setup

#### CDN

The simplest way to use this package is to include these scripts in your HTML page:

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/break_eternity.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@antimatter-dimensions/notations"></script>
```

You can also grab specific versions here:

- https://github.com/Patashu/break_eternity.js/releases
- https://github.com/antimatter-dimensions/notations/releases

#### npm

```
npm install @antimatter-dimensions/notations
```

There is no default export. The correct way to import notations is:

```js
import * as ADBNotations from "@antimatter-dimensions/notations";
```

## Use

All the notations are included inside `ADBNotations` object:

```js
const scientific = new ADBNotations.ExtendedScientificNotation();
```

The main method that notations provide is `format(value, places)`

- `value` can be `Decimal`, `number` or `string` which you want to format
- `places` is used to format mantissa when number is greater than 1000

You can configure some formatting aspects via `ADBNotations.Settings` object

```js
const scientific = new ADBNotations.ScientificNotation();

// Outputs "F2E5"
console.log(scientific.format("1ee100000", 2));

// Outputs "F3E5"
ADBNotations.Settings.exponentCommas.show = false;
console.log(scientific.format("1eee100000", 2));

// Outputs "Infinite"
ADBNotations.Settings.isInfinite = decimal => decimal.gte(1e100);
console.log(scientific.format(1e101, 2, 2));
```

Configuration settings:

- `Settings.isInfinite` - function that determines if a `Decimal` value is infinite
(default is `decimal => decimal.gte(Decimal.tetrate(10, 1e16))`)
- `Settings.numCommas` - lower bound for numbers to be formatted with
commas (default is **100000**)

## Extend

Creating your own notations is very simple! Just extend base class `Notation`
and implement the required methods `get name()` and `formatDecimal`:

```js
class SimpleNotation extends ADBNotations.Notation {
  get name() {
    return "Simple";
  }

  formatDecimal(value, places) {
    return `Layer: ${value.layer.toFixed(places)}, Exponent: ${value.exponent}`;
  }
}
```

## Build

First, clone the repo

```
git clone https://github.com/antimatter-dimensions/notations.git
cd notations
```

Then install npm dependencies

```
npm install
```

And then run build command which will build all packs to the dist directory and
to the `docs` directory.

```
npm run build
```

To build the AD pack or community pack separately, use `build:ad` or `build:community`
command.

## Contributing

1. Be reasonable when commiting something.
2. Be original when making a new notation.

## Acknowledgements

Thanks to [Omsi](https://github.com/omsi6) for the scaffolding of docs page.
Thanks to the [original notation code](https://github.com/antimatter-dimensions/notations) for the pre e9e15 code, and for making this possible.
