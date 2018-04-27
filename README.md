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
})
```

## License

MIT
