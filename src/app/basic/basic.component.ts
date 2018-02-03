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

@Component({
  selector: 'app-root',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.css']
})
export class BasicComponent implements OnInit {
  constructor() { }

  ngOnInit() {

  }

  miniMize() {
    remote.BrowserWindow.getFocusedWindow().minimize();
  }

}
