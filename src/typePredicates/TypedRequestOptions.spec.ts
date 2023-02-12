import * as chai from "chai";
import { JSONContentTypeHandler } from "../contentTypeHandlers";
import { TypedRequestOptionsBase } from "../types";
import {
  isTypedRequestOptionsWithPayload,
  isTypedRequestOptionsWithPayloadWithAdditionalAndAccept,
} from "./TypedRequestOptions";

const expect = chai.expect;

interface PType {
  a: string;
}

describe("isTypedRequestOptionsWithPayload type predicate", function () {
  describe("Has Payload", function () {
    const options: TypedRequestOptionsBase<PType> = {
      url: new URL("http://localhost:80"),
      payload: { a: "apple" },
    };
    it("should be true", function () {
      expect(isTypedRequestOptionsWithPayload(options)).to.be.true;
    });
  });
  describe("Has Payload And ContentTypeHandler", function () {
    const options: TypedRequestOptionsBase<PType> = {
      url: new URL("http://localhost:80"),
      payload: { a: "apple" },
      contentTypeHandler: JSONContentTypeHandler,
    };
    it("should be true", function () {
      expect(isTypedRequestOptionsWithPayload(options)).to.be.true;
    });
  });
  describe("Has Only ContentTypeHandler", function () {
    const options: TypedRequestOptionsBase<PType> = {
      url: new URL("http://localhost:80"),
      contentTypeHandler: JSONContentTypeHandler,
    };
    it("should be false", function () {
      expect(isTypedRequestOptionsWithPayload(options)).to.be.false;
    });
  });
  describe("Has No Payload Or ContentTypeHandler", function () {
    const options: TypedRequestOptionsBase<PType> = {
      url: new URL("http://localhost:80"),
    };
    it("should be false", function () {
      expect(isTypedRequestOptionsWithPayload(options)).to.be.false;
    });
  });
});
describe("isTypedRequestOptionsWithPayloadWithAdditionalAndAccept type predicate", function () {
  describe("Has Payload, Content Type Handler, Accept Header, And Additional Headers", function () {
    const options: TypedRequestOptionsBase<PType> = {
      url: new URL("http://localhost:80"),
      payload: { a: "apple" },
      contentTypeHandler: JSONContentTypeHandler,
      acceptHeader: "application/json",
      additionalHeaders: {},
    };
    it("should be true", function () {
      expect(isTypedRequestOptionsWithPayloadWithAdditionalAndAccept(options))
        .to.be.true;
    });
  });
  describe("Has Payload, Content Type Handler, And Accept Header, No Additional Headers", function () {
    const options: TypedRequestOptionsBase<PType> = {
      url: new URL("http://localhost:80"),
      payload: { a: "apple" },
      contentTypeHandler: JSONContentTypeHandler,
      acceptHeader: "application/json",
    };
    it("should be false", function () {
      expect(isTypedRequestOptionsWithPayloadWithAdditionalAndAccept(options))
        .to.be.false;
    });
  });
  describe("Has Payload, Content Type Handler, And Additional Headers, No Accept Header", function () {
    const options: TypedRequestOptionsBase<PType> = {
      url: new URL("http://localhost:80"),
      payload: { a: "apple" },
      contentTypeHandler: JSONContentTypeHandler,
      additionalHeaders: {},
    };
    it("should be false", function () {
      expect(isTypedRequestOptionsWithPayloadWithAdditionalAndAccept(options))
        .to.be.false;
    });
  });
  describe("Has Payload, Accept Header, And Additional Headers, No Content Type Handler", function () {
    const options: TypedRequestOptionsBase<PType> = {
      url: new URL("http://localhost:80"),
      payload: { a: "apple" },
      acceptHeader: "application/json",
      additionalHeaders: {},
    };
    it("should be false", function () {
      expect(isTypedRequestOptionsWithPayloadWithAdditionalAndAccept(options))
        .to.be.false;
    });
  });
  describe("Has Content Type Handler, Accept Header, And Additional Headers, No Payload", function () {
    const options: TypedRequestOptionsBase<PType> = {
      url: new URL("http://localhost:80"),
      contentTypeHandler: JSONContentTypeHandler,
      acceptHeader: "application/json",
      additionalHeaders: {},
    };
    it("should be false", function () {
      expect(isTypedRequestOptionsWithPayloadWithAdditionalAndAccept(options))
        .to.be.false;
    });
  });
});
