import * as chai from "chai";
import WWWFormEncodedContentTypeHandler from "./WWWFormEncodedContentTypeHandler";

const expect = chai.expect;

describe("WWWFormEncodedContentTypeHandler", function () {
  it("provides form encoded from data", function () {
    const sourceData = {
      fruit: "apple",
      number: 3,
    };
    const expected = "fruit=apple&number=3";
    expect(
      WWWFormEncodedContentTypeHandler.getContentForRequestFromPayload(
        sourceData
      )
    ).to.deep.equal(expected);
  });
});
