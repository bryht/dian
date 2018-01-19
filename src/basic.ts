import * as https from 'https';
import * as fs from 'fs-extra';
import * as readline from 'readline';
import { app, remote, shell } from 'electron';
import * as storage from 'electron-json-storage';
import Word from './Entities/Word';

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
        let folderName = fileName.split('.')[0] + "audio";
        let words = await this.getAllWords();
        let checkFolder = await fs.ensureDir(folderName);
        for (let index = 0; index < words.length; index++) {
            const element = words[index];
            if (element.hasContent == false || element.isPhrase) continue;
            switch (target) {
                case "memrise":
                    let line = `${element.word},${element.type},${element.define},[${element.translation}]${element.pronunciation},${element.example}`; element.word + ',' + element.define;
                    fs.appendFileSync(fileName, line + '\r\n');
                    await this.saveMp3File(element.soundUrl, folderName + "\\" + element.word + ".mp3");
                    return "Words have saved in " + fileName + "\n\t Audios have saved in " + folderName;
                case "momo":
                    fs.appendFileSync(fileName, element.word + '\r\n');
                    return "Words have saved in " + fileName;
                default:
                    break;
            }
        }
        return 'input wrong';
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

    openLink(url: string) {
        shell.openExternal(url);
    }

}