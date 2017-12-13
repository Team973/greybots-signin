const datetime = require('./datetime.js');
const firebase = require('firebase');

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDnrZ8l94mfVYyzugwDYwQ3lOv5zsM7Cps",
  authDomain: "greybots-signin.firebaseapp.com",
  databaseURL: "https://greybots-signin.firebaseio.com",
  projectId: "greybots-signin",
  storageBucket: "greybots-signin.appspot.com",
  messagingSenderId: "29179813690"
};
firebase.initializeApp(config);

// Shortcuts to DOM Elements.
var rosterUserSection = document.getElementById('roster-user-list');

// Database refs
var roster = firebase.database().ref('roster');
var userAttendance = firebase.database().ref('attendance');

/**
 * Creates a user element.
 */
function createuserElement(userId, title) {

  var html =
    '<div class="user user-' + userId + ' mdl-cell mdl-cell--12-col mdl-cell--6-col-tablet mdl-cell--4-col-desktop mdl-grid mdl-grid--no-spacing">' +
      '<div class="mdl-card mdl-shadow--2dp">' +
        '<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onclick="location.reload();">' +
          '<span class="mdl-card__title-text"></span>' +
        '</button>' +
      '</div>' +
    '</div>';

  // Create the DOM element from the HTML.
  var div = document.createElement('div');
  div.innerHTML = html;
  var userElement = div.firstChild;

  // Set values.
  userElement.getElementsByClassName('mdl-card__title-text')[0].innerText = title;

  return userElement;
}

/**
 * Starts listening for new users and populates users lists.
 */
function startDatabaseQueries() {
  // [START recent_users_query]
  var rosterUsers = roster.orderByChild('firstName');
  // [END recent_users_query]

  var fetchUsers = function() {
    rosterUsers.on('child_added', function(snapshot) {
      var newUser = snapshot.val()
      var userTitle = newUser.firstName + ' ' + newUser.lastName;
      var containerElement = document.getElementsByClassName('users-container')[0];
      containerElement.insertBefore(
        createuserElement(newUser.key, userTitle),
        containerElement.firstChild);
    });
    rosterUsers.on('child_changed', function(snapshot) {
      var newUser = snapshot.val()
      var userTitle = newUser.firstName + ' ' + newUser.lastName;
      var containerElement = document.getElementsByClassName('users-container')[0];
      var userElement = containerElement.getElementsByClassName('user-' + newUser.key)[0];
      userElement.getElementsByClassName('mdl-card__title-text')[0].innerText = userTitle;
    });
    rosterUsers.on('child_removed', function(snapshot) {
      var newUser = snapshot.val()
      var containerElement = document.getElementsByClassName('users-container')[0];
      var user = containerElement.getElementsByClassName('user-' + newUser.key)[0];
      user.parentElement.removeChild(user);
    });
  };

  // Fetching and displaying all users of each sections.
  fetchUsers();
}

startDatabaseQueries();

function writeUserAttendance(fullName, action) {
  if (action === 'signIn') {
    database.ref(`attendance/${datetime.date()}/${fullName}`).set({
      arrival: datetime.time(),
    });
  }
  if (action === 'signOut') {
    database.ref(`attendance/${datetime.date()}/${fullName}`).set({
      departure: datetime.time(),
    });
  }
}
