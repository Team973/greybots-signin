/**
 * @file Application initializer.
 * @author Chris Lawson
 * @copyright The Greybots 2018
 */

const database = require('./firebase.js');
const users = require('./users.js');
const util = require('./util.js');

/**
 * Create date/time info.
 */
function startDateTime() {
  "use strict";
  document.getElementById('datetime').innerHTML = `${util.getCurrentDate()} ${util.getCurrentTime()}`;
  setTimeout(() => {
    startDateTime();
  }, 100);
}

function initApp() {
  "use strict";
  // Listening for auth state changes.
  database.auth.onAuthStateChanged((user) => {
    if (user) {
      document.getElementById('account-dialog-action').textContent = 'Sign out';
      users.fetchUsers();
    } else {
      // User is signed out.
      document.getElementById('account-dialog-action').textContent = 'Sign in';
      database.showAccountDialog();
    }
  });
  document.getElementById('show-account-dialog').addEventListener('click', () => {
    database.showAccountDialog();
  });
  startDateTime();
}

window.onload = () => {
  "use strict";
  initApp();
};
