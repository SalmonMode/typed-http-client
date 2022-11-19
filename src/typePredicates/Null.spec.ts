import * as chai from "chai";
import { isNull } from "./Null";

var expect = chai.expect;

describe("isNull type predicate", function () {
  describe("Valid Object", function () {
    describe("Object is null", function () {
      it("should be true", function () {
        expect(isNull(null)).to.be.true;
      });
    });
  });
  describe("Invalid Object", function () {
    describe("Empty Object", function () {
      it("should be false", function () {
        expect(isNull({})).to.be.false;
      });
    });
    describe("Object is number", function () {
      it("should be false", function () {
        expect(isNull(3)).to.be.false;
      });
    });
    describe("Object is boolean", function () {
      it("should be false", function () {
        expect(isNull(true)).to.be.false;
      });
    });
    describe("Object is array", function () {
      it("should be false", function () {
        expect(isNull([])).to.be.false;
      });
    });
    describe("Object is undefined", function () {
      it("should be false", function () {
        expect(isNull(undefined)).to.be.false;
      });
    });
  });
});
