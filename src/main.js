"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https = require("https");
const cheerio = require("cheerio");
const storage = require("electron-json-storage");
const guessLanguage = require("guesslanguage");
const Word_1 = require("./Entities/Word");
class Main {
    constructor(parameters) {
    }
    getLanguage(text) {
        let promise = new Promise((resolve, reject) => {
            let lang = guessLanguage.guessLanguage.detect(text, result => {
                if (result == 'unknown') {
                    resolve('en');
                }
                resolve(result);
            });
        });
        return promise;
    }
    translateWord(source = 'cn', target = 'zh', word) {
        var translate = require('node-google-translate-skidz');
        let content = new Promise((resolve, reject) => {
            translate({
                text: word,
                source: source,
                target: target
            }, function (params) {
                resolve(params.translation);
            });
        });
        return content;
    }
    searchWord(word) {
        //get the define
        let content = new Promise((resolve, reject) => {
            let result = new Word_1.default();
            if (word.trim().indexOf(' ') > 0) {
                resolve(result);
            }
            let options = {
                "method": "GET",
                "hostname": "www.ldoceonline.com",
                "path": "/dictionary/" + word
            };
            let req = https.request(options, function (res) {
                let chunks = [];
                res.on("data", function (chunk) {
                    chunks.push(chunk);
                });
                res.on("end", function () {
                    let body = Buffer.concat(chunks);
                    let $body = cheerio.load(body.toString());
                    let $content = $body('.entry_content');
                    // let pos = "[" + $body('.POS').first().text().trim() + "]";
                    // let pron = "[" + $body('.PRON').first().text().replace(/,/g, '-').trim() + "]";
                    // let define = $body('#' + word + '__1 .DEF').text().replace(/,/g, '.');
                    let mp3Url = 'https://www.ldoceonline.com/' + $body('.brefile').first().attr('data-src-mp3');
                    // let exp = $body('#' + word + '__1 .EXAMPLE').first().text().replace(/,/g, '.').replace(word, '[xxx]').trim();
                    // if (exp.length == 0) {
                    //     exp = $body('.cexa1g1[info=UK]').first().text().replace(/,/g, '.').replace(word, '[xxx]').trim();
                    // }
                    let important = $body('.frequent') != undefined;
                    result.word = word;
                    result.important = important;
                    result.hasContent = $content != undefined;
                    result.html = ''; //result.isInLongmen ? $content.html() : '';
                    result.url = 'http://' + options.hostname + options.path;
                    result.soundUrl = mp3Url;
                    resolve(result);
                });
            });
            req.end();
        });
        return content;
    }
    playSound(mp3Url) {
        let audio = new Audio(mp3Url);
        audio.play();
    }
    navigateTranslate() {
        let path = `file://${__dirname}/../src/translate.html`;
        fetch(path).then(res => {
            return res.text;
        });
    }
    addWord(word) {
        let promise = new Promise((resolve, reject) => {
            storage.get('words', (error, words) => {
                if (error)
                    throw error;
                let wordsArray = new Array();
                if (words instanceof Array) {
                    wordsArray = words;
                }
                for (let index = 0; index < wordsArray.length; index++) {
                    const element = wordsArray[index];
                    if (element.word == word.word) {
                        wordsArray.splice(index, 1);
                    }
                }
                word.id = Date.now().toString();
                wordsArray.unshift(word);
                storage.set('words', wordsArray, error => {
                    if (error)
                        throw error;
                    resolve(word);
                });
            });
        });
        return promise;
    }
    getAllWords() {
        let words = new Promise((resolve, reject) => {
            storage.get('words', function (error, data) {
                if (error)
                    throw error;
                //document.getElementById('words').appendChild();
                resolve(data);
            });
        });
        return words;
    }
    deleteAllWords() {
        return new Promise((resovle, reject) => {
            storage.remove('words', (error) => {
                if (error)
                    throw error;
                resovle('ok');
            });
        });
    }
    deleteWord(wordId) {
        let promise = new Promise((resolve, reject) => {
            storage.get('words', (error, words) => {
                if (error)
                    throw error;
                let wordsArray = new Array();
                if (words instanceof Array) {
                    wordsArray = words;
                }
                for (let index = 0; index < wordsArray.length; index++) {
                    const element = wordsArray[index];
                    if (element.id == wordId) {
                        wordsArray.splice(index, 1);
                    }
                }
                storage.set('words', wordsArray, error => {
                    if (error)
                        throw error;
                    resolve(true);
                });
            });
        });
        return promise;
    }
}
exports.Main = Main;
//# sourceMappingURL=main.js.map