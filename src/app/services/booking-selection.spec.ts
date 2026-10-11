import { TestBed } from '@angular/core/testing';

import { BookingSelection } from './booking-selection';

describe('BookingSelection', () => {
  let service: BookingSelection;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingSelection);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
