import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken', 'logout']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorization header if token exists', () => {
    authServiceSpy.getToken.and.returnValue('mock-token');

    http.get('/test-endpoint').subscribe();

    const req = httpMock.expectOne('/test-endpoint');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    req.flush({});
  });

  it('should not add Authorization header if token does not exist', () => {
    authServiceSpy.getToken.and.returnValue(null);

    http.get('/test-endpoint').subscribe();

    const req = httpMock.expectOne('/test-endpoint');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('should handle 401 error by navigating to login and showing snackbar', () => {
    authServiceSpy.getToken.and.returnValue('mock-token');

    http.get('/test-endpoint').subscribe({
      error: () => {
        expect(snackBarSpy.open).toHaveBeenCalledWith(
          'Session expired. Redirecting to login page.'
        );
        expect(authServiceSpy.logout).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['login']);
      },
    });

    const req = httpMock.expectOne('/test-endpoint');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });
});
