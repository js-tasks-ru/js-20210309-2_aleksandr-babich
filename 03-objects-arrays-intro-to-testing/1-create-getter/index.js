/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const fields = path.split('.');

  return function (product) {
    let result;

    for (const field of fields) {
      if (result) {
        if (result.hasOwnProperty(field)) {
          result = result[field];
          continue;
        }

        return undefined;
      }

      if (product.hasOwnProperty(field)) {
        result = product[field];

        continue;
      }

      return undefined;
    }

    return result;
  };
}
