// Valid cultures that have resource files
const validCultures = ['de', 'en', 'es', 'fr', 'it', 'ja', 'ko', 'nl', 'pt', 'ru', 'zh'];

async function loadWordsAsync(culture: string, search: string, count: number) {
    // Only load resources for valid cultures
    if (!validCultures.includes(culture)) {
        return [];
    }
    
    // Return empty if search is too short
    if (!search || search.length === 0) {
        return [];
    }
    
    if (!cache.find(x => x.culture === culture)) {
        try {
            const res = await fetch(`/resources/${culture}.txt`);
            if (!res.ok) {
                console.error(`Failed to load words for culture ${culture}, status: ${res.status}`);
                return [];
            }
            const txt = await res.text();
            cache.push({
                culture: culture,
                words: txt.split('\n').map(w => w.trim()).filter(w => w.length > 0)
            })
        } catch (error) {
            console.error(`Failed to load words for culture ${culture}:`, error);
            return [];
        }
    }
    
    const searchLower = search.toLowerCase();
    const cultureCache = cache.find(x => x.culture === culture);
    if (!cultureCache) {
        return [];
    }
    
    // Prioritize words that start with the search term, then include words that contain it
    const startsWithMatches = cultureCache.words.filter(x => x.toLowerCase().startsWith(searchLower));
    const containsMatches = cultureCache.words.filter(x => !x.toLowerCase().startsWith(searchLower) && x.toLowerCase().includes(searchLower));
    
    return [...startsWithMatches, ...containsMatches].slice(0, count);
}

//most-common-words-by-language
let cache: Array<{ culture: string, words: Array<string> }>=[];

export { loadWordsAsync };