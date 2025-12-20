import { franc } from 'franc';

// Simple language detection using franc
function getCulture(text: string): Promise<string | null> {
    return new Promise<string | null>((resolve) => {
        try {
            const langCode = franc(text, { minLength: 1 });
            if (langCode === 'und') {
                resolve(null);
            } else {
                // franc returns ISO 639-3, but we need ISO 639-1 for some cases
                // Map common languages
                const iso3ToIso1: Record<string, string> = {
                    'eng': 'en',
                    'deu': 'de',
                    'fra': 'fr',
                    'spa': 'es',
                    'ita': 'it',
                    'por': 'pt',
                    'nld': 'nl',
                    'rus': 'ru',
                    'jpn': 'ja',
                    'kor': 'ko',
                    'cmn': 'zh',
                    'zho': 'zh',
                };
                resolve(iso3ToIso1[langCode] || langCode);
            }
        } catch {
            resolve(null);
        }
    });
}

// Using Google Translate API via web fetch
async function translateWord(fromCulture: string, toCulture: string, inputWord: string): Promise<string> {
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromCulture}&tl=${toCulture}&dt=t&q=${encodeURIComponent(inputWord)}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data && data[0] && data[0][0] && data[0][0][0]) {
            return data[0][0][0];
        }
        return inputWord;
    } catch (error) {
        console.error('Translation error:', error);
        return inputWord;
    }
}

export { getCulture, translateWord };