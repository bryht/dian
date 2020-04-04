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
    let log_message = "Speed: " + parseInt(progressObj.bytesPerSecond) / (1204 * 8);
    log_message = log_message + 'KB/s  Progress:' + parseInt(progressObj.percent) + '%';
    sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('downloaded');
});

ipcMain.on('message', (event, info, data) => {
    switch (info) {
        case 'update':
            autoUpdater.quitAndInstall();
            break;
        case 'exportBlankTest':
            exportBlankTest(data);
            break;
        case 'exportMutiChoiceTest':
            exportMutiChoiceTest(data);
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
        icon: __dirname + '/assets/icon.ico'
    })
    // and load the index.html of the app.
    if (electronIsDev) {
        win.loadURL('http://localhost:3000/')
    } else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, '/build/index.html'),
            protocol: 'file:',
            slashes: true
        }))
    }
    win.on("closed", () => win = null)
    if (electronIsDev) {
        win.webContents.openDevTools();
    }

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

async function exportBlankTest(words) {
    const fileName = await new Promise(resolve => {
        dialog.showSaveDialog({
            'title': 'Save',
            'defaultPath': 'BlankTest-' + Date.now(),
            'filters': [{ 'name': 'pdf', 'extensions': ['pdf'] }],
            'buttonLabel': 'Save'
        }, result => {
            resolve(result);
        });
    });
    if (fileName === undefined) {
        return false;
    }
    const pdf = new pdfkit();
    pdf.pipe(fs.createWriteStream(fileName));
    const wordsHasContent = words.filter((value, index, array) => {
        return value.hasContent && value.example.length;
    });
    // write the title
    pdf.fontSize(20).text('Blank Filling Questions', { align: 'center' });
    // write blank words
    pdf.fontSize(15).text('Words you can fill:', { underline: true });
    const wordsHasContentSort = wordsHasContent.map((value, index, array) => {
        return value.word;
    }).sort();
    const wordsBlanks = wordsHasContentSort.join(',   ');
    pdf.fontSize(15).text(wordsBlanks).moveDown();
    // write the questions
    pdf.fontSize(15).text('Questions:', { underline: true });
    for (let index = 0; index < wordsHasContent.length; index++) {
        const element = wordsHasContent[index];
        const sentence = element.example.split(' ').filter((value, i, array) => {
            if (value.includes('[xxx]')) {
                return value;
            }
        });
        const word = sentence.length === 1 ? sentence[0] : '[xxx]';
        const textContent = (index + 1) + '. ' + element.example.replace(word, '______');
        pdf.fontSize(15).text(textContent);
    }
    // draw the line
    pdf.fontSize(15).moveDown()
        .moveTo(0, pdf.y)
        .lineTo(pdf.page.width, pdf.y)
        .fillAndStroke().moveDown();
    // write the answers
    pdf.fontSize(15).text('Answers:');
    const wordsWithAnswers = wordsHasContent.map((word, index, array) => {
        const answerWords = word.example.split(' ').filter((value, i, list) => {
            if (value.includes('[xxx]')) {
                return value;
            }
        });
        return (index + 1) + ':' +
            (answerWords.length === 1 ?
                answerWords[0].replace('[xxx]', word.word) :
                word.word);
    });
    const answers = wordsWithAnswers.join(',   ');
    pdf.fontSize(15).text(answers);
    pdf.end();

}
async function exportMutiChoiceTest(words) {
    const fileName = await new Promise(resolve => {
        dialog.showSaveDialog({
            'title': 'Save',
            'defaultPath': 'ChoiceTest-' + Date.now(),
            'filters': [{ 'name': 'pdf', 'extensions': ['pdf'] }],
            'buttonLabel': 'Save'
        }, result => {
            resolve(result);
        });
    });
    if (fileName === undefined) {
        return false;
    }
    const pdf = new pdfkit();
    pdf.pipe(fs.createWriteStream(fileName));
    const wordsHasContent = words.filter((value, index, array) => {
        return value.hasContent && value.example.length;
    });
    // write the title
    pdf.fontSize(20).text('Mutiple Choice Questions', { align: 'center' });
    // write the questions
    const answersNumToLetter = ['A', 'B', 'C', 'D'];
    const answersArray = [];
    for (let index = 0; index < wordsHasContent.length; index++) {
        const randomInt = Math.floor(Math.random() * 3.9);
        answersArray[index] = { answer: randomInt };
    }
    const answers = answersArray.map((value, index, array) => {
        return index + 1 + ',' + answersNumToLetter[value.answer];
    }).join(';    ');
    pdf.fontSize(12).text('Questions:', { underline: true });
    for (let index = 0; index < wordsHasContent.length; index++) {
        const element = wordsHasContent[index];
        pdf.text((index + 1) + '.' + element.word + ':', { stroke: true });
        const choices = [];
        choices.push(index);
        let randomInt = index;
        for (let i = 0; i < 4; i++) {
            if (i === answersArray[index].answer) {
                pdf.fontSize(12).text(answersNumToLetter[i] + '.' + element.define);
            } else {
                while (choices.includes(randomInt)) {
                    randomInt = Math.floor(Math.random() * (wordsHasContent.length - 0.1));
                    if (choices.includes(randomInt) === false) {
                        choices.push(randomInt);
                        break;
                    }
                }
                pdf.fontSize(12).text(answersNumToLetter[i] + '.' + wordsHasContent[randomInt].define);
            }
        }
    }
    // draw the line
    pdf.fontSize(15).moveDown()
        .moveTo(0, pdf.y)
        .lineTo(pdf.page.width, pdf.y)
        .fillAndStroke().moveDown();
    // write the answers.
    pdf.fontSize(12).text('Answers:');
    pdf.fontSize(12).text(answers);
    pdf.end();
}