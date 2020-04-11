// import * as https from 'https';
import * as storage from 'electron-json-storage';
// import * as cheerio from 'cheerio';
// import { guessLanguage } from 'guesslanguage';
// import * as translate from 'node-google-translate-skidz';
import { isArray } from 'util';
import Word from 'core/Models/Word';
const { shell } = window.require("electron")

// const configPara = {
//     'default': {
//         'source': 'zh',
//         'target': 'en',
//         'name': 'Longman',
//         'value': 'longman',
//         'function': 'getLongmanWord',
//         'playSound': 'true'
//     },
//     'playSoundOptions': [
//         {
//             'name': 'play',
//             'value': 'true'
//         },
//         {
//             'name': 'do not play',
//             'value': 'false'
//         }
//     ],
//     'languageSource': [
//         {
//             'name': '中文',
//             'value': 'zh'
//         },
//         {
//             'name': '한국어',
//             'value': 'ko'
//         },
//         {
//             'name': '日本語',
//             'value': 'ja'
//         },
//         {
//             'name': 'Ελληνικά',
//             'value': 'el'
//         },
//         {
//             'name': 'Nederlands',
//             'value': 'nl'
//         },
//         {
//             'name': 'bahasa Indonesia',
//             'value': 'id'
//         }
//     ],
//     'languageTarget': [
//         {
//             'name': 'English',
//             'value': 'en'
//         }
//     ],
//     'languageDetail': [
//         {
//             'source': 'zh',

//             'target': 'en',
//             'name': 'Longman',
//             'value': 'longman',
//             'function': 'getLongmanWord'
//         }
//     ]
// };

// const configName = 'config2';
// async function initConfig() {
//     const hasKeyPromise = new Promise<boolean>(resolve => {
//         storage.has(configName, (errorMsg, result) => {
//             if (errorMsg) { throw errorMsg; }
//             resolve(result);
//         });
//     });
//     const hasKey = await hasKeyPromise;
//     if (hasKey === false) {
//         storage.set(configName, configPara.default, (errorMsg) => { if (errorMsg) { throw errorMsg; } });
//     } else {
//         await getConfig();
//     }
// }
// async function setConfig(name: string, value: any) {
//     configPara.default.name = value;
//     storage.set(configName, configPara.default, errorMsg => { if (errorMsg) { throw errorMsg; } });
// }
// async function getConfig() {
//     const getConfigPromise = new Promise<typeof configPara.default>(resolve => {
//         storage.get(configName, (errorMsg, result) => {
//             if (errorMsg) { throw errorMsg; }
//             resolve(result as typeof configPara.default);
//         });
//     });
//     configPara.default = await getConfigPromise;
//     return configPara;
// }
// function getDetail() {
//     const detail = configPara.languageDetail.find(element => {
//         return element.source === configPara.default.source &&
//             element.target === configPara.default.target;
//     });
//     return detail;
// }
// export {
//     configPara, setConfig, getConfig, initConfig, getDetail
// };

export class WordService {

  public getAllWords() {
    // new Promise<Array<Word>>((resolve, reject) => {
    //   storage.get('words', function (error, data) {
    //     if (error) { reject(error); }
    //     if (isArray(data)) {
    //       resolve(data as Array<Word>);
    //     } else {
    //       resolve(new Array<Word>());
    //     }

    //   });
    // });
    const url = 'https://bryht.gitbooks.io/dict/how-to-use.html';
    shell.openExternal(url);
    return new Array<Word>();
  }
  // getLanguage(text: string) {
  //   return new Promise<string>((resolve, reject) => {
  //     guessLanguage.detect(text, (result: string | PromiseLike<string> | undefined) => {
  //       if (result === 'unknown') {
  //         result = 'en';
  //       }
  //       resolve(result);
  //     });
  //   });
  // }
  // translateWord(inputLanguage: string, inputWord: string) {
  //   const isTarget = inputLanguage === configPara.default.target;
  //   return new Promise<Word>((resolve, reject) => {
  //     translate({
  //       text: inputWord,
  //       source: isTarget ? configPara.default.target : configPara.default.source, // translation is opposite with setting
  //       target: isTarget ? configPara.default.source : configPara.default.target,
  //     }, function (params: { translation: string; }) {
  //       const result = new Word();
  //       // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  //       result.word = (isTarget ? inputWord : <string>params.translation).toLowerCase();
  //       result.translation = isTarget ? params.translation : inputWord;
  //       result.isPhrase = result.word.indexOf(' ') > 0;
  //       resolve(result);
  //     });
  //   });
  // }
  // public async getLongmanWord(inputWord: string) {
  //   const inputLanguage = await this.getLanguage(inputWord);
  //   const result = await this.translateWord(inputLanguage, inputWord);
  //   // get the define
  //   return new Promise<Word>((resolve, reject) => {
  //     if (result.isPhrase) {
  //       resolve(result);
  //     }
  //     const options = {
  //       'method': 'GET',
  //       'hostname': 'www.ldoceonline.com',
  //       'path': '/dictionary/' + result.word
  //     };
  //     const req = https.request(options, function (res) {
  //       const chunks: Buffer[] = [];
  //       res.on('data', function (chunk) {
  //         chunks.push(chunk as Buffer);
  //       });
  //       res.on('end', function () {
  //         const body = Buffer.concat(chunks);
  //         const $body = cheerio.load(body.toString());
  //         const $content = $body('.entry_content');
  //         const pos = '[' + $body('.POS').first().text().trim() + ']'; // none. verb.
  //         const pronunciation = '[' + $body('.PRON').first().text().replace(/,/g, '-').trim() + ']';
  //         const define = $body('#' + result.word + '__1 .DEF').text().replace(/,/g, '.');
  //         const mp3Url = $body('.brefile').first().attr('data-src-mp3');
  //         let exp = $body('#' + result.word + '__1 .EXAMPLE').first().text().replace(/,/g, '.').replace(result.word, '[xxx]').trim();
  //         if (exp.length === 0) {
  //           exp = $body('.cexa1g1[info=UK]').first().text().replace(/,/g, '.').replace(result.word, '[xxx]').trim();
  //         }
  //         const sign = $body('.FREQ').text();
  //         result.important = $body('.frequent').html() != null;
  //         result.hasContent = $content.html() != null;
  //         result.html = ''; // result.isInLongmen ? $content.html() : '';
  //         result.url = 'http://' + options.hostname + options.path;
  //         result.soundUrl = mp3Url;
  //         result.dictionary = 'Longman';
  //         result.type = pos;
  //         result.pronunciation = pronunciation;
  //         result.define = define.trim();
  //         result.sign = sign;
  //         result.example = exp.trim();
  //         resolve(result);
  //       });
  //     });
  //     req.end();
  //   });
  // }
  // public playSound(mp3Url: string) {
  //   const audio = new Audio(mp3Url);
  //   audio.play().then(value => { }).catch(error => console.log(error));
  // }

  // public updateWords(words: Array<Word>) {
  //   const promise = new Promise<Array<Word>>((resolve, reject) => {
  //     storage.set('words', words, errorMsg => {
  //       if (errorMsg) {
  //         reject(errorMsg);
  //       }
  //       resolve(words);
  //     });
  //   });
  //   return promise;
  // }
  // public insertWord(word: Word, wordsArray: Array<Word>) {
  //   for (let index = 0; index < wordsArray.length; index++) {
  //     const element = wordsArray[index];
  //     if (element.word === word.word) {
  //       wordsArray.splice(index, 1);
  //     }
  //   }
  //   word.id = Date.now().toString();
  //   wordsArray.unshift(word);
  //   return word;
  // }
  // public deleteWord(id: string, wordsArray: Array<Word>) {
  //   for (let index = 0; index < wordsArray.length; index++) {
  //     const element = wordsArray[index];
  //     if (element.id === id) {
  //       wordsArray.splice(index, 1);
  //     }
  //   }
  //   return id;
  // }
  // public deleteAllWords() {
  //   return new Promise((resolve, reject) => {
  //     storage.remove('words', (errorMsg) => {
  //       if (errorMsg) { throw errorMsg; }
  //       resolve('ok');
  //     });
  //   });
  // }

}
