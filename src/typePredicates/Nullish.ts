import { isNull } from "./Null";
import { isUndefined } from "./Undefined";

/**
 * This is used to maintain type safety while eliminating the need for optional chaining, as
 * that feature of JavaScript confuses istanbul (the code coverage tool).
 *
 * Detailed explanation:
 *
 * When trying to reference a property of a variable that is "nullish", that is, `null` or
 * `undefined`, JavaScript will throw a TypeError. For example:
 *
 * @example
 * let x = null;
 * // throws a TypeError
 * console.log(x.thing);
 *
 * @example
 * let x;
 * // throws a TypeError
 * console.log(x.thing);
 *
 * @example
 * let x = "";
 * // will NOT throw a TypeError
 * // logs "undefined"
 * console.log(x.thing);
 *
 * In order to avoid these errors when looking up properties on potentially null or undefined
 * references, JavaScript provides feature called "optional chaining". This feature makes it
 * so that you can safely try to reference the property of an object, but get `undefined`
 * back if the variable points to null or undefined.
 *
 * However, Istanbul, a popular code coverage tool, has issues comprehending what is happening
 * here, and so can't reliably detect when code coverage is achieved, even if providing
 * automated checks for when the referenced variable is undefined and null.
 *
 * This type assertion, along with `isNull` and `isUndefined` are used to safely eliminate the
 * need for optional chaining, while also preventing excessive property key lookups. This allows
 * Istanbul to determine code coverage.
 *
 * @param {unknown} value value to assert is nullish.
 */
export function assertIsNullish(
  value: unknown
): asserts value is null | undefined {
  if (!isNull(value) && !isUndefined(value)) {
    throw new TypeError("Value is not null or undefined");
  }
}

/**
 * This is used to maintain type safety while eliminating the need for optional chaining, as
 * that feature of JavaScript confuses istanbul (the code coverage tool).
 *
 * Detailed explanation:
 *
 * When trying to reference a property of a variable that is "nullish", that is, `null` or
 * `undefined`, JavaScript will throw a TypeError. For example:
 *
 * @example
 * let x = null;
 * // throws a TypeError
 * console.log(x.thing);
 *
 * @example
 * let x;
 * // throws a TypeError
 * console.log(x.thing);
 *
 * @example
 * let x = "";
 * // will NOT throw a TypeError
 * // logs "undefined"
 * console.log(x.thing);
 *
 * In order to avoid these errors when looking up properties on potentially null or undefined
 * references, JavaScript provides feature called "optional chaining". This feature makes it
 * so that you can safely try to reference the property of an object, but get `undefined`
 * back if the variable points to null or undefined.
 *
 * However, Istanbul, a popular code coverage tool, has issues comprehending what is happening
 * here, and so can't reliably detect when code coverage is achieved, even if providing
 * automated checks for when the referenced variable is undefined and null.
 *
 * This type predicate, along with `isNull` and `isUndefined` are used to safely eliminate the
 * need for optional chaining, while also preventing excessive property key lookups. This allows
 * Istanbul to determine code coverage.
 *
 * @param {unknown} value value to check if it is nullish or not.
 * @returns {boolean} boolean telling the compiler if the value is null or undefined.
 */
export function isNullish(value: unknown): value is null | undefined {
  try {
    assertIsNullish(value);
    return true;
  } catch {
    return false;
  }
}
