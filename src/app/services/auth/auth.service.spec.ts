import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { AuthResponse } from '../../models/auth-response';
import { environment } from '../../../environments/environment';
import { provideHttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockResponse: AuthResponse = {
    token: 'mock-jwt-token',
  };

  const loginPayload = {
    username: 'testuser',
    password: 'testpass',
  };

  const tokenKey = 'token';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform login and store token in localStorage', () => {
    service
      .login(loginPayload.username, loginPayload.password)
      .subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.getItem(tokenKey)).toBe(mockResponse.token);
      });

    const req = httpMock.expectOne(`${environment.baseUrl}/Auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(loginPayload);

    req.flush(mockResponse); 
  });

  it('should return token from localStorage', () => {
    localStorage.setItem(tokenKey, mockResponse.token);
    expect(service.getToken()).toBe(mockResponse.token);
  });

  it('should return true if token exists in localStorage', () => {
    localStorage.setItem(tokenKey, mockResponse.token);
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should return false if token does not exist in localStorage', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should clear token on logout', () => {
    spyOn(localStorage, 'removeItem');
    service.logout();
    expect(localStorage.removeItem).toHaveBeenCalled();
  });
});
