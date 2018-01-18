import * as https from 'https';
import * as fs from 'fs-extra';
import * as readline from 'readline';
import { app, remote, crashReporter } from 'electron';
import * as storage from 'electron-json-storage';
import Word from './Entities/Word';
import { EPROTO } from 'constants';
import { electronIsDev } from 'electron-is-dev';


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
export class Basic {

    getAllWords() {

        let words = new Promise<Array<Word>>((resolve, reject) => {
            storage.get('words', function (error, data) {
                if (error) throw error;
                resolve(data as Array<Word>);
            });
        });

        return words;
    }

    async exportWords(target: string = 'memrise') {
        let fileName = await new Promise<string>(resolve => {
            remote.dialog.showSaveDialog({
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
        let words = await this.getAllWords();
        let checkFolder = await fs.ensureDir(folderName);
        for (let index = 0; index < words.length; index++) {
            const element = words[index];
            if (element.isPhrase) continue;
            switch (target) {
                case "memrise":
                    let line = `${element.word},${element.type},${element.define},[${element.translation}]${element.pronunciation},${element.example}`; element.word + ',' + element.define;
                    fs.appendFileSync(fileName, line + '\r\n');
                    await this.saveMp3File(element.soundUrl, folderName + "\\" + element.word + ".mp3");
                    break;
                case "momo":
                    fs.appendFileSync(fileName, element.word + '\r\n');
                    break;
                default:
                    break;
            }
        }
        return 'ok';
    }
    saveMp3File(url: string, fileName: string) {
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