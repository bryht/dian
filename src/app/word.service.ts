import { Injectable } from '@angular/core';
import * as https from 'https';
import * as storage from 'electron-json-storage';
import * as cheerio from 'cheerio';
import Word from './word.model';
import { guessLanguage } from 'guesslanguage';
import * as translate from 'node-google-translate-skidz';
import { configPara } from './config';
import { isArray } from 'util';
@Injectable()
export class WordService {

  constructor() { }

  public getAllWords() {
    const words = new Promise<Array<Word>>((resolve, reject) => {
      storage.get('words', function (error, data) {
        if (error) { reject(error); }
        if (isArray(data)) {
          resolve(data as Array<Word>);
        } else {
          resolve(new Array<Word>());
        }

      });
    });
    return words;
  }
  getLanguage(text: string) {
    return new Promise<string>((resolve, reject) => {
      const lang = guessLanguage.detect(text, result => {
        if (result === 'unknown') {
          result = 'en';
        }
        resolve(result);
      });
    });
  }
  translateWord(inputLanguage: string, inputWord: string) {
    const isTarget = inputLanguage === configPara.default.target;
    return new Promise<Word>((resolve, reject) => {
      translate({
        text: inputWord,
        source: isTarget ? configPara.default.target : configPara.default.source, // translation is opposite with setting
        target: isTarget ? configPara.default.source : configPara.default.target,
      }, function (params) {
        const result = new Word();
        result.word = (isTarget ? inputWord : <string>params.translation).toLowerCase();
        result.translation = isTarget ? params.translation : inputWord;
        result.isPhrase = result.word.indexOf(' ') > 0;
        resolve(result);
      });
    });
  }
  public async getLongmanWord(inputWord: string) {
    const inputLanguage = await this.getLanguage(inputWord);
    const result = await this.translateWord(inputLanguage, inputWord);
    // get the define
    return new Promise<Word>((resolve, reject) => {
      if (result.isPhrase) {
        resolve(result);
      }
      const options = {
        'method': 'GET',
        'hostname': 'www.ldoceonline.com',
        'path': '/dictionary/' + result.word
      };
      const req = https.request(options, function (res) {
        const chunks: Buffer[] = [];
        res.on('data', function (chunk) {
          chunks.push(chunk as Buffer);
        });
        res.on('end', function () {
          const body = Buffer.concat(chunks);
          const $body = cheerio.load(body.toString());
          const $content = $body('.entry_content');
          const pos = '[' + $body('.POS').first().text().trim() + ']'; // none. verb.
          const pronunciation = '[' + $body('.PRON').first().text().replace(/,/g, '-').trim() + ']';
          const define = $body('#' + result.word + '__1 .DEF').text().replace(/,/g, '.');
          const mp3Url = $body('.brefile').first().attr('data-src-mp3');
          let exp = $body('#' + result.word + '__1 .EXAMPLE').first().text().replace(/,/g, '.').replace(result.word, '[xxx]').trim();
          if (exp.length === 0) {
            exp = $body('.cexa1g1[info=UK]').first().text().replace(/,/g, '.').replace(result.word, '[xxx]').trim();
          }
          const sign = $body('.FREQ').text();
          result.important = $body('.frequent').html() != null;
          result.hasContent = $content.html() != null;
          result.html = ''; // result.isInLongmen ? $content.html() : '';
          result.url = 'http://' + options.hostname + options.path;
          result.soundUrl = mp3Url;
          result.dictionary = 'Longman';
          result.type = pos;
          result.pronunciation = pronunciation;
          result.define = define.trim();
          result.sign = sign;
          result.example = exp.trim();
          resolve(result);
        });
      });
      req.end();
    });
  }
  public playSound(mp3Url: string) {
    const audio = new Audio(mp3Url);
    audio.play().then(value => { }).catch(error => console.log(error));
  }

  public updateWords(words: Array<Word>) {
    const promise = new Promise<Array<Word>>((resolve, reject) => {
      storage.set('words', words, errorMsg => {
        if (errorMsg) {
          reject(errorMsg);
        }
        resolve(words);
      });
    });
    return promise;
  }
  public insertWord(word: Word, wordsArray: Array<Word>) {
    for (let index = 0; index < wordsArray.length; index++) {
      const element = wordsArray[index];
      if (element.word === word.word) {
        wordsArray.splice(index, 1);
      }
    }
    word.id = Date.now().toString();
    wordsArray.unshift(word);
    return word;
  }
  public deleteWord(id: string, wordsArray: Array<Word>) {
    for (let index = 0; index < wordsArray.length; index++) {
      const element = wordsArray[index];
      if (element.id === id) {
        wordsArray.splice(index, 1);
      }
    }
    return id;
  }
  public deleteAllWords() {
    return new Promise((resovle, reject) => {
      storage.remove('words', (errorMsg) => {
        if (errorMsg) { throw errorMsg; }
        resovle('ok');
      });
    });
  }

}
