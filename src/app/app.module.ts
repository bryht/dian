import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BasicComponent } from './basic/basic.component';
import 'bootstrap';

@NgModule({
  declarations: [
    BasicComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [BasicComponent]
})
export class AppModule { }
