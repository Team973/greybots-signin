const electron = require('electron');
// Modules to control application life & to create native browser window.
const { app, BrowserWindow } = electron;

const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// simple parameters initialization
const electronConfig = {
  URL_LAUNCHER_TOUCH: process.env.URL_LAUNCHER_TOUCH === '1' ? 1 : 0,
  URL_LAUNCHER_TOUCH_SIMULATE: process.env.URL_LAUNCHER_TOUCH_SIMULATE === '1' ? 1 : 0,
  URL_LAUNCHER_FRAME: process.env.URL_LAUNCHER_FRAME === '1' ? 1 : 0,
  URL_LAUNCHER_KIOSK: process.env.URL_LAUNCHER_KIOSK === '1' ? 1 : 0,
  URL_LAUNCHER_WIDTH: parseInt(process.env.URL_LAUNCHER_WIDTH || 1024, 10),
  URL_LAUNCHER_HEIGHT: parseInt(process.env.URL_LAUNCHER_HEIGHT || 768, 10),
  URL_LAUNCHER_TITLE: process.env.URL_LAUNCHER_TITLE || 'Greybots Signin System',
  URL_LAUNCHER_CONSOLE: process.env.URL_LAUNCHER_CONSOLE === '1' ? 1 : 0,
  URL_LAUNCHER_URL: process.env.URL_LAUNCHER_URL || path.join(__dirname, 'data', 'index.html'),
  URL_LAUNCHER_ZOOM: parseFloat(process.env.URL_LAUNCHER_ZOOM || 1.0),
  URL_LAUNCHER_OVERLAY_SCROLLBARS: process.env.URL_LAUNCHER_CONSOLE === '1' ? 1 : 0,
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: electronConfig.URL_LAUNCHER_WIDTH,
    height: electronConfig.URL_LAUNCHER_HEIGHT,
    frame: !!(electronConfig.URL_LAUNCHER_FRAME),
    title: electronConfig.URL_LAUNCHER_TITLE,
    kiosk: !!(electronConfig.URL_LAUNCHER_KIOSK),
    webPreferences: {
      zoomFactor: electronConfig.URL_LAUNCHER_ZOOM,
      overlayScrollbars: !!(electronConfig.URL_LAUNCHER_OVERLAY_SCROLLBARS),
    },
  });

  mainWindow.webContents.on('did-finish-load', () => {
    setTimeout(() => {
      mainWindow.show();
    }, 300);
  });

  // if the env-var is set to true,
  // a portion of the screen will be dedicated to the chrome-dev-tools
  if (electronConfig.URL_LAUNCHER_CONSOLE) {
    mainWindow.openDevTools();
  }

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: electronConfig.URL_LAUNCHER_URL,
    protocol: 'file:',
    slashes: true,
  }));

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// enable touch events if your device supports them
if (electronConfig.URL_LAUNCHER_TOUCH) {
  app.commandLine.appendSwitch('--touch-devices');
}
// simulate touch events - might be useful for touchscreen with partial driver support
if (electronConfig.URL_LAUNCHER_TOUCH_SIMULATE) {
  app.commandLine.appendSwitch('--simulate-touch-screen-with-mouse');
}

if (process.env.NODE_ENV === 'development') {
  console.log('Running in development mode');
  Object.assign(electronConfig, {
    URL_LAUNCHER_HEIGHT: 600,
    URL_LAUNCHER_WIDTH: 800,
    URL_LAUNCHER_KIOSK: 0,
    URL_LAUNCHER_CONSOLE: 1,
    URL_LAUNCHER_FRAME: 1,
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
