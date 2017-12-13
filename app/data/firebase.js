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

  // Create the DOM element from the HTML.
  // Create grid
  var grid = document.createElement('div');
  grid.setAttribute('class', 'user user-' + username + ' mdl-cell mdl-cell--12-col mdl-cell--6-col-tablet mdl-cell--4-col-desktop mdl-grid mdl-grid--no-spacing');

  // Create card
  var card = document.createElement('div');
  card.setAttribute('class', 'mdl-card mdl-shadow--2dp');

  // Create button
  var button = document.createElement('button');
  button.setAttribute('class', 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent')

  // Create button text
  var buttonText = document.createElement('span');
  buttonText.setAttribute('class', 'mdl-card__title-text');

  // Structure
  button.appendChild(buttonText);
  card.appendChild(button);
  grid.appendChild(card);

  // Set values.
  buttonText.innerText = title;
  button.addEventListener("click", function() {
    writeUserAttendance(username);
  });

  return grid;
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
//TODO: set default values if no values

function writeUserAttendance(fullName) {
  var userAttendanceDB = firebase.database().ref('attendance/' + fullName)
  userAttendanceDB.once('value', function(snapshot) {
    var currentStatus = snapshot.val().status;
  });
  if (currentStatus === 'in') {
    userAttendanceDB.set({
      status: 'out'
    });
  } else {
    userAttendanceDB.set({
      status: 'in'
    });
  }
}
