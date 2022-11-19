import {
  ContentTypeHeaderString,
  IContentTypeHandler,
  MediaTypeCategory,
  NodeSupportedEncoding,
} from "../types";

/**
 * A content type handler that can provide JSON encoded bodies.
 *
 * Converts whatever payload is provided into a string via JSON.stringify.
 */
const JSONContentTypeHandler: IContentTypeHandler<any> = {
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
