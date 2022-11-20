/**
 * RegExp to test a string for a ISO 8601 Date spec
 *  YYYY
 *  YYYY-MM
 *  YYYY-MM-DD
 *  YYYY-MM-DDThh:mmTZD
 *  YYYY-MM-DDThh:mm:ssTZD
 *  YYYY-MM-DDThh:mm:ss.sTZD
 * @see {@link https://www.w3.org/TR/NOTE-datetime}
 * @type {RegExp}
 */
var ISO_8601 =
  /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/i;

/**
 * RegExp to test a string for a full ISO 8601 Date
 * Does not do any sort of date validation, only checks if the string is according to the ISO 8601 spec.
 *  YYYY-MM-DDThh:mm:ss
 *  YYYY-MM-DDThh:mm:ssTZD
 *  YYYY-MM-DDThh:mm:ss.sTZD
 * @see {@link https://www.w3.org/TR/NOTE-datetime}
 * @type {RegExp}
 */
var ISO_8601_FULL =
  /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;

/**
 * A reviver function for parsing JSON that transforms ISO 8601 date strings into Date objects.
 *
 * This matches on anything that has an ISO 8601 formatted date, but also matches if they include the time
 * portion of the pattern.
 *
 * Matches on:
 *  YYYY
 *  YYYY-MM
 *  YYYY-MM-DD
 *  YYYY-MM-DDThh:mmTZD
 *  YYYY-MM-DDThh:mm:ss
 *  YYYY-MM-DDThh:mm:ssTZD
 *  YYYY-MM-DDThh:mm:ss.s
 *  YYYY-MM-DDThh:mm:ss.sTZD
 * @see {@link https://www.w3.org/TR/NOTE-datetime}
 *
 * @param _ the key of the entry in the object being parsed
 * @param value the vlaue of the entry in the object being parsed
 * @returns a Date object, if the value matches an ISO 8601 pattern with a valid date, the original value otherwise
 */
export function JsonISO8601DateReviver(_: string, value: any): Date | any {
  if (typeof value == "string" && ISO_8601.test(value)) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }
  return value;
}

/**
 * A reviver function for parsing JSON that transforms ISO 8601 date and time strings into Date objects.
 *
 * This matches exclusively on ISO 8601 formatted strings that include the time portion of the pattern. If
 * no time is provided, this will return the original string.
 * Matches on:
 *  YYYY-MM-DDThh:mm:ss
 *  YYYY-MM-DDThh:mm:ssTZD
 *  YYYY-MM-DDThh:mm:ss.s
 *  YYYY-MM-DDThh:mm:ss.sTZD
 * @see {@link https://www.w3.org/TR/NOTE-datetime}
 *
 * @param _ the key of the entry in the object being parsed
 * @param value the vlaue of the entry in the object being parsed
 * @returns a Date object, if the value matches an ISO 8601 pattern with a valid date and time, the original value otherwise
 */
export function JsonISO8601DateAndTimeReviver(
  _: string,
  value: any
): Date | any {
  if (typeof value == "string" && ISO_8601_FULL.test(value)) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }
  return value;
}
