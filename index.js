module.exports = function createContextStore() {
  const contextStore = new Map();
  const context = new Proxy(contextStore, {
    get(obj, prop) {
      switch (prop) {
        case 'get':
          return key => {
            const data = contextStore.get(key);
            if (data) {
              return data.value;
            }
            return null;
          };
        case 'set':
          return (key, value, opts) => {
            const options = Object.assign({
              writable: false,
            }, opts);
            const existingValue = contextStore.get(key);
            if (existingValue && existingValue.readOnly) {
              throw new Error(`${key} already exist in req.context`);
            }

            contextStore.set(key, { value, readOnly: !options.writable });
          };
        default:
          return obj[prop];
      }
    },
  });

  return (req, res, next) => {
    Object.defineProperty(req, 'context', {
      value: context,
      writable: false,
      enumerable: false,
    });

    next();
  };
};
