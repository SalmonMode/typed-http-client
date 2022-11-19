/**
 * This is thrown when the text of response body cannot be processed by JSON.parse.
 */
export class ResponseBodyNotJSONError extends TypeError {
  constructor(message?: string) {
    super(message);

    Object.setPrototypeOf(this, ResponseBodyNotJSONError.prototype);
    this.name = new.target.name;
  }
}
