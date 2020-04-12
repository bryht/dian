const electron = require('electron');
const pdfkit = require('pdfkit');
const url = require('url');
const path = require('path');
const fs = require('fs-extra');
const {
    app,
    BrowserWindow,
    ipcMain,
    Menu,
    Tray,
    globalShortcut,
    dialog
} = require('electron');
const log = require('electron-log');
const autoUpdater = require("electron-updater").autoUpdater;
const electronIsDev = require("electron-is-dev");
//Update Logging
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
function sendStatusToWindow(text) {
    log.info(text);
    // win.webContents.send('message', text);
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
    let log_message = "Speed: " + parseInt(progressObj.bytesPerSecond) / (1204 * 8);
    log_message = log_message + 'KB/s  Progress:' + parseInt(progressObj.percent) + '%';
    sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('update');
});

autoUpdater.checkForUpdates();
ipcMain.on('message', (event, info, data) => {
    switch (info) {
        case 'update':
            autoUpdater.quitAndInstall();
            break;
        default:
            break;
    }
})

let win;
var appIcon = null;
function createWindow() {
    const _width = electronIsDev ? 1200 : 600, _height = 800
    win = new BrowserWindow({
        width: _width,
        height: _height,
        minWidth: 500,
        minHeight: 600,
        icon: __dirname + '/assets/icon.ico',
        webPreferences:{
           nodeIntegration:true,
           webviewTag:true
        }
    })
    // and load the index.html of the app.
    if (electronIsDev) {
        win.loadURL('http://localhost:3000/')
        win.webContents.openDevTools();
        require('electron-reload')(__dirname, {
            electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
            forceHardReset: true,
            hardResetMethod: 'exit'
        });
    } else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, '/build/index.html'),
            protocol: 'file:',
            slashes: true
        }));
        win.setMenuBarVisibility(false)
    }
    win.on("closed", () => win = null)

    appIcon = new Tray(__dirname + '/build/icon.png');
    appIcon.setToolTip('This is Dict');
    appIcon.addListener("click", () => win.show());
    var contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show App', click: function () {
                win.show()
            }
        },
        {
            label: 'Quit', click: function () {
                app.quit()
            }
        }
    ])
    let x = electron.screen.getPrimaryDisplay().workAreaSize.width - win.webContents.browserWindowOptions.width;
    win.setPosition(x, 0);

    appIcon.setContextMenu(contextMenu)
    win.on('minimize', function (event) {
        event.preventDefault();
        win.hide();
    });
    globalShortcut.register('CommandOrControl+Shift+' + (electronIsDev ? 'D' : 'F'), () => {
        win.show();
    });

}
app.on("ready", createWindow)
app.on("window-all-closed", () => {
    app.quit()
})
app.on("activate", () => {
    if (win === null)
        createWindow()
})


