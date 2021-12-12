import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizedMemoComponent } from './customized-memo.component';

describe('CustomizedMemoComponent', () => {
  let component: CustomizedMemoComponent;
  let fixture: ComponentFixture<CustomizedMemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomizedMemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizedMemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
