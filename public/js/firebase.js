/**
 * @file Firebase Handler.
 * @author Chris Lawson
 * @copyright The Greybots 2018
 */

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
const auth = firebase.auth();

/**
 * Handles the sign in button press.
 */
function toggleSignIn() {
  "use strict";
  if (auth.currentUser) {
    auth.signOut();
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
    auth.signInWithEmailAndPassword(email, password).catch((error) => {
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
  "use strict";
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

module.exports = {
  mainDB,
  auth,
  showAccountDialog,
};
