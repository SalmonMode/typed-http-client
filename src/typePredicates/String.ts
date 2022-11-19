/**
 * Type assertion function to check if a value is a string or not.
 * 
 * @throws {TypeError} if value is not a string
 * 
 * @param value an unknown value
 */
export function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new TypeError("Value is not a string");
  }
}
/**
 * Type predicate to check if a value is a string or not.
 * 
 * @param value an unknown value
 * @returns true, if value is a string, false, if it is not
 */
export function isString(value: unknown): value is string {
  try {
    assertIsString(value);
    return true;
  } catch {
    return false;
  }
}
