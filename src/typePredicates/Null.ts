/**
 * Type assertion function to check if a value is null or not.
 *
 * @throws {TypeError} if value is not null
 *
 * @param value an unknown value
 */
export function assertIsNull(value: unknown): asserts value is null {
  if (value !== null) {
    throw new TypeError("Value is not null");
  }
}
/**
 * Type predicate to check if a value is null or not.
 *
 * @param value an unknown value
 * @returns true, if value is null, false, if it is not
 */
export function isNull(value: unknown): value is null {
  try {
    assertIsNull(value);
    return true;
  } catch {
    return false;
  }
}
