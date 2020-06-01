import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardPurchasesComponent } from './credit-card-purchases.component';

describe('CreditCardPurchasesComponent', () => {
  let component: CreditCardPurchasesComponent;
  let fixture: ComponentFixture<CreditCardPurchasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditCardPurchasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditCardPurchasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
