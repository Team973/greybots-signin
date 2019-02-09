/**
 * @file Firebase handler.
 * @author Chris Lawson
 * @copyright The Greybots 2019
 */

import { fetchStudents } from './students.js'
import { pushStudentActionDateTime } from './spreadsheet.js'
import { getCurrentDate, getCurrentTime } from './util.js'

// Initialize Firebase
export const config = {
    apiKey: 'AIzaSyAO7HnG9qiPlJqY_KXCjg3sE-1STBeENwA',
    authDomain: 'greybots-signin.firebaseapp.com',
    clientId:
      '29179813690-df6m643k77nmmsoo3ogr15ji3sph9cvr.apps.googleusercontent.com',
    databaseURL: 'https://greybots-signin.firebaseio.com',
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    projectId: 'greybots-signin',
    scopes: ['email', 'profile', 'https://www.googleapis.com/auth/spreadsheets'],
    storageBucket: 'greybots-signin.appspot.com',
    messagingSenderId: '29179813690'
}

gapi.load('client:auth2', () => {
    gapi.client.init(config)
    gapi.auth2.init(config)
})

// Initialize Firebase
firebase.initializeApp(config)

// Firebase variables
export const mainDB = firebase.database()
export const studentDB = mainDB.ref('students')

/**
 * Handles the sign in button press.
 */
function signOut () {
    firebase.auth().signOut().catch((error) => {
        // An error happened.
        console.error(error)
    })
    gapi.auth2.getAuthInstance().signOut().catch((error) => {
        // An error happened.
        console.error(error)
    })
    document.getElementById('signin-container').style.visibility = 'visible'
    document.getElementById('account-dialog-action').textContent = 'Sign in above'
    document.getElementById('account-dialog-action').disabled = true
    window.location = window.location
}

function isUserEqual (googleUser, firebaseUser) {
    if (firebaseUser) {
        var providerData = firebaseUser.providerData
        for (var i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                providerData[i].uid === googleUser.getBasicProfile().getId()) {
                // We don't need to reauth the Firebase connection.
                return true
            }
        }
    }
    return false
}

export function updateAuthStatus (googleUser) {
    document.getElementById('account-dialog-action').textContent = 'Sign out'
    document.getElementById('account-dialog-action').disabled = false

    console.log('Google Auth Response', googleUser)
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    firebase.auth().onAuthStateChanged((firebaseUser) => {
        // Check if we are already signed-in Firebase with the correct user.
        if (!isUserEqual(googleUser, firebaseUser)) {
            // Build Firebase credential with the Google ID token.
            var credential = firebase.auth.GoogleAuthProvider.credential(
                googleUser.getAuthResponse().id_token)
            // Sign in with credential from the Google user.
            firebase.auth().signInAndRetrieveDataWithCredential(credential).catch((error) => {
                // Handle Errors here.
                var errorCode = error.code
                var errorMessage = error.message
                // The email of the user's account used.
                var email = error.email
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential

                console.error(`Error signing into Firebase; error code: ${errorCode}, message: ${errorMessage}, email: ${email}, credential: ${credential}`)
            })
        } else {
            console.log('User already signed-in Firebase.')
        }

        document.getElementById('signin-container').style.visibility = 'hidden'
        fetchStudents()

        // Basically, there is a bug where the spreadsheet doesn't accept the first data pushed to it (404 :/) so we send a request to prime the system.
        console.warn('Expect a spreadsheet undefined error!')
        pushStudentActionDateTime('INITALIZE-SYSTEM', 'in', getCurrentDate(), getCurrentTime())
    })
}

/**
 * Shows the dialog for signing in to the database.
 */
export function showAccountDialog () {
    const accountDialog = document.getElementById('account-dialog')
    const actionBtn = document.getElementById('account-dialog-action')
    const closeBtn = document.getElementById('account-dialog-close')
    accountDialog.showModal()

    closeBtn.addEventListener('click', () => {
        accountDialog.close()
    })
    actionBtn.addEventListener('click', () => {
        signOut()
    })
}
