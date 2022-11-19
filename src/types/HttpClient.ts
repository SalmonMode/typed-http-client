import { HttpMethod } from "./HttpMethod";

export interface RequestInitSansMethod extends Omit<RequestInit, "method"> {}
export interface RequestInitSansBody extends Omit<RequestInit, "body"> {}
export interface RequestInitSansMethodAndBody extends Omit<RequestInit, "body" | "method"> {}
/**
 * The details for a HEAD request.
 * 
 * HEAD requests cannot have a body.
 */
export interface HeadRequestInit extends RequestInitSansBody {
  method: HttpMethod.HEAD;
}
export interface OptionsRequestInit extends RequestInit {
  method: HttpMethod.OPTIONS;
}
/**
 * The details for a GET request.
 * 
 * GET requests cannot have a body.
 */
export interface GetRequestInit extends RequestInitSansBody {
  method: HttpMethod.GET;
}
export interface DeleteRequestInit extends RequestInit {
  method: HttpMethod.DELETE;
}
export interface PostRequestInit extends RequestInit {
  method: HttpMethod.POST;
}
export interface PatchRequestInit extends RequestInit {
  method: HttpMethod.PATCH;
}
export interface PutRequestInit extends RequestInit {
  method: HttpMethod.PUT;
}
export type IRequestInit =
  | HeadRequestInit
  | OptionsRequestInit
  | GetRequestInit
  | DeleteRequestInit
  | PostRequestInit
  | PatchRequestInit
  | PutRequestInit;

export interface IHttpClient {
  head(requestUrl: URL, requestInit: RequestInitSansMethodAndBody): Promise<Response>;
  options(requestUrl: URL, requestInit: RequestInitSansMethod): Promise<Response>;
  get(requestUrl: URL, requestInit: RequestInitSansMethodAndBody): Promise<Response>;
  delete(requestUrl: URL, requestInit: RequestInitSansMethod): Promise<Response>;
  post(requestUrl: URL, requestInit: RequestInitSansMethod): Promise<Response>;
  patch(requestUrl: URL, requestInit: RequestInitSansMethod): Promise<Response>;
  put(requestUrl: URL, requestInit: RequestInitSansMethod): Promise<Response>;
  request(requestUrl: URL, requestInit: IRequestInit): Promise<Response>;
}
