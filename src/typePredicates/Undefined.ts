/**
 * Type assertion function to check if a value is undefined or not.
 *
 * @throws {TypeError} if value is not undefined
 *
 * @param value an unknown value
 */
export function assertIsUndefined(value: unknown): asserts value is undefined {
  if (value !== undefined) {
    throw new TypeError("Value is not undefined");
  }
}
/**
 * Type predicate to check if a value is undefined or not.
 *
 * @param value an unknown value
 * @returns true, if value is undefined, false, if it is not
 */
export function isUndefined(value: unknown): value is undefined {
  try {
    assertIsUndefined(value);
    return true;
  } catch {
    return false;
  }
}
