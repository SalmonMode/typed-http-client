import { Headers } from "cross-fetch";
import { JSONContentTypeHandler } from "../contentTypeHandlers";
import { ResponseBodyNotJSONError } from "../errors";
import { HttpClient } from "../httpClient";
import {
  ITypedRequestOptions,
  ITypedRequestOptionsBase,
  ITypedRequestOptionsSansPayload,
  ITypedRequestOptionsWithAdditionalAndAccept,
  ITypedRequestOptionsWithPayload,
  ITypedResponse,
  RequestInitSansMethod,
  RequestInitSansMethodAndBody,
  ResponseProcessor,
} from "../types";

/**
 * An HTTP client that returns typed responses.
 *
 * This client will assume the Content-Type headers on the requests and responses are indicative of how to
 * parse the provided content. If the Content-Type indicates the body is JSON, the client will attempt to
 * parse the response as such before passing it to caller-provided response parsers. If the bodies do not
 * contain JSON, a {@link ResponseBodyNotJSONError} will be thrown.
 *
 * It's recommended that [type assertion functions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions)
 * are used in the provided response processor in order to ensure the responses are the anticipated shape.
 * The provided response parser is executed after some potential initial processing of the response. Each
 * response parser is provided with the original {@link Response} object, the response body as a string
 * (which may be empty), and the response body as an object (if the content-type indicates JSON) as
 * arguments.
 *
 * Generic typing is provided so TypeScript can be told what to expect from such responses and to give
 * downstream code access to helpful typing information.
 *
 * In general, this client is here to provide some convenience functionality and helpful typing information
 * in a way that doesn't clutter up the rest of the code base. It does not, on its own guarantee that what
 * it returns from its request methods will match the types specified, as this is the responsibility of the
 * response parser functions. Using robust parsers and assertions is highly recommended.
 *
 * For convenience, the client will assume that the primary mode of communication will be JSON where relevant,
 * unless otherwise specified.
 */
export default class TypedHttpClient {
  client: HttpClient;

  /**
   * Creates an instance of the HTTP client.
   *
   * @constructor
   * @param {string} userAgent - userAgent for requests
   */
  constructor(userAgent: string) {
    this.client = new HttpClient(userAgent);
  }

  /**
   * Performs a HEAD request to the provided URL.
   *
   * @param requestOptions the details for the request to be made
   * @returns an object containing information about the response
   */
  public async head(
    requestOptions: ITypedRequestOptionsSansPayload
  ): Promise<ITypedResponse<undefined>> {
    let requestInit = this._getRequestResources(requestOptions);
    let response: Response = await this.client.head(
      requestOptions.url,
      requestInit
    );
    return {
      statusCode: response.status,
      result: undefined,
      headers: response.headers,
    };
  }

  /**
   * Performs an OPTIONS request to the provided URL.
   *
   * @param requestOptions the details for the request to be made
   * @returns an object containing information about the response
   */
  public async options<ReturnType, PayloadType = undefined>(
    requestOptions: ITypedRequestOptions<PayloadType>,
    responseProcessor: ResponseProcessor<ReturnType>
  ): Promise<ITypedResponse<ReturnType>> {
    let requestInit: RequestInitSansMethod =
      this._getRequestResources<PayloadType>(requestOptions);
    let response: Response = await this.client.options(
      requestOptions.url,
      requestInit
    );
    return this.processResponse<ReturnType>(response, responseProcessor);
  }

  /**
   * Performs a GET request to the provided URL.
   *
   * @param requestOptions the details for the request to be made
   * @returns an object containing information about the response
   */
  public async get<ReturnType>(
    requestOptions: ITypedRequestOptionsSansPayload,
    responseProcessor: ResponseProcessor<ReturnType>
  ): Promise<ITypedResponse<ReturnType>> {
    let requestInit: RequestInitSansMethodAndBody =
      this._getRequestResources(requestOptions);
    let response: Response = await this.client.get(
      requestOptions.url,
      requestInit
    );
    return this.processResponse<ReturnType>(response, responseProcessor);
  }

  /**
   * Performs a POST request to the provided URL.
   *
   * @param requestOptions the details for the request to be made
   * @returns an object containing information about the response
   */
  public async post<ReturnType, PayloadType = undefined>(
    requestOptions: ITypedRequestOptions<PayloadType>,
    responseProcessor: ResponseProcessor<ReturnType>
  ): Promise<ITypedResponse<ReturnType>> {
    let requestInit: RequestInitSansMethod =
      this._getRequestResources<PayloadType>(requestOptions);
    let response: Response = await this.client.post(
      requestOptions.url,
      requestInit
    );
    return this.processResponse<ReturnType>(response, responseProcessor);
  }

  /**
   * Performs a PUT request to the provided URL.
   *
   * @param requestOptions the details for the request to be made
   * @returns an object containing information about the response
   */
  public async put<ReturnType, PayloadType = undefined>(
    requestOptions: ITypedRequestOptions<PayloadType>,
    responseProcessor: ResponseProcessor<ReturnType>
  ): Promise<ITypedResponse<ReturnType>> {
    let requestInit: RequestInitSansMethod =
      this._getRequestResources<PayloadType>(requestOptions);
    let response: Response = await this.client.put(
      requestOptions.url,
      requestInit
    );
    return this.processResponse<ReturnType>(response, responseProcessor);
  }

  /**
   * Performs a PATCH request to the provided URL.
   *
   * @param requestOptions the details for the request to be made
   * @returns an object containing information about the response
   */
  public async patch<ReturnType, PayloadType = undefined>(
    requestOptions: ITypedRequestOptions<PayloadType>,
    responseProcessor: ResponseProcessor<ReturnType>
  ): Promise<ITypedResponse<ReturnType>> {
    let requestInit: RequestInitSansMethod =
      this._getRequestResources<PayloadType>(requestOptions);
    let response: Response = await this.client.patch(
      requestOptions.url,
      requestInit
    );
    return this.processResponse<ReturnType>(response, responseProcessor);
  }

  /**
   * Performs a DELETE request to the provided URL.
   *
   * @param requestOptions the details for the request to be made
   * @returns an object containing information about the response
   */
  public async delete<ReturnType, PayloadType = undefined>(
    requestOptions: ITypedRequestOptions<PayloadType>,
    responseProcessor: ResponseProcessor<ReturnType>
  ): Promise<ITypedResponse<ReturnType>> {
    let requestInit: RequestInitSansMethod =
      this._getRequestResources<PayloadType>(requestOptions);
    let response: Response = await this.client.delete(
      requestOptions.url,
      requestInit
    );
    return this.processResponse<ReturnType>(response, responseProcessor);
  }

  /**
   * Forces a fallback to the `"application/json"` accept header if not provided, and the {@link JSONContentTypeHandler} if necessary.
   *
   * It's not required that a caller provides a additional headers or and accept header for their convenience. This
   * function is used to ensure that these are provided if the caller doesn't pass them. Additionally, if a payload
   * is provided, but no content type handler is, this will embed the JSON handler as a fallback.
   *
   * @param requestOptions The original options object passed to the function
   * @returns the options with a content type handler explicitly defined
   */
  private _getRequestOptionsWithAdditionalAndAccept<PayloadType>(
    requestOptions: ITypedRequestOptions<PayloadType>
  ): ITypedRequestOptionsWithAdditionalAndAccept<PayloadType> {
    const base = {
      ...requestOptions,
      acceptHeader: requestOptions.acceptHeader || "application/json",
      additionalHeaders: requestOptions.additionalHeaders || {},
    };
    if (this._optionsHasPayload(requestOptions)) {
      return {
        ...base,
        payload: requestOptions.payload,
        contentTypeHandler:
          requestOptions.contentTypeHandler || JSONContentTypeHandler,
      };
    }
    return base;
  }

  /**
   * Use the provided options to build the {@link Headers} that will be used for the request.
   *
   * This will defer to using the {@link JSONContentTypeHandler} if a payload is provided but a handler isn't.
   *
   * @param requestOptions request options to form headers from
   * @returns The {@link Headers} to use for the request
   */
  private _headersFromOptions<PayloadType>(
    requestOptions: ITypedRequestOptionsWithAdditionalAndAccept<PayloadType>
  ): Headers {
    let headers: Headers = new Headers(requestOptions.additionalHeaders);
    headers.set("accept", requestOptions.acceptHeader);
    if (this._optionsHasPayload(requestOptions)) {
      let contentHandler = requestOptions.contentTypeHandler;
      headers.set("content-type", contentHandler.header);
    }
    return headers;
  }

  /**
   * Format the data and request details into a digestible format for the base HttpClient.
   *
   * @param requestOptions The request options for the request
   * @returns The object the base HttpClient will use to set up and make the actual request
   */
  private _getRequestResources<PayloadType = undefined>(
    requestOptions: ITypedRequestOptions<PayloadType>
  ): PayloadType extends undefined
    ? RequestInitSansMethodAndBody
    : RequestInitSansMethod {
    const reqOptsWithAdditionalAndAccept =
      this._getRequestOptionsWithAdditionalAndAccept(requestOptions);
    const requestInit: RequestInitSansMethodAndBody = {
      headers: this._headersFromOptions<PayloadType>(
        reqOptsWithAdditionalAndAccept
      ),
    };
    if (this._optionsHasPayload(reqOptsWithAdditionalAndAccept)) {
      const requestInitWithBody: RequestInitSansMethod = {
        ...requestInit,
        body: reqOptsWithAdditionalAndAccept.contentTypeHandler.getContentForRequestFromPayload(
          reqOptsWithAdditionalAndAccept.payload
        ),
      };
      return requestInitWithBody;
    }
    return requestInit;
  }

  /**
   * A type predicate for narrowing type possibilities based on whether or not a payload was provided.
   *
   * The contentTypeHandler property is only relevant if there is a payload.
   *
   * @param requestOptions options to check if a payload is provided
   * @returns
   */
  private _optionsHasPayload<PayloadType>(
    requestOptions: ITypedRequestOptions<PayloadType>
  ): requestOptions is ITypedRequestOptionsWithPayload<PayloadType> {
    const reqOpt = requestOptions as ITypedRequestOptionsBase<PayloadType>;
    if (reqOpt.payload) {
      return true;
    }
    return false;
  }

  /**
   * Process the response and return the result.
   *
   * If the content-type of the response indicates the body has JSON, this will attempt to parse that JSON
   * and provide that along with the string version and the original response to the response processor.
   *
   * @param response the {@link Response} object provided by cross-fetch
   * @param responseProcessor the function that will be used to
   * @returns the processed response of the anticipated return type
   */
  async processResponse<ReturnType>(
    response: Response,
    responseProcessor: ResponseProcessor<ReturnType>
  ): Promise<ITypedResponse<ReturnType>> {
    let bodyContentsAsString: string = await response.text();
    let bodyContentsAsObject: unknown;
    if (this._contentTypeIsJson(response.headers)) {
      bodyContentsAsObject =
        this._getParsedJSONFromResponseBodyContents(bodyContentsAsString);
    }

    let result: ReturnType = responseProcessor(
      response,
      bodyContentsAsString,
      bodyContentsAsObject
    );
    return {
      statusCode: response.status,
      result: result,
      headers: response.headers,
    };
  }

  /**
   * Check if the content type of the request or response is "application/json"
   *
   * @param headers the request or response headers
   * @returns true if the content type is "application/json", false if not
   */
  private _contentTypeIsJson(headers: Headers): boolean {
    return headers.get("content-type") === JSONContentTypeHandler.mediaType;
  }

  /**
   * Attempt to parse the body string as JSON.
   *
   * @throws {@link ResponseBodyNotJSONError} if body can't be parsed
   *
   * @param bodyContentsAsString the body contents of the response as a string
   * @returns the body parsed as JSON
   */
  private _getParsedJSONFromResponseBodyContents(
    bodyContentsAsString: string
  ): unknown {
    try {
      if (bodyContentsAsString.length > 0) {
        return JSON.parse(bodyContentsAsString);
      }
      return;
    } catch (err) {
      throw new ResponseBodyNotJSONError(
        `Response body is string with content, and headers suggest the content type is JSON, but could not parse JSON. Contents: ${bodyContentsAsString}`
      );
    }
  }
}
