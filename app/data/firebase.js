/**
 * @file All i/o from firebase resides here
 * @author Chris Lawson
 * @copyright The Greybots 2018
 */

const datetime = require('./datetime.js');
const firebase = require('firebase-admin');

// Initialize Firebase
try {
  firebase.initializeApp({
    credential: firebase.credential.cert({
      projectId: 'greybots-signin',
      clientEmail: process.env.clientEmail,
      privateKey: process.env.privateKey,
    }),
    databaseURL: 'https://greybots-signin.firebaseio.com',
  });
} catch (err) {
  // This section is for authenticating on a developer environment
  const serviceAccount = require('./greybots-signin-firebase-adminsdk-jnm12-ac279eb3f2.json'); // Ask Chris for this file
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: 'https://greybots-signin.firebaseio.com',
  });
}

// main DB
const mainDB = firebase.database().ref('attendance');

/**
 * Writes the specified user's attendance to the database
 * @param {string} userId - The hyphenated full name of the user
 */
function writeUserAttendance(userId) {
  const user = mainDB.child(userId);
  const userAttendance = user.child(datetime.date());
  user.once('value', (snapshot) => {
    const currentStatus = snapshot.val().status;
    if (currentStatus === 'in') {
      user.update({
        status: 'out',
      });
      userAttendance.update({
        departure: datetime.time(),
      });
    } else {
      user.update({
        status: 'in',
      });
      userAttendance.update({
        arrival: datetime.time(),
      });
    }
  });
}

/**
 * Signs all signed in users out in the database
 */
function signEveryoneOut() {
  mainDB.once('value', (snapshot) => {
    Object.keys(snapshot.val()).forEach((key) => {
      const user = mainDB.child(key);
      const userAttendance = user.child(datetime.date());
      user.once('value', (snap) => {
        const userStatus = snap.val().status;
        if (userStatus === 'in') {
          user.update({
            status: 'out',
          });
          userAttendance.update({
            departure: datetime.time(),
          });
        }
      });
    });
  });
}

/**
 * Changes user button styling based on the user's current status
 * @param {Object} snapshot - firebase.database.DataSnapshot output for the user
 */
function btnColorChange(snapshot) {
  const currentUserInfo = snapshot.val();
  const currentUserStatus = currentUserInfo.status;
  const btnColor = document.getElementById(snapshot.key);
  if (currentUserStatus === 'in') {
    btnColor.style.backgroundColor = '#8bc34a';
    btnColor.style.color = '#ffffff';
  } else if (currentUserStatus === 'out') {
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
    writeUserAttendance(userId);
  });

  return grid;
}

/**
 * Starts listening for new users and populates users lists.
 */
function startDatabaseQueries() {
  const userList = mainDB.orderByChild('firstName');

  /**
   * Fetches all user entries in the database and calls createUserElement() for each user
   */
  function fetchUsers() {
    userList.on('child_added', (snapshot) => {
      const currentUser = snapshot.key;
      const userTitle = currentUser.replace('-', ' ');
      const containerElement = document.getElementsByClassName('users-container')[0];
      containerElement.insertBefore(
        createUserElement(currentUser, userTitle),
        containerElement.nextChild,
      );
    });
  }

  /**
   * Listens to all users and calls btnColorChange() to match button color with the user's status
   */
  function fetchBtnColor() {
    userList.on('child_added', (snapshot) => {
      btnColorChange(snapshot);
    });
    userList.on('child_changed', (snapshot) => {
      btnColorChange(snapshot);
    });
  }

  // Fetching and displaying all users of each sections.
  fetchUsers();
  fetchBtnColor();
}

startDatabaseQueries();
