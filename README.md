# greybots-signin

Team 973 - The Greybots' clock in/out system that runs on a Raspberry Pi w/ [Electron](https://electron.atom.io/), [resin.io](https://resin.io/), and [Firebase](https://firebase.google.com/).

## Getting started

### Create a working developer environment

1. clone this repository to your local workspace
2. install `yarn`, `node` and `npm`
3. run `yarn install` in app/
4. grab the service account key from the [Firebase Console](https://console.firebase.google.com/) (or ask @Chris2fourlaw for one) and put it in data/
5. run `yarn run dev` in app/
You should see the system working!

### Push to the Raspberry Pi

1. authorize your GitHub with the [resin.io](https://resin.io/) project
2. in the local workspace, run the remote add command that shows in the [resin.io Dashboard](https://dashboard.resin.io/) (for example: `git remote add resin <username>@git.resin.io:<project>`)
3. add, commit, then run `git push resin <branch>`
You should see the Raspberry Pi automatically download the new image and run the updated system!
