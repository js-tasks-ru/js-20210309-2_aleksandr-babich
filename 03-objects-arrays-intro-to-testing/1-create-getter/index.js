/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const fields = path.split('.');

  return function (product) {
    let result = product;

    for (const field of fields) {
      if (result.hasOwnProperty(field)) {
        result = result[field];
        continue;
      }

      return;
    }

    return result;
  };
}
