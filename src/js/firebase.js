/**
 * @file Firebase handler.
 * @author Chris Lawson
 * @copyright The Greybots 2019
 */

import { fetchStudents } from './students.js'

// Initialize Firebase
export const config = {
    apiKey: 'AIzaSyAO7HnG9qiPlJqY_KXCjg3sE-1STBeENwA',
    authDomain: 'greybots-signin.firebaseapp.com',
    clientId: '29179813690-df6m643k77nmmsoo3ogr15ji3sph9cvr.apps.googleusercontent.com',
    databaseURL: 'https://greybots-signin.firebaseio.com',
    discoveryDocs: [
        'https://sheets.googleapis.com/$discovery/rest?version=v4'
    ],
    projectId: 'greybots-signin',
    scopes: [
        'email',
        'profile',
        'https://www.googleapis.com/auth/spreadsheets'
    ],
    storageBucket: 'greybots-signin.appspot.com',
    messagingSenderId: '29179813690'
}

// Initialize Firebase
firebase.initializeApp(config)

// Firebase variables
export const mainDB = firebase.database()
export const studentDB = mainDB.ref('students')

/**
 * Handles the sign in button press.
 */
function signOut () {
    gapi.auth2.getAuthInstance().signOut()
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

    firebase.auth().onAuthStateChanged((firebaseUser) => {
        // Check if we are already signed-in Firebase with the correct user.
        if (!isUserEqual(googleUser, firebaseUser)) {
            // Build Firebase credential with the Google ID token.
            var credential = firebase.auth.GoogleAuthProvider.credential(googleUser.getAuthResponse().id_token)
            // Sign in with credential from the Google user.
            firebase.auth().signInAndRetrieveDataWithCredential(credential)
        } else {
            console.log('User already signed-in Firebase.')
        }

        document.getElementById('signin-container').style.visibility = 'hidden'

        fetchStudents()
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
