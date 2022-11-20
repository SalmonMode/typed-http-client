import {
    TypedRequestOptionsBase,
    TypedRequestOptionsWithPayload,
    TypedRequestOptionsWithPayloadWithAdditionalAndAccept
} from "../types";

/**
 * A type predicate for narrowing type possibilities based on whether or not a payload was provided.
 *
 * The contentTypeHandler property is only relevant if there is a payload.
 *
 * @param requestOptions options to check if a payload is provided
 * @returns
 */
export function isTypedRequestOptionsWithPayload<PayloadType>(
  requestOptions: TypedRequestOptionsBase<PayloadType>
): requestOptions is TypedRequestOptionsWithPayload<PayloadType> {
  return !!requestOptions.payload
}
/**
 * A type predicate for narrowing type possibilities based on whether or not a payload was provided.
 *
 * The contentTypeHandler property is only relevant if there is a payload.
 *
 * @param requestOptions options to check if a payload is provided
 * @returns
 */
export function isTypedRequestOptionsWithPayloadWithAdditionalAndAccept<
  PayloadType
>(
  requestOptions: TypedRequestOptionsBase<PayloadType>
): requestOptions is TypedRequestOptionsWithPayloadWithAdditionalAndAccept<PayloadType> {
  return !!(
    requestOptions.payload &&
    requestOptions.contentTypeHandler &&
    requestOptions.acceptHeader &&
    requestOptions.additionalHeaders
  );
}
