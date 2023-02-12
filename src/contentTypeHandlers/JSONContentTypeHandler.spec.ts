import * as chai from "chai";
import JSONContentTypeHandler from "./JSONContentTypeHandler";

const expect = chai.expect;

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
