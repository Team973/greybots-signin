/**
 * @file Utility Functions.
 * @author Chris Lawson
 * @copyright The Greybots 2018
 */

/**
 * Prepends a zero to the input if the input is less than 10.
 * @param {number} i An integer.
 * @returns {number} i with 0 prepended if needed.
 */
function prependZero (i) {
    let zero = i
    if (i < 10) {
        zero = `0${i}`
    }
    return zero
}

/**
 * Adds 1 to the input.
 * @param {number} i An integer.
 * @returns {number} The sum of 1 + i.
 */
function addOne (i) {
    const one = 1 + i
    return one
}

/**
 * Returns the current time in 12-hour format.
 * @returns {number} The current time in 12-hour format.
 */
function getCurrentTime () {
    const now = new Date()
    const currentTime = `${prependZero(now.getHours())}:${prependZero(now.getMinutes())}:${prependZero(now.getSeconds())}`
    return currentTime
}

/**
 * Returns the current date in mm/dd format.
 * @returns {number} The current date in mm/dd format.
 */
function getCurrentDate () {
    const now = new Date()
    const currentDate = `${prependZero(addOne(now.getMonth()))}-${prependZero(now.getDate())}-${now.getFullYear()}`
    return currentDate
}

module.exports = {
    getCurrentTime,
    getCurrentDate
}
