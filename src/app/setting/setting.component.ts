import { Component, OnInit } from '@angular/core';
import * as pdfkit from 'pdfkit';
import { shell, ipcRenderer } from 'electron';
import * as fs from 'fs-extra';
import * as readline from 'readline';
import * as https from 'https';
import { File, Filter } from '../file.utility';
import { WordService } from '../word.service';
@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

  constructor(private wordService: WordService) { }

  ngOnInit() {
  }

  openLink() {
    const url = 'https://bryht.gitbooks.io/dict/how-to-use.html';
    shell.openExternal(url);
  }

  saveMp3File(url: string, fileName: string) {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(fileName, { autoClose: true });
      const request = https.get(url, res => {
        res.pipe(file);
      });
      request.on('error', error => {
        console.log(error);
        reject(error);
      });
      request.on('finish', () => {
        resolve('ok');
      });
    });
  }
  async  exportBlankTest() {
    const words = await this.wordService.getAllWords();
    ipcRenderer.send('message', 'exportBlankTest', words);
  }
  async exportMutiChoiceTest() {
    const words = await this.wordService.getAllWords();
    ipcRenderer.send('message', 'exportMutiChoiceTest', words);
  }
  async deleteAllHistory() {

    const ok = await this.wordService.deleteAllWords();
    if (ok === 'ok') {
      window.location.reload();
    }
  }
  async exportWords(target: string = 'memrise') {

    const fileName = await File.openFile('SaveWords', 'WordList', Filter.txt);
    if (fileName === false) {
      return false;
    }
    const words = await this.wordService.getAllWords();
    switch (target) {
      case 'memrise':
        const folderName = fileName.split('.')[0] + 'audio';
        const checkFolder = await fs.ensureDir(folderName);
        for (let index = 0; index < words.length; index++) {
          const element = words[index];
          if (element.hasContent === false || element.isPhrase) { continue; }
          const line = `${element.word},${element.type},${element.define},
          [${element.translation}]${element.pronunciation},${element.example}`;
          fs.appendFileSync(fileName, line + '\r\n');
          await this.saveMp3File(element.soundUrl, folderName + '\\' + element.word + '.mp3');
        }
        const message = 'Words have saved in ' + fileName + '\n\t Audios have saved in ' + folderName;
        alert(message);
        break;
      case 'momo':
        for (let index = 0; index < words.length; index++) {
          const element = words[index];
          if (element.hasContent === false || element.isPhrase) { continue; }
          fs.appendFileSync(fileName, element.word + '\r\n');
        }
        const messageMomo = 'Words have saved in ' + fileName;
        alert(messageMomo);
        break;
    }
  }
}
