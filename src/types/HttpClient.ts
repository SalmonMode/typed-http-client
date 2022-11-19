import { HttpMethod } from "./HttpMethod";

export interface RequestInitSansMethod extends Exclude<RequestInit, "method"> {}
export interface HeadRequestInit extends RequestInit {
  method: HttpMethod.HEAD;
}
export interface OptionsRequestInit extends RequestInit {
  method: HttpMethod.OPTIONS;
}
export interface GetRequestInit extends RequestInit {
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
  head(requestUrl: URL, requestInit: RequestInitSansMethod): Promise<Response>;
  options(requestUrl: URL, requestInit: OptionsRequestInit): Promise<Response>;
  get(requestUrl: URL, requestInit: GetRequestInit): Promise<Response>;
  delete(requestUrl: URL, requestInit: DeleteRequestInit): Promise<Response>;
  post(requestUrl: URL, requestInit: PostRequestInit): Promise<Response>;
  patch(requestUrl: URL, requestInit: PatchRequestInit): Promise<Response>;
  put(requestUrl: URL, requestInit: PutRequestInit): Promise<Response>;
  request(requestUrl: URL, requestInit: IRequestInit): Promise<Response>;
}
