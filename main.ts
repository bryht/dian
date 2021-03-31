const electron = require('electron');
const url = require('url');
const path = require('path');
const {
    app,
    BrowserWindow,
    ipcMain,
    Menu,
    Tray,
    globalShortcut,
    session,
} = require('electron');
const log = require('electron-log');
const autoUpdater = require("electron-updater").autoUpdater;
const electronIsDev = require("electron-is-dev");
const { promises } = require('fs');
const { ElectronBlocker, fullLists } = require('@cliqz/adblocker-electron');
const nodeFetch = require('node-fetch');
const googleTTS = require('google-tts-api');
const Shell = require('node-powershell');

//Update Logging
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
function Logging(text) {
    log.info(text);
}
autoUpdater.on('checking-for-update', () => {
    Logging('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
    Logging('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
    Logging('Update not available.');
})
autoUpdater.on('error', (err) => {
    Logging('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Speed: " + parseInt(progressObj.bytesPerSecond) / (1204 * 8);
    log_message = log_message + 'KB/s  Progress:' + parseInt(progressObj.percent) + '%';
    Logging(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
    autoUpdater.quitAndInstall();
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

ipcMain.on('play-audio', async (event, info) => {
    try {

        console.log(info);
        let url = googleTTS.getAudioUrl(info.value, {
            lang: info.culture,
            slow: false,
            host: 'https://translate.google.com',
            timeout: 10000,
        });

        const ps = new Shell({
            executionPolicy: 'Bypass',
            noProfile: true
        });

        ps.addCommand(`wget "${url}" -o "$env:USERPROFILE/AppData/Local/Temp/temp.mp3"`);
        ps.addCommand(`Add-Type -AssemblyName presentationCore`);
        ps.addCommand(`$mediaPlayer = New-Object system.windows.media.mediaplayer`);
        ps.addCommand(`$mediaPlayer.open("$env:USERPROFILE/AppData/Local/Temp/temp.mp3")`);
        ps.addCommand(`$mediaPlayer.Play()`);
        ps.addCommand(`Start-Sleep -s 3`);
        ps.addCommand(`exit`);
        ps.invoke().catch(error => ps.dispose());
    } catch (error) {
        console.log(error);
    }

})

let win;
var appIcon = null;
async function createWindow() {
    const _width = electronIsDev ? 1200 : 600, _height = 800
    win = new BrowserWindow({
        width: _width,
        height: _height,
        minWidth: 500,
        minHeight: 600,
        // icon: __dirname + '/assets/icon.ico',
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true,
            webSecurity: false,
            allowRunningInsecureContent: true,
        }
    })

    // add ad blocker
    const blocker = await ElectronBlocker.fromLists(
        nodeFetch,
        fullLists,
        {
            enableCompression: true,
        },
        {
            path: 'engine.bin',
            read: promises.readFile,
            write: promises.writeFile,
        },
    );
    blocker.enableBlockingInSession(session.defaultSession);

    // and load the index.html of the app.
    if (electronIsDev) {
        win.loadURL('http://localhost:3000/')
        win.webContents.openDevTools();
        require('electron-reload')(__dirname, {
            electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
            forceHardReset: true,
            hardResetMethod: 'exit',
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
    appIcon.setToolTip('This is Dian');
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
        win.webContents.send('input-message', 'focus');
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


