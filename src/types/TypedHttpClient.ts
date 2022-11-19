import { IContentTypeHandler } from "./ContentTypeHandlers";

export interface IRequestOptions {
  headers?: Headers;
  socketTimeout?: number;
  allowRedirects?: boolean;
  allowRedirectDowngrade?: boolean;
  maxRedirects?: number;
  maxSockets?: number;
  keepAlive?: boolean;
  presignedUrlPatterns?: RegExp[];
}

export type IRequestQueryParams = Record<string, string>;

export interface ITypedResponse<T> {
  statusCode: number;
  result: T;
  headers: Headers;
}

export type ResponseProcessor<ReturnType> = (
  response: Response,
  responseBodyString: string,
  responseBodyObject: unknown
) => ReturnType;

export interface ITypedRequestOptionsBase<PayloadType = undefined> {
  acceptHeader?: string;
  payload?: PayloadType;
  additionalHeaders?: HeadersInit;

  contentTypeHandler?: IContentTypeHandler<PayloadType>;
  queryParameters?: IRequestQueryParams;
}

export interface ITypedRequestOptionsBase<PayloadType = undefined> {
  acceptHeader?: string;
  payload?: PayloadType;
  additionalHeaders?: HeadersInit;
  queryParameters?: IRequestQueryParams;
  contentTypeHandler?: IContentTypeHandler<PayloadType>;
}
export interface ITypedRequestOptionsWithPayload<PayloadType = undefined>
  extends ITypedRequestOptionsBase<PayloadType> {
  payload: PayloadType;
  contentTypeHandler?: IContentTypeHandler<PayloadType>;
}
export interface ITypedRequestOptionsWithPayloadAndHandler<PayloadType = undefined>
  extends ITypedRequestOptionsBase<PayloadType> {
  payload: PayloadType;
  contentTypeHandler: IContentTypeHandler<PayloadType>;
}
export interface ITypedRequestOptionsSansPayload
  extends Omit<ITypedRequestOptionsBase, "payload" | "contentTypeHandler"> {
  contentTypeHandler?: undefined;
}

export type ITypedRequestOptions<PayloadType = undefined> =
  | ITypedRequestOptionsSansPayload
  | ITypedRequestOptionsWithPayload<PayloadType>;

export interface ITypedRequestOptionsWithPayloadWithAdditionalAndAccept<
  PayloadType = undefined
> extends ITypedRequestOptionsWithPayloadAndHandler<PayloadType> {
  additionalHeaders: HeadersInit;
  acceptHeader: string;
}
export interface ITypedRequestOptionsSansPayloadWithAdditionalAndAccept
  extends ITypedRequestOptionsSansPayload {
  additionalHeaders: HeadersInit;
  acceptHeader: string;
}
export type ITypedRequestOptionsWithAdditionalAndAccept<
  PayloadType = undefined
> =
  | ITypedRequestOptionsWithPayloadWithAdditionalAndAccept<PayloadType>
  | ITypedRequestOptionsSansPayloadWithAdditionalAndAccept;
