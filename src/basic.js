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
}
exports.Basic = Basic;
//# sourceMappingURL=basic.js.map