module.exports = function createContextStore(opts) {
  const options = Object.assign({ property: 'context' }, opts);
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
            const options = Object.assign(
              {
                writable: false,
              },
              opts
            );
            const existingValue = contextStore.get(key);
            if (existingValue && existingValue.readOnly) {
              throw new Error(`${key} already exist in req.context`);
            }

            contextStore.set(key, { value, readOnly: !options.writable });
          };
        case 'toObject':
          return () =>
            Array.from(contextStore.entries()).reduce(
              (result, [key, value]) =>
                Object.assign(result, { [key]: value.value }),
              {}
            );
        default: {
          const value = contextStore[prop];
          return typeof value === 'function' ? value.bind(contextStore) : value;
        }
      }
    },
  });

  return (req, res, next) => {
    Object.defineProperty(req, options.property, {
      value: context,
      writable: false,
      enumerable: false,
    });

    next();
  };
};
