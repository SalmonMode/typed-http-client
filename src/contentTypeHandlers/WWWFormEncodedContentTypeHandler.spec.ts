import * as chai from "chai";
import WWWFormEncodedContentTypeHandler from "./WWWFormEncodedContentTypeHandler";

var expect = chai.expect;

describe("WWWFormEncodedContentTypeHandler", function () {
  it("provides form encoded from data", function () {
    let sourceData = {
      fruit: "apple",
      number: 3,
    };
    let expected = "fruit=apple&number=3";
    expect(
      WWWFormEncodedContentTypeHandler.getContentForRequestFromPayload(
        sourceData
      )
    ).to.deep.equal(expected);
  });
});
