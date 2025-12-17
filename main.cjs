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
// electron-is-dev is now ESM only, use app.isPackaged instead
const electronIsDev = !app.isPackaged;
const { promises } = require('fs');
const { ElectronBlocker, fullLists } = require('@cliqz/adblocker-electron');
const googleTTS = require('google-tts-api');
const { exec } = require('child_process');
const https = require('https');
const fs = require('fs');
const os = require('os');

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
        let audioUrl = googleTTS.getAudioUrl(info.value, {
            lang: info.culture,
            slow: false,
            host: 'https://translate.google.com',
            timeout: 10000,
        });

        const tempFile = path.join(os.tmpdir(), 'temp.mp3');
        
        // Download the audio file
        const file = fs.createWriteStream(tempFile);
        https.get(audioUrl, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                // Play using PowerShell on Windows
                if (process.platform === 'win32') {
                    const psCommand = `
                        Add-Type -AssemblyName presentationCore;
                        $mediaPlayer = New-Object system.windows.media.mediaplayer;
                        $mediaPlayer.open('${tempFile.replace(/\\/g, '\\\\')}');
                        $mediaPlayer.Play();
                        Start-Sleep -s 3;
                    `;
                    exec(`powershell -Command "${psCommand}"`, (error) => {
                        if (error) console.log('Audio playback error:', error);
                    });
                }
            });
        }).on('error', (err) => {
            console.log('Download error:', err);
            fs.unlink(tempFile, () => {});
        });
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
            contextIsolation: false,
            webviewTag: true,
            webSecurity: false,
            allowRunningInsecureContent: true,
        }
    })

    // Enable @electron/remote for this window
    require('@electron/remote/main').initialize();
    require('@electron/remote/main').enable(win.webContents);

    // add ad blocker
    const blocker = await ElectronBlocker.fromLists(
        fetch,
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
        win.loadURL('http://localhost:5173/')
        win.webContents.openDevTools();
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
    const winBounds = win.getBounds();
    let x = electron.screen.getPrimaryDisplay().workAreaSize.width - winBounds.width;
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


