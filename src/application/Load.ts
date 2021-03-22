async function loadWordsAsync(culture: string, search: string, count: number) {
    if (!cache.find(x => x.culture === culture)) {
        const res = await fetch(`https://raw.githubusercontent.com/bryht/dian/master/public/resources/${culture}.txt`);
        const txt = await res.text();
        cache.push({
            culture: culture,
            words: txt.split('\n')
        })
    }
    return cache.find(x => x.culture === culture)?.words.filter(x => x.indexOf(search) > -1).slice(0, count);
}

//most-common-words-by-language
let cache: Array<{ culture: string, words: Array<string> }>=[];

export { loadWordsAsync };