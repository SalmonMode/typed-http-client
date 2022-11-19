import * as chai from "chai";
import { Headers } from "cross-fetch";
import * as nock from "nock";
import { Body } from "nock/types";
import { WWWFormEncodedContentTypeHandler } from "../contentTypeHandlers";
import { ResponseBodyNotJSONError } from "../errors";
import { isNullish, isString } from "../typePredicates";
import { ITypedResponse } from "../types";
import TypedHttpClient from "./TypedHttpClient";

var expect = chai.expect;

export interface HttpData {
  url: string;
  data: any;
  json: any;
  args?: any;
}
export interface RawResponseData {
  status: string;
}
export interface ResponseData {
  status: string;
}

function isRawResponseData(object: unknown): object is RawResponseData {
  if (isNullish(object)) {
    return false;
  }
  let dict = object as RawResponseData;
  return isString(dict.status);
}

function parseRawResponseData(
  response: Response,
  responseBodyAsString: string,
  rawResponseData: unknown
): ResponseData {
  if (isRawResponseData(rawResponseData)) {
    return { ...rawResponseData };
  }
  throw new TypeError(
    `Response body is not RawResponseData: ${JSON.stringify(rawResponseData)}`
  );
}

describe("TypedHttpClient", function () {
  describe("HEAD requests", function () {
    let client: TypedHttpClient;
    let requestBody: Body;
    let requestMethod: string;
    let requestHeaders: Headers;
    let restRes: ITypedResponse<undefined>;

    describe("With query string", function () {
      let requestUri: string;
      let payload = {
        something: "hello",
        other: "world",
      };
      before(async function () {
        client = new TypedHttpClient(
          "typed-http-client-tests",
          "https://localhost:80"
        );
        nock("https://localhost:80")
          .head(new RegExp("/.*"))
          .reply(200, function (uri: string, reqBody: Body): ResponseData {
            requestHeaders = new Headers(this.req.headers);
            requestMethod = this.req.method;
            requestBody = reqBody;
            requestUri = uri;
            return { status: "ok" };
          });
        restRes = await client.head("https://localhost:80", {
          queryParameters: payload,
        });
      });

      after(function () {
        nock.cleanAll();
      });

      it("received response", function () {
        expect(restRes.result).to.deep.equal(undefined);
      });
      it("uses null header because it has no body", async function () {
        expect(requestHeaders.get("content-type")).to.equal(null);
      });
      it("request body is empty", async function () {
        expect(requestBody).to.deep.equal("");
      });
      it("uses HEAD", async function () {
        expect(requestMethod).to.equal("HEAD");
      });
      it("uses query string", async function () {
        let params = new URL(`https://localhost:80${requestUri}`).searchParams;
        expect(params.get("something")).to.equal("hello");
        expect(params.get("other")).to.equal("world");
      });
    });
    describe("Without body", function () {
      before(async function () {
        client = new TypedHttpClient(
          "typed-http-client-tests",
          "https://localhost:80"
        );
        nock("https://localhost:80")
          .head("/")
          .reply(200, function (uri: string, reqBody: Body): ResponseData {
            requestHeaders = new Headers(this.req.headers);
            requestMethod = this.req.method;
            requestBody = reqBody;
            return { status: "ok" };
          });
        restRes = await client.head("https://localhost:80");
      });

      after(function () {
        nock.cleanAll();
      });

      it("received response", function () {
        expect(restRes.result).to.deep.equal(undefined);
      });
      it("uses null header because it has no body", async function () {
        expect(requestHeaders.get("content-type")).to.equal(null);
      });
      it("used empty string for request body", function () {
        expect(requestBody).to.equal("");
      });
      it("uses HEAD", async function () {
        expect(requestMethod).to.equal("HEAD");
      });
    });
    describe("Without body and with options", function () {
      before(async function () {
        client = new TypedHttpClient(
          "typed-http-client-tests",
          "https://localhost:80"
        );
        nock("https://localhost:80")
          .head("/")
          .reply(200, function (uri: string, reqBody: Body): ResponseData {
            requestHeaders = new Headers(this.req.headers);
            requestMethod = this.req.method;
            requestBody = reqBody;
            return { status: "ok" };
          });
        restRes = await client.head("https://localhost:80", {
          additionalHeaders: { "extra-header": "3" },
        });
      });

      after(function () {
        nock.cleanAll();
      });

      it("received response", function () {
        expect(restRes.result).to.deep.equal(undefined);
      });
      it("uses null header because it has no body", async function () {
        expect(requestHeaders.get("content-type")).to.equal(null);
      });
      it("uses extra header", async function () {
        expect(requestHeaders.get("extra-header")).to.equal("3");
      });
      it("used empty string for request body", function () {
        expect(requestBody).to.equal("");
      });
      it("uses HEAD", async function () {
        expect(requestMethod).to.equal("HEAD");
      });
    });
  });
  describe("GET requests", function () {
    let client: TypedHttpClient;
    let requestBody: Body;
    let requestMethod: string;
    let requestHeaders: Headers;
    let restRes: ITypedResponse<ResponseData>;

    describe("With query string", function () {
      let requestUri: string;
      let payload = {
        something: "hello",
        other: "world",
      };
      before(async function () {
        client = new TypedHttpClient(
          "typed-http-client-tests",
          "https://localhost:80"
        );
        nock("https://localhost:80")
          .get(new RegExp("/.*"))
          .reply(200, function (uri: string, reqBody: Body): ResponseData {
            requestHeaders = new Headers(this.req.headers);
            requestMethod = this.req.method;
            requestBody = reqBody;
            requestUri = uri;
            return { status: "ok" };
          }, {
            "content-type": "application/json"
          });
        restRes = await client.get<ResponseData>(
          "https://localhost:80",
          parseRawResponseData,
          { queryParameters: payload }
        );
      });

      after(function () {
        nock.cleanAll();
      });

      it("received response", function () {
        expect(restRes.result).to.deep.equal({ status: "ok" });
      });
      it("uses null header because it has no body", async function () {
        expect(requestHeaders.get("content-type")).to.equal(null);
      });
      it("request body is empty", async function () {
        expect(requestBody).to.deep.equal("");
      });
      it("uses GET", async function () {
        expect(requestMethod).to.equal("GET");
      });
      it("uses query string", async function () {
        let params = new URL(`https://localhost:80${requestUri}`).searchParams;
        expect(params.get("something")).to.equal("hello");
        expect(params.get("other")).to.equal("world");
      });
    });
    describe("Without body", function () {
      before(async function () {
        client = new TypedHttpClient(
          "typed-http-client-tests",
          "https://localhost:80"
        );
        nock("https://localhost:80")
          .get("/")
          .reply(200, function (uri: string, reqBody: Body): ResponseData {
            requestHeaders = new Headers(this.req.headers);
            requestMethod = this.req.method;
            requestBody = reqBody;
            return { status: "ok" };
          });
        restRes = await client.get<ResponseData>(
          "https://localhost:80",
          parseRawResponseData
        );
      });

      after(function () {
        nock.cleanAll();
      });

      it("received response", function () {
        expect(restRes.result).to.deep.equal({ status: "ok" });
      });
      it("uses null header because it has no body", async function () {
        expect(requestHeaders.get("content-type")).to.equal(null);
      });
      it("used empty string for request body", function () {
        expect(requestBody).to.equal("");
      });
      it("uses GET", async function () {
        expect(requestMethod).to.equal("GET");
      });
    });
    describe("Without body and with options", function () {
      before(async function () {
        client = new TypedHttpClient(
          "typed-http-client-tests",
          "https://localhost:80"
        );
        nock("https://localhost:80")
          .get("/")
          .reply(200, function (uri: string, reqBody: Body): ResponseData {
            requestHeaders = new Headers(this.req.headers);
            requestMethod = this.req.method;
            requestBody = reqBody;
            return { status: "ok" };
          });
        restRes = await client.get<ResponseData>(
          "https://localhost:80",
          parseRawResponseData,
          { additionalHeaders: { "extra-header": "3" } }
        );
      });

      after(function () {
        nock.cleanAll();
      });

      it("received response", function () {
        expect(restRes.result).to.deep.equal({ status: "ok" });
      });
      it("uses null header because it has no body", async function () {
        expect(requestHeaders.get("content-type")).to.equal(null);
      });
      it("uses extra header", async function () {
        expect(requestHeaders.get("extra-header")).to.equal("3");
      });
      it("used empty string for request body", function () {
        expect(requestBody).to.equal("");
      });
      it("uses GET", async function () {
        expect(requestMethod).to.equal("GET");
      });
    });
    describe("Empty string for response with text content type", function () {
      before(async function () {
        client = new TypedHttpClient(
          "typed-http-client-tests",
          "https://localhost:80"
        );
        nock("https://localhost:80")
          .get("/")
          .reply(200, "");
      });

      after(function () {
        nock.cleanAll();
      });

      it("throws TypeError", async function () {
        await expect(
          client.get<ResponseData>("https://localhost:80", parseRawResponseData)
        ).to.eventually.be.rejectedWith(TypeError);
      });
    });
    describe("Empty string for response with JSON content type", function () {
      before(async function () {
        client = new TypedHttpClient(
          "typed-http-client-tests",
          "https://localhost:80"
        );
        nock("https://localhost:80")
          .get("/")
          .reply(200, "", {"content-type": "application/json"});
      });

      after(function () {
        nock.cleanAll();
      });

      it("throws TypeError", async function () {
        await expect(
          client.get<ResponseData>("https://localhost:80", parseRawResponseData)
        ).to.eventually.be.rejectedWith(TypeError);
      });
    });
    describe("With improper JSON response", function () {
      let payload = {
        something: "hello",
        other: "world",
      };
      before(async function () {
        client = new TypedHttpClient(
          "typed-http-client-tests",
          "https://localhost:80"
        );
        nock("https://localhost:80")
          .get("/")
          .reply(200, function (uri: string, reqBody: Body): string {
            requestHeaders = new Headers(this.req.headers);
            requestMethod = this.req.method;
            requestBody = reqBody;
            return "{";
          }, {"content-type": "application/json"});
      });

      after(function () {
        nock.cleanAll();
      });

      it("throws ResponseBodyNotJSONError", async function () {
        await expect(
          client.get<ResponseData>("https://localhost:80", parseRawResponseData)
        ).to.eventually.be.rejectedWith(ResponseBodyNotJSONError);
      });
    });
  });
  describe("POST requests", function () {
    let client: TypedHttpClient;
    let requestBody: Body;
    let requestMethod: string;
    let requestHeaders: Headers;
    let restRes: ITypedResponse<ResponseData>;

    describe("With body", function () {
      let payload = {
        something: "hello",
        other: "world",
      };
      before(async function () {
        client = new TypedHttpClient(
          "typed-http-client-tests",
          "https://localhost:80"
        );
        nock("https://localhost:80")
          .post("/")
          .reply(200, function (uri: string, reqBody: Body): ResponseData {
            requestHeaders = new Headers(this.req.headers);
            requestMethod = this.req.method;
            requestBody = reqBody;
            return { status: "ok" };
          });
        restRes = await client.post<ResponseData, Record<string, any>>(
          "https://localhost:80",
          parseRawResponseData,
          { payload }
        );
      });

      after(function () {
        nock.cleanAll();
      });

      it("received response", function () {
        expect(restRes.result).to.deep.equal({ status: "ok" });
      });
      it("uses application/json header by default", function () {
        expect(requestHeaders.get("content-type")).to.equal(
          "application/json; charset=utf8"
        );
      });
      it("encoded request body in JSON format by default", async function () {
        expect(requestBody).to.deep.equal(payload);
      });
      it("uses POST", function () {
        expect(requestMethod).to.equal("POST");
      });
    });
    describe("With body and options", function () {
      before(async function () {
        client = new TypedHttpClient(
          "typed-http-client-tests",
          "https://localhost:80"
        );
        nock("https://localhost:80")
          .post("/")
          .reply(200, function (uri: string, reqBody: Body): ResponseData {
            requestHeaders = new Headers(this.req.headers);
            requestMethod = this.req.method;
            requestBody = reqBody;
            return { status: "ok" };
          });
        restRes = await client.post<ResponseData, Record<string, any>>(
          "https://localhost:80",
          parseRawResponseData,
          {
            payload: { something: "hello", other: "world" },
            additionalHeaders: { "extra-header": "3" },
            contentTypeHandler: WWWFormEncodedContentTypeHandler,
          }
        );
      });

      after(function () {
        nock.cleanAll();
      });

      it("received response", function () {
        expect(restRes.result).to.deep.equal({ status: "ok" });
      });
      it("uses x-www-form-urlencoded header", async function () {
        expect(requestHeaders.get("content-type")).to.equal(
          "application/x-www-form-urlencoded; charset=utf8"
        );
      });
      it("uses extra header", async function () {
        expect(requestHeaders.get("extra-header")).to.equal("3");
      });
      it("encoded request body in x-www-form-urlencoded format", async function () {
        expect(requestBody).to.equal("something=hello&other=world");
      });
      it("uses POST", function () {
        expect(requestMethod).to.equal("POST");
      });
    });
    describe("Without body", function () {
      before(async function () {
        client = new TypedHttpClient(
          "typed-http-client-tests",
          "https://localhost:80"
        );
        nock("https://localhost:80")
          .post("/")
          .reply(200, function (uri: string, reqBody: Body): ResponseData {
            requestHeaders = new Headers(this.req.headers);
            requestMethod = this.req.method;
            requestBody = reqBody;
            return { status: "ok" };
          }, {"content-type": "application/json"});
        restRes = await client.post<ResponseData>(
          "https://localhost:80",
          parseRawResponseData
        );
      });

      after(function () {
        nock.cleanAll();
      });

      it("received response", function () {
        expect(restRes.result).to.deep.equal({ status: "ok" });
      });
      it("uses null header because it has no body", async function () {
        expect(requestHeaders.get("content-type")).to.equal(null);
      });
      it("used empty string for request body", function () {
        expect(requestBody).to.equal("");
      });
      it("uses POST", function () {
        expect(requestMethod).to.equal("POST");
      });
    });
    describe("Without body and with options", function () {
      before(async function () {
        client = new TypedHttpClient(
          "typed-http-client-tests",
          "https://localhost:80"
        );
        nock("https://localhost:80")
          .post("/")
          .reply(200, function (uri: string, reqBody: Body): ResponseData {
            requestHeaders = new Headers(this.req.headers);
            requestMethod = this.req.method;
            requestBody = reqBody;
            return { status: "ok" };
          });
        restRes = await client.post<ResponseData>(
          "https://localhost:80",
          parseRawResponseData,
          { additionalHeaders: { "extra-header": "3" } }
        );
      });

      after(function () {
        nock.cleanAll();
      });

      it("received response", function () {
        expect(restRes.result).to.deep.equal({ status: "ok" });
      });
      it("uses null header because it has no body", async function () {
        expect(requestHeaders.get("content-type")).to.equal(null);
      });
      it("uses extra header", async function () {
        expect(requestHeaders.get("extra-header")).to.equal("3");
      });
      it("used empty string for request body", function () {
        expect(requestBody).to.equal("");
      });
      it("uses POST", function () {
        expect(requestMethod).to.equal("POST");
      });
    });
  });
  describe("PUT requests", function () {
    let client: TypedHttpClient;
    let requestBody: Body;
    let requestMethod: string;
    let requestHeaders: Headers;
    let restRes: ITypedResponse<ResponseData>;

    describe("With body", function () {
      let payload = {
        something: "hello",
        other: "world",
      };
      before(async function () {
        client = new TypedHttpClient(
          "typed-http-client-tests",
          "https://localhost:80"
        );
        nock("https://localhost:80")
          .put("/")
          .reply(200, function (uri: string, reqBody: Body): ResponseData {
            requestHeaders = new Headers(this.req.headers);
            requestMethod = this.req.method;
            requestBody = reqBody;
            return { status: "ok" };
          });
        restRes = await client.put<ResponseData, Record<string, any>>(
          "https://localhost:80",
          parseRawResponseData,
          { payload }
        );
      });

      after(function () {
        nock.cleanAll();
      });

      it("received response", function () {
        expect(restRes.result).to.deep.equal({ status: "ok" });
      });
      it("uses application/json header by default", function () {
        expect(requestHeaders.get("content-type")).to.equal(
          "application/json; charset=utf8"
        );
      });
      it("encoded request body in JSON format by default", async function () {
        expect(requestBody).to.deep.equal(payload);
      });
      it("uses PUT", async function () {
        expect(requestMethod).to.equal("PUT");
      });
    });
    describe("With body and options", function () {
      before(async function () {
        client = new TypedHttpClient(
          "typed-http-client-tests",
          "https://localhost:80"
        );
        nock("https://localhost:80")
          .put("/")
          .reply(200, function (uri: string, reqBody: Body): ResponseData {
            requestHeaders = new Headers(this.req.headers);
            requestMethod = this.req.method;
            requestBody = reqBody;
            return { status: "ok" };
          });
        restRes = await client.put<ResponseData, Record<string, any>>(
          "https://localhost:80",
          parseRawResponseData,
          {
            payload: { something: "hello", other: "world" },
            additionalHeaders: { "extra-header": "3" },
            contentTypeHandler: WWWFormEncodedContentTypeHandler,
          }
        );
      });

      after(function () {
        nock.cleanAll();
      });

      it("received response", function () {
        expect(restRes.result).to.deep.equal({ status: "ok" });
      });
      it("uses x-www-form-urlencoded header", async function () {
        expect(requestHeaders.get("content-type")).to.equal(
          "application/x-www-form-urlencoded; charset=utf8"
        );
      });
      it("uses extra header", async function () {
        expect(requestHeaders.get("extra-header")).to.equal("3");
      });
      it("encoded request body in x-www-form-urlencoded format", async function () {
        expect(requestBody).to.equal("something=hello&other=world");
      });
      it("uses PUT", async function () {
        expect(requestMethod).to.equal("PUT");
      });
    });
    describe("Without body", function () {
      before(async function () {
        client = new TypedHttpClient(
          "typed-http-client-tests",
          "https://localhost:80"
        );
        nock("https://localhost:80")
          .put("/")
          .reply(200, function (uri: string, reqBody: Body): ResponseData {
            requestHeaders = new Headers(this.req.headers);
            requestMethod = this.req.method;
            requestBody = reqBody;
            return { status: "ok" };
          });
        restRes = await client.put<ResponseData>(
          "https://localhost:80",
          parseRawResponseData
        );
      });

      after(function () {
        nock.cleanAll();
      });

      it("received response", function () {
        expect(restRes.result).to.deep.equal({ status: "ok" });
      });
      it("uses null header because it has no body", async function () {
        expect(requestHeaders.get("content-type")).to.equal(null);
      });
      it("used empty string for request body", function () {
        expect(requestBody).to.equal("");
      });
      it("uses PUT", async function () {
        expect(requestMethod).to.equal("PUT");
      });
    });
    describe("Without body and with options", function () {
      before(async function () {
        client = new TypedHttpClient(
          "typed-http-client-tests",
          "https://localhost:80"
        );
        nock("https://localhost:80")
          .put("/")
          .reply(200, function (uri: string, reqBody: Body): ResponseData {
            requestHeaders = new Headers(this.req.headers);
            requestMethod = this.req.method;
            requestBody = reqBody;
            return { status: "ok" };
          });
        restRes = await client.put<ResponseData>(
          "https://localhost:80",
          parseRawResponseData,
          { additionalHeaders: { "extra-header": "3" } }
        );
      });

      after(function () {
        nock.cleanAll();
      });

      it("received response", function () {
        expect(restRes.result).to.deep.equal({ status: "ok" });
      });
      it("uses null header because it has no body", async function () {
        expect(requestHeaders.get("content-type")).to.equal(null);
      });
      it("uses extra header", async function () {
        expect(requestHeaders.get("extra-header")).to.equal("3");
      });
      it("used empty string for request body", function () {
        expect(requestBody).to.equal("");
      });
      it("uses PUT", async function () {
        expect(requestMethod).to.equal("PUT");
      });
    });
  });
  describe("PATCH requests", function () {
    let client: TypedHttpClient;
    let requestBody: Body;
    let requestMethod: string;
    let requestHeaders: Headers;
    let restRes: ITypedResponse<ResponseData>;

    describe("With body", function () {
      let payload = {
        something: "hello",
        other: "world",
      };
      before(async function () {
        client = new TypedHttpClient(
          "typed-http-client-tests",
          "https://localhost:80"
        );
        nock("https://localhost:80")
          .patch("/")
          .reply(200, function (uri: string, reqBody: Body): ResponseData {
            requestHeaders = new Headers(this.req.headers);
            requestMethod = this.req.method;
            requestBody = reqBody;
            return { status: "ok" };
          });
        restRes = await client.patch<ResponseData, Record<string, any>>(
          "https://localhost:80",
          parseRawResponseData,
          { payload }
        );
      });

      after(function () {
        nock.cleanAll();
      });

      it("received response", function () {
        expect(restRes.result).to.deep.equal({ status: "ok" });
      });
      it("uses application/json header by default", function () {
        expect(requestHeaders.get("content-type")).to.equal(
          "application/json; charset=utf8"
        );
      });
      it("encoded request body in JSON format by default", async function () {
        expect(requestBody).to.deep.equal(payload);
      });
      it("uses PATCH", async function () {
        expect(requestMethod).to.equal("PATCH");
      });
    });
    describe("With body and options", function () {
      before(async function () {
        client = new TypedHttpClient(
          "typed-http-client-tests",
          "https://localhost:80"
        );
        nock("https://localhost:80")
          .patch("/")
          .reply(200, function (uri: string, reqBody: Body): ResponseData {
            requestHeaders = new Headers(this.req.headers);
            requestMethod = this.req.method;
            requestBody = reqBody;
            return { status: "ok" };
          });
        restRes = await client.patch<ResponseData, Record<string, any>>(
          "https://localhost:80",
          parseRawResponseData,
          {
            payload: { something: "hello", other: "world" },
            additionalHeaders: { "extra-header": "3" },
            contentTypeHandler: WWWFormEncodedContentTypeHandler,
          }
        );
      });

      after(function () {
        nock.cleanAll();
      });

      it("received response", function () {
        expect(restRes.result).to.deep.equal({ status: "ok" });
      });
      it("uses x-www-form-urlencoded header", async function () {
        expect(requestHeaders.get("content-type")).to.equal(
          "application/x-www-form-urlencoded; charset=utf8"
        );
      });
      it("uses extra header", async function () {
        expect(requestHeaders.get("extra-header")).to.equal("3");
      });
      it("encoded request body in x-www-form-urlencoded format", async function () {
        expect(requestBody).to.equal("something=hello&other=world");
      });
      it("uses PATCH", async function () {
        expect(requestMethod).to.equal("PATCH");
      });
    });
    describe("Without body", function () {
      before(async function () {
        client = new TypedHttpClient(
          "typed-http-client-tests",
          "https://localhost:80"
        );
        nock("https://localhost:80")
          .patch("/")
          .reply(200, function (uri: string, reqBody: Body): ResponseData {
            requestHeaders = new Headers(this.req.headers);
            requestMethod = this.req.method;
            requestBody = reqBody;
            return { status: "ok" };
          });
        restRes = await client.patch<ResponseData>(
          "https://localhost:80",
          parseRawResponseData
        );
      });

      after(function () {
        nock.cleanAll();
      });

      it("received response", function () {
        expect(restRes.result).to.deep.equal({ status: "ok" });
      });
      it("uses null header because it has no body", async function () {
        expect(requestHeaders.get("content-type")).to.equal(null);
      });
      it("used empty string for request body", function () {
        expect(requestBody).to.equal("");
      });
      it("uses PATCH", async function () {
        expect(requestMethod).to.equal("PATCH");
      });
    });
    describe("Without body and with options", function () {
      before(async function () {
        client = new TypedHttpClient(
          "typed-http-client-tests",
          "https://localhost:80"
        );
        nock("https://localhost:80")
          .patch("/")
          .reply(200, function (uri: string, reqBody: Body): ResponseData {
            requestHeaders = new Headers(this.req.headers);
            requestMethod = this.req.method;
            requestBody = reqBody;
            return { status: "ok" };
          });
        restRes = await client.patch<ResponseData>(
          "https://localhost:80",
          parseRawResponseData,
          { additionalHeaders: { "extra-header": "3" } }
        );
      });

      after(function () {
        nock.cleanAll();
      });

      it("received response", function () {
        expect(restRes.result).to.deep.equal({ status: "ok" });
      });
      it("uses null header because it has no body", async function () {
        expect(requestHeaders.get("content-type")).to.equal(null);
      });
      it("uses extra header", async function () {
        expect(requestHeaders.get("extra-header")).to.equal("3");
      });
      it("used empty string for request body", function () {
        expect(requestBody).to.equal("");
      });
      it("uses PATCH", async function () {
        expect(requestMethod).to.equal("PATCH");
      });
    });
  });
  describe("OPTIONS requests", function () {
    let client: TypedHttpClient;
    let requestBody: Body;
    let requestMethod: string;
    let requestHeaders: Headers;
    let restRes: ITypedResponse<ResponseData>;

    describe("With body", function () {
      let payload = {
        something: "hello",
        other: "world",
      };
      before(async function () {
        client = new TypedHttpClient(
          "typed-http-client-tests",
          "https://localhost:80"
        );
        nock("https://localhost:80")
          .options("/")
          .reply(200, function (uri: string, reqBody: Body): ResponseData {
            requestHeaders = new Headers(this.req.headers);
            requestMethod = this.req.method;
            requestBody = reqBody;
            return { status: "ok" };
          });
        restRes = await client.options<ResponseData, Record<string, any>>(
          "https://localhost:80",
          parseRawResponseData,
          { payload }
        );
      });

      after(function () {
        nock.cleanAll();
      });

      it("received response", function () {
        expect(restRes.result).to.deep.equal({ status: "ok" });
      });
      it("uses application/json header by default", function () {
        expect(requestHeaders.get("content-type")).to.equal(
          "application/json; charset=utf8"
        );
      });
      it("encoded request body in JSON format by default", async function () {
        expect(requestBody).to.deep.equal(payload);
      });
      it("uses OPTIONS", async function () {
        expect(requestMethod).to.equal("OPTIONS");
      });
    });
    describe("With body and options", function () {
      before(async function () {
        client = new TypedHttpClient(
          "typed-http-client-tests",
          "https://localhost:80"
        );
        nock("https://localhost:80")
          .options("/")
          .reply(200, function (uri: string, reqBody: Body): ResponseData {
            requestHeaders = new Headers(this.req.headers);
            requestMethod = this.req.method;
            requestBody = reqBody;
            return { status: "ok" };
          });
        restRes = await client.options<ResponseData, Record<string, any>>(
          "https://localhost:80",
          parseRawResponseData,
          {
            payload: { something: "hello", other: "world" },
            additionalHeaders: { "extra-header": "3" },
            contentTypeHandler: WWWFormEncodedContentTypeHandler,
          }
        );
      });

      after(function () {
        nock.cleanAll();
      });

      it("received response", function () {
        expect(restRes.result).to.deep.equal({ status: "ok" });
      });
      it("uses x-www-form-urlencoded header", async function () {
        expect(requestHeaders.get("content-type")).to.equal(
          "application/x-www-form-urlencoded; charset=utf8"
        );
      });
      it("uses extra header", async function () {
        expect(requestHeaders.get("extra-header")).to.equal("3");
      });
      it("encoded request body in x-www-form-urlencoded format", async function () {
        expect(requestBody).to.equal("something=hello&other=world");
      });
      it("uses OPTIONS", async function () {
        expect(requestMethod).to.equal("OPTIONS");
      });
    });
    describe("Without body", function () {
      before(async function () {
        client = new TypedHttpClient(
          "typed-http-client-tests",
          "https://localhost:80"
        );
        nock("https://localhost:80")
          .options("/")
          .reply(200, function (uri: string, reqBody: Body): ResponseData {
            requestHeaders = new Headers(this.req.headers);
            requestMethod = this.req.method;
            requestBody = reqBody;
            return { status: "ok" };
          });
        restRes = await client.options<ResponseData>(
          "https://localhost:80",
          parseRawResponseData
        );
      });

      after(function () {
        nock.cleanAll();
      });

      it("received response", function () {
        expect(restRes.result).to.deep.equal({ status: "ok" });
      });
      it("uses null header because it has no body", async function () {
        expect(requestHeaders.get("content-type")).to.equal(null);
      });
      it("used empty string for request body", function () {
        expect(requestBody).to.equal("");
      });
      it("uses OPTIONS", async function () {
        expect(requestMethod).to.equal("OPTIONS");
      });
    });
    describe("Without body and with options", function () {
      before(async function () {
        client = new TypedHttpClient(
          "typed-http-client-tests",
          "https://localhost:80"
        );
        nock("https://localhost:80")
          .options("/")
          .reply(200, function (uri: string, reqBody: Body): ResponseData {
            requestHeaders = new Headers(this.req.headers);
            requestMethod = this.req.method;
            requestBody = reqBody;
            return { status: "ok" };
          });
        restRes = await client.options<ResponseData>(
          "https://localhost:80",
          parseRawResponseData,
          { additionalHeaders: { "extra-header": "3" } }
        );
      });

      after(function () {
        nock.cleanAll();
      });

      it("received response", function () {
        expect(restRes.result).to.deep.equal({ status: "ok" });
      });
      it("uses null header because it has no body", async function () {
        expect(requestHeaders.get("content-type")).to.equal(null);
      });
      it("uses extra header", async function () {
        expect(requestHeaders.get("extra-header")).to.equal("3");
      });
      it("used empty string for request body", function () {
        expect(requestBody).to.equal("");
      });
      it("uses OPTIONS", async function () {
        expect(requestMethod).to.equal("OPTIONS");
      });
    });
  });
  describe("DELETE requests", function () {
    let client: TypedHttpClient;
    let requestBody: Body;
    let requestMethod: string;
    let requestHeaders: Headers;
    let restRes: ITypedResponse<ResponseData>;

    describe("With body", function () {
      let payload = {
        something: "hello",
        other: "world",
      };
      before(async function () {
        client = new TypedHttpClient(
          "typed-http-client-tests",
          "https://localhost:80"
        );
        nock("https://localhost:80")
          .delete("/")
          .reply(200, function (uri: string, reqBody: Body): ResponseData {
            requestHeaders = new Headers(this.req.headers);
            requestMethod = this.req.method;
            requestBody = reqBody;
            return { status: "ok" };
          });
        restRes = await client.delete<ResponseData, Record<string, any>>(
          "https://localhost:80",
          parseRawResponseData,
          { payload }
        );
      });

      after(function () {
        nock.cleanAll();
      });

      it("received response", function () {
        expect(restRes.result).to.deep.equal({ status: "ok" });
      });
      it("uses application/json header by default", function () {
        expect(requestHeaders.get("content-type")).to.equal(
          "application/json; charset=utf8"
        );
      });
      it("encoded request body in JSON format by default", async function () {
        expect(requestBody).to.deep.equal(payload);
      });
      it("uses DELETE", async function () {
        expect(requestMethod).to.equal("DELETE");
      });
    });
    describe("With body and options", function () {
      before(async function () {
        client = new TypedHttpClient(
          "typed-http-client-tests",
          "https://localhost:80"
        );
        nock("https://localhost:80")
          .delete("/")
          .reply(200, function (uri: string, reqBody: Body): ResponseData {
            requestHeaders = new Headers(this.req.headers);
            requestMethod = this.req.method;
            requestBody = reqBody;
            return { status: "ok" };
          });
        restRes = await client.delete<ResponseData, Record<string, any>>(
          "https://localhost:80",
          parseRawResponseData,
          {
            payload: { something: "hello", other: "world" },
            additionalHeaders: { "extra-header": "3" },
            contentTypeHandler: WWWFormEncodedContentTypeHandler,
          }
        );
      });

      after(function () {
        nock.cleanAll();
      });

      it("received response", function () {
        expect(restRes.result).to.deep.equal({ status: "ok" });
      });
      it("uses x-www-form-urlencoded header", async function () {
        expect(requestHeaders.get("content-type")).to.equal(
          "application/x-www-form-urlencoded; charset=utf8"
        );
      });
      it("uses extra header", async function () {
        expect(requestHeaders.get("extra-header")).to.equal("3");
      });
      it("encoded request body in x-www-form-urlencoded format", async function () {
        expect(requestBody).to.equal("something=hello&other=world");
      });
      it("uses DELETE", async function () {
        expect(requestMethod).to.equal("DELETE");
      });
    });
    describe("Without body", function () {
      before(async function () {
        client = new TypedHttpClient(
          "typed-http-client-tests",
          "https://localhost:80"
        );
        nock("https://localhost:80")
          .delete("/")
          .reply(200, function (uri: string, reqBody: Body): ResponseData {
            requestHeaders = new Headers(this.req.headers);
            requestMethod = this.req.method;
            requestBody = reqBody;
            return { status: "ok" };
          });
        restRes = await client.delete<ResponseData>(
          "https://localhost:80",
          parseRawResponseData
        );
      });

      after(function () {
        nock.cleanAll();
      });

      it("received response", function () {
        expect(restRes.result).to.deep.equal({ status: "ok" });
      });
      it("uses null header because it has no body", async function () {
        expect(requestHeaders.get("content-type")).to.equal(null);
      });
      it("used empty string for request body", function () {
        expect(requestBody).to.equal("");
      });
      it("uses DELETE", async function () {
        expect(requestMethod).to.equal("DELETE");
      });
    });
    describe("Without body and with options", function () {
      before(async function () {
        client = new TypedHttpClient(
          "typed-http-client-tests",
          "https://localhost:80"
        );
        nock("https://localhost:80")
          .delete("/")
          .reply(200, function (uri: string, reqBody: Body): ResponseData {
            requestHeaders = new Headers(this.req.headers);
            requestMethod = this.req.method;
            requestBody = reqBody;
            return { status: "ok" };
          });
        restRes = await client.delete<ResponseData>(
          "https://localhost:80",
          parseRawResponseData,
          { additionalHeaders: { "extra-header": "3" } }
        );
      });

      after(function () {
        nock.cleanAll();
      });

      it("received response", function () {
        expect(restRes.result).to.deep.equal({ status: "ok" });
      });
      it("uses null header because it has no body", async function () {
        expect(requestHeaders.get("content-type")).to.equal(null);
      });
      it("uses extra header", async function () {
        expect(requestHeaders.get("extra-header")).to.equal("3");
      });
      it("used empty string for request body", function () {
        expect(requestBody).to.equal("");
      });
      it("uses DELETE", async function () {
        expect(requestMethod).to.equal("DELETE");
      });
    });
  });
});
