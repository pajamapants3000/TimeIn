import { TestBed } from '@angular/core/testing';
import { InMemoryDataService } from './in-memory-data.service';

/* This service should be as simple as possible; Testing via end-to-end tests */
describe('InMemoryDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created',
    () => {
    const service: InMemoryDataService = TestBed.get(InMemoryDataService);
    expect(service).toBeTruthy();
  });
});
