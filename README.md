# express-context-store

> Store data related to current request without polluting request object

[![Build Status](https://travis-ci.org/traveloka/express-context-store.svg?branch=master)](https://travis-ci.org/traveloka/express-context-store)

## Install

```sh
yarn add express-context-store
# or
npm install express-context-store
```

## Usage

```js
const express = require('express');
const context = require('express-context-store');

const app = express();
app.use(context());

app.use((req, res, next) => {
  req.context.set('key', 'value');
  next();
});

app.get('/', (req, res, next) => {
  const value = req.context.get('key');
  res.send(value);
});
```

`express-context-store` uses [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) under the hood with different API for `.get` and `.set`, so you can actually use `Map` method to `req.context`:

```js
app.get('/', (req, res, next) => {
  // you can get the size
  console.log(req.context.size);
  // or check whether key is exists
  console.log(req.context.has('key'));
  // or get iterable for all entries
  console.log(req.context.entries());
});
```

Keep in mind that the value stored inside the map is actually an object that contains the value that you provide in `.set` method. This is why we provide `.toObject` method to get the actual value from the map. See [serialization](#serialization) below

## Rewrite context values

By default, context values are meant to be read only. Any attempt to override its value will throw error, for example:

```js
app.use((req, res, next) => {
  req.context.set('a', 'b');
  req.context.set('a', 'c'); // throw error
});
```

This default behavior is implemented to prevent surprise when reading context key. If you want to change its behavior, you need to pass third option argument in `.set` method called `writable`:

```js
app.use((req, res, next) => {
  req.context.set('a', 'b', { writable: true });
  // you need to pass writable: true again if you want to modify it later
  req.context.set('a', 'c', { writable: true });
});
```

## Serialization

You can convert context store to plain javascript object by calling `.toObject` method. This is useful where you want to log current request context using JSON logger.

```js
app.use((req, res, next) => {
  const context = req.context.toObject();
  JSONLogger.log(context);
});
```

## Custom property name

If for some reason you can't use `req.context`, you can change the default property name by passing option object when creating the middleware:

```js
const context = require('express-context-store');

// use req.data instead of req.context
app.use(context({ property: 'data' }));

app.use((req, res, next) => {
  req.data.set('key', 'value');
  next();
});

app.get('/', (req, res, next) => {
  const value = req.data.get('key');
  res.send(value);
});
```

## License

MIT
