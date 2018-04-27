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
  expect(() => req.context.set('key', 'another')).toThrow('key already exist in req.context');
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
  expect(() => req.context.set('key', 'different', { writable: true })).toThrow('key already exist in req.context');
});
