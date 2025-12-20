import { WordItem } from "./WordItem";

export class SearchItem {
    words: Array<WordItem> = [];
    data: number = Date.now();
    static getId = (items: Array<WordItem>): string => items.map(x => x.text).join('-');
    static isPhrase = (items: Array<WordItem>): boolean => items.findIndex(x => x.text.includes(' ')) > -1;
}
