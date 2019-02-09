/**
 * @file Application initializer/renderer.
 * @author Chris Lawson
 * @copyright The Greybots 2019
 */

import { showAccountDialog, updateAuthStatus } from './firebase.js'
import { getCurrentDate, getCurrentTime } from './util.js'

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
    console.log('initializing')

    document.getElementById('show-account-dialog').addEventListener('click', () => {
        showAccountDialog()
    })

    startDateTime()

    window.updateAuthStatus = updateAuthStatus
}

// document.addEventListener('DOMContentsLoaded', () => initApp())
window.onload = () => {
    initApp()
}
