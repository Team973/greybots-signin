/**
 * @file User Handler.
 * @author Chris Lawson
 * @copyright The Greybots 2018
 */

import { userDB, dateDB, nameDB } from '../database.js'
import { getCurrentTime, getCurrentDate } from '../util.js'

/**
 * Clocks in the user.
 * @param {string} user The user object from the
 */
function clockIn (userId) {
    const user = userDB.child(userId)
    const userDateAttendance = dateDB.child(getCurrentDate()).child(userId)
    const userNameAttendance = nameDB.child(userId).child(getCurrentDate())
    user.update({
        status: 'in'
    })
    userNameAttendance.update({
        arrival: getCurrentTime()
    })
    userDateAttendance.update({
        arrival: getCurrentTime()
    })
}

/**
 * Clocks out the user.
 * @param {string} user The user object from the database.
 */
function clockOut (userId) {
    const user = userDB.child(userId)
    const userDateAttendance = dateDB.child(getCurrentDate()).child(userId)
    const userNameAttendance = nameDB.child(userId).child(getCurrentDate())
    user.update({
        status: 'out'
    })
    userNameAttendance.update({
        departure: getCurrentTime()
    })
    userDateAttendance.update({
        departure: getCurrentTime()
    })
}

/**
 * Shows the dialog for clocking someone out.
 * @param {string} userId The hyphenated full name of the user.
 */
function showClockOutDialog (userId) {
    const warnDialog = document.getElementById('warn-dialog')
    const continueBtn = document.getElementById('warn-dialog-continue')
    const closeBtn = document.getElementById('warn-dialog-close')
    warnDialog.showModal()

    closeBtn.addEventListener('click', () => {
        warnDialog.close()
    })
    continueBtn.addEventListener('click', () => {
        clockOut(userId)
        warnDialog.close()
    })
}

/**
 * Writes the specified user's attendance to the
 * @param {string} userId The hyphenated full name of the user.
 */
function userBtnHandler (userId) {
    const user = userDB.child(userId)
    user.once('value', (snapshot) => {
        if (snapshot.val().status === 'in') {
            showClockOutDialog(userId)
        } else {
            clockIn(userId)
        }
    })
}

/**
 * Clocks all clocked in users out in the database
 */
document.getElementById('clock-everyone-out').onclick = () => {
    userDB.once('value', (snapshot) => {
        Object.keys(snapshot.val()).forEach((userId) => {
            const user = userDB.child(userId)
            user.once('value', (snap) => {
                if (snap.val().status === 'in') {
                    clockOut(userId)
                }
            })
        })
    })
}

/**
 * Changes user button styling based on the user's current status.
 * @param {Object} snapshot firebase.DataSnapshot output for the user
 */
function btnColorChange (userId) {
    userDB.child(userId).once('value', (snapshot) => {
        const btnColor = document.getElementById(userId)
        if (snapshot.val().status === 'in') {
            btnColor.style.backgroundColor = '#8bc34a'
            btnColor.style.color = '#ffffff'
        } else if (snapshot.val().status === 'out') {
            btnColor.style.backgroundColor = '#ff4081'
            btnColor.style.color = '#000000'
        } else {
            throw Error('Incorrect user status.')
        }
    })
}

/**
 * Creates a button for the user information provided
 * @param {string} userId - The hyphenated full name of the user
 * @param {string} title - The unhyphenated full name of the user
 * @returns {HTMLDivElement} grid - The div for the grid with all the buttons
 */
function createUserElement (userId, title) {
    // Create the DOM element from the HTML.
    // Create grid
    const grid = document.createElement('div')
    grid.setAttribute('class', `user user-${userId} mdl-cell mdl-cell--12-col mdl-cell--6-col-tablet mdl-cell--4-col-desktop mdl-grid mdl-grid--no-spacing`)

    // Create card
    const card = document.createElement('div')
    card.setAttribute('class', 'mdl-card mdl-shadow--2dp')

    // Create button
    const button = document.createElement('button')
    button.setAttribute('class', 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect')
    button.setAttribute('id', userId)

    // Create button text
    const buttonText = document.createElement('span')

    // Structure
    button.appendChild(buttonText)
    card.appendChild(button)
    grid.appendChild(card)

    // Set values.
    buttonText.innerText = title
    button.addEventListener('click', () => {
        userBtnHandler(userId)
    })

    return grid
}

const userList = userDB.orderByChild('firstName')

/**
 * Fetches all user entries in the database and calls createUserElement() for each user.
 */
export function fetchUsers () {
    userList.on('child_added', (snapshot) => {
        const userId = snapshot.key
        const userName = userId.split('-')
        const userFirstName = userName[0]
        const userLastName = userName[1].charAt(0)
        const userTitle = `${userFirstName} ${userLastName}`
        const containerElement = document.getElementById('users-container')
        containerElement.insertBefore(
            createUserElement(userId, userTitle),
            containerElement.nextChild
        )
        btnColorChange(userId)
    })
    userList.on('child_changed', (snapshot) => {
        const userId = snapshot.key
        btnColorChange(userId)
    })
    userList.on('child_removed', (snapshot) => {
        window.location.reload()
    })
}
