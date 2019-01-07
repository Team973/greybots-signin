var token = '<LEGACY FIREBASE SECRET>';                                                        // legacy database secret
var database = FirebaseApp.getDatabaseByUrl('https://greybots-signin.firebaseio.com/', token); // Create a hook to Firebase
var spreadsheetId = '1GssDxqWyccwi3n3ssnE4bHsYJyj_NryUl2IQKxFvgTM';                            // SpreadsheetId, REPLACE EVERY YEAR
var spreadsheet = SpreadsheetApp.openById(spreadsheetId);                                      // Replace for every new roster

// Main function used to sync students from the roster spreadsheet to the Greybots Signin System hosted on Firebase
function syncDatabase() {
  Logger.log('Syncing students w/ Firebase...');
  const studentSheet = spreadsheet.getSheetByName("Students");      // Reference tab for accepted students
  const rosterStudents = studentSheet.getRange('A2:B').getValues(); // Get accepted students information        
  const databaseStudents = database.getData('students');            // Reference Firebase

  // Update the spreadsheet key
  database.updateData('', {
    spreadsheetId: spreadsheetId,
  });

  // Go through all the students in the spreadsheet
  for (var i in rosterStudents) {
    var rosterFirstName = rosterStudents[i][0]; // Student first name
    var rosterLastName = rosterStudents[i][1];  // Student last name

    if (rosterFirstName != '' && rosterLastName != '') {
      // If the student doesn't exist in Firebase, add them
      if (database.getData('students/' + rosterFirstName + '-' + rosterLastName) === null) {
        Logger.log('Adding ' + rosterFirstName + '-' + rosterLastName + ' to Firebase');

        // Create a new key firstName-lastName containing student information
        database.setData('students/' + rosterFirstName + '-' + rosterLastName, {
          firstName: rosterFirstName,          // Student first name
          lastName: rosterLastName,            // Student last name
          status: 'out',                       // Default student to not in shop
        });
      }
    }
  }

  // Go through all the students in Firebase
  for (var i in databaseStudents) {
    var found = false;

    // Go through all the students in the spreadsheet
    for (var j in rosterStudents) {
      var rosterFirstName = rosterStudents[j][0];            // Roster student first name
      var rosterLastName = rosterStudents[j][1];             // Roster student last name
      var databaseFirstName = databaseStudents[i].firstName; // Firebase student first name
      var databaseLastName = databaseStudents[i].lastName;   // Firebase student last name

      // If student is in Firebase and the spreadsheet, mark them as found
      if (databaseFirstName + databaseLastName === rosterFirstName + rosterLastName) {
        Logger.log('Found ' + databaseFirstName + '-' + databaseLastName + ', not removing');
        found = true;
      }
    }

    // If student isn't found, remove them
    if (found === false) {
      Logger.log('Removing ' + databaseFirstName + '-' + databaseLastName + ' from Firebase');
      database.removeData('students/' + databaseFirstName + '-' + databaseLastName);
    }
  }
}