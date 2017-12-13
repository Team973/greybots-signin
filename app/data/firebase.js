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

// Roster DB
var rosterDB = firebase.database().ref('roster');

/**
 * Creates a user element.
 */
function createuserElement(username, title) {
  //TODO: instead of innerHTML, make this create seperate elements
  var html =
    '<div class="user user-' + username + ' mdl-cell mdl-cell--12-col mdl-cell--6-col-tablet mdl-cell--4-col-desktop mdl-grid mdl-grid--no-spacing">' +
      '<div class="mdl-card mdl-shadow--2dp">' +
        '<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onclick="writeUserAttendance(' + username.toString() + ');">' +
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
  var rosterUsers = rosterDB.orderByChild('firstName');
  // [END recent_users_query]

  var fetchUsers = function() {
    rosterUsers.on('child_added', function(snapshot) {
      var newUser = snapshot.val()
      console.log(newUser);
      var userId = newUser.firstName.concat('-', newUser.lastName);
      var userTitle = newUser.firstName.concat(' ', newUser.lastName);
      var containerElement = document.getElementsByClassName('users-container')[0];
      containerElement.insertBefore(
        createuserElement(userId, userTitle),
        containerElement.firstChild);
    });
  };

  // Fetching and displaying all users of each sections.
  fetchUsers();
}

startDatabaseQueries();


/**
 * Functions for attendance.
 */
function userAttendanceDB(fullName) {
  return firebase.database().ref('attendance/' + fullName);
};

function getUserStatus(fullName) {
  userAttendanceDB(fullName).once('child_changed', function(snapshot) {
    return snapshot.val().status;
  });
};

function writeUserAttendance(fullName) {
  if (getUserStatus(fullName) === 'in') {
    userAttendanceDB(fullName).set({
      status: 'out',
    });
  } else {
    userAttendanceDB(fullName).set({
      status: 'in',
    });
  }
}
