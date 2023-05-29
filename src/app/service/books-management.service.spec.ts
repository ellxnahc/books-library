import { TestBed } from '@angular/core/testing';

import { BooksManagementService } from './books-management.service';

describe('BooksManagementService', () => {
  let service: BooksManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BooksManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
