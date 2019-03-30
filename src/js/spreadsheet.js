/**
 * @file Google Sheets Handler.
 * @author Chris Lawson
 * @copyright The Greybots 2019
 */

import { mainDB } from './authentication.js'

// Initialize a spreadsheet variable
var spreadsheetId

export function pushStudentActionDateTime (studentId, action, date) {
    // Read the spreadsheet id from Firebase
    mainDB.ref('spreadsheetId').once('value').then((snapshot) => {
        console.log(`firebase response: ${snapshot}`)

        spreadsheetId = snapshot.val()
    }, (error) => {
        console.error(`firebase error: ${error}`)
        window.alert('ERROR! CONTACT CHRIS LAWSON.')
    })

    console.log(`Pushing new data to spreadsheet: ${studentId} went ${action} at ${date}`)

    gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: 'Raw Attendance',
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: [[studentId, action, date]]
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
