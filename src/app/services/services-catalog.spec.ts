import { TestBed } from '@angular/core/testing';

import { ServicesCatalog } from './services-catalog';

describe('ServicesCatalog', () => {
  let service: ServicesCatalog;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesCatalog);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
