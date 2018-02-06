import { Component, OnInit } from '@angular/core';
import * as pdfkit from 'pdfkit';
import { shell } from 'electron';
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
  async exportBlankTest() {
    const fileName = await File.openFile('BlankTest', 'Blank', Filter.pdf);
    if (fileName === false) {
      return false;
    }
    // const pdf = new pdfkit();

    // pdf.pipe(fs.createWriteStream(fileName));
    // const words = await this.wordService.getAllWords();
    // const wordsHasContent = words.filter((value, index, array) => {
    //   if (value.hasContent && value.example.length) {
    //     return value;
    //   }
    // });
    // // write the title
    // pdf.fontSize(20).text('Blank Filling Questions', { align: 'center' });
    // // write blank words
    // pdf.fontSize(15).text('Words you can fill:', { underline: true });
    // const wordsHasContentSort = wordsHasContent.map((value, index, array) => {
    //   return value.word;
    // }).sort();
    // const wordsBlanks = wordsHasContentSort.join(',   ');
    // pdf.fontSize(15).text(wordsBlanks).moveDown();
    // // write the questions
    // pdf.fontSize(15).text('Questions:', { underline: true });
    // for (let index = 0; index < wordsHasContent.length; index++) {
    //   const element = wordsHasContent[index];
    //   const sentence = element.example.split(' ').filter((value, i, array) => {
    //     if (value.includes('[xxx]')) {
    //       return value;
    //     }
    //   });
    //   const word = sentence.length === 1 ? sentence[0] : '[xxx]';
    //   const textContent = (index + 1) + '. ' + element.example.replace(word, '______');
    //   pdf.fontSize(15).text(textContent);
    // }
    // // draw the line
    // pdf.fontSize(15).moveDown()
    //   .moveTo(0, pdf.y)
    //   .lineTo(pdf.page.width, pdf.y)
    //   .fillAndStroke().moveDown();
    // // write the answers
    // pdf.fontSize(15).text('Answers:');
    // const wordsWithAnswers = wordsHasContent.map((word, index, array) => {
    //   const answerWords = word.example.split(' ').filter((value, i, list) => {
    //     if (value.includes('[xxx]')) {
    //       return value;
    //     }
    //   });
    //   return (index + 1) + ':' +
    //     (answerWords.length === 1 ?
    //       answerWords[0].replace('[xxx]', word.word) :
    //       word.word);
    // });
    // const answers = wordsWithAnswers.join(',   ');
    // pdf.fontSize(15).text(answers);
    // pdf.end();

  }
  // async exportMutiChoiceTest() {
  //   const fileName = await File.openFile('MutipleChoice', 'Choice', Filter.pdf);
  //   if (fileName === false) {
  //     return false;
  //   }
  //   const pdf = new pdfkit();
  //   pdf.pipe(fs.createWriteStream(fileName));
  //   const words = await this.wordService.getAllWords();
  //   const wordsHasContent = words.filter((value, index, array) => {
  //     if (value.hasContent && value.example.length) {
  //       return value;
  //     }
  //   });
  //   // write the title
  //   pdf.fontSize(20).text('Mutiple Choice Questions', { align: 'center' });
  //   // write the questions
  //   const answersNumToLetter = new Array('A', 'B', 'C', 'D');
  //   const answersArray = new Array<{ answer: number }>();
  //   for (let index = 0; index < wordsHasContent.length; index++) {
  //     const randomInt = Math.floor(Math.random() * 3.9);
  //     answersArray[index] = { answer: randomInt };
  //   }
  //   const answers = answersArray.map((value, index, array) => {
  //     return index + 1 + ',' + answersNumToLetter[value.answer];
  //   }).join(';    ');
  //   pdf.fontSize(12).text('Questions:', { underline: true });
  //   for (let index = 0; index < wordsHasContent.length; index++) {
  //     const element = wordsHasContent[index];
  //     pdf.text((index + 1) + '.' + element.word + ':', { stroke: true });
  //     const choices = new Array();
  //     choices.push(index);
  //     let randomInt = index;
  //     for (let i = 0; i < 4; i++) {
  //       if (i === answersArray[index].answer) {
  //         pdf.fontSize(12).text(answersNumToLetter[i] + '.' + element.define);
  //       } else {
  //         while (choices.includes(randomInt)) {
  //           randomInt = Math.floor(Math.random() * (wordsHasContent.length - 0.1));
  //           if (choices.includes(randomInt) === false) {
  //             choices.push(randomInt);
  //             break;
  //           }
  //         }
  //         pdf.fontSize(12).text(answersNumToLetter[i] + '.' + wordsHasContent[randomInt].define);
  //       }
  //     }
  //   }
  //   // draw the line
  //   pdf.fontSize(15).moveDown()
  //     .moveTo(0, pdf.y)
  //     .lineTo(pdf.page.width, pdf.y)
  //     .fillAndStroke().moveDown();
  //   // write the answers.
  //   pdf.fontSize(12).text('Answers:');
  //   pdf.fontSize(12).text(answers);
  //   pdf.end();
  // }
  async deleteAllHistory() {
    
    const ok = await this.wordService.deleteAllWords();
    if (ok === 'ok') {
      window.location.reload();
      // TODO: fresh history list
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
