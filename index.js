const electron = require('electron');
const {
    app,
    BrowserWindow,
    ipcMain,
    Menu,
    MenuItem,
    webContents,
    Tray,
    globalShortcut,
    crashReporter
} = electron;
const log = require('electron-log');
const autoUpdater = require("electron-updater").autoUpdater;
const electronIsDev = require("electron-is-dev");

//Crash Reporter
if (electronIsDev) {
    app.setPath('temp', 'C:/Users/liming/Desktop/DictLog/');
    crashReporter.start({
        productName: 'Dict',
        companyName: 'bryht',
        uploadToServer: true,
        submitURL: 'localhost'
    });
}

//Update Logging
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
    let log_message = "Speed: " + parseInt(progressObj.bytesPerSecond / (1204 * 8));
    log_message = log_message + 'KB/s  Progress:' + parseInt(progressObj.percent) + '%';
    sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('Update downloaded');
    autoUpdater.quitAndInstall();
});

let win;
function createWindow() {
    const _width = electronIsDev ? 1200 : 600, _height = 800
    win = new BrowserWindow({
        width: _width,
        height: _height,
        minWidth: 500,
        minHeight: 600,
        icon: __dirname + '/build/icon.ico'
    })
    win.loadURL(`file://${__dirname}/src/basic.html`)
    win.on("closed", () => win = null)
    if (electronIsDev) {
        win.webContents.openDevTools();
    }
    if (!electronIsDev) {
        autoUpdater.checkForUpdates();
    }
    var appIcon = new Tray(__dirname + '/build/icon.ico');
    var contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show App', click: function () {
                win.show()
            }
        },
        {
            label: 'Quit', click: function () {
                app.isQuiting = true
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
    win.on('close', function (event) {
        if (!app.isQuiting) {
            event.preventDefault();
            win.hide();
        }

        return false;
    });
    globalShortcut.register('CommandOrControl+Shift+F', () => {
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