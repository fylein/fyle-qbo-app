import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QBOCallbackComponent } from './qbo-callback.component';

describe('QBOCallbackComponent', () => {
  let component: QBOCallbackComponent;
  let fixture: ComponentFixture<QBOCallbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QBOCallbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QBOCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
