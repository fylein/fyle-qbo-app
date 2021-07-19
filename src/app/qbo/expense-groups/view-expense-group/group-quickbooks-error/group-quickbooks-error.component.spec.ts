import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupQuickbooksErrorComponent } from './group-quickbooks-error.component';

describe('GroupQuickbooksErrorComponent', () => {
  let component: GroupQuickbooksErrorComponent;
  let fixture: ComponentFixture<GroupQuickbooksErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupQuickbooksErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupQuickbooksErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
