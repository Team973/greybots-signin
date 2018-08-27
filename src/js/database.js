/**
 * @file Firebase Handler.
 * @author Chris Lawson
 * @copyright The Greybots 2018
 */

// Firebase App is always required and must be first
import firebase from 'firebase/app'

// Add additional services that you want to use
import 'firebase/auth'
import 'firebase/database'

// Initialize Firebase
const config = {
    apiKey: 'AIzaSyDnrZ8l94mfVYyzugwDYwQ3lOv5zsM7Cps',
    authDomain: 'greybots-signin.firebaseapp.com',
    databaseURL: 'https://greybots-signin.firebaseio.com',
    projectId: 'greybots-signin',
    storageBucket: 'greybots-signin.appspot.com',
    messagingSenderId: '29179813690'
}
firebase.initializeApp(config)

// Firebase variables
export const mainDB = firebase.database()
const auth = firebase.auth()
const attendanceDB = mainDB.ref('attendance')
export const dateDB = attendanceDB.child('bydate')
export const nameDB = attendanceDB.child('byname')
export const userDB = mainDB.ref('users')

/**
 * Handles the sign in button press.
 */
function toggleSignIn () {
    if (auth.currentUser) {
        auth.signOut()
        window.location = window.location // eslint-disable-line no-self-assign
    } else {
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        if (email.length < 4) {
            window.alert('Please enter an email address.')
            return
        }
        if (password.length < 4) {
            window.alert('Please enter a password.')
            return
        }
        // Sign in with email and pass.
        auth.signInWithEmailAndPassword(email, password).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code
            const errorMessage = error.message
            if (errorCode === 'auth/wrong-password') {
                window.alert('Wrong password.')
            } else {
                window.alert(errorMessage)
            }
        })
    }
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
        toggleSignIn()
    })
}
