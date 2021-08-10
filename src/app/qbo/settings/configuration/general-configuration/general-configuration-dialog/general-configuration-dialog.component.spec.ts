import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralConfigurationDialogComponent } from './general-configuration-dialog.component';

describe('GenericMappingsDialogComponent', () => {
  let component: GeneralConfigurationDialogComponent;
  let fixture: ComponentFixture<GeneralConfigurationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralConfigurationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralConfigurationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
