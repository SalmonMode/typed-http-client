import * as chai from "chai";
import { isUndefined } from "./Undefined";

var expect = chai.expect;

describe("isUndefined type predicate", function () {
  describe("Valid Object", function () {
    describe("Object is undefined", function () {
      it("should be true", function () {
        expect(isUndefined(undefined)).to.be.true;
      });
    });
  });
  describe("Invalid Object", function () {
    describe("Empty Object", function () {
      it("should be false", function () {
        expect(isUndefined({})).to.be.false;
      });
    });
    describe("Object is number", function () {
      it("should be false", function () {
        expect(isUndefined(3)).to.be.false;
      });
    });
    describe("Object is null", function () {
      it("should be false", function () {
        expect(isUndefined(null)).to.be.false;
      });
    });
    describe("Object is boolean", function () {
      it("should be false", function () {
        expect(isUndefined(true)).to.be.false;
      });
    });
    describe("Object is array", function () {
      it("should be false", function () {
        expect(isUndefined([])).to.be.false;
      });
    });
  });
});
