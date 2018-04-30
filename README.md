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
