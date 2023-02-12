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
  Record<string, any>
> = {
  mediaType: `${MediaTypeCategory.Application}/x-www-form-urlencoded`,
  charset: NodeSupportedEncoding.UTF8,
  get header(): ContentTypeHeaderString {
    return `${this.mediaType}; charset=${this.charset}`;
  },
  getContentForRequestFromPayload<T extends Record<string, any>>(
    payload: T
  ): string {
    let formBodyArray = [];
    for (let property in payload) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(payload[property]);
      formBodyArray.push(encodedKey + "=" + encodedValue);
    }
    return formBodyArray.join("&");
  },
};
export default WWWFormEncodedContentTypeHandler;


function a(x: unknown) {
  if (x !== null && typeof x === "object"){
    console.log(x)
  }
}

const someVar: any = {};
if (someVar !== null && typeof someVar === "object") {
  // 'someVar' is still recognized as type 'any'
  someVar.thing(); // Compiler doesn't complain
}
