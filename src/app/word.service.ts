import { Injectable } from '@angular/core';
import * as storage from 'electron-json-storage';
import Word from './word.model';

@Injectable()
export class WordService {

  constructor() { }

  public getAllWords() {
    const words = new Promise<Array<Word>>((resolve, reject) => {
      storage.get('words', function (error, data) {
        if (error) { reject(error); }
        resolve(data as Array<Word>);
      });
    });
    return words;
  }
}
