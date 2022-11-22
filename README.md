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

Let's start with the meat of it. What's it like to use the results? Importing looks like this:

```typescript
import { TypedHttpClient } from 'typed-http-client';
```

Now let's take a peak at how it'll look in your code if you need to send a `POST` request to a particular endpoint that sends back some simple JSON data:

```typescript
const client = new TypedHttpClient("my-client");
const url = new URL("https://www.somecoolwebsite.com/post-endpoint");
// It's not necessary to tell response or data what types they'll be as it's inferred. But
// it's added here for clarity.
const response: ITypedResponse<MyProcessedData> = await client.post<MyProcessedData>({ url }, parseMyRawData);
const data: MyProcessedData = response.result;
```

You might have some questions, so let's go through it and how you can get to this point by working backwards.

`client` is the HTTP client itself. Nothing fancy, except for `"my-client"` which is just the user agent that the client will be using. You can put whatever you want in there.

`url` is the `URL` object that contains the information about where to make the request to. It's built in to JavaScript, so nothing to worry about there.

Let's look at that third line of code without the explicit typing (it can be inferred based on the arguments passed anyway):

```typescript
const response = await client.post({ url }, parseMyRawData);
```

Ultimately each, every request you make with the client needs to provide the `RequestOptions` where how to make the request (here it's just `{ url }`, but there's more options available), and a processing function that takes the raw response from the server and returns back out the data you want. You can see that response processing function, `parseMyRawData`, being passed as the second argument to the `post` method. In this case, we'll (hopefully) be receiving this in the response back from the server:

```typescript
export interface MyRawData {
  someNumber: number;
  someDate: string; // this is the field we wanna transform
}
```

And we'll be using the response processor to turn it into this:

```typescript
export interface MyProcessedData {
  someNumber: number;
  someDate: Date; // this is the field that changed
}
```

We'll be turning that string field, `someDate` (which should be in ISO 8601 format), into a `Date` object.

Of course, things can easily go wrong when working over a network, so we might not actually be getting back data in the shape of `MyRawData`. It might not even be a normal object with keys and stuff! It could just be a `string`, `null`, or even `undefined`! The client will grab JSON and provide it to the response processor if it can find any, but we can't know ahead of time what we'll be getting, so we have to cover our bases.

To do that, let's define our response processing function, `parseMyRawData`:

```typescript
function parseMyRawData({
  response,
  responseBodyAsString,
  responseBodyAsObject,
}: ResponseProcessorParams): MyProcessedData {
  assertIsMyRawData(responseBodyAsObject);
  // responseBodyAsObject is now recognized as `MyRawData`
  return {
    someNumber: responseBodyAsObject.someNumber,
    someDate: new Date(responseBodyAsObject.someDate),
  };
}
```

You probably already have more questions, so let's break this one down too. The three arguments to the function are what the client provides to all response processing functions.

The first is the full `Response` object. It's exactly what the client is working with when it gets a response back from the server.

The second is the response body as a string, with no processing done to it. It could very well be stringified JSON.

The third is the response body as an object. It'll try to parse JSON responses if the headers indicate it's JSON, but it doesn't know what that'll look like, and if there's no headers telling it there's JSON, it won't try. That's why its type is `unknown`. It could be an object, `null`, `undefined`, a `string`, or a number of other things, so we have to be careful with it.

That's where the [type assertion function](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions), `assertIsMyRawData`, comes in. Type assertion functions can take arguments and confirm for you (by not throwing an error) that something is a particular type. If it throws an error, it definitely isn't that type of data, but it is a real error that'll break the flow of the code so be careful with these. Then again, the errors can be a very powerful tool when combined with `try/catch` blocks.

For now, let's look at `assertIsMyRawData` to see how it works:

```typescript
function assertIsMyRawData(value: unknown): asserts value is MyRawData {
  if (!isObject(value)) {
    throw new TypeError("Value is not MyRawData");
  } else if (!hasProperty(value, "someNumber") || !Number.isFinite(value.someNumber)) {
    throw new TypeError("Value is not MyRawData");
  } else if (!hasProperty(value, "someDate") || typeof value.someDate !== "string") {
    throw new TypeError("Value is not MyRawData");
  }
}
```

It's important that it's recognized as `unknown` first. This is because it's "illegal" to perform any operations on anything of type `unknown`. Everything should be assumed to be `unknown` unless we can confirm otherwise for maximum type safety.

Another risk is that `null` and `undefined` are "nullish", which means that if we try to reference a property on them, a `TypeError` will be thrown. There's also an issue with the fact that [the type of `null` is actually `object`](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#typeof-type-guards). We could use `!value` to narrow the typing quite a lot, but TypeScript gets confused as this, and thinks it would otherwise be of type `{}`, even if `value` was `true`. Luckily the client comes with a type predicate to make this a little more covenient.

Even though we've ruled out errors being thrown when trying to access properties, the compiler will still complain about referencing properties it doesn't know are there. `hasProperty` (provided by `typed-http-client`) tells the compiler that the property exists, but the property type is still `unknown`.

Once the property is confirmed to exist, we can check its type, and repeat the process for the other property. If it makes it through without throwing an error, then it's all good!

Once this is executed, it tells the rest of the code in `parseMyRawData` that the variable is in fact of type `MyRawData`, so the only thing left to do is change that `someDate` field and return the result as type `MyProcessedData`.

It's also important to note that, in this case, the type assertion function is where we need to be careful, because there's nothing inherently making sure we're checking everything we should to figure out if the incoming data is `MyRawData`. The function could be completely empty and we would be none the wiser.

With all that covered, though, we're done. The result of the `post` method will be an object that contains a reference to the object returned by our response processing function, along with references to a few other things that might be helpful in more advanced use cases.

### Payloads

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

Errors can be thrown at any point in the response processor and they'll bubble up to whatever is calling the client's methods. So you can get fancy in the processor to throw specific error depending on what went wrong so the caller can handle each one differently. That might look something like this:

```typescript
try {
  const client = new TypedHttpClient("my-client");
  const url = new URL("https://www.somecoolwebsite.com/post-endpoint");
  const response = await client.post({ url }, parseMyRawData);
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

To simplify the processing before it reaches your response processor, you may want to try to transform some primitives into more convenient types like `Date` objects, since those can't be sent over the wire in JSON. The `JSON.parse` function accepts an argument it calls a ["reviver"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#the_reviver_parameter) that does exactly this. You can think of it like a preprocessor for the response if it's JSON.

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
  // We only want objects.
  if (!isObject(value)) {
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
