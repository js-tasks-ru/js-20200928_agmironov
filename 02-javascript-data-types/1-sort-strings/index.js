/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {

  function inverseCase(str) {
    let result = "";
    for (let char of str) {
      const isUpper = char.toUpperCase() === char;
      result += isUpper ? char.toLowerCase() : char.toUpperCase();
    }
    return result;
  }

  function compareStrings(str1, str2) {
    // Потому что производительность - не главное)
    return inverseCase(str1).localeCompare(inverseCase(str2), "ru");
  }

  return [...arr].sort((a, b) => param === "asc" ? compareStrings(a, b) : compareStrings(b, a));
}
