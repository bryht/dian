import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BasicComponent } from './basic/basic.component';
import 'bootstrap';
import { SettingComponent } from './setting/setting.component';
import { SerachWordComponent } from './serach-word/serach-word.component';
import { WordService } from './word.service';

@NgModule({
  declarations: [
    BasicComponent,
    SettingComponent,
    SerachWordComponent
  ],
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    BrowserModule, FormsModule
  ],
  providers: [
    WordService
  ],
  bootstrap: [BasicComponent]
})
export class AppModule { }
