const {
    app,
    BrowserWindow,
    ipcMain,
    Menu,
    MenuItem,
    webContents
} = require('electron');
const log = require('electron-log');
const autoUpdater = require("electron-updater").autoUpdater;
const electronIsDev = require("electron-is-dev");

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

function sendStatusToWindow(text) {
    log.info(text);
    win.webContents.send('message', text);
}
autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
    // sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
    sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Speed: " +parseInt(progressObj.bytesPerSecond / (1204 * 8));
    log_message = log_message + 'KB/s  Progress:' + parseInt(progressObj.percent) + '%';
    sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('Update downloaded');
    autoUpdater.quitAndInstall();
});

let win;
function createWindow() {
    const _width = 1200, _height = 800
    win = new BrowserWindow({
        width: _width,
        height: _height,
        minWidth: 800,
        minHeight: 600,
        icon: '../build/icon.ico'
    })
    win.center();
    win.loadURL(`file://${__dirname}/src/basic.html`)
    win.on("closed", () => win = null)
    if (electronIsDev) {
        win.webContents.openDevTools();
    }
    if (!electronIsDev) {
        autoUpdater.checkForUpdates();
    }
}

app.on("ready", createWindow)
app.on("window-all-closed", () => {
    app.quit()
})
app.on("activate", () => {
    if (win === null)
        createWindow()
})