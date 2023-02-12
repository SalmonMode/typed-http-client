import fetch, { Headers, Request } from "cross-fetch";
import {
  DeleteRequestInit,
  GetRequestInit,
  HeadRequestInit,
  HttpMethod,
  MethodSpecificRequestInit,
  OptionsRequestInit,
  PatchRequestInit,
  PostRequestInit,
  PutRequestInit,
  RequestInitSansMethod,
  RequestInitSansMethodAndBody,
} from "../types";

export default class HttpClient {
  /**
   * Creates an instance of the {@link HttpClient} class.
   *
   * This is a bare bones abstraction around cross-fetch, meant to provide some simple interfaces for making HTTP requests.
   *
   * @constructor
   * @param userAgent The user agent to use for all requests
   */
  constructor(public userAgent?: string) {}

  /**
   * Make a HEAD request.
   * 
   * Note: HEAD requests cannot contain bodies, and so any body provided in the RequestInit will be ignored.
   *
   * @param requestUrl The URL to make the request to
   * @param requestInit The settings for how the request should be made
   * @returns a {@link Response} object
   */
  public async head(
    requestUrl: URL,
    requestInit: RequestInitSansMethodAndBody = {}
  ): Promise<Response> {
    const requestInitWithMethod: HeadRequestInit = {
      ...requestInit,
      method: HttpMethod.HEAD,
    };
    return await this.request(requestUrl, requestInitWithMethod);
  }

  /**
   * Make an OPTIONS request.
   *
   * @param requestUrl The URL to make the request to
   * @param requestInit The settings for how the request should be made
   * @returns a {@link Response} object
   */
  public async options(
    requestUrl: URL,
    requestInit: RequestInitSansMethod = {}
  ): Promise<Response> {
    const requestInitWithMethod: OptionsRequestInit = {
      ...requestInit,
      method: HttpMethod.OPTIONS,
    };
    return await this.request(requestUrl, requestInitWithMethod);
  }

  /**
   * Make a GET request.
   * 
   * Note: GET requests cannot contain bodies, and so any body provided in the RequestInit will be ignored.
   *
   * @param requestUrl The URL to make the request to
   * @param requestInit The settings for how the request should be made
   * @returns a {@link Response} object
   */
  public async get(
    requestUrl: URL,
    requestInit: RequestInitSansMethodAndBody = {}
  ): Promise<Response> {
    const requestInitWithMethod: GetRequestInit = {
      ...requestInit,
      method: HttpMethod.GET,
    };
    return await this.request(requestUrl, requestInitWithMethod);
  }

  /**
   * Make a DELETE request.
   *
   * @param requestUrl The URL to make the request to
   * @param requestInit The settings for how the request should be made
   * @returns a {@link Response} object
   */
  public async delete(
    requestUrl: URL,
    requestInit: RequestInitSansMethod = {}
  ): Promise<Response> {
    const requestInitWithMethod: DeleteRequestInit = {
      ...requestInit,
      method: HttpMethod.DELETE,
    };
    return await this.request(requestUrl, requestInitWithMethod);
  }

  /**
   * Make a POST request.
   *
   * @param requestUrl The URL to make the request to
   * @param requestInit The settings for how the request should be made
   * @returns a {@link Response} object
   */
  public async post(
    requestUrl: URL,
    requestInit: RequestInitSansMethod = {}
  ): Promise<Response> {
    const requestInitWithMethod: PostRequestInit = {
      ...requestInit,
      method: HttpMethod.POST,
    };
    return await this.request(requestUrl, requestInitWithMethod);
  }

  /**
   * Make a PATCH request.
   *
   * @param requestUrl The URL to make the request to
   * @param requestInit The settings for how the request should be made
   * @returns a {@link Response} object
   */
  public async patch(
    requestUrl: URL,
    requestInit: RequestInitSansMethod = {}
  ): Promise<Response> {
    const requestInitWithMethod: PatchRequestInit = {
      ...requestInit,
      method: HttpMethod.PATCH,
    };
    return await this.request(requestUrl, requestInitWithMethod);
  }

  /**
   * Make a PUT request.
   *
   * @param requestUrl The URL to make the request to
   * @param requestInit The settings for how the request should be made
   * @returns a {@link Response} object
   */
  public async put(
    requestUrl: URL,
    requestInit: RequestInitSansMethod = {}
  ): Promise<Response> {
    const requestInitWithMethod: PutRequestInit = {
      ...requestInit,
      method: HttpMethod.PUT,
    };
    return await this.request(requestUrl, requestInitWithMethod);
  }

  /**
   * Makes a raw fetch request.
   * All other methods such as get, post, patch, and request ultimately call this.
   * The normal get, post, patch, et all methods should be preferred.
   *
   * @param requestUrl The URL to make the request to
   * @param requestInit The {@link MethodSpecificRequestInit} settings for how the request should be made
   * @returns a {@link Response} object
   */
  public async request(
    requestUrl: URL,
    requestInit: MethodSpecificRequestInit
  ): Promise<Response> {
    // make copy of requestInit to make sure the original is maintained
    const copyOfRequestInit: RequestInit = { ...requestInit };
    copyOfRequestInit.headers = this._getHeadersWithUserAgentMixedIn(
      copyOfRequestInit.headers
    );
    // Form the Request object.
    const request: Request = new Request(requestUrl, copyOfRequestInit);
    // Use the Request object to make the request.
    const response: Response = await fetch(request);
    return response;
  }
  /**
   * Create the {@link Headers} object to be used for the request.
   *
   * A {@link Headers} object is preferred by cross-fetch for the headers. It also allows for case-insensitive
   * lookups of header keys, which is convenient.
   *
   * @param headers The {@link HeadersInit} settings that will be used to produce the headers for the request
   * @returns The formed {@link Headers} object
   */
  private _getHeadersWithUserAgentMixedIn(headers?: HeadersInit): Headers {
    const userAgentUpdatedHeaders = new Headers(headers);
    if (this.userAgent) {
      userAgentUpdatedHeaders.set("User-Agent", this.userAgent);
    }
    return userAgentUpdatedHeaders;
  }
}
