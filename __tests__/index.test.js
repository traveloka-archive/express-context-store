/* eslint-env jest */
const createMiddleware = require('../');

test('call next inside middleware', () => {
  const req = {};
  const res = {};
  const next = jest.fn();
  const middleware = createMiddleware();
  middleware(req, res, next);

  expect(next).toHaveBeenCalledTimes(1);
});

test('provide Map-like API in req.context', () => {
  const req = {};
  const res = {};
  const next = jest.fn();
  const middleware = createMiddleware();
  middleware(req, res, next);

  expect(req.context.get('key')).toBe(null);
  req.context.set('key', 'value');
  expect(req.context.get('key')).toBe('value');
});

test('throw error if context is written multiple times', () => {
  const req = {};
  const res = {};
  const next = jest.fn();
  const middleware = createMiddleware();
  middleware(req, res, next);

  req.context.set('key', 'value');
  const fn = () => req.context.set('key', 'another');
  expect(fn).toThrow('key already exist in req.context');
});

test('allow key to be written multiple times explicitly', () => {
  const req = {};
  const res = {};
  const next = jest.fn();
  const middleware = createMiddleware();
  middleware(req, res, next);

  req.context.set('key', 'value', { writable: true });
  expect(req.context.get('key')).toBe('value');

  req.context.set('key', 'another', { writable: true });
  expect(req.context.get('key')).toBe('another');

  req.context.set('key', 'different', { writable: true });
  expect(req.context.get('key')).toBe('different');
});

test('require writable option to be provided for multiple write', () => {
  const req = {};
  const res = {};
  const next = jest.fn();
  const middleware = createMiddleware();
  middleware(req, res, next);

  req.context.set('key', 'value', { writable: true });
  req.context.set('key', 'another');
  const fn = () => req.context.set('key', 'different', { writable: true });
  expect(fn).toThrow('key already exist in req.context');
});

test('provides toObject method for serialization', () => {
  const req = {};
  const res = {};
  const next = jest.fn();
  const middleware = createMiddleware();
  middleware(req, res, next);

  req.context.set('a', 'b');
  req.context.set('c', { d: 'e' });
  req.context.set('f', ['g', 'h']);
  req.context.set('i', 1);
  req.context.set('j', true);

  const object = req.context.toObject();
  const expectedObject = {
    a: 'b',
    c: {
      d: 'e',
    },
    f: ['g', 'h'],
    i: 1,
    j: true,
  };
  expect(object).toEqual(expectedObject);
});

test('fallback to Map for unknown getter', () => {
  const req = {};
  const res = {};
  const next = jest.fn();
  const middleware = createMiddleware();
  middleware(req, res, next);

  req.context.set('key', 'value');
  expect(req.context.size).toBe(1);
  expect(req.context.has('key')).toBe(true);

  // conversion to iterable
  expect(Array.from(req.context.keys())).toMatchSnapshot('.keys()');
  expect(Array.from(req.context.values())).toMatchSnapshot('.values()');
  expect(Array.from(req.context.entries())).toMatchSnapshot('.entries()');

  req.context.delete('key');
  expect(req.context.size).toBe(0);
});

test('custom property name', () => {
  const req = {};
  const res = {};
  const next = jest.fn();
  const middleware = createMiddleware({ property: 'data' });
  middleware(req, res, next);

  expect(req.context).not.toBeDefined();

  req.data.set('key', 'value');
  expect(req.data.get('key')).toBe('value');
});
