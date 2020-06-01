import { TestBed } from '@angular/core/testing';

import { CreditCardPurchasesService } from './credit-card-purchases.service';

describe('CreditCardPurchasesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreditCardPurchasesService = TestBed.get(CreditCardPurchasesService);
    expect(service).toBeTruthy();
  });
});
