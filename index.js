const {
    app,
    BrowserWindow,
    ipcMain,
    Menu,
    MenuItem,
    webContents
} = require('electron')

const electron = require('electron')

let win;

function createWindow() {

    const _width = 1200, _height = 800
    win = new BrowserWindow({
        width: _width,
        height: _height,
        minWidth: 800,
        minHeight: 600,
        icon: './dictionary.ico'
    })
    win.webContents.openDevTools();
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

