# greybots-signin

Team 973 - The Greybots' clock in/out system that runs on [Firebase](https://firebase.google.com/)'s [Real Time Database](https://firebase.google.com/docs/database/) w/ [Firebase Hosting](https://firebase.google.com/docs/hosting/). Also uses a Raspberry Pi with a ELO touchscreen in our shop.

## Getting started

### Create a working developer environment

1.  Clone this repository to your local workspace.
2.  Install `yarn` using your package manager. Check Yarn's website for instructions.
3.  Run `yarn install` in the repository.

### Testing using Electron

[Electron](https://electronjs.org/) runs a custom Chromium browser used for web apps. It's a quick way to view changes to greybots-signin. To run Electron, do the following:

1.  Run `yarn start` in the repository.
2.  Login using the email and password.

### Testing using Firebase Hosting

[Firebase Hosting](https://firebase.google.com/docs/hosting/) allows you to serve the site on a locally hosted web server to replicate Firebase's servers. To serve, do the following:

1.  Run `yarn serve` in the repository.
2.  Open a web browser to <https://localhost:5000/>
3.  Login using the email and password.

### Deploying to Firebase Hosting

To push your changes to Firebase's servers, do the following:

1.  Run `yarn deploy` in the repository.
2.  Open a web browser to <https://greybots-signin.firebaseapp.com/>
3.  Login using the email and password.

## Good coding practices

### Modules

Try to separate your code into different modules. An example of this is in `public/js/util.js` where there are utility functions for time, date, and etc. Make sure to use `module.exports`.

### Linting

[JSHint](https://jshint.com/) is included with this repository and is configured to be strict for linting. This will help with performance issues as well as generating cleaner code.

To lint, use `yarn lint`. To automatically fix most errors/warnings, use `yarn autolint`.

## Troubleshooting

### Help! My site isn't loading correctly!

If your site seems to be breaking, open Developer Tools > Console to view JavaScript errors that will point you to your problem. Sometimes, these problems can be resolved by linting.

### I'm getting some weird gRPC error when using Electron...

Run `yarn run electron-rebuild`. If it still doesn't resolve the issue, use `yarn serve`.
