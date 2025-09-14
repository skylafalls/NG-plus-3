// Deepmerge library modified for Antimatter Dimensions usage (mainly Decimal integration)
// Source: https://github.com/TehShrike/deepmerge

import type { MergeDeep } from "type-fest"

interface ArrayMergeOptions {
  isMergeableObject(value: object): boolean
  cloneUnlessOtherwiseSpecified(value: object, options?: Options): object
}

interface Options {
  arrayMerge?(target: any[], source: any[], options?: ArrayMergeOptions): any[]
  clone?: boolean
  customMerge?: (key: string, options?: Options) => ((x: any, y: any) => any) | undefined
  isMergeableObject?(value: object): boolean
}

function emptyTarget(val: unknown) {
  return Array.isArray(val) ? [] : {};
}

function cloneUnlessOtherwiseSpecified(value: object, options: Options): object {
  if (value instanceof Decimal) {
    return new Decimal(value);
  }
  if (value instanceof Set) {
    return new Set(value);
  }
  return (options.clone !== false && options.isMergeableObject?.(value))
    ? deepmerge(emptyTarget(value), value, options)
    : value;
}

function defaultArrayMerge(target: any[], source: any[], options: ArrayMergeOptions) {
  return [...target, ...source].map(element =>
    cloneUnlessOtherwiseSpecified(element, options),
  );
}

function mergeObject<T extends Record<PropertyKey, any>, V extends Record<PropertyKey, any>>(target: T, source: V, options: ArrayMergeOptions): T & V {
  const destination: Record<PropertyKey, unknown> = {};
  if (options.isMergeableObject(target)) {
    Object.keys(target).forEach((key) => {
      destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
    });
  }
  Object.keys(source).forEach((key) => {
    if (target[key] && target[key] instanceof Decimal) {
      destination[key] = new Decimal(source[key]);
    } else if (target[key] && target[key] instanceof Set) {
      destination[key] = new Set(source[key]);
    } else if (!options.isMergeableObject(source[key]) || !target[key]) {
      destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
    } else {
      destination[key] = deepmerge(target[key], source[key], options);
    }
  });
  return destination as T & V;
}

export function deepmerge<T>(target: Partial<T>, source: Partial<T>, options: Options): T;
export function deepmerge<T1, T2>(target: Partial<T1>, source: Partial<T2>, options: Options = {}): MergeDeep<T1, T2> {
  options.arrayMerge = options.arrayMerge || defaultArrayMerge;
  options.isMergeableObject = options.isMergeableObject || isMergeableObject;

  if (target instanceof Decimal) {
    return new Decimal(source);
  }

  if (target instanceof Set) {
    return new Set(source);
  }

  const sourceIsArray = Array.isArray(source);
  const targetIsArray = Array.isArray(target);
  const sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

  if (!sourceAndTargetTypesMatch) {
    return cloneUnlessOtherwiseSpecified(source, options);
  }

  if (sourceIsArray) {
    return options.arrayMerge(target, source, options);
  }

  return mergeObject(target, source, options);
}

export function deepmergeAll(array: unknown[], options?: ArrayMergeOptions) {
  if (!Array.isArray(array)) {
    throw new TypeError("first argument should be an array");
  }

  if (!options) {
    const deepCloneMerge = (destinationArray, sourceArray, options) =>
      sourceArray.map((element, index) => {
        if (
          destinationArray[index] && destinationArray[index] instanceof Decimal
        ) {
          return new Decimal(element);
        }

        if (destinationArray[index] && destinationArray[index] instanceof Set) {
          return new Set(element);
        }

        if (!options.isMergeableObject(element) || !destinationArray[index]) {
          return cloneUnlessOtherwiseSpecified(element, options);
        }
        return deepmerge(destinationArray[index], element, options);
      });

    options = {
      arrayMerge: deepCloneMerge,
    };
  }

  return array.reduce((prev, next) => deepmerge(prev, next, options), {});
}

function isMergeableObject(value: unknown) {
  return isNonNullObject(value) && !isSpecial(value);
}

function isNonNullObject(value: unknown): value is object {
  return Boolean(value) && typeof value === "object";
}

function isSpecial(value: unknown): value is RegExp | Date {
  const stringValue = Object.prototype.toString.call(value);
  return stringValue === "[object RegExp]" || stringValue === "[object Date]";
}
