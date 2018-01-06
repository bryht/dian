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

let win;

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
    sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
    sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('Update downloaded');
    autoUpdater.quitAndInstall();
});
function createWindow() {
    if (!electronIsDev) {
        autoUpdater.checkForUpdates();
    }
    const _width = 1200, _height = 800
    win = new BrowserWindow({
        width: _width,
        height: _height,
        minWidth: 800,
        minHeight: 600,
        icon: '../build/icon.ico'
    })
    if (electronIsDev) {
        win.webContents.openDevTools();
    }
    win.center();
    // let menu = new Menu();
    // menu.append(new MenuItem({
    //     accelerator:'Return',
    //     visible:false,
    //     click: () => {
    //         win.webContents.send('onKeyPress','Return');
    //     }
    // }));
    // win.setMenu(null);

    win.loadURL(`file://${__dirname}/src/basic.html`)
    win.on("closed", () => win = null)
}

app.on("ready", createWindow)
app.on("window-all-closed", () => {
    app.quit()
})
app.on("activate", () => {
    if (win === null)
        createWindow()
})