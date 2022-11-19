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

For example, you may be able to recognize when a login attempt failed because of invalid credentials and throw an `InvalidCredentialsError`.

# Getting Started

### Installation

```bash
npm install --save typed-http-client
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
