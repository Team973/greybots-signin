/**
 * @file All i/o from firebase resides here
 * @author Chris Lawson
 * @copyright The Greybots 2018
 */

const util = require('./util.js');
// Firebase App is always required and must be first
const firebase = require('firebase/app');

// Add additional services that you want to use
require('firebase/auth');
require('firebase/database');

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyDnrZ8l94mfVYyzugwDYwQ3lOv5zsM7Cps',
  authDomain: 'greybots-signin.firebaseapp.com',
  databaseURL: 'https://greybots-signin.firebaseio.com',
  projectId: 'greybots-signin',
  storageBucket: 'greybots-signin.appspot.com',
  messagingSenderId: '29179813690',
};
firebase.initializeApp(config);

// main DB
const mainDB = firebase.database().ref('attendance');

/**
 * Handles the sign in button press.
 */
function toggleSignIn() {
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
    location = location;
  } else {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (email.length < 4) {
      alert('Please enter an email address.');
      return;
    }
    if (password.length < 4) {
      alert('Please enter a password.');
      return;
    }
    // Sign in with email and pass.
    firebase.auth().signInWithEmailAndPassword(email, password).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
      }
    });
  }
}

/**
 * Shows the dialog for signing in to the database.
 */
function showAccountDialog() {
  const accountDialog = document.getElementById('account-dialog');
  const actionBtn = document.getElementById('account-dialog-action');
  const closeBtn = document.getElementById('account-dialog-close');
  accountDialog.showModal();

  closeBtn.addEventListener('click', () => {
    accountDialog.close();
  });
  actionBtn.addEventListener('click', () => {
    toggleSignIn();
  });
}

/**
 * Shows the dialog for clocking someone out.
 * @param {string} userId The hyphenated full name of the user.
 */
function showClockOutDialog(userId) {
  const warnDialog = document.getElementById('warn-dialog');
  const continueBtn = document.getElementById('warn-dialog-continue');
  const closeBtn = document.getElementById('warn-dialog-close');
  const user = mainDB.child(userId);
  const userAttendance = user.child(util.getCurrentDate());
  warnDialog.showModal();

  closeBtn.addEventListener('click', () => {
    warnDialog.close();
  });
  continueBtn.addEventListener('click', () => {
    user.update({
      status: 'out',
    });
    userAttendance.update({
      departure: util.getCurrentTime(),
    });
    warnDialog.close();
  });
}

/**
 * Writes the specified user's attendance to the database.
 * @param {string} userId The hyphenated full name of the user.
 */
function userBtnHandler(userId) {
  const user = mainDB.child(userId);
  const userAttendance = user.child(util.getCurrentDate());
  user.once('value', (snapshot) => {
    const userStatus = snapshot.val().status;
    if (userStatus === 'in') {
      showClockOutDialog(userId);
    } else {
      user.update({
        status: 'in',
      });
      userAttendance.update({
        arrival: util.getCurrentTime(),
      });
    }
  });
}

/**
 * Clocks all clocked in users out in the database
 */
document.getElementById('clock-everyone-out').onclick = () => {
  mainDB.once('value', (snapshot) => {
    Object.keys(snapshot.val()).forEach((key) => {
      const user = mainDB.child(key);
      const userAttendance = user.child(util.getCurrentDate());
      user.once('value', (snap) => {
        const userStatus = snap.val().status;
        if (userStatus === 'in') {
          user.update({
            status: 'out',
          });
          userAttendance.update({
            departure: util.getCurrentTime(),
          });
        }
      });
    });
  });
};

/**
 * Changes user button styling based on the user's current status
 * @param {Object} snapshot firebase.database.DataSnapshot output for the user
 */
function btnColorChange(snapshot) {
  const userStatus = snapshot.val().status;
  const btnColor = document.getElementById(snapshot.key);
  if (userStatus === 'in') {
    btnColor.style.backgroundColor = '#8bc34a';
    btnColor.style.color = '#ffffff';
  } else if (userStatus === 'out') {
    btnColor.style.backgroundColor = '#ff4081';
    btnColor.style.color = '#000000';
  }
}

/**
 * Creates a button for the user information provided
 * @param {string} userId - The hyphenated full name of the user
 * @param {string} title - The unhyphenated full name of the user
 * @returns {HTMLDivElement} grid - The div for the grid with all the buttons
 */
function createUserElement(userId, title) {
  // Create the DOM element from the HTML.
  // Create grid
  const grid = document.createElement('div');
  grid.setAttribute('class', `user user-${userId} mdl-cell mdl-cell--12-col mdl-cell--6-col-tablet mdl-cell--4-col-desktop mdl-grid mdl-grid--no-spacing`);

  // Create card
  const card = document.createElement('div');
  card.setAttribute('class', 'mdl-card mdl-shadow--2dp');

  // Create button
  const button = document.createElement('button');
  button.setAttribute('class', 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect');
  button.setAttribute('id', userId);

  // Create button text
  const buttonText = document.createElement('span');

  // Structure
  button.appendChild(buttonText);
  card.appendChild(button);
  grid.appendChild(card);

  // Set values.
  buttonText.innerText = title;
  button.addEventListener('click', () => {
    userBtnHandler(userId);
  });

  return grid;
}

const userList = mainDB.orderByChild('firstName');

/**
 * Fetches all user entries in the database and calls createUserElement() for each user.
 */
function fetchUsers() {
  userList.on('child_added', (snapshot) => {
    const currentUser = snapshot.key;
    const userTitle = currentUser.replace('-', ' ');
    const containerElement = document.getElementById('users-container');
    containerElement.insertBefore(
      createUserElement(currentUser, userTitle),
      containerElement.nextChild,
    );
  });
}

/**
 * Listens to all users and calls btnColorChange() to match button color with the user's status.
 */
function fetchBtnColor() {
  userList.on('child_added', (snapshot) => {
    btnColorChange(snapshot);
  });
  userList.on('child_changed', (snapshot) => {
    btnColorChange(snapshot);
  });
}

/**
 * Create date/time in options.
 */
function startDateTime() {
  document.getElementById('datetime').innerHTML = `${util.getCurrentDate()} ${util.getCurrentTime()}`;
  setTimeout(() => {
    startDateTime();
  }, 100);
}

function initApp() {
  // Listening for auth state changes.
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      document.getElementById('account-dialog-action').textContent = 'Sign out';
      fetchUsers();
      fetchBtnColor();
    } else {
      // User is signed out.
      document.getElementById('account-dialog-action').textContent = 'Sign in';
      showAccountDialog();
    }
  });
  document.getElementById('show-account-dialog').addEventListener('click', () => {
    showAccountDialog();
  });
  startDateTime();
}

window.onload = () => {
  initApp();
};
