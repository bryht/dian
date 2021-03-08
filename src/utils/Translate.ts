import Word from 'core/Models/Word';
import { guessLanguage } from 'guesslanguage';
const translate = window.require('node-google-translate-skidz');

function getLanguage(text: string) {
    return new Promise<string>((resolve, reject) => {
        guessLanguage.detect(text, (result: string | PromiseLike<string>) => {
            if (result === 'unknown') {
                result = 'en';
            }
            resolve(result);
        });
    });
}

function translateWord(fromCulture: string, toCulture: string, inputWord: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        translate({
            text: inputWord,
            source: fromCulture,
            target: toCulture,
        }, function (params: { translation: string; }) {
            resolve(params.translation);
        });
    });
}

export { guessLanguage, translateWord }