import { guessLanguage } from 'guesslanguage';
const translate = window.require('node-google-translate-skidz');

function getCulture(text: string) {
    return new Promise<string | null>((resolve, reject) => {
        guessLanguage.detect(text, (result: string | PromiseLike<string | null> | null) => {
            if (result === 'unknown') {
                result = null;
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

export { getCulture, translateWord }