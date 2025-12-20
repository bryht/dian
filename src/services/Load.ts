// Valid cultures that have resource files
const validCultures = ['de', 'en', 'es', 'fr', 'it', 'ja', 'ko', 'nl', 'pt', 'ru', 'zh'];

// Cache structure with proper typing
interface CacheEntry {
    culture: string;
    words: string[];
}

// In-memory cache for loaded word lists
let cache: CacheEntry[] = [];

export async function loadWordsAsync(culture: string, search: string, count: number) {
    // Only load resources for valid cultures
    if (!validCultures.includes(culture)) {
        return [];
    }
    
    // Return empty if search is too short
    if (!search || search.length === 0) {
        return [];
    }
    
    if (!cache.find(x => x.culture === culture)) {
            let txt: string | null = null;
            // Try HTTP fetch first (dev server)
            try {
                console.log(`[loadWordsAsync] fetching /resources/${culture}.txt`);
                const res = await fetch(`https://raw.githubusercontent.com/bryht/dian/master/public/resources/${culture}.txt`);
                if (res.ok) {
                    txt = await res.text();
                } else {
                    console.warn(`[loadWordsAsync] HTTP ${res.status} for /resources/${culture}.txt`);
                }
            } catch (error) {
                console.warn(`[loadWordsAsync] HTTP fetch failed for /resources/${culture}.txt:`, error);
            }

            if (txt == null) {
                console.error(`[loadWordsAsync] Unable to load words for culture ${culture} from HTTP or filesystem.`);
                return [];
            }

            cache.push({
                culture: culture,
                words: txt.split('\n').map(w => w.trim()).filter(w => w.length > 0)
            });
            const added = cache.find(x => x.culture === culture)?.words.length || 0;
            console.log(`[loadWordsAsync] loaded ${added} words for ${culture}`);
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