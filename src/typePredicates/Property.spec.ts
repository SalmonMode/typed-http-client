import * as chai from "chai";
import { hasProperty } from "./Property";

var expect = chai.expect;

describe("hasProperty type predicate", function () {
  describe("Valid Property", function () {
    it("should be true", function () {
      const value = { a: "apple" }
      expect(hasProperty(value, "a")).to.be.true;
    });
  });
  describe("Invalid Property", function () {
    it("should be false", function () {
      const value = { a: "apple" }
      expect(hasProperty(value, "b")).to.be.false;
    });
  });
});
