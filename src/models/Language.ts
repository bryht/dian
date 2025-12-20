
class Language {
    culture!: string;
    cultureFull!: string;
    cultureName!: string;
    isSelected: boolean = false;
    isUsed: boolean = false;
    detailLink: string = '';
    detailHideTop: number = 0;
    detailHideFilters: Array<string> = [];

}

const languages: Array<Language> = [
    {
        culture: 'en',
        cultureFull: 'en-GB',
        cultureName: 'English',
        isSelected: true,
        isUsed: true,
        detailHideFilters: [],
        detailHideTop: 160,
        detailLink: 'https://www.ldoceonline.com/dictionary/{{word}}'
    },
    {
        culture: 'nl',
        cultureFull: 'nl-NL',
        cultureName: 'Nederlands',
        isSelected: false,
        isUsed: true,
        detailHideFilters: [],
        detailHideTop: 160,
        detailLink: 'https://en.glosbe.com/nl/en/{{word}}'
    },
    {
        culture: 'zh',
        cultureFull: 'zh-CN',
        cultureName: '中文',
        isUsed: true,
        isSelected: false,
        detailHideFilters: [],
        detailHideTop: 160,
        detailLink: 'http://www.zdic.net/hans/{{word}}'
    },
    {
        culture: 'ko',
        cultureFull: 'ko-KO',
        cultureName: '한국어',
        isSelected: false,
        isUsed: false,
        detailHideFilters: [],
        detailHideTop: 160,
        detailLink: 'https://www.google.com/search?q={{word}}'
    },
    {
        culture: 'ja',
        cultureFull: 'ja-JA',
        cultureName: '日本語',
        isSelected: false,
        isUsed: false,
        detailHideFilters: [],
        detailHideTop: 160,
        detailLink: 'https://www.google.com/search?q={{word}}'
    },
    {
        culture: 'ru',
        cultureFull: 'ru-RU',
        cultureName: 'Pусский',
        isSelected: false,
        isUsed: false,
        detailHideFilters: [],
        detailHideTop: 160,
        detailLink: 'https://en.openrussian.org/ru/{{word}}'
    },
    {
        culture: 'es',
        cultureFull: 'es-ES',
        cultureName: 'Español',
        isSelected: false,
        isUsed: false,
        detailHideFilters: [],
        detailHideTop: 160,
        detailLink: 'https://www.collinsdictionary.com/dictionary/spanish-english/{{word}}'
    },
    {
        culture: 'pt',
        cultureFull: 'pt-PT',
        cultureName: 'Português',
        isSelected: false,
        isUsed: false,
        detailHideFilters: [],
        detailHideTop: 160,
        detailLink: 'https://www.collinsdictionary.com/dictionary/portuguese-english/{{word}}'
    },
    {
        culture: 'it',
        cultureFull: 'it-IT',
        cultureName: 'Italiano',
        isSelected: false,
        isUsed: false,
        detailHideFilters: [],
        detailHideTop: 160,
        detailLink: 'https://www.collinsdictionary.com/dictionary/italian-english/{{word}}'
    },
    {
        culture: 'fr',
        cultureFull: 'fr-FR',
        cultureName: 'Français',
        isSelected: false,
        isUsed: false,
        detailHideFilters: [],
        detailHideTop: 160,
        detailLink: 'https://www.collinsdictionary.com/dictionary/french-english/{{word}}'
    },
    {
        culture: 'de',
        cultureFull: 'de-DE',
        cultureName: 'Deutsch',
        isSelected: false,
        isUsed: false,
        detailHideFilters: [],
        detailHideTop: 160,
        detailLink: 'https://www.collinsdictionary.com/dictionary/german-english/{{word}}'
    }
];

export {
    languages,
    Language
}


