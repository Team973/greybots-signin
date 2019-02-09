# greybots-signin

[![Build Status](https://travis-ci.com/Team973/greybots-signin.svg?token=PMQ4h4i9r3eRUJnsCJBt&branch=master)](https://travis-ci.com/Team973/greybots-signin)

Team 973 - The Greybots' clock in/out system that runs on [Firebase](https://firebase.google.com/)'s [Real Time Database](https://firebase.google.com/docs/database/) w/ [Firebase Hosting](https://firebase.google.com/docs/hosting/).

## Getting started

### Create a working developer environment

1.  Clone this repository to your local workspace.
2.  Install `npm` using your package manager. Check NPM's website for instructions.
3.  Run `npm install` in the repository.

### Testing using Firebase Hosting

[Firebase Hosting](https://firebase.google.com/docs/hosting/) allows you to serve the site on a locally hosted web server to replicate Firebase's servers. To serve, do the following:

1.  Run `npm start` in the repository.
2.  Open a web browser to <https://localhost:5000/>
3.  Login using the email and password.

### Deploying to Firebase Hosting

To push your changes to Firebase's servers, do the following:

1.  Run `npm run deploy` in the repository.
2.  Open a web browser to <https://greybots-signin.firebaseapp.com/>
3.  Login using the email and password.

## Good coding practices

### Modules

Try to separate your code into different modules. An example of this is in `src/js/util.js` where there are utility functions for time, date, and etc. Make sure to use `export`s.

### Linting

[ESLint](https://eslint.org/) is included with this repository and is configured to be strict for linting. This will help with performance issues as well as generating cleaner code.

To lint, use `npm run lint`.

## Troubleshooting

### Help! My site isn't loading correctly!

If your site seems to be breaking, open Developer Tools > Console to view JavaScript errors that will point you to your problem. Most of the time, these problems can be resolved by linting.
