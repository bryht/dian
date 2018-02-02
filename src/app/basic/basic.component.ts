import { Component, OnInit, NgModule } from '@angular/core';
import { remote } from 'electron';
import * as Mousetrap from 'mousetrap';

@Component({
  selector: 'app-root',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.css']
})
export class BasicComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }
  exportMutiChoice() {
    alert(1);
  }

}
