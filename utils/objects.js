/**
 * Check if object is empty or not.
 *
 * @param {Object} object
 */
export const isObjectEmpty = object => {
  return (
    !object ||
    (Object.entries(object).length === 0 && object.constructor === Object)
  )
}

/**
 * Checks if objects are equal
 *
 * @param {Object} first
 * @param {Object} second
 * @returns {Boolean}
 */
export const areObjectsEqual = (first, second) => {
  return Object.entries(first).every(entry => {
    if (typeof first[entry[0]] === 'object') {
      return (
        JSON.stringify(first[entry[0]]) === JSON.stringify(second[entry[0]])
      )
    }
    return first[entry[0]] === second[entry[0]]
  })
}

