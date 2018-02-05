import { OnInit, Component } from '@angular/core';
import * as https from 'https';
// import * as fs from 'fs-extra';
import * as readline from 'readline';
import * as storage from 'electron-json-storage';
import * as pdfkit from 'pdfkit';
import { remote, shell } from 'electron';
import * as Mousetrap from 'mousetrap';
import Word from '../word.model';
import { File, Filter } from '../file.utility';
import { setConfig, initConfig, configPara } from '../config';

@Component({
  selector: 'app-root',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.css']
})
export class BasicComponent implements OnInit {
  sourceList;
  sourceCurrent;
  targetList;
  targetCurrent;
  constructor() { }

  async ngOnInit() {
    await initConfig();
    this.sourceList = configPara.languageSource;
    this.sourceCurrent = configPara.default.source;
    this.targetList = configPara.languageTarget;
    this.targetCurrent = configPara.default.target;
    Mousetrap.bind('esc', () => { this.miniMize(); });
  }

  miniMize() {
    remote.BrowserWindow.getFocusedWindow().minimize();
  }

  async settingSave() {
    await setConfig('source', this.sourceCurrent);
    await setConfig('target', this.targetCurrent);
  }
}
