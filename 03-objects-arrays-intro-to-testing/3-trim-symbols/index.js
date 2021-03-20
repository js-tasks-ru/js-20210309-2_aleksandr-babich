/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === undefined) {
    return string;
  }

  if (Number.parseInt(size) === 0) {
    return '';
  }

  let result = '';
  let counter = 1;

  for (let i = 0; i < string.length; i++) {
    if (string[i - 1] !== string[i]) {
      counter = 1;
    }

    if (counter <= size) {
      result += string[i];
      counter++;

      continue;
    }

    if (string[i - 1] === string[i]) {
      counter++;

      continue;
    }

    counter = 1;
  }

  return result;
}
