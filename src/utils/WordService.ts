import * as https from 'https';
import * as cheerio from 'cheerio';
import { guessLanguage } from 'guesslanguage';
import { isArray } from 'util';
import Word from 'core/Models/Word';
import { configPara } from './ConfigPara';
import Log from './Log';
import Guid from './Guid';
const translate = window.require('node-google-translate-skidz');
const storage = window.require('electron-json-storage');

export class WordService {

  public getAllWords() {
    return new Promise<Array<Word>>((resolve, reject) => {
      storage.get('words', function (error: any, data: any) {
        if (error) { reject(error); }
        Log.Info(data);
        if (isArray(data)) {
          resolve(data);
        } else {
          resolve(new Array<Word>());
        }

      });
    });
  }
  getLanguage(text: string) {
    return new Promise<string>((resolve, reject) => {
      guessLanguage.detect(text, (result: string | PromiseLike<string> | undefined) => {
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
      }, function (params: { translation: string; }) {
        const result = new Word();
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
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
          var header = $body('.header').html() ?? '';
          var footer = $body('.footer').html() ?? '';
          
          result.important = $body('.frequent').html() != null;
          result.hasContent = $content.html() != null;
          const html = result.hasContent?$body.html().replace("href=\"/dictionary", "href=\"https://www.ldoceonline.com/dictionary").replace(header, '').replace(footer, ''):'';
          result.html = html;
          result.url = 'http://' + options.hostname + options.path;
          result.soundUrl = mp3Url;
          result.dictionary = 'Longman';
          result.type = pos;
          result.pronunciation = pronunciation;
          result.define = define.trim();
          result.sign = sign;
          result.example = exp.trim();
          result.id = Guid.newGuid();
          resolve(result);
        });
      });
      req.end();
    });
  }
  public async playSound(mp3Url: string) {
    try {
      const audio = new Audio(mp3Url);
      await audio.play();
    } catch (error) {
      Log.Warning(error)
    }
  }

  public updateWords(words: Array<Word>) {
    const promise = new Promise<Array<Word>>((resolve, reject) => {
      storage.set('words', words, (errorMsg: any) => {
        Log.Info(errorMsg);
        if (errorMsg) {
          reject(errorMsg);
        }
        resolve(words);
      });
    });
    return promise;
  }
  public deleteAllWords() {
    return new Promise((resolve, reject) => {
      storage.remove('words', (errorMsg: any) => {
        if (errorMsg) { throw errorMsg; }
        resolve('ok');
      });
    });
  }

}
