/**
 * @file Google Sheets Handler.
 * @author Chris Lawson
 * @copyright The Greybots 2019
 */

import { mainDB } from './authentication.js'

// Initialize spreadsheet variables
var attendanceSpreadsheetId

export function pushStudentDateTime (studentId, datetime) {
    // Read the spreadsheet id from Firebase
    mainDB.ref('attendanceSpreadsheetId').once('value').then((snapshot) => {
        console.log(`firebase response: ${snapshot}`)

        attendanceSpreadsheetId = snapshot.val()
    }, (error) => {
        console.error(`firebase error: ${error}`)
        window.alert('ERROR! CONTACT CHRIS LAWSON.')
    })

    console.log(`Pushing new data to spreadsheet: ${studentId} on ${datetime}`)
    gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: attendanceSpreadsheetId,
        range: `A2:B`,
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: [[studentId, datetime]]
        }
    }).then((response) => {
        console.log(`spreadsheet response: ${response}`)
    }).catch((error) => {
        console.error(`spreadsheet error: ${error}`)
        if (error.status === 401) {
            window.alert('ERROR WRITING TO SPREADSHEET. RELOADING!')
            window.location.reload(true)
        } else {
            window.alert('ERROR! CONTACT CHRIS LAWSON.')
        }
    })
}
