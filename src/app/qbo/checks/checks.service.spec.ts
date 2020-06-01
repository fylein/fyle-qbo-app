import { TestBed } from '@angular/core/testing';

import { ChecksService } from './checks.service';

describe('ChecksService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChecksService = TestBed.get(ChecksService);
    expect(service).toBeTruthy();
  });
});
