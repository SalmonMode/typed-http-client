import type { HttpMethod } from "./HttpMethod.js";

export type RequestInitSansMethod = Omit<RequestInit, "method">;
export type RequestInitSansBody = Omit<RequestInit, "body">;
export type RequestInitSansMethodAndBody = Omit<RequestInit, "body" | "method">;
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
export type MethodSpecificRequestInit =
  | HeadRequestInit
  | OptionsRequestInit
  | GetRequestInit
  | DeleteRequestInit
  | PostRequestInit
  | PatchRequestInit
  | PutRequestInit;
