export function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

// oxlint-disable-next-line no-unsafe-function-type, ban-types
export function isFunction(value: unknown): value is Function {
  return typeof value === "function";
}

export function isDecimal(value: unknown): value is Decimal {
  return value instanceof Decimal;
}

export function isPlainObject(value: unknown): value is object {
  return Object.prototype.toString.call(value) === "[object Object]";
}
