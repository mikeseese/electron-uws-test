// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { performance } = require("perf_hooks");
const uWebSockets = require("@seesemichaelj/uwebsockets.js");

const uwsApp = uWebSockets.App();

uwsApp.ws("/", {
  message: (ws, msg, isBinary) => {
    // the renderer process starts after the main process, so it has
    // a different start time. performance.now's `0` is when the process
    // starts. this subtracts the extra time in between
    const now = performance.now();
    const message = JSON.parse(Buffer.from(msg).toString());
    const timeCorrection = message.timeOrigin - performance.timeOrigin;
    console.log("uWS", now - message.timeSent - timeCorrection);
  }
});

uwsApp.listen(1337, (listenSocket) => {
  if (listenSocket) {
    console.log("Listening to port 1337");
  }
});

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  });
});

// Quit when all windows are closed, except on macOS. There, it"s common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on("PING", (event, message) => {
  // the renderer process starts after the main process, so it has
  // a different start time. performance.now's `0` is when the process
  // starts. this subtracts the extra time in between
  const now = performance.now();
  const timeCorrection = message.timeOrigin - performance.timeOrigin;
  console.log("IPC", now - message.timeSent - timeCorrection);
});
