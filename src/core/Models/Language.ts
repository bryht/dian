
class Language {
    culture!: string;
    cultureName!: string;
    isSelected: boolean = false;
    detailLink: string | undefined;
    detailHideTop: number = 0;
    detailHideFilters: Array<string> = [];

}

const languages: Array<Language> = [
    {
        culture: 'en',
        cultureName: 'English',
        isSelected: true,
        detailHideFilters: [],
        detailHideTop: 0,
        detailLink: 'https://www.ldoceonline.com/dictionary/{{word}}'
    },
    {
        culture: 'nl',
        cultureName: 'Nederlands',
        isSelected: false,
        detailHideFilters: [],
        detailHideTop: 0,
        detailLink: 'https://www.deepl.com/translator#nl/en/{{word}}'
    },
    {
        culture: 'zh',
        cultureName: '中文',
        isSelected: false,
        detailHideFilters: [],
        detailHideTop: 0,
        detailLink: 'https://www.deepl.com/translator#zh/en/{{word}}'
    }
];

export {
    languages,
    Language
}


