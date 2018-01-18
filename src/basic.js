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
const electron_is_dev_1 = require("electron-is-dev");
//Crash Reporter
if (electron_is_dev_1.electronIsDev) {
    electron_1.app.setPath('temp', 'C:/Users/liming/Desktop/DictLog/');
    electron_1.crashReporter.start({
        productName: 'Dict',
        companyName: 'bryht',
        uploadToServer: true,
        submitURL: 'localhost'
    });
}
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
    exportWords() {
        return __awaiter(this, void 0, void 0, function* () {
            let fileName = yield new Promise(resolve => {
                electron_1.remote.dialog.showSaveDialog({
                    'title': 'SaveWords',
                    'defaultPath': 'wordlist-result',
                    'filters': [{ 'name': 'txt', 'extensions': ['txt'] }],
                    'buttonLabel': 'SaveWords'
                }, result => {
                    resolve(result);
                });
            });
            if (fileName == undefined) {
                return 'file name is null';
            }
            let folderName = fileName.split('.')[0] + "Audio";
            let words = yield this.getAllWords();
            let checkFolder = yield fs.ensureDir(folderName);
            for (let index = 0; index < words.length; index++) {
                const element = words[index];
                if (element.isPhrase)
                    continue;
                let line = `${element.word},${element.type},${element.define},[${element.translation}]${element.pronunciation},${element.example}`;
                element.word + ',' + element.define;
                fs.appendFileSync(fileName, line + '\n');
                yield this.saveMp3File(element.soundUrl, folderName + "\\" + element.word + ".mp3");
            }
            return 'ok';
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
}
exports.Basic = Basic;
//# sourceMappingURL=basic.js.map