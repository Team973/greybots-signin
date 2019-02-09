/**
 * @file Student Handler.
 * @author Chris Lawson
 * @copyright The Greybots 2019
 */

import { studentDB } from './authentication.js'
import { getCurrentTime, getCurrentDate } from './util.js'
import { pushStudentActionDateTime } from './spreadsheet.js'

/**
 * Clocks in the student.
 * @param {string} student The student object from the database.
 */
function clockIn (studentId) {
    const student = studentDB.child(studentId)

    console.log(`signing in ${studentId} at ${getCurrentTime()}`)

    student.update({
        status: 'in'
    })

    pushStudentActionDateTime(studentId, 'in', getCurrentDate(), getCurrentTime())
}

/**
 * Clocks out the student.
 * @param {string} student The student object from the database.
 */
function clockOut (studentId) {
    const student = studentDB.child(studentId)

    student.update({
        status: 'out'
    })

    pushStudentActionDateTime(studentId, 'out', getCurrentDate(), getCurrentTime())
}

/**
 * Writes the specified student's attendance to the
 * @param {string} studentId The hyphenated full name of the student.
 */
function studentBtnHandler (studentId) {
    const student = studentDB.child(studentId)

    console.log(`${studentId}'s button clicked'`)
    student.once('value').then((snapshot) => {
        if (snapshot.val().status === 'in') {
            clockOut(studentId)
        } else {
            clockIn(studentId)
        }
    }).catch((error) => {
        console.error(error)
    })
}

/**
 * Clocks all clocked in students out in the database.
 */
document.getElementById('clock-everyone-out').onclick = () => {
    studentDB.once('value').then((snapshot) => {
        Object.keys(snapshot.val()).forEach((studentId) => {
            const student = studentDB.child(studentId)
            student.once('value').then((snap) => {
                if (snap.val().status === 'in') {
                    clockOut(studentId)
                }
            }).catch((error) => {
                console.error(error)
            })
        })
    }).catch((error) => {
        console.log(error)
    })
}

/**
 * Changes student button styling based on the student's current status.
 * @param {Object} studentId firebase.DataSnapshot output for the student.
 */
function btnColorChange (studentId) {
    studentDB.child(studentId).once('value').then((snapshot) => {
        const btnColor = document.getElementById(`button-${studentId}`)
        if (snapshot.val().status === 'in') {
            btnColor.style.backgroundColor = '#8bc34a'
            btnColor.style.color = '#ffffff'
        } else if (snapshot.val().status === 'out') {
            btnColor.style.backgroundColor = '#ff4081'
            btnColor.style.color = '#000000'
        } else {
            throw new Error('Incorrect student status.')
        }
    }).catch((error) => {
        console.error(error)
    })
}

/**
 * Creates a button for the student information provided.
 * @param {string} studentId The hyphenated full name of the student.
 * @param {string} title The unhyphenated full name of the student.
 * @returns {HTMLDivElement} The student's button.
 */
function createStudentElement (studentId, title) {
    // Create button
    const button = document.createElement('button')
    button.setAttribute('class', 'mdl-cell mdl-cell--4-col mdl-button mdl-js-button mdl-button--raised')
    button.setAttribute('id', `button-${studentId}`)
    button.setAttribute('style', 'font-size: 2.5vw; height: 8vh; width: 20vw; margin: 1.5vw;')

    // Set values.
    button.innerText = title
    button.addEventListener('click', () => {
        studentBtnHandler(studentId)
    })

    return button
}

/**
 * Fetches all student entries in the database and calls createstudentElement() for each student.
 */
export function fetchStudents () {
    const studentList = studentDB.orderByChild('firstName')
    studentList.on('child_added', (snapshot) => {
        const studentId = snapshot.key
        const studentName = studentId.split('-')
        const studentFirstName = studentName[0]
        const studentLastName = studentName[1].charAt(0)
        const studentTitle = `${studentFirstName} ${studentLastName}`
        const containerElement = document.getElementById('student-container')
        containerElement.insertBefore(
            createStudentElement(studentId, studentTitle),
            containerElement.nextChild
        )
        btnColorChange(studentId)
    })
    studentList.on('child_changed', (snapshot) => {
        const studentId = snapshot.key
        btnColorChange(studentId)
    })
    studentList.on('child_removed', (snapshot) => {
        const studentId = snapshot.key
        const studentElement = document.getElementById(`button-${studentId}`)
        studentElement.parentNode.removeChild(studentElement)
    })
}
