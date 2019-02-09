/**
 * @file Google Sheets Handler.
 * @author Chris Lawson
 * @copyright The Greybots 2019
 */

import { mainDB } from './authentication.js'

// Initialize a spreadsheet variable
var spreadsheetId

export function pushStudentActionDateTime (studentId, action, date, time) {
    // Read the spreadsheet id from Firebase
    mainDB.ref('spreadsheetId').once('value').then((snapshot) => {
        spreadsheetId = snapshot.val()
    }, (error) => {
        console.error(error)
    })

    console.log(`Pushing new data to spreadsheet: ${studentId} went ${action} on ${date} at ${time}`)

    gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: 'Raw Attendance',
        valueInputOption: 'RAW',
        resource: {
            values: [[studentId, action, date, time]]
        }
    }).then((response) => {
        console.log(`spreadsheet response: ${response}`)
    }).catch((error) => {
        console.error(error)
    })
}
