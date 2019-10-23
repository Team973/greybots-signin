/**
 * @file User Handler.
 * @author Chris Lawson
 * @copyright The Greybots 2019
 */

import {userDB} from './authentication.js'
import {pushUserDateTime} from './spreadsheet.js'
import {getCurrentDate, getCurrentTime} from './util.js'

/**
 * Clocks in the user.
 * @param {string} user The user object from the database.
 */
function clockIn (userId) {
    const user = userDB.child(userId)
    const datetime = `${getCurrentDate()} ${getCurrentTime()}`

    console.log(`signing in ${userId} on ${datetime}`)

    user.update({
        status: 'in'
    }).then((response) => {
        console.log(`firebase clock in response: ${response}`)
    }).catch((error) => {
        console.error(`firebase clock in error: ${error}`)
        window.alert('ERROR! CONTACT CHRIS LAWSON.')
    })

    pushUserDateTime(userId, datetime)
}

/**
 * Clocks out the user.
 * @param {string} user The user object from the database.
 */
function clockOut (userId) {
    const user = userDB.child(userId)

    console.log(`signing out ${userId} at ${getCurrentDate()} ${getCurrentTime()}`)

    user.update({
        status: 'out'
    }).then((response) => {
        console.log(`firebase clock out response: ${response}`)
    }).catch((error) => {
        console.error(`firebase clock out error: ${error}`)
        window.alert('ERROR! CONTACT CHRIS LAWSON.')
    })
}

/**
 * Clocks all clocked in users out in the database.
 */
export function clockAllOut () {
    userDB.once('value').then((snapshot) => {
        console.log(`firebase clock everyone out user db response: ${snapshot}`)

        Object.keys(snapshot.val()).forEach((userId) => {
            const user = userDB.child(userId)
            user.once('value').then((snap) => {
                console.log(`firebase clock everyone out user response: ${snap}`)

                if (snap.val().status === 'in') {
                    clockOut(userId)
                }
            }).catch((error) => {
                console.error(`firebase clock everyone out user error: ${error}`)
                window.alert('ERROR! CONTACT CHRIS LAWSON.')
            })
        })
    }).catch((error) => {
        console.error(`firebase clock everyone out user db error: ${error}`)
        window.alert('ERROR! CONTACT CHRIS LAWSON.')
    })
}

/**
 * Writes the specified user's attendance to the
 * @param {string} userId The hyphenated full name of the user.
 */
function userBtnHandler (userId) {
    const user = userDB.child(userId)

    console.log(`${userId}'s button clicked'`)
    user.once('value').then((snapshot) => {
        console.log(`firebase user btn response: ${snapshot}`)
        if (snapshot.val().status === 'out') {
            clockIn(userId)
        }
    }).catch((error) => {
        console.error(`firebase user btn error ${error}`)
        window.alert('ERROR! CONTACT CHRIS LAWSON.')
    })
}

/**
 * Changes user button styling based on the user's current status.
 * @param {Object} userId firebase.DataSnapshot output for the user.
 */
function btnColorChange (userId) {
    userDB.child(userId).once('value').then((snapshot) => {
        console.log(`firebase btn color change response: ${snapshot}`)

        const btnColor = document.getElementById(`button-${userId}`)
        if (snapshot.val().status === 'in') {
            btnColor.style.backgroundColor = '#8bc34a'
            btnColor.style.color = '#ffffff'
        } else if (snapshot.val().status === 'out') {
            btnColor.style.backgroundColor = '#ff4081'
            btnColor.style.color = '#000000'
        } else {
            throw new Error('Incorrect user status.')
        }
    }).catch((error) => {
        console.error(`firebase btn color change error: ${error}`)
        window.alert('ERROR! CONTACT CHRIS LAWSON.')
    })
}

/**
 * Creates a button for the user information provided.
 * @param {string} userId The hyphenated full name of the user.
 * @param {string} title The unhyphenated full name of the user.
 * @returns {HTMLDivElement} The user's button.
 */
function createUserElement (userId, title) {
    // Create button
    const button = document.createElement('button')
    button.setAttribute(
        'class',
        'mdl-cell mdl-cell--4-col mdl-button mdl-js-button mdl-button--raised')
    button.setAttribute('id', `button-${userId}`)
    button.setAttribute(
        'style', 'font-size: 2.5vw; height: 8vh; width: 20vw; margin: 1.5vw;')

    // Set values.
    button.innerText = title
    button.addEventListener('click', () => { userBtnHandler(userId) })

    return button
}

/**
 * Fetches all user entries in the database and calls createuserElement()
 * for each user.
 */
export function fetchUsers () {
    const userList = userDB.orderByChild('firstName')
    userList.on('child_added', (snapshot) => {
        const userId = snapshot.key
        const userFirstName = snapshot.val().firstName
        const userLastName = snapshot.val().lastName
        const userTitle = `${userFirstName} ${userLastName}`
        const containerElement = document.getElementById('user-container')
        containerElement.insertBefore(
            createUserElement(userId, userTitle), containerElement.nextChild)
        btnColorChange(userId)
    })
    userList.on('child_changed', (snapshot) => {
        const userId = snapshot.key
        btnColorChange(userId)
    })
    userList.on('child_removed', (snapshot) => {
        const userId = snapshot.key
        const userElement = document.getElementById(`button-${userId}`)
        userElement.parentNode.removeChild(userElement)
    })
}

function qrcodeProcessor (code, qty) {
    
}
