/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === 0 || string === "") {
    return "";
  }

  if (size === undefined) {
    return string;
  }

  const result = [];
  string.split("").reduce(
    (count, curSym) => {
      const curSymEqualsLastSym = result.length > 0 ? curSym === result[result.length - 1] : false;
      if (count < size || !curSymEqualsLastSym) {
        result.push(curSym);
        if (!curSymEqualsLastSym) {
          return 1;
        }
      }
      return count + 1;
    },
    0
  );

  return result.join("");
}
