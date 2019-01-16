import { TestBed } from '@angular/core/testing';

import { IntracomService } from './intracom.service';

describe('IntracomService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IntracomService = TestBed.get(IntracomService);
    expect(service).toBeTruthy();
  });
});
