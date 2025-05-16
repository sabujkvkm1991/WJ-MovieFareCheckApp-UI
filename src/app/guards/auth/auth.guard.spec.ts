import { TestBed } from '@angular/core/testing';
import { authGuard } from './auth.guard';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { runInInjectionContext } from '@angular/core';

describe('authGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  it('should allow access if user is logged in', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);

    const result = runInInjectionContext(TestBed, () => authGuard());

    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should block access and navigate to login if not logged in', () => {
    authServiceSpy.isLoggedIn.and.returnValue(false);

    const result = runInInjectionContext(TestBed, () => authGuard());

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['login']);
  });
});
