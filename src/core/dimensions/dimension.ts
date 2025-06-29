// @ts-check

export abstract class DimensionState<
  DimensionParams extends { amount: Decimal, bought: Decimal } = { amount: Decimal, bought: Decimal },
> {
  private _getData: () => DimensionParams[];
  private _tier: number;
  private _displayName: string | null | undefined;
  private _shortDisplayName: string | null | undefined;

  constructor(getData: () => DimensionParams[], tier: number) {
    this._tier = tier;
    this._getData = getData;
    const DISPLAY_NAMES = [
      null,
      "First",
      "Second",
      "Third",
      "Fourth",
      "Fifth",
      "Sixth",
      "Seventh",
      "Eighth",
    ];
    this._displayName = DISPLAY_NAMES[tier];
    const SHORT_DISPLAY_NAMES = [
      null,
      "1st",
      "2nd",
      "3rd",
      "4th",
      "5th",
      "6th",
      "7th",
      "8th",
    ];
    this._shortDisplayName = SHORT_DISPLAY_NAMES[tier];
  }

  get tier() {
    return this._tier;
  }

  get displayName() {
    return this._displayName;
  }

  get shortDisplayName() {
    return this._shortDisplayName;
  }

  get data() {
    return this._getData()[this.tier - 1];
  }

  get amount() {
    return this.data?.amount;
  }

  set amount(value) {
    this.data.amount = value;
  }

  /** @returns {Decimal} */
  get bought() {
    return this.data?.bought;
  }

  /** @param {Decimal} value */
  set bought(value) {
    this.data.bought = value;
  }

  abstract get productionPerSecond(): Decimal;

  get productionPerRealSecond() {
    return this.productionPerSecond.times(getGameSpeedupForDisplay());
  }

  productionForDiff(diff: Decimal) {
    return this.productionPerSecond.times(diff.div(1000));
  }

  produceCurrency(currency: Decimal, diff: Decimal) {
    currency.add(this.productionForDiff(diff));
  }

  produceDimensions(dimension: DimensionState, diff: Decimal) {
    dimension.amount = dimension.amount.plus(this.productionForDiff(diff));
  }

  static get dimensionCount() {
    return 8;
  }

  abstract createAccessor(): {
    (tier: number): DimensionState
    index: Array<DimensionState>
  };
}
