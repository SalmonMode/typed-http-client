/**
 * Checks if an object has a particular property name.
 * 
 * Type safety is important, so this leverages the `unknown` type to ensure that, while the object
 * can be recognized as having a particular property, it can't be used until some further type
 * checking is done.
 * 
 * The first argument is forbidden from being "nullable" (i.e. `null` or `undefined`), despite
 * `null` being of type object, as attempting to check the name of a property on something `null`
 * or `undefined` will throw a `TypeError`. The T generic ensures that only non-nullable values can
 * be passed to avoid this error from being thrown. Checking for `null` or `undefined` first can be
 * done to account for this type restriction.
 * 
 * @param value An object with unknown properties
 * @param propertyName the name of the property
 * @returns true, if the object has a property with the specified name, false, if it does not
 */
export function hasProperty<T extends NonNullable<object>, K extends string>(
  value: T,
  propertyName: K
): value is T & Record<K, unknown> {
  return propertyName in value;
}
