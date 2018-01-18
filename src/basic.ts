import * as https from 'https';
import * as fs from 'fs-extra';
import * as readline from 'readline';
import { remote } from 'electron';
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

    async exportWords() {
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

        let folderName = fileName.split('.')[0] + "Audio";
        let words = await this.getAllWords();
        let checkFolder=await fs.ensureDir(folderName);
        for (let index = 0; index < words.length; index++) {
            const element = words[index];
            let line = `${element.word},${element.type},${element.define},[${element.translation}]${element.pronunciation},${element.example}`; element.word + ',' + element.define;
            fs.appendFile(fileName, line + '\n', error => {
                if (error) {
                    throw error;
                }
                console.log(line + '---Saved!');
            });
            this.saveMp3File(element.soundUrl, folderName + "\\" + element.word + ".mp3");
        }
    }
    saveMp3File(url: string, fileName: string) {
        var file = fs.createWriteStream(fileName);
        file.on('finish', function () {
            file.close();  // close() is async, call cb after close completes.
        });
        var request = https.get(url, res => {
            res.pipe(file);
        });

    }


}