[![codecov](https://codecov.io/gh/SalmonMode/typed-http-client/branch/main/graph/badge.svg?token=E28MMT0TC6)](https://codecov.io/gh/SalmonMode/typed-http-client)

# typed-http-client
A TypeScript HTTP client that facilitates strongly typed requests and responses.

# Introduction
This is a simple, strongly typed HTTP client that's meant to work in both a browser and a Node.js runtime environment. It provides two main features:

1. Strongly typed requests
2. Strongly typed responses

## Strongly typed requests

Being able to specify the shape of what the request functions (`get`, `post`, et al) accept as a shape for the data, in combination with the particular content type makes it easy and simple to know what's going out the door.

## Strongly typed responses

Using the hook provided for processing a response, the caller can define the means to both parse the response from the backend and provide the typing information for it.

Using tools like [type assertion functions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions), the caller can easily maintain type safety while providing a means of flow control if necessary for any problematic responses.

Type assertion function are similar to [type predicates](https://www.typescriptlang.org/docs/handbook/advanced-types.html#using-type-predicates), but rely on errors being thrown to tell the rest of the code whether or not the argument passed matches the anticipated type. If no error is thrown—and it can be any error type—then the argument passed must be what was anticipated. Because any error type can be thrown, you can use different error types to provide for different error handling logic, and build that error however you desire.

For example, you may be able to recognize when a login attempt failed because of invalid credentials and throw a custom `InvalidCredentialsError`.

# Getting Started

### Installation

```bash
npm install --save typed-http-client
```

## Usage

Let's say there's an endpoint that accepts `POST` requests that contain a JSON payload in the body, and it returns with some JSON of its own with a range of data. For now, let's assume it'll come back as JSON and the client will at least parse that much. First let's starts by making an interface that represents the anticipated shape of our raw data:

```typescript
export interface MyRawData {
  someNumber: number;
  someDate: string;
}
```

The `someDate` field represents a `Date` object, but the API is providing it as an [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) string. We'll be converting it to a proper `Date` object in the response processor, but that'll be a few steps down. For now, let's define the shape of our desired data:

```typescript
export interface MyProcessedData {
  someNumber: number;
  someDate: Date;
}
```

We don't want to get too ahead of ourselves, though, because we don't know what's coming back from the API until we actually look at it. So let's build a [type assertion function](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions) to make sure it lines up:

```typescript
function assertIsMyRawData(value: unknown): asserts value is MyRawData {
  // Check if nullish first so members can be accessed later without throwing errors.
  if (value === null || value === undefined) {
    throw new TypeError("Value is not MyRawData");
  }
  // Assign it to type any now that it is confirmed to not be nullish so the compiler doesn't
  // complain about members not existing.
  const obj: any = value;
  if (!Number.isFinite(obj.member)) {
    throw new TypeError("Value is not MyRawData");
  } else if (typeof obj.someDate !== "string") {
    throw new TypeError("Value is not MyRawData");
  }
}
```

Now we can use this in our processing function to get some semblance of typing early on. Any errors can be thrown here, and this can be used to your advantage as mentioned earlier. Now let's define our processing function:

```typescript
function parseMyRawData(
  response: Response,
  responseBodyAsString: string,
  responseBodyAsObject: unknown
): MyProcessedData {
  assertIsMyRawData(responseBodyAsObject);
  // responseBodyAsObject is now recognized as `MyRawData`
  return {
    someNumber: responseBodyAsObject.someNumber,
    someDate: new Date(responseBodyAsObject.someDate),
  }
}
```

The HTTP client provides references to the original `Response` object, the response body as a `string`, and, if it thought it could pull it out, the body of the response parsed by the `JSON` module. The client provides all this information to be convenient so you can decide how you want to parse each response using all the available information.

It's important to note that even with the `JSON` module parsing it, the type is still `unknown`. But the type assertion function we made makes that easy to account for. And now to put it all together:

```typescript
const client = new TypedHttpClient("my-client");
const url = new URL("https://www.somecoolwebsite.com/post-endpoint");
// It's not necessary to tell response or data what types they'll be as it's inferred. But
// it's added here for clarity.
const response: ITypedResponse<MyProcessedData> = await client.post<MyProcessedData>({ url }, parseMyRawData);
const data: MyProcessedData = response.result;
```

Now let's say the same endpoint took a JSON payload. The client comes with two content type handlers (one for JSON, and another for `x-www-form-urlencoded`), but attempts to use JSON by default. Let's define a quick interface that outlines the shape of the data we want to send to the endpoint:

```typescript
export interface MyPayload {
  someId: number;
  specialFlag: boolean;
}
```

Now we can use this to make sure that we're passing exactly what we think to the `post` function:

```typescript
const payload: MyPayload = {
  someId: 1234,
  specialFlag: true,
};
const client = new TypedHttpClient("my-client");
const url = new URL("https://www.somecoolwebsite.com/post-endpoint");
// Specifying the payload type here helps make sure we don't accidentally pass something in we don't want to.
const response = await client.post<MyProcessedData, MyPayload>(
  {
    url,
    payload,
  },
  parseMyRawData
);
const data: MyProcessedData = response.result;
```

And that's it!

Errors can be thrown at any point in the response processor and it'll bubble up to whatever is calling the client's methods. So you can get fancy in the processor to throw specific error depending on what went wrong so the caller can handle each one differently. That might look something like this:

```typescript
try {
  const client = new TypedHttpClient("my-client");
  const url = new URL("https://www.somecoolwebsite.com/post-endpoint");
  // It's not necessary to tell response or data what types they'll be as it's inferred. But
  // it's added here for clarity.
  const response = await client.post<MyProcessedData>({ url }, parseMyRawData);
  return response.result;
} catch (err) {
  // UnauthorizedError would be a custom error you'd define.
  if (err instanceof UnauthorizedError) {
    // do something special
  }
  // throw the other kinds of errors that weren't handled
  throw err;
}
```

For an example of how to define a custom error, check out the `errors.ts` module in the source code.

## Revivers

To simplify the processing, you may want to try to transform some primitives into more convenient types like `Date` objects, since those can't be sent over the wire in JSON. The `JSON.parse` function accepts an argument it calls a ["reviver"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#the_reviver_parameter) that does exactly this. You can think of it like a preprocessor for the response if it's JSON.

The client allows you to pass your own reviver function along with your request options if desired. And a couple `Date`-focused revivers are provided with the client that transform [ISO 8601](https://www.w3.org/TR/NOTE-datetime) formatted strings if encountered. You can define your own using them as an example. If you wish to use them, you can import them like this:

```typescript
import {
  JsonISO8601DateReviver,
  JsonISO8601DateAndTimeReviver,
} from 'typed-http-client/JsonRevivers';
```

Note that the typing information is still unknown by the compiler, so the response processing function will still be very much in the dark until it actually checks, but this can save a bit of effort by making it easy to check things.

Here's what using them looks like:

```typescript
const client = new TypedHttpClient("my-client");
const url = new URL("https://www.somecoolwebsite.com/post-endpoint");
const requestOptions: RequestOptions = {
  url,
  responseJsonReviver: JsonISO8601DateAndTimeReviver, // right here
};

// The return type can be inferred from the response processor too!
const response = await client.post(requestOptions, parseMyRawData);
const data: MyProcessedData = response.result;
```

Of course, our `MyRawData` interface now needs to change to accomodate this update. In fact, there wouldn't be anything to do with the data if it matches up in this case, so let's just simplify things a bit and keep it to one interface:

```typescript
export interface MyData {
  someNumber: number;
  someDate: Date;
}
```

Here's how our type assertion function changes:

```typescript
function assertIsMyData(value: unknown): asserts value is MyData {
  // Check if nullish first so members can be accessed later without throwing errors.
  if (value === null || value === undefined) {
    throw new TypeError("Value is not MyRawData");
  }
  // Assign it to type any now that it is confirmed to not be nullish so the compiler doesn't
  // complain about members not existing.
  const obj: any = value;
  if (!Number.isFinite(obj.member)) {
    throw new TypeError("Value is not MyRawData");
  } else if (!obj.someDate instanceof Date) { // right here
    throw new TypeError("Value is not MyRawData");
  }
}
```

And our response processor now looks like this:

```typescript
function parseMyRawData(
  response: Response,
  responseBodyAsString: string,
  responseBodyAsObject: unknown
): MyData {
  assertIsMyData(responseBodyAsObject);
  // responseBodyAsObject is now recognized as `MyData`
  return responseBodyAsObject;
}
```

# Build and Test

## Building

```bash
npm install
npm run build
```

## Testing

```
npm run test
```
