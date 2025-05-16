import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { LoginComponent } from './login.component';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientTestingModule, FormsModule],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // ensure no outstanding requests
    localStorage.clear(); // clean up after tests
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should perform login and navigate on success', fakeAsync(() => {
    component.username = 'admin';
    component.password = 'password';
    component.login();

    const req = httpMock.expectOne(`${environment.baseUrl}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      username: 'admin',
      password: 'password',
    });

    const mockToken = 'mock-jwt-token';
    req.flush({ token: mockToken });

    tick();

    expect(localStorage.getItem('token')).toBe(mockToken);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  }));

  it('should handle login error and show message', fakeAsync(() => {
    component.username = 'invalid';
    component.password = 'wrong';
    component.login();

    const req = httpMock.expectOne(`${environment.baseUrl}/login`);
    req.flush(
      { message: 'Invalid credentials' },
      { status: 401, statusText: 'Unauthorized' }
    );

    tick();

    expect(component.error).toBe('Login failed');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  }));
});
