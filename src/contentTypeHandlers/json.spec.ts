import * as chai from "chai";
import JSONContentTypeHandler from "./json";

var expect = chai.expect;

describe("JSONContentTypeHandler", function () {
  it("provides stringified JSON from data", function () {
    let expected = {
      fruit: "apple",
      number: 3,
    };
    let content =
      JSONContentTypeHandler.getContentForRequestFromPayload(expected);
    expect(JSON.parse(content)).to.deep.equal(expected);
  });
});
