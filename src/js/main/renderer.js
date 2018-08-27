/**
 * @file Application initializer/renderer.
 * @author Chris Lawson
 * @copyright The Greybots 2018
 */

import { showAccountDialog } from '../database.js'
import firebase from 'firebase'
import { fetchUsers } from './users.js'
import { getCurrentDate, getCurrentTime } from '../util.js'

/**
 * Create date/time info.
 */
function startDateTime () {
    document.getElementById('datetime').innerHTML = `${getCurrentDate()} ${getCurrentTime()}`
    setTimeout(() => {
        startDateTime()
    }, 100)
}

/**
 * Initialize the main application.
 */
function initApp () {
    // Listening for auth state changes.
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            document.getElementById('account-dialog-action').textContent = 'Sign out'
            fetchUsers()
        } else {
            // User is signed out.
            document.getElementById('account-dialog-action').textContent = 'Sign in'
            showAccountDialog()
        }
    })
    document.getElementById('show-account-dialog').addEventListener('click', () => {
        showAccountDialog()
    })
    startDateTime()
}

window.onload = () => {
    initApp()
}
