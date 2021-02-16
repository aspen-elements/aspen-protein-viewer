/**
 * The debounce function.
 *
 * @param {Function} callback - The function that needs to be debounced.
 * @param {Number} wait - The time in milliseconds to debounce.
 * @param {Boolean} isImmediate - Determines if the function should be run immediately.
 *
 * @returns {Function}
 */
export const debounce = (callback, wait = 1000, isImmediate = false) => {
  let timeoutRef

  return function (...args) {
    const context = this

    const later = function () {
      timeoutRef = null

      if (!isImmediate) {
        callback.apply(context, args)
      }
    }

    const shouldCallNow = isImmediate && !timeoutRef

    clearTimeout(timeoutRef)

    timeoutRef = setTimeout(later, wait)

    if (shouldCallNow) {
      callback.apply(context, args)
    }
  }
}

/**
 * @param {Object} domainOrganization
 * @property {string} color
 * @property {string} title
 * @property {number} startRange
 * @property {number} endRange
 *
 * @returns {Object}
 */
export const convertToDomain = ({ color, title, startRange, endRange }) => ({
  color: color.replace('#', '0X'),
  name: title,
  start: +startRange, // `+` typecasts to number
  end: +endRange,
})

/**
 * Double request animation frame.
 *
 * @param {Function} callback
 */
export const doubleRaf = callback =>
  requestAnimationFrame(() => requestAnimationFrame(callback))

/**
 * Checks whether the incoming value is empty or null.
 *
 * @param {String} value
 */
export const isEmpty = value => {
  if (typeof value === 'string') {
    return !value.trim();
  }
  return !value;
};

