import * as https from 'https';
import * as cheerio from 'cheerio';
import { getConfig, setConfig, initConfig, getDetail } from './config';
import DefaultConfig from './Entities/DefaultConfig';
import Word from './Entities/Word';
import * as guessLanguage from 'guesslanguage';
export class Dictionary {
    config = null;
    detail = null;
    constructor() {
    }
    async init() {
        await initConfig();
        this.config = await getConfig();
        this.detail = getDetail();
    }

    getLanguage(text: string) {
        return new Promise<string>((resolve, reject) => {
            let lang = guessLanguage.guessLanguage.detect(text, result => {
                if (result == 'unknown') {
                    result = 'en';
                }
                if (result != this.detail.source &&
                    result != this.detail.target) {
                    reject('language is wrong');
                }
                resolve(result);
            })
        });
    }
    translateWord(wordLanguage: string, input: string) {
        var translate = require('node-google-translate-skidz');
        var isTarget = wordLanguage == this.detail.target;
        var inputWord = input.trim();
        return new Promise<Word>((resolve, reject) => {
            translate({
                text: inputWord,
                source: isTarget ? this.detail.target : this.detail.source,//translation is opposite with setting
                target: isTarget ? this.detail.source : this.detail.target,
            }, function (params) {
                let result = new Word();
                result.word = isTarget ? inputWord : params.translation;
                result.translation = isTarget ? params.translation : inputWord;
                result.isPhrase = result.word.indexOf(' ') > 0.
                resolve(result);
            });
        });
    }
    async  GetLongmenWord(input: string) {
        let inputLanguage = await this.getLanguage(input);
        let result = await this.translateWord(inputLanguage, input);
        //get the define
        return new Promise<Word>((resolve, reject) => {
            if (result.isPhrase) {
                resolve(result);
            }
            let options = {
                "method": "GET",
                "hostname": "www.ldoceonline.com",
                "path": "/dictionary/" + result.word
            };
            let req = https.request(options, function (res) {
                let chunks: Buffer[] = [];
                res.on("data", function (chunk) {
                    chunks.push(chunk as Buffer);
                });
                res.on("end", function () {
                    let body = Buffer.concat(chunks);
                    let $body = cheerio.load(body.toString());
                    let $content = $body('.entry_content');
                    let pos = "[" + $body('.POS').first().text().trim() + "]";//none. verb.
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
                    result.html = '';//result.isInLongmen ? $content.html() : '';
                    result.url = 'http://' + options.hostname + options.path;
                    result.soundUrl = mp3Url;
                    result.dictionary = "Longmen";
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
}