import fetch, { Headers, Request } from "cross-fetch";
import {
  DeleteRequestInit,
  GetRequestInit,
  HeadRequestInit,
  IHttpClient,
  IRequestInit,
  OptionsRequestInit,
  PatchRequestInit,
  PostRequestInit,
  PutRequestInit,
  RequestInitSansMethod,
} from "./interfaces";
import { HttpMethods } from "./HttpMethods";

export default class HttpClient implements IHttpClient {
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
   * @param requestUrl The URL to make the request to
   * @param requestInit The settings for how the request should be made
   * @returns a {@link Response} object
   */
  public async head(
    requestUrl: URL,
    requestInit: RequestInitSansMethod = {}
  ): Promise<Response> {
    const requestInitWithMethod: HeadRequestInit = {
      ...requestInit,
      method: HttpMethods.HEAD
    }
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
      method: HttpMethods.OPTIONS
    }
    return await this.request(requestUrl, requestInitWithMethod);
  }

  /**
   * Make a GET request.
   *
   * @param requestUrl The URL to make the request to
   * @param requestInit The settings for how the request should be made
   * @returns a {@link Response} object
   */
  public async get(
    requestUrl: URL,
    requestInit: RequestInitSansMethod = { }
  ): Promise<Response> {
    const requestInitWithMethod: GetRequestInit = {
      ...requestInit,
      method: HttpMethods.GET
    }
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
    requestInit: RequestInitSansMethod = { }
  ): Promise<Response> {
    const requestInitWithMethod: DeleteRequestInit = {
      ...requestInit,
      method: HttpMethods.DELETE
    }
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
    requestInit: RequestInitSansMethod = { }
  ): Promise<Response> {
    const requestInitWithMethod: PostRequestInit = {
      ...requestInit,
      method: HttpMethods.POST
    }
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
    requestInit: RequestInitSansMethod = { }
  ): Promise<Response> {
    const requestInitWithMethod: PatchRequestInit = {
      ...requestInit,
      method: HttpMethods.PATCH
    }
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
    requestInit: RequestInitSansMethod = { }
  ): Promise<Response> {
    const requestInitWithMethod: PutRequestInit = {
      ...requestInit,
      method: HttpMethods.PUT
    }
    return await this.request(requestUrl, requestInitWithMethod);
  }

  /**
   * Makes a raw fetch request.
   * All other methods such as get, post, patch, and request ultimately call this.
   * The normal get, post, patch, et all methods should be preferred.
   *
   * @param requestUrl The URL to make the request to
   * @param requestInit The {@link IRequestInit} settings for how the request should be made
   * @returns a {@link Response} object
   */
  public async request(
    requestUrl: URL,
    requestInit: IRequestInit
  ): Promise<Response> {
    // make copy of requestInit to make sure the original is maintained
    let copyOfRequestInit: RequestInit = { ...requestInit };
    copyOfRequestInit.headers = this._getHeadersWithUserAgentMixedIn(
      copyOfRequestInit.headers
    );
    // Form the Request object.
    let request: Request = new Request(requestUrl, copyOfRequestInit);
    // Use the Request object to make the request.
    let response: Response = await fetch(request);
    return response;
  }
  /**
   * Create the {@link Headers} object to be used for the request.
   *
   * A {@link Headers} object is preferred by cross-fetch for the headers.
   *
   * @param headers The {@link HeadersInit} settings that will be used to produce the headers for the request
   * @returns The formed {@link Headers} object
   */
  private _getHeadersWithUserAgentMixedIn(headers?: HeadersInit): Headers {
    let userAgentUpdatedHeaders = new Headers(headers);
    if (this.userAgent) {
      userAgentUpdatedHeaders.set("User-Agent", this.userAgent);
    }
    return userAgentUpdatedHeaders;
  }
}
