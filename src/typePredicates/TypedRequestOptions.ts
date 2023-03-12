import type {
  RequestOptions,
  TypedRequestOptions,
  TypedRequestOptionsWithAdditionalAndAccept,
  TypedRequestOptionsWithPayload,
} from "../types/TypedHttpClient.js";

/**
 * A type predicate for narrowing type possibilities based on whether or not a payload was provided.
 *
 * The contentTypeHandler property is only relevant if there is a payload.
 *
 * @param requestOptions options to check if a payload is provided
 * @returns
 */
export function isTypedRequestOptionsWithPayload<PayloadType>(
  requestOptions: RequestOptions | TypedRequestOptions<PayloadType>
): requestOptions is TypedRequestOptionsWithPayload<PayloadType> {
  return !!(requestOptions as TypedRequestOptionsWithPayload<PayloadType>)
    .payload;
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
  requestOptions: RequestOptions | TypedRequestOptions<PayloadType>
): requestOptions is TypedRequestOptionsWithAdditionalAndAccept<PayloadType> {
  return !!(
    (requestOptions as TypedRequestOptions<PayloadType>).payload &&
    (requestOptions as TypedRequestOptions<PayloadType>).contentTypeHandler &&
    requestOptions.acceptHeader &&
    requestOptions.additionalHeaders
  );
}
