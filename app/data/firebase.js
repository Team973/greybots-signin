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

// main DB
const mainDB = firebase.database().ref('attendance');

/**
 * Functions for attendance.
 */

function writeUserAttendance(userId) {
  const btnColor = document.getElementById(userId);
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
 * Functions for UI look and feel.
 */

 function btnColorChange(snapshot){
   const currentUserInfo = snapshot.val();
   const currentUserStatus = currentUserInfo.status;
   const btnColor = document.getElementById(snapshot.key);
   if (currentUserStatus === 'in') {
     btnColor.style.backgroundColor = '#8bc34a';
   } else {
     btnColor.style.backgroundColor = '#ff4081';
   }
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
  button.setAttribute('id', username);

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
  const userList = mainDB.orderByChild('firstName');
  // [END recent_users_query]

  function fetchUsers() {
    userList.on('child_added', (snapshot) => {
      const currentUser = snapshot.key;
      const userTitle = currentUser.replace('-', ' ');
      const containerElement = document.getElementsByClassName('users-container')[0];
      containerElement.insertBefore(
        createuserElement(currentUser, userTitle),
        containerElement.firstChild,
      );
      mainDB.child(currentUser).update({
        status: 'out',
      });
    });
  }

  function fetchBtnColor() {
    userList.on('child_added', (snapshot) => {
      btnColorChange(snapshot);
    });
    userList.on('child_changed', (snapshot) => {
      btnColorChange(snapshot);
    }
  )
  }

  // Fetching and displaying all users of each sections.
  fetchUsers();
  fetchBtnColor();
}

startDatabaseQueries();
