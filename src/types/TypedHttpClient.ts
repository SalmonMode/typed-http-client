import { URL } from "url";
import { ContentTypeHandler } from "./ContentTypeHandlers";

export interface TypedResponse<T> {
  statusCode: number;
  result: T;
  headers: Headers;
}

export interface ResponseProcessorParams {
  /**
   * The original {@link Response} object.
   */
  response: Response;
  /**
   * The body of the response as a string.
   *
   * If no body was returned, this will just be an empty string.
   */
  responseBodyAsString: string;
  /**
   * The body of the response as an object.
   *
   * This is only provided if the Content-Type header indicates the body
   * is JSON and it was able to successfully parse the JSON using
   * {@link JSON.parse}.
   */
  responseBodyAsObject: unknown;
}

export type ResponseProcessor<ReturnType> = (
  responseData: ResponseProcessorParams
) => ReturnType;

/**
 * A function used by {@link JSON.parse} to transform individual members.
 *
 * @see {@link JSON.parse} for more information.
 */
export type JsonReviver = (key: string, value: any) => any;

export interface RequestOptions {
  url: URL;
  acceptHeader?: string;
  additionalHeaders?: HeadersInit;
  /**
   * A function that does an initial transformation of the response results in the event that JSON is received
   * in the response body. This function will be passed directly to {@link JSON.parse} and is called for each
   * member of the object. If a member contains nested objects, the nested objects are transformed before the
   * parent object is.
   * @see {@link JSON.parse} for more information on the reviver function.
   */
  responseJsonReviver?: JsonReviver;
}
export interface TypedRequestOptionsBase<PayloadType = undefined>
  extends RequestOptions {
  payload?: PayloadType;
  contentTypeHandler?: ContentTypeHandler<PayloadType>;
}
export interface TypedRequestOptions<PayloadType = undefined>
  extends TypedRequestOptionsBase<PayloadType> {
  payload?: PayloadType;
}
export interface TypedRequestOptionsWithPayload<PayloadType extends any>
  extends TypedRequestOptions<PayloadType> {
  payload: PayloadType;
}
export interface TypedRequestOptionsWithHandler<PayloadType extends any>
  extends TypedRequestOptionsBase<PayloadType> {
  payload: PayloadType;
  contentTypeHandler: ContentTypeHandler<PayloadType>;
}

export interface TypedRequestOptionsWithAdditionalAndAccept<
  PayloadType = undefined
> extends TypedRequestOptionsWithHandler<PayloadType> {
  additionalHeaders: HeadersInit;
  acceptHeader: string;
}
export interface RequestOptionsWithPayload extends RequestOptions {
  payload: any;
  contentTypeHandler?: ContentTypeHandler<unknown>;
}
export interface RequestOptionsWithAdditionalAndAccept extends RequestOptions {
  additionalHeaders: HeadersInit;
  acceptHeader: string;
}
