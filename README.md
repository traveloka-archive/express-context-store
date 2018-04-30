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

## License

MIT
