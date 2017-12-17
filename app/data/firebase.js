const datetime = require('./datetime.js');
const firebase = require('firebase');

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

// Roster DB
const rosterDB = firebase.database().ref('roster');

/**
 * Functions for attendance.
 */

function writeUserAttendance(fullName) {
  const btnColor = document.getElementById(fullName);
  const userStatusDB = firebase.database().ref(`attendance/${fullName}`);
  const userAttendanceDB = firebase.database().ref(`attendance/${fullName}/${datetime.date()}`);
  userStatusDB.once('value', (snapshot) => {
    const currentStatus = snapshot.val().status;
    if (currentStatus === 'in') {
      userStatusDB.update({
        status: 'out',
      });
      userAttendanceDB.update({
        departure: datetime.time(),
      });
      btnColor.style.backgroundColor = '#ff4081';
    } else {
      userStatusDB.update({
        status: 'in',
      });
      userAttendanceDB.update({
        arrival: datetime.time(),
      });
      btnColor.style.backgroundColor = '#8bc34a';
    }
  });
}

/**
 * Creates a user element.
 */
function createuserElement(username, title) {
  // Create the DOM element from the HTML.
  // Create grid
  const grid = document.createElement('div');
  grid.setAttribute('class', `user user-${username} mdl-cell mdl-cell--12-col mdl-cell--6-col-tablet mdl-cell--4-col-desktop mdl-grid mdl-grid--no-spacing`);

  // Create card
  const card = document.createElement('div');
  card.setAttribute('class', 'mdl-card mdl-shadow--2dp');

  // Create button
  const button = document.createElement('button');
  button.setAttribute('class', 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect');
  button.setAttribute('id', username)

  // Create button text
  const buttonText = document.createElement('span');

  // Structure
  button.appendChild(buttonText);
  card.appendChild(button);
  grid.appendChild(card);

  // Set values.
  buttonText.innerText = title;
  button.addEventListener('click', () => {
    writeUserAttendance(username);
  });

  return grid;
}

/**
 * Starts listening for new users and populates users lists.
 */
function startDatabaseQueries() {
  // [START recent_users_query]
  const rosterUsers = rosterDB.orderByChild('firstName');
  // [END recent_users_query]

  function fetchUsers() {
    rosterUsers.on('child_added', (snapshot) => {
      const newUser = snapshot.val();
      const userId = newUser.firstName.concat('-', newUser.lastName);
      const userTitle = newUser.firstName.concat(' ', newUser.lastName);
      const containerElement = document.getElementsByClassName('users-container')[0];
      containerElement.insertBefore(
        createuserElement(userId, userTitle),
        containerElement.firstChild,
      );
    });
  }

  // Fetching and displaying all users of each sections.
  fetchUsers();
}

startDatabaseQueries();
