import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('LoginComponent (Standalone)', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', [
      'login',
    ]);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.login and navigate on successful login', () => {
    component.username = 'testuser';
    component.password = 'password123';
    authServiceSpy.login.and.returnValue(of({ token: 'mockToken' }));

    component.login();

    expect(authServiceSpy.login).toHaveBeenCalledWith(
      'testuser',
      'password123'
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(component.error).toBeUndefined();
  });

  it('should show error message on failed login', () => {
    component.username = 'wronguser';
    component.password = 'wrongpass';
    authServiceSpy.login.and.returnValue(
      throwError(() => new Error('Invalid credentials'))
    );

    component.login();

    expect(authServiceSpy.login).toHaveBeenCalledWith('wronguser', 'wrongpass');
    expect(component.error).toBe('Login failed');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
