import { Headers } from "cross-fetch";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import HttpClient from "./HttpClient";
import * as nock from "nock";

chai.use(chaiAsPromised);

var expect = chai.expect;

interface ResponseData {
  headers: any;
  method: string;
  url: string;
}

describe("HttpClient", function () {
  let httpClient: HttpClient;
  let nockScope: nock.Scope;
  beforeEach(function () {
    httpClient = new HttpClient("typed-test-client-tests");
  });
  afterEach(function () {
    nock.cleanAll();
  });
  describe("HTTP", function () {
    let rootUrl: string;
    beforeEach(function () {
      rootUrl = "http://localhost:80";
      nockScope = nock(rootUrl);
    });
    describe("GET", function () {
      describe("Basic", function () {
        beforeEach(function () {
          nockScope
            .get("/get")
            .reply(
              200,
              function (uri: string, reqBody: nock.Body): ResponseData {
                let context: nock.ReplyFnContext = this as nock.ReplyFnContext;
                return {
                  method: context.req.method,
                  headers: context.req.headers,
                  url: uri,
                };
              }
            );
        });
        it("succeeds", async function () {
          let res: Response = await httpClient.get(
            new URL("http://localhost:80/get")
          );
          expect(res.status).to.equal(200);
          let body: string = await res.text();
          let obj: any = JSON.parse(body);
          expect(Object.keys(obj.headers)).to.include("user-agent");
        });
        it("succeeds with undefined agent", async function () {
          let http: HttpClient = new HttpClient(undefined);
          let res: Response = await http.get(
            new URL("http://localhost:80/get")
          );
          expect(res.status).to.equal(200);
          let body: string = await res.text();
          let obj: any = JSON.parse(body);
          let x = new Headers();
          expect(Object.keys(obj.headers)).to.include("user-agent");
          expect(obj.headers["user-agent"]).to.deep.equal([
            "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)",
          ]);
        });

        it("succeeds with empty agent", async function () {
          let http: HttpClient = new HttpClient("");
          let res: Response = await http.get(
            new URL("http://localhost:80/get")
          );
          expect(res.status).to.equal(200);
          let body: string = await res.text();
          let obj: any = JSON.parse(body);
          expect(Object.keys(obj.headers)).to.include("user-agent");
          expect(obj.headers["user-agent"]).to.deep.equal([
            "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)",
          ]);
        });
      });
      describe("No charset in response", function () {
        beforeEach(function () {
          nockScope.get("/get").reply(
            200,
            function (uri: string, reqBody: nock.Body): ResponseData {
              let context: nock.ReplyFnContext = this as nock.ReplyFnContext;
              return {
                method: context.req.method,
                headers: context.req.headers,
                url: uri,
              };
            },
            { "content-type": "application/json" }
          );
        });
        it("succeeds", async function () {
          let res: Response = await httpClient.get(
            new URL("http://localhost:80/get")
          );
          expect(res.status).to.equal(200);
          let body: string = await res.text();
        });
      });
      describe("Compatible charset in response", function () {
        beforeEach(function () {
          nockScope.get("/get").reply(
            200,
            function (uri: string, reqBody: nock.Body): ResponseData {
              let context: nock.ReplyFnContext = this as nock.ReplyFnContext;
              return {
                method: context.req.method,
                headers: context.req.headers,
                url: uri,
              };
            },
            { "content-type": "application/json; charset=utf8" }
          );
        });
        it("succeeds", async function () {
          let res: Response = await httpClient.get(
            new URL("http://localhost:80/get")
          );
          expect(res.status).to.equal(200);
          let body: string = await res.text();
        });
      });
      describe("Incompatible charset in response", function () {
        beforeEach(function () {
          nockScope.get("/get").reply(
            200,
            function (uri: string, reqBody: nock.Body): ResponseData {
              let context: nock.ReplyFnContext = this as nock.ReplyFnContext;
              return {
                method: context.req.method,
                headers: context.req.headers,
                url: uri,
              };
            },
            { "content-type": "application/json; charset=utf-9" }
          );
        });
        it("succeeds", async function () {
          let res: Response = await httpClient.get(
            new URL("http://localhost:80/get")
          );
          expect(res.status).to.equal(200);
          let body: string = await res.text();
        });
      });
      describe("404", function () {
        beforeEach(function () {
          nockScope
            .get("/status/404")
            .reply(
              404,
              function (uri: string, reqBody: nock.Body): ResponseData {
                let context: nock.ReplyFnContext = this as nock.ReplyFnContext;
                return {
                  method: context.req.method,
                  headers: context.req.headers,
                  url: uri,
                };
              }
            );
        });
        it("succeeds", async function () {
          let res: Response = await httpClient.get(
            new URL("http://localhost:80/status/404")
          );
          expect(res.status).to.equal(404);
          let body: string = await res.text();
        });
      });
    });
    describe("HEAD", function () {
      beforeEach(function () {
        nockScope
          .head("/head")
          .reply(200, function (uri: string, reqBody: nock.Body): ResponseData {
            let context: nock.ReplyFnContext = this as nock.ReplyFnContext;
            return {
              method: context.req.method,
              headers: context.req.headers,
              url: uri,
            };
          });
      });
      it("succeeds", async function () {
        let res: Response = await httpClient.head(
          new URL("http://localhost:80/head")
        );
        expect(res.status).to.equal(200);
      });
    });
    describe("POST", function () {
      beforeEach(function () {
        nockScope
          .post("/post")
          .reply(200, function (uri: string, reqBody: nock.Body): nock.Body {
            return {
              data: reqBody,
            };
          });
      });
      it("succeeds", async function () {
        let data: string = "Hello World!";
        let res: Response = await httpClient.post(
          new URL("http://localhost:80/post"),
          { body: data }
        );
        expect(res.status).to.equal(200);
        let body: string = await res.text();
        let obj: any = JSON.parse(body);
        expect(obj.data).to.equal(data);
      });
      it("succeeds without body", async function () {
        let res: Response = await httpClient.post(
          new URL("http://localhost:80/post")
        );
        expect(res.status).to.equal(200);
        let body: string = await res.text();
        let obj: any = JSON.parse(body);
        expect(obj.data).to.equal("");
      });
    });
    describe("PATCH", function () {
      beforeEach(function () {
        nockScope
          .patch("/patch")
          .reply(200, function (uri: string, reqBody: nock.Body): nock.Body {
            return {
              data: reqBody,
            };
          });
      });
      it("succeeds", async function () {
        let data: string = "Hello World!";
        let res: Response = await httpClient.patch(
          new URL("http://localhost:80/patch"),
          { body: data }
        );
        expect(res.status).to.equal(200);
        let body: string = await res.text();
        let obj: any = JSON.parse(body);
        expect(obj.data).to.equal(data);
      });
      it("succeeds without body", async function () {
        let res: Response = await httpClient.patch(
          new URL("http://localhost:80/patch")
        );
        expect(res.status).to.equal(200);
        let body: string = await res.text();
        let obj: any = JSON.parse(body);
        expect(obj.data).to.equal("");
      });
    });
    describe("PUT", function () {
      beforeEach(function () {
        nockScope
          .put("/put")
          .reply(200, function (uri: string, reqBody: nock.Body): nock.Body {
            return {
              data: reqBody,
            };
          });
      });
      it("succeeds", async function () {
        let data: string = "Hello World!";
        let res: Response = await httpClient.put(
          new URL("http://localhost:80/put"),
          { body: data }
        );
        expect(res.status).to.equal(200);
        let body: string = await res.text();
        let obj: any = JSON.parse(body);
        expect(obj.data).to.equal(data);
      });
      it("succeeds without body", async function () {
        let res: Response = await httpClient.put(
          new URL("http://localhost:80/put")
        );
        expect(res.status).to.equal(200);
        let body: string = await res.text();
        let obj: any = JSON.parse(body);
        expect(obj.data).to.equal("");
      });
    });
    describe("DELETE", function () {
      beforeEach(function () {
        nockScope
          .delete("/delete")
          .reply(200, function (uri: string, reqBody: nock.Body): ResponseData {
            let context: nock.ReplyFnContext = this as nock.ReplyFnContext;
            return {
              method: context.req.method,
              headers: context.req.headers,
              url: uri,
            };
          });
      });
      it("succeeds", async function () {
        let res: Response = await httpClient.delete(
          new URL("http://localhost:80/delete")
        );
        expect(res.status).to.equal(200);
        let body: string = await res.text();
        let obj: any = JSON.parse(body);
      });
    });
    describe("OPTIONS", function () {
      beforeEach(function () {
        nockScope
          .options("/options")
          .reply(200, function (uri: string, reqBody: nock.Body): ResponseData {
            let context: nock.ReplyFnContext = this as nock.ReplyFnContext;
            return {
              method: context.req.method,
              headers: context.req.headers,
              url: uri,
            };
          });
      });
      it("succeeds", async function () {
        let res: Response = await httpClient.options(
          new URL("http://localhost:80/options")
        );
        expect(res.status).to.equal(200);
        let body: string = await res.text();
      });
    });
  });
  describe("HTTPS", function () {
    let rootUrl: string;
    beforeEach(function () {
      rootUrl = "https://localhost:80";
      nockScope = nock(rootUrl);
    });
    describe("GET", function () {
      describe("Basic", function () {
        beforeEach(function () {
          nockScope
            .get("/get")
            .reply(
              200,
              function (uri: string, reqBody: nock.Body): ResponseData {
                let context: nock.ReplyFnContext = this as nock.ReplyFnContext;
                return {
                  method: context.req.method,
                  headers: context.req.headers,
                  url: uri,
                };
              }
            );
        });
        it("succeeds", async function () {
          let res: Response = await httpClient.get(
            new URL("https://localhost:80/get")
          );
          expect(res.status).to.equal(200);
          let body: string = await res.text();
          let obj: any = JSON.parse(body);
          expect(Object.keys(obj.headers)).to.include("user-agent");
        });
      });
    });
  });
});
