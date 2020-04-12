/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import * as https from 'https';
import { WordService } from 'utils/WordService';
import { Filter,File } from 'utils/File';
const { shell } = window.require('electron');
const fs = window.require('fs-extra');
const pdfkit = window.require('pdfkit');

export interface ISettingsProps {
}

export default class Settings extends React.Component<ISettingsProps> {
  wordService: WordService;
  constructor(params: Readonly<ISettingsProps>) {
    super(params);
    this.wordService = new WordService();

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
  
  async deleteAllHistory() {

    const ok = await this.wordService.deleteAllWords();
    if (ok === 'ok') {
      // this.searchWordComponent.words = new Array();
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
      case 'quizlet':
        for (let index = 0; index < words.length; index++) {
          const element = words[index];
          const word = element.word.replace(',', '.');
          const translation = element.translation.trim().replace(',', '.');
          const define = element.define === undefined ? '' : element.define.replace(',', '.');
          const line = `${word},(${translation})${define}`;
          fs.appendFileSync(fileName, line + '\r\n');
        }
        alert('Words have saved in ' + fileName);
        break;
    }
  }

  async exportBlankTest() {
    const words = await this.wordService.getAllWords();

    const fileName = await File.openFile('Save', 'BlankTest', Filter.pdf);
    if (fileName === false) {
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

  async exportMutiChoiceTest() {
    const words = await this.wordService.getAllWords();

    const fileName = await File.openFile('Save', 'MultiTest', Filter.pdf);
    if (fileName === false) {
      return false;
    }
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
  public render() {
    return (
      <div className="btn-group-vertical">
        <div className="btn-group" role="group">
          <button id="dropdownMenuLink" type="button" className="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Delete
            </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
            <button type="button" className="dropdown-item" onClick={e => this.deleteAllHistory()}>
              All History
              </button>
          </div>
        </div>
        <div className="btn-group" role="group">
          <button type="button" className="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Export
            </button>
          <div className="dropdown-menu">
            <button type="button" className="dropdown-item" onClick={e => this.exportMutiChoiceTest()}>
              MutiChoice Test
              </button>
            <button type="button" className="dropdown-item" onClick={e => this.exportBlankTest()}>
              Blank Test
              </button>
            <button type="button" className="dropdown-item" onClick={e => this.exportWords('memrise')}>
              To Memrise
              </button>
            <button type="button" className="dropdown-item" onClick={e => this.exportWords('quizlet')}>
              To Quizlet
              </button >
            <button type="button" className="dropdown-item" onClick={e => this.exportWords('momo')}>
              To Momo
              </button >
          </div >
        </div >
        <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#settingModal">
          Setting
        </button>
        <button type="button" className="btn btn-warning" onClick={e=>this.openLink()}>
          How To Use
        </button >
      </div>
    );
  }
}
