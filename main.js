const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')
const {autoUpdater} = require("electron-updater");
const {ipcMain} = require('electron');

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 600})
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  mainWindow.on('closed', function () {
    mainWindow = null
  })
  mainWindow.webContents.openDevTools()
  sendmessage("opening dev tool");
}

app.on('ready', function(){
  createWindow()
   autoUpdater.checkForUpdates();
});

autoUpdater.on('checking-for-update', (info) => {
    sendmessage("checking for updates");
});
autoUpdater.on('update-available', (info) => {
    sendmessage("update-available");
});
autoUpdater.on('update-not-available', (info) => {
    sendmessage("update-not-available");
});
autoUpdater.on('download-progress', (info) => {
    sendmessage("download-progress");
});
autoUpdater.on('update-downloaded', (info) => {
  sendmessage("download-completed");
  mainWindow.webContents.send('updateReady')
});

// when receiving a quitAndInstall signal, quit and install the new version ;)
ipcMain.on("quitAndInstall", (event, arg) => {
    autoUpdater.quitAndInstall();
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})


function sendmessage(str){
  mainWindow.webContents.send('message')
}