/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  if (!['asc', 'desc'].includes(param)) {
    return arr;
  }
  function compareStrings(str1, str2) {
    return str1.localeCompare(str2, ['ru', 'en'], {caseFirst: "upper"});
  }
  return [...arr].sort((a, b) => param === "asc" ? compareStrings(a, b) : compareStrings(b, a));
}
