import { expect } from "chai";
import { default as JSONContentTypeHandler } from "./JSONContentTypeHandler.js";

describe("JSONContentTypeHandler", function () {
  it("provides stringified JSON from data", function () {
    const expected = {
      fruit: "apple",
      number: 3,
    };
    const content =
      JSONContentTypeHandler.getContentForRequestFromPayload(expected);
    expect(JSON.parse(content)).to.deep.equal(expected);
  });
});
