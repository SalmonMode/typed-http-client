import type {
  ContentTypeHandler,
  ContentTypeHeaderString,
} from "../types/ContentTypeHandlers.js";
import { MediaTypeCategory } from "../types/MediaTypeCategory.js";
import { NodeSupportedEncoding } from "../types/NodeSupportedEncoding.js";

/**
 * A content type handler that can provide JSON encoded bodies.
 *
 * Converts whatever payload is provided into a string via JSON.stringify.
 */
const JSONContentTypeHandler: ContentTypeHandler<unknown> = {
  mediaType: `${MediaTypeCategory.Application}/json`,
  charset: NodeSupportedEncoding.UTF8,
  get header(): ContentTypeHeaderString {
    return `${this.mediaType}; charset=${this.charset}`;
  },
  getContentForRequestFromPayload<T>(payload: T): string {
    return JSON.stringify(payload);
  },
};
export default JSONContentTypeHandler;
