/**
 * @file Application initializer/renderer.
 * @author Chris Lawson
 * @copyright The Greybots 2019
 */

import { showAccountDialog, updateAuthStatus } from './authentication.js'
import { getCurrentDate, getCurrentTime } from './util.js'
import { clockAllOut } from './users.js'

/**
 * Create date/time info.
 */
function startDateTime () {
    document.getElementById('datetime').innerHTML = `${getCurrentDate()} ${getCurrentTime()}`
    setTimeout(() => {
        startDateTime()
    }, 100)

    setTimeout(clockAllOut, new Date('1/1/2020 12:00:00 AM').getTime() - new Date().getTime())
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

window.onload = () => {
    initApp()
}
