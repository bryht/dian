export interface Language {
  code: string;
  name: string;
  native: string;
  isUsed: boolean;
  detailLink: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English',    native: 'English',    isUsed: true,  detailLink: 'https://dictionary.cambridge.org/dictionary/english/{word}' },
  { code: 'zh', name: 'Chinese',    native: '中文',       isUsed: true,  detailLink: 'https://www.zdic.net/hans/{word}' },
  { code: 'es', name: 'Spanish',    native: 'Español',    isUsed: true,  detailLink: 'https://dle.rae.es/{word}' },
  { code: 'fr', name: 'French',     native: 'Français',   isUsed: true,  detailLink: 'https://www.larousse.fr/dictionnaires/francais/{word}' },
  { code: 'de', name: 'German',     native: 'Deutsch',    isUsed: false, detailLink: 'https://www.duden.de/rechtschreibung/{word}' },
  { code: 'ja', name: 'Japanese',   native: '日本語',     isUsed: true,  detailLink: 'https://jisho.org/search/{word}' },
  { code: 'ko', name: 'Korean',     native: '한국어',     isUsed: false, detailLink: 'https://en.dict.naver.com/#/search?query={word}' },
  { code: 'it', name: 'Italian',    native: 'Italiano',   isUsed: false, detailLink: 'https://www.grandidizionari.it/Dizionario_Italiano/parola/{word}.aspx' },
  { code: 'pt', name: 'Portuguese', native: 'Português',  isUsed: false, detailLink: 'https://dicionario.priberam.org/{word}' },
  { code: 'ru', name: 'Russian',    native: 'Русский',    isUsed: false, detailLink: 'https://dic.academic.ru/searchall.php?SWord={word}&stype=' },
  { code: 'ar', name: 'Arabic',    native: 'العربية',    isUsed: false, detailLink: 'https://www.almaany.com/ar/dict/{word}' },
  { code: 'nl', name: 'Dutch',      native: 'Nederlands', isUsed: false, detailLink: 'https://en.glosbe.com/nl/en/{word}' },
  { code: 'sv', name: 'Swedish',    native: 'Svenska',    isUsed: false, detailLink: 'https://svenska.se/saol/?sok={word}' },
  { code: 'tr', name: 'Turkish',    native: 'Türkçe',     isUsed: false, detailLink: 'https://www.sozluk.gov.tr/?kelime={word}' },
];

export { languages };