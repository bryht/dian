import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerachWordComponent } from './serach-word.component';

describe('SerachWordComponent', () => {
  let component: SerachWordComponent;
  let fixture: ComponentFixture<SerachWordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerachWordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerachWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
