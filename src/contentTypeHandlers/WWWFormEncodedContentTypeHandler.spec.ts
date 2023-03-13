import { expect } from "chai";
import WWWFormEncodedContentTypeHandler from "./WWWFormEncodedContentTypeHandler.js";

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
