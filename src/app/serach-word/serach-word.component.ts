import { Component, OnInit } from '@angular/core';
import { WordService } from '../word.service';
import Word from '../word.model';
import * as Mousetrap from 'mousetrap';
import { WebviewTag, webviewTag } from 'electron';
import { fail } from 'assert';

@Component({
  selector: 'app-serach-word',
  templateUrl: './serach-word.component.html',
  styleUrls: ['./serach-word.component.css']
})
export class SerachWordComponent implements OnInit {
  settingImage = require('assets/settings.svg');
  words: Array<Word>;
  constructor(private wordService: WordService) { }
  ngOnInit() {
    this.getWords();
    Mousetrap.bind(['command+f', 'ctrl+f'], function () {
      const word = <HTMLInputElement>document.querySelector('#word');
      word.focus();
      word.value = '';
    });
    Mousetrap.bind('j', function () {
      const webView = <WebviewTag>document.querySelector('div.collapse.show div webview');
      if (webView != null) {
        webView.executeJavaScript('document.querySelector("body").scrollTop+=20', false);
      }
    });
    Mousetrap.bind('k', function () {
      const webView = <WebviewTag>document.querySelector('div.collapse.show div webview');
      if (webView != null) {
        webView.executeJavaScript('document.querySelector("body").scrollTop-=20', false);
      }
    });
    Mousetrap.bind('J', function () {
      window.scrollTo(window.scrollX, window.scrollY + 20);
    });
    Mousetrap.bind('K', function () {
      window.scrollTo(window.scrollX, window.scrollY - 20);
    });
  }


  async getWords() {
    this.words = await this.wordService.getAllWords();
  }
  deleteWord(id: string) {
    alert(id);
  }

  showWord(id: string, url: string, isSearch: boolean) {
    document.getElementById('web' + id).setAttribute('src', url);
  }
  searchWord(value: string, event: any) {
    alert(event.target.value);
    event.target.blur();
  }
}
