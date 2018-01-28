"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const https = require("https");
const cheerio = require("cheerio");
const config_1 = require("./config");
const Word_1 = require("./Entities/Word");
const guessLanguage = require("guesslanguage");
class Dictionary {
    constructor() {
        this.config = null;
        this.detail = null;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield config_1.initConfig();
            this.config = yield config_1.getConfig();
            this.detail = config_1.getDetail();
        });
    }
    getLanguage(text) {
        return new Promise((resolve, reject) => {
            let lang = guessLanguage.guessLanguage.detect(text, result => {
                if (result == 'unknown') {
                    result = 'en';
                }
                if (result != this.detail.source &&
                    result != this.detail.target) {
                    reject('language is wrong');
                }
                resolve(result);
            });
        });
    }
    translateWord(wordLanguage, input) {
        var translate = require('node-google-translate-skidz');
        var isTarget = wordLanguage == this.detail.target;
        var inputWord = input.trim();
        return new Promise((resolve, reject) => {
            translate({
                text: inputWord,
                source: isTarget ? this.detail.target : this.detail.source,
                target: isTarget ? this.detail.source : this.detail.target,
            }, function (params) {
                let result = new Word_1.default();
                result.word = (isTarget ? inputWord : params.translation).toLowerCase();
                result.translation = isTarget ? params.translation : inputWord;
                result.isPhrase = result.word.indexOf(' ') > 0;
                resolve(result);
            });
        });
    }
    GetLongmenWord(input) {
        return __awaiter(this, void 0, void 0, function* () {
            let inputLanguage = yield this.getLanguage(input);
            let result = yield this.translateWord(inputLanguage, input);
            //get the define
            return new Promise((resolve, reject) => {
                if (result.isPhrase) {
                    resolve(result);
                }
                let options = {
                    "method": "GET",
                    "hostname": "www.ldoceonline.com",
                    "path": "/dictionary/" + result.word
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
                        let pos = "[" + $body('.POS').first().text().trim() + "]"; //none. verb.
                        let pronunciation = "[" + $body('.PRON').first().text().replace(/,/g, '-').trim() + "]";
                        let define = $body('#' + result.word + '__1 .DEF').text().replace(/,/g, '.');
                        let mp3Url = 'https://www.ldoceonline.com/' + $body('.brefile').first().attr('data-src-mp3');
                        let exp = $body('#' + result.word + '__1 .EXAMPLE').first().text().replace(/,/g, '.').replace(result.word, '[xxx]').trim();
                        if (exp.length == 0) {
                            exp = $body('.cexa1g1[info=UK]').first().text().replace(/,/g, '.').replace(result.word, '[xxx]').trim();
                        }
                        let sign = $body('.FREQ').text();
                        result.important = $body('.frequent').html() != null;
                        result.hasContent = $content.html() != null;
                        result.html = ''; //result.isInLongmen ? $content.html() : '';
                        result.url = 'http://' + options.hostname + options.path;
                        result.soundUrl = mp3Url;
                        result.dictionary = "Longman";
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
        });
    }
}
exports.Dictionary = Dictionary;
//# sourceMappingURL=dictionary.js.map