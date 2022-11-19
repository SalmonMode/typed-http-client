import * as chai from "chai";
import { isNullish } from "./Nullish";

var expect = chai.expect;

describe("isNullish type predicate", function () {
  describe("Valid Object", function () {
    describe("Object is null", function () {
      it("should be true", function () {
        expect(isNullish(null)).to.be.true;
      });
    });
    describe("Object is undefined", function () {
      it("should be true", function () {
        expect(isNullish(undefined)).to.be.true;
      });
    });
  });
  describe("Invalid Object", function () {
    describe("Empty Object", function () {
      it("should be false", function () {
        expect(isNullish({})).to.be.false;
      });
    });
    describe("Object With Contents", function () {
      it("should be false", function () {
        expect(isNullish({ a: "apple" })).to.be.false;
      });
    });
    describe("Object is number", function () {
      it("should be false", function () {
        expect(isNullish(3)).to.be.false;
      });
    });

    describe("Object is boolean", function () {
      it("should be false", function () {
        expect(isNullish(true)).to.be.false;
      });
    });
    describe("Object is array", function () {
      it("should be false", function () {
        expect(isNullish([])).to.be.false;
      });
    });
  });
});
