import * as chai from "chai";
import { isString } from "./String";

var expect = chai.expect;

describe("isString type predicate", function () {
  describe("Valid Object", function () {
    describe("String With Content", function () {
      it("should be true", function () {
        expect(isString("true")).to.be.true;
      });
    });
    describe("Empty String", function () {
      it("should be true", function () {
        expect(isString("")).to.be.true;
      });
    });
  });
  describe("Invalid Object", function () {
    describe("Empty Object", function () {
      it("should be false", function () {
        expect(isString({})).to.be.false;
      });
    });
    describe("Object is number", function () {
      it("should be false", function () {
        expect(isString(3)).to.be.false;
      });
    });
    describe("Object is null", function () {
      it("should be false", function () {
        expect(isString(null)).to.be.false;
      });
    });
    describe("Object is boolean", function () {
      it("should be false", function () {
        expect(isString(true)).to.be.false;
      });
    });
    describe("Object is array", function () {
      it("should be false", function () {
        expect(isString([])).to.be.false;
      });
    });
    describe("Object is undefined", function () {
      it("should be false", function () {
        expect(isString(undefined)).to.be.false;
      });
    });
  });
});
