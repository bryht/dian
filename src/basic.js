"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const https = require("https");
const fs = require("fs-extra");
const electron_1 = require("electron");
const storage = require("electron-json-storage");
const pdfkit = require("pdfkit");
const File_1 = require("./Utilities/File");
class Basic {
    getAllWords() {
        let words = new Promise((resolve, reject) => {
            storage.get('words', function (error, data) {
                if (error)
                    throw error;
                resolve(data);
            });
        });
        return words;
    }
    miniMize() {
        electron_1.remote.BrowserWindow.getFocusedWindow().minimize();
    }
    exportWords(target = 'memrise') {
        return __awaiter(this, void 0, void 0, function* () {
            let fileName = yield new Promise(resolve => {
                electron_1.remote.dialog.showSaveDialog({
                    'title': 'SaveWords',
                    'defaultPath': 'wordlist' + Date.now(),
                    'filters': [{ 'name': 'txt', 'extensions': ['txt'] }],
                    'buttonLabel': 'SaveWords'
                }, result => {
                    resolve(result);
                });
            });
            if (fileName == undefined) {
                return false;
            }
            let words = yield this.getAllWords();
            switch (target) {
                case "memrise":
                    let folderName = fileName.split('.')[0] + "audio";
                    let checkFolder = yield fs.ensureDir(folderName);
                    for (let index = 0; index < words.length; index++) {
                        const element = words[index];
                        if (element.hasContent == false || element.isPhrase)
                            continue;
                        let line = `${element.word},${element.type},${element.define},[${element.translation}]${element.pronunciation},${element.example}`;
                        element.word + ',' + element.define;
                        fs.appendFileSync(fileName, line + '\r\n');
                        yield this.saveMp3File(element.soundUrl, folderName + "\\" + element.word + ".mp3");
                    }
                    return "Words have saved in " + fileName + "\n\t Audios have saved in " + folderName;
                case "momo":
                    for (let index = 0; index < words.length; index++) {
                        const element = words[index];
                        if (element.hasContent == false || element.isPhrase)
                            continue;
                        fs.appendFileSync(fileName, element.word + '\r\n');
                    }
                    return "Words have saved in " + fileName;
            }
        });
    }
    saveMp3File(url, fileName) {
        return new Promise((resolve, reject) => {
            var file = fs.createWriteStream(fileName, { autoClose: true });
            var request = https.get(url, res => {
                res.pipe(file);
            });
            request.on("error", error => {
                console.log(error);
                reject(error);
            });
            request.on("finish", () => {
                resolve('ok');
            });
        });
    }
    openLink(url) {
        electron_1.shell.openExternal(url);
    }
    exportBlankTest() {
        return __awaiter(this, void 0, void 0, function* () {
            let fileName = yield File_1.File.openFile('BlankTest', 'Blank', File_1.Filter.pdf);
            if (fileName == false) {
                return false;
            }
            let pdf = new pdfkit();
            pdf.pipe(fs.createWriteStream(fileName));
            let words = yield this.getAllWords();
            let wordsHasContent = words.filter((value, index, array) => {
                if (value.hasContent && value.example.length) {
                    return value;
                }
            });
            //write the title
            pdf.fontSize(20).text('Blank Filling Questions', { align: 'center' });
            //write blank words
            pdf.fontSize(15).text('Words you can fill:', { underline: true });
            let wordsHasContentSort = wordsHasContent.map((value, index, array) => {
                return value.word;
            }).sort();
            let wordsBlanks = wordsHasContentSort.join(',   ');
            pdf.fontSize(15).text(wordsBlanks).moveDown();
            //write the questions
            pdf.fontSize(15).text('Questions:', { underline: true });
            for (let index = 0; index < wordsHasContent.length; index++) {
                const element = wordsHasContent[index];
                let words = element.example.split(' ').filter((value, index, array) => {
                    if (value.includes('[xxx]')) {
                        return value;
                    }
                });
                let word = words.length == 1 ? words[0] : '[xxx]';
                let textContent = (index + 1) + '. ' + element.example.replace(word, '______');
                pdf.fontSize(15).text(textContent);
                //pdf.fontSize(8).text(element.define);
            }
            //draw the line
            pdf.fontSize(15).moveDown()
                .moveTo(0, pdf.y)
                .lineTo(pdf.page.width, pdf.y)
                .fillAndStroke().moveDown();
            //write the answers 
            pdf.fontSize(15).text('Answers:');
            let wordsWithAnswers = wordsHasContent.map((word, index, array) => {
                let words = word.example.split(' ').filter((value, index, array) => {
                    if (value.includes('[xxx]')) {
                        return value;
                    }
                });
                return (index + 1) + ':' +
                    (words.length === 1 ?
                        words[0].replace('[xxx]', word.word) :
                        word.word);
            });
            let answers = wordsWithAnswers.join(',   ');
            pdf.fontSize(15).text(answers);
            pdf.end();
        });
    }
    exportMutiChoiceTest() {
        return __awaiter(this, void 0, void 0, function* () {
            let fileName = yield File_1.File.openFile('MutipleChoice', 'Choice', File_1.Filter.pdf);
            if (fileName == false) {
                return false;
            }
            let pdf = new pdfkit();
            pdf.pipe(fs.createWriteStream(fileName));
            let words = yield this.getAllWords();
            let wordsHasContent = words.filter((value, index, array) => {
                if (value.hasContent && value.example.length) {
                    return value;
                }
            });
            //write the title
            pdf.fontSize(20).text('Mutiple Choice Questions', { align: 'center' });
            //write the questions
            let answersNumToLetter = new Array('A', 'B', 'C', 'D');
            let answersArray = new Array();
            for (let index = 0; index < wordsHasContent.length; index++) {
                let randomInt = Math.floor(Math.random() * 3.9);
                answersArray[index] = { answer: randomInt };
            }
            let answers = answersArray.map((value, index, array) => {
                return index + 1 + "," + answersNumToLetter[value.answer];
            }).join(';    ');
            pdf.fontSize(12).text('Questions:', { underline: true });
            for (let index = 0; index < wordsHasContent.length; index++) {
                const element = wordsHasContent[index];
                pdf.text((index + 1) + "." + element.word + ":", { stroke: true });
                let choices = new Array();
                choices.push(index);
                let randomInt = index;
                for (let i = 0; i < 4; i++) {
                    if (i === answersArray[index].answer) {
                        pdf.fontSize(12).text(answersNumToLetter[i] + "." + wordsHasContent[index].define);
                    }
                    else {
                        while (choices.includes(randomInt)) {
                            randomInt = Math.floor(Math.random() * (wordsHasContent.length - 0.1));
                            if (choices.includes(randomInt) == false) {
                                choices.push(randomInt);
                                break;
                            }
                        }
                        pdf.fontSize(12).text(answersNumToLetter[i] + "." + wordsHasContent[randomInt].define);
                    }
                }
            }
            //draw the line
            pdf.fontSize(15).moveDown()
                .moveTo(0, pdf.y)
                .lineTo(pdf.page.width, pdf.y)
                .fillAndStroke().moveDown();
            //write the answers 
            pdf.fontSize(12).text('Answers:');
            pdf.fontSize(12).text(answers);
            pdf.end();
        });
    }
}
exports.Basic = Basic;
//# sourceMappingURL=basic.js.map