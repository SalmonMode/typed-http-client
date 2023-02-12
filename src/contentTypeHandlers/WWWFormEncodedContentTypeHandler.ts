import {
  ContentTypeHandler,
  MediaTypeCategory,
  NodeSupportedEncoding,
  ContentTypeHeaderString,
} from "../types";

/**
 * A content type handler that can provide WWW Form encoded bodies.
 *
 * Converts the payload (which should be a simple key value pair object) to URL encoding.
 */
const WWWFormEncodedContentTypeHandler: ContentTypeHandler<
  Record<string, unknown>
> = {
  mediaType: `${MediaTypeCategory.Application}/x-www-form-urlencoded`,
  charset: NodeSupportedEncoding.UTF8,
  get header(): ContentTypeHeaderString {
    return `${this.mediaType}; charset=${this.charset}`;
  },
  getContentForRequestFromPayload<T extends Record<string, unknown>>(
    payload: T
  ): string {
    const formBodyArray = [];
    for (const property in payload) {
      const encodedKey = encodeURIComponent(property);
      const rawValue = payload[property];
      const encodableValue = String(rawValue);
      const encodedValue = encodeURIComponent(encodableValue);
      formBodyArray.push(encodedKey + "=" + encodedValue);
    }
    return formBodyArray.join("&");
  },
};
export default WWWFormEncodedContentTypeHandler;
