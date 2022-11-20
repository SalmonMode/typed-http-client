import { URL } from "url";
import { ContentTypeHandler } from "./ContentTypeHandlers";

export interface TypedResponse<T> {
  statusCode: number;
  result: T;
  headers: Headers;
}

export type ResponseProcessor<ReturnType> = (
  response: Response,
  responseBodyString: string,
  responseBodyObject: unknown
) => ReturnType;

export interface TypedRequestOptionsBase<PayloadType = undefined> {
  url: URL;
  acceptHeader?: string;
  payload?: PayloadType;
  additionalHeaders?: HeadersInit;
  contentTypeHandler?: ContentTypeHandler<PayloadType>;
}
export interface TypedRequestOptionsWithPayload<PayloadType = undefined>
  extends TypedRequestOptionsBase<PayloadType> {
  payload: PayloadType;
  contentTypeHandler?: ContentTypeHandler<PayloadType>;
}
export interface TypedRequestOptionsWithPayloadAndHandler<PayloadType = undefined>
  extends TypedRequestOptionsBase<PayloadType> {
  payload: PayloadType;
  contentTypeHandler: ContentTypeHandler<PayloadType>;
}
/**
 * contentTypeHandler is only allowed when there is a payload to send.
 */
export interface TypedRequestOptionsSansPayload
  extends Omit<TypedRequestOptionsBase, "payload" | "contentTypeHandler"> {
  contentTypeHandler?: undefined;
}

export type TypedRequestOptions<PayloadType = undefined> =
  | TypedRequestOptionsSansPayload
  | TypedRequestOptionsWithPayload<PayloadType>;

export interface TypedRequestOptionsWithPayloadWithAdditionalAndAccept<
  PayloadType = undefined
> extends TypedRequestOptionsWithPayloadAndHandler<PayloadType> {
  additionalHeaders: HeadersInit;
  acceptHeader: string;
}
export interface TypedRequestOptionsSansPayloadWithAdditionalAndAccept
  extends TypedRequestOptionsSansPayload {
  additionalHeaders: HeadersInit;
  acceptHeader: string;
}
export type TypedRequestOptionsWithAdditionalAndAccept<
  PayloadType = undefined
> =
  | TypedRequestOptionsWithPayloadWithAdditionalAndAccept<PayloadType>
  | TypedRequestOptionsSansPayloadWithAdditionalAndAccept;
