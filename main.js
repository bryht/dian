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
var appIcon = null;
function createWindow() {
    const _width = electronIsDev ? 1200 : 600, _height = 800
    win = new BrowserWindow({
        width: _width,
        height: _height,
        minWidth: 500,
        minHeight: 600,
        icon: __dirname + '/build/icon.ico'
    })
    // and load the index.html of the app.
    if (electronIsDev) {
        win.loadURL('http://localhost:4200/')
    } else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, '/dist/index.html'),
            protocol: 'file:',
            slashes: true
        }))
    }
    win.on("closed", () => win = null)
    if (electronIsDev) {
        win.webContents.openDevTools();
    }
    if (!electronIsDev) {
        autoUpdater.checkForUpdates();
    }
    appIcon = new Tray(__dirname + '/src/assets/icon.png');
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
    globalShortcut.register('CommandOrControl+Shift+' +(electronIsDev ? 'D' : 'F'), () => {
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