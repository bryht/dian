
class Language {
    culture!: string;
    cultureName!: string;
    isSelected: boolean = false;
    detailLink: string = '';
    detailHideTop: number = 0;
    detailHideFilters: Array<string> = [];

}

const languages: Array<Language> = [
    {
        culture: 'en',
        cultureName: 'English',
        isSelected: true,
        detailHideFilters: [],
        detailHideTop: 160,
        detailLink: 'https://www.ldoceonline.com/dictionary/{{word}}'
    },
    {
        culture: 'nl',
        cultureName: 'Nederlands',
        isSelected: false,
        detailHideFilters: [],
        detailHideTop: 160,
        detailLink: 'https://dictionary.cambridge.org/dictionary/dutch-english/{{word}}'
    },
    {
        culture: 'zh',
        cultureName: '中文',
        isSelected: false,
        detailHideFilters: [],
        detailHideTop: 160,
        detailLink: 'http://www.zdic.net/hans/{{word}}'
    }
];

export {
    languages,
    Language
}


