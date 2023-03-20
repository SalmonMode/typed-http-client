import { Headers } from "cross-fetch";
import { default as JSONContentTypeHandler } from "../contentTypeHandlers/JSONContentTypeHandler.js";
import { ResponseBodyNotJSONError } from "../errors.js";
import { default as HttpClient } from "../httpClient/HttpClient.js";
import {
  isTypedRequestOptionsWithPayload,
  isTypedRequestOptionsWithPayloadWithAdditionalAndAccept,
} from "../typePredicates/TypedRequestOptions.js";
import {
  type JsonReviver,
  type RequestOptions,
  type RequestOptionsWithAdditionalAndAccept,
  type ResponseProcessor,
  type TypedRequestOptions,
  type TypedRequestOptionsWithAdditionalAndAccept,
  type TypedResponse,
} from "../types/TypedHttpClient.js";

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
  constructor(userAgent?: string) {
    this.client = new HttpClient(userAgent);
  }

  /**
   * Performs a HEAD request to the provided URL.
   *
   * Note: HEAD requests cannot contain bodies, and so any body provided in the RequestInit will be ignored.
   *
   * @param requestOptions the details for the request to be made
   * @returns an object containing information about the response
   */
  public async head(
    requestOptions: RequestOptions
  ): Promise<TypedResponse<undefined>> {
    const requestInit = this._getRequestResources(requestOptions);
    const response: Response = await this.client.head(
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
  public async options<ReturnType>(
    requestOptions: RequestOptions,
    responseProcessor: ResponseProcessor<ReturnType>
  ): Promise<TypedResponse<ReturnType>>;
  public async options<ReturnType, PayloadType>(
    requestOptions: TypedRequestOptions<PayloadType>,
    responseProcessor: ResponseProcessor<ReturnType>
  ): Promise<TypedResponse<ReturnType>>;
  public async options<ReturnType, PayloadType>(
    requestOptions: RequestOptions | TypedRequestOptions<PayloadType>,
    responseProcessor: ResponseProcessor<ReturnType>
  ): Promise<TypedResponse<ReturnType>> {
    const requestInit = this._getRequestResources(requestOptions);
    const response = await this.client.options(requestOptions.url, requestInit);
    return this.processResponse(
      response,
      responseProcessor,
      requestOptions.responseJsonReviver
    );
  }

  /**
   * Performs a GET request to the provided URL.
   *
   * Note: GET requests cannot contain bodies, and so any body provided in the RequestInit will be ignored.
   *
   * @param requestOptions the details for the request to be made
   * @returns an object containing information about the response
   */
  public async get<ReturnType>(
    requestOptions: RequestOptions,
    responseProcessor: ResponseProcessor<ReturnType>
  ): Promise<TypedResponse<ReturnType>> {
    const requestInit = this._getRequestResources(requestOptions);
    const response = await this.client.get(requestOptions.url, requestInit);
    return this.processResponse(
      response,
      responseProcessor,
      requestOptions.responseJsonReviver
    );
  }

  /**
   * Performs a POST request to the provided URL.
   *
   * @param requestOptions the details for the request to be made
   * @returns an object containing information about the response
   */
  public async post<ReturnType>(
    requestOptions: RequestOptions,
    responseProcessor: ResponseProcessor<ReturnType>
  ): Promise<TypedResponse<ReturnType>>;
  public async post<ReturnType, PayloadType>(
    requestOptions: TypedRequestOptions<PayloadType>,
    responseProcessor: ResponseProcessor<ReturnType>
  ): Promise<TypedResponse<ReturnType>>;
  public async post<ReturnType, PayloadType>(
    requestOptions: RequestOptions | TypedRequestOptions<PayloadType>,
    responseProcessor: ResponseProcessor<ReturnType>
  ): Promise<TypedResponse<ReturnType>> {
    const requestInit = this._getRequestResources(requestOptions);
    const response = await this.client.post(requestOptions.url, requestInit);
    return this.processResponse(
      response,
      responseProcessor,
      requestOptions.responseJsonReviver
    );
  }

  /**
   * Performs a PUT request to the provided URL.
   *
   * @param requestOptions the details for the request to be made
   * @returns an object containing information about the response
   */
  public async put<ReturnType>(
    requestOptions: RequestOptions,
    responseProcessor: ResponseProcessor<ReturnType>
  ): Promise<TypedResponse<ReturnType>>;
  public async put<ReturnType, PayloadType>(
    requestOptions: TypedRequestOptions<PayloadType>,
    responseProcessor: ResponseProcessor<ReturnType>
  ): Promise<TypedResponse<ReturnType>>;
  public async put<ReturnType, PayloadType>(
    requestOptions: RequestOptions | TypedRequestOptions<PayloadType>,
    responseProcessor: ResponseProcessor<ReturnType>
  ): Promise<TypedResponse<ReturnType>> {
    const requestInit = this._getRequestResources(requestOptions);
    const response = await this.client.put(requestOptions.url, requestInit);
    return this.processResponse<ReturnType>(
      response,
      responseProcessor,
      requestOptions.responseJsonReviver
    );
  }

  /**
   * Performs a PATCH request to the provided URL.
   *
   * @param requestOptions the details for the request to be made
   * @returns an object containing information about the response
   */
  public async patch<ReturnType>(
    requestOptions: RequestOptions,
    responseProcessor: ResponseProcessor<ReturnType>
  ): Promise<TypedResponse<ReturnType>>;
  public async patch<ReturnType, PayloadType>(
    requestOptions: TypedRequestOptions<PayloadType>,
    responseProcessor: ResponseProcessor<ReturnType>
  ): Promise<TypedResponse<ReturnType>>;
  public async patch<ReturnType, PayloadType>(
    requestOptions: RequestOptions | TypedRequestOptions<PayloadType>,
    responseProcessor: ResponseProcessor<ReturnType>
  ): Promise<TypedResponse<ReturnType>> {
    const requestInit = this._getRequestResources(requestOptions);
    const response = await this.client.patch(requestOptions.url, requestInit);
    return this.processResponse(
      response,
      responseProcessor,
      requestOptions.responseJsonReviver
    );
  }

  /**
   * Performs a DELETE request to the provided URL.
   *
   * @param requestOptions the details for the request to be made
   * @returns an object containing information about the response
   */
  public async delete<ReturnType>(
    requestOptions: RequestOptions,
    responseProcessor: ResponseProcessor<ReturnType>
  ): Promise<TypedResponse<ReturnType>>;
  public async delete<ReturnType, PayloadType>(
    requestOptions: TypedRequestOptions<PayloadType>,
    responseProcessor: ResponseProcessor<ReturnType>
  ): Promise<TypedResponse<ReturnType>>;
  public async delete<ReturnType, PayloadType>(
    requestOptions: RequestOptions | TypedRequestOptions<PayloadType>,
    responseProcessor: ResponseProcessor<ReturnType>
  ): Promise<TypedResponse<ReturnType>> {
    const requestInit = this._getRequestResources(requestOptions);
    const response = await this.client.delete(requestOptions.url, requestInit);
    return this.processResponse(
      response,
      responseProcessor,
      requestOptions.responseJsonReviver
    );
  }

  /**
   * Forces a fallback to the `"application/json"` accept header if not provided, and the {@link JSONContentTypeHandler} if necessary.
   *
   * It's not required that a caller provides a additional headers or and accept header for their convenience. This
   * function is used to ensure that these are provided if the caller doesn't pass them. Additionally, if a payload
   * is provided, but no content type handler is, this will embed the JSON handler as a fallback. Without a fallback
   * content handler, it could potentially break things as the client may not be able to serialize the payload
   * provided (if there is one) or it may not know what to put for the content type header so the server can receive
   * it properly.
   *
   * @param requestOptions The original options object passed to the function
   * @returns the options with a content type handler explicitly defined
   */
  private _getRequestOptionsWithAdditionalAndAccept<PayloadType>(
    requestOptions: RequestOptions | TypedRequestOptions<PayloadType>
  ):
    | TypedRequestOptionsWithAdditionalAndAccept<PayloadType>
    | RequestOptionsWithAdditionalAndAccept {
    const common = {
      acceptHeader: requestOptions.acceptHeader || "application/json",
      additionalHeaders: requestOptions.additionalHeaders || {},
    };
    if (isTypedRequestOptionsWithPayload(requestOptions)) {
      // A payload is provided, so be sure there is a content type handler.
      const options: TypedRequestOptionsWithAdditionalAndAccept<PayloadType> = {
        ...common,
        ...requestOptions,
        contentTypeHandler:
          requestOptions.contentTypeHandler || JSONContentTypeHandler,
      };
      return options;
    }
    // No payload provided so no need for a content type handler.
    const options: RequestOptionsWithAdditionalAndAccept = {
      ...common,
      ...requestOptions,
    };
    return options;
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
    requestOptions:
      | RequestOptionsWithAdditionalAndAccept
      | TypedRequestOptionsWithAdditionalAndAccept<PayloadType>
  ): Headers {
    const headers: Headers = new Headers(requestOptions.additionalHeaders);
    headers.set("accept", requestOptions.acceptHeader);
    if (
      isTypedRequestOptionsWithPayloadWithAdditionalAndAccept(requestOptions)
    ) {
      // A payload was provided so provide the content-type header must be set.
      const contentHandler = requestOptions.contentTypeHandler;
      headers.set("content-type", contentHandler.header);
    }
    // No payload was provided so no need for a content-type header.
    return headers;
  }

  /**
   * Format the data and request details into a digestible format for the base HttpClient.
   *
   * @param requestOptions The request options for the request
   * @returns The object the base HttpClient will use to set up and make the actual request
   */
  private _getRequestResources<PayloadType>(
    requestOptions: RequestOptions | TypedRequestOptions<PayloadType>
  ): RequestInit {
    const reqOptsWithAdditionalAndAccept =
      this._getRequestOptionsWithAdditionalAndAccept(requestOptions);
    const requestInit: RequestInit = {
      headers: this._headersFromOptions(reqOptsWithAdditionalAndAccept),
    };
    if (
      isTypedRequestOptionsWithPayloadWithAdditionalAndAccept(
        reqOptsWithAdditionalAndAccept
      )
    ) {
      // A payload is provided and should be converted to the format required for sending over the wire.
      requestInit.body =
        reqOptsWithAdditionalAndAccept.contentTypeHandler.getContentForRequestFromPayload(
          reqOptsWithAdditionalAndAccept.payload
        );
    }
    // No payload was provided so no need to convert it.
    return requestInit;
  }

  /**
   * Process the response and return the result.
   *
   * If the content-type of the response indicates the body has JSON, this will attempt to parse that JSON
   * and provide that along with the string version and the original response to the response processor.
   *
   * A "reviver" function can also be provided to fascilitate the JSON parsing attempt if relevant.
   *
   * @param response the {@link Response} object provided by cross-fetch
   * @param responseProcessor the function that will be used to
   * @param responseJsonReviver (optional) A function that transforms the results. This function is called for
   *   each member of the object. If a member contains nested objects, the nested objects are transformed before
   *   the parent object is.
   * @see {@link JSON.parse} for more information on the reviver.
   * @returns the processed response of the anticipated return type
   */
  async processResponse<ReturnType>(
    response: Response,
    responseProcessor: ResponseProcessor<ReturnType>,
    responseJsonReviver?: JsonReviver
  ): Promise<TypedResponse<ReturnType>> {
    // Get the body as a string first.
    const bodyContentsAsString = await response.text();
    // If the content-type indicates JSON, attempts to parse the contents as such.
    let bodyContentsAsObject: unknown;
    if (this._contentTypeIsJson(response.headers)) {
      bodyContentsAsObject = this._getParsedJSONFromResponseBodyContents(
        bodyContentsAsString,
        responseJsonReviver
      );
    }
    // Process the response
    const result: ReturnType = responseProcessor({
      response,
      responseBodyAsString: bodyContentsAsString,
      responseBodyAsObject: bodyContentsAsObject,
    });
    return {
      statusCode: response.status,
      result: result,
      headers: response.headers,
    };
  }

  /**
   * Check if the content type of the request or response is "application/json".
   *
   * The Content-Type header may contain extra information beyond the media type, like `charset=utf-8`, so it must be
   * checked to see if the media type for JSON content ('application/json') is included, as oppposed to just checking if
   * it's equal to the media type.
   *
   * @param headers the request or response headers
   * @returns true, if the content type is "application/json", false, if not
   */
  private _contentTypeIsJson(headers: Headers): boolean {
    const contentType = headers.get("content-type");
    const jsonContentType = JSONContentTypeHandler.mediaType;
    return !!contentType && contentType.includes(jsonContentType);
  }

  /**
   * Attempt to parse the body string as JSON.
   *
   * @throws {@link ResponseBodyNotJSONError} if body can't be parsed
   *
   * @param bodyContentsAsString the body contents of the response as a string
   * @param reviver (optional) A function that transforms the results. This function is called for each member
   *   of the object. If a member contains nested objects, the nested objects are transformed before the parent
   *   object is.
   * @see {@link JSON.parse} for more information on the reviver.
   * @returns the body parsed as JSON
   */
  private _getParsedJSONFromResponseBodyContents(
    bodyContentsAsString: string,
    reviver?: JsonReviver
  ): unknown {
    try {
      if (bodyContentsAsString.length > 0) {
        return JSON.parse(bodyContentsAsString, reviver);
      }
      return;
    } catch (err) {
      throw new ResponseBodyNotJSONError(
        `Response body is string with content, and headers suggest the content type is JSON, but could not parse JSON. Contents: ${bodyContentsAsString}`
      );
    }
  }
}
