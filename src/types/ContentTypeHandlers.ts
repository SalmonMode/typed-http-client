import { MediaTypeCategory } from "./MediaTypeCategory";
import { NodeSupportedEncoding } from "./NodeSupportedEncoding";

/**
 * The string format for MIME types that are provided in the Content-Type header.
 */
export type MediaTypeString = `${MediaTypeCategory}/${string}`;
/**
 * The string format for the Content-Type header's value.
 */
export type ContentTypeHeaderString =
  | `${MediaTypeCategory}/${string}; charset=${NodeSupportedEncoding}`
  | `${MediaTypeCategory}/${string}; charset=${NodeSupportedEncoding}; boundary=${string}`;

/**
 * The interface that all ContentType handlers should implement.
 *
 * The HttpClient will expect something similar to this to know how to set the headers for the request,
 * and to transform the request body appropriately.
 *
 */
export interface IContentTypeHandler<T> {
  mediaType: MediaTypeString;
  charset: NodeSupportedEncoding;
  header: ContentTypeHeaderString;
  getContentForRequestFromPayload(payload: T): string;
}
