import { TestBed } from '@angular/core/testing';

import { AuthGuessGuard } from './auth-guess.guard';

describe('AuthGuessGuard', () => {
  let guard: AuthGuessGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthGuessGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
