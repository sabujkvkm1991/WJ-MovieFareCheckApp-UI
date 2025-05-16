import { TestBed } from '@angular/core/testing';
import { authInterceptor } from './auth.interceptor';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpRequest,
} from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';

describe('TokenInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpTestingController],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: authInterceptor, multi: true },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should add Authorization header when token exists', () => {
    const mockToken = 'mock-token';
    localStorage.setItem('token', mockToken);

    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${mockToken}`
    );
  });

  it('should not add Authorization header when token is missing', () => {
    localStorage.removeItem('token');

    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBeFalse();
  });
});
