/**
 * @file Date/time functions
 * @author Chris Lawson
 * @copyright The Greybots 2018
 */

 /**
  * Prepends a zero to the input if the input is less than 10
  * @param {number} i - An integer
  * @returns {number} - i with 0 prepended if needed
  */
function addZero(i) {
  let zero = i;
  if (i < 10) {
    zero = `0${i}`;
  }
  return zero;
}

/**
 * Adds 1 to the input
 * @param {number} i - An integer
 * @returns {number} - The sum of 1 + i
 */
function addOne(i) {
  const one = 1 + i;
  return one;
}

/**
 * Converts the input to 12-hour time
 * @param {number} i - 24-hour based time
 * @returns {number} - 12-hour based time
 */
function twelveHour(i) {
  let twelve = i;
  if (i > 12) {
    twelve -= 12;
  } else if (i === 0) {
    twelve = 12;
  }
  return twelve;
}

/**
 * Returns the current time in 12-hour format
 * @returns {number} - The current time in 12-hour format
 */
function time() {
  const now = new Date();
  const currentTime = `${twelveHour(now.getHours())}:${addZero(now.getMinutes())}`;
  return currentTime;
}

/**
 * Returns the current date in mm/dd format
 * @returns {number} - The current date in mm/dd format
 */
function date() {
  const now = new Date();
  const currentDate = `${addOne(now.getMonth())}-${now.getDate()}`;
  return currentDate;
}

module.exports = {
  time,
  date,
};
