import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarDismiss, MatSnackBarModule, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { catchError, of, throwError } from 'rxjs';
import { FormValidationService } from '../../core/services/form-validation.service';
import { Dialog } from '@angular/cdk/dialog';


fdescribe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let routerSpy: jasmine.SpyObj<Router>;
  let formValidationServiceSpy: jasmine.SpyObj<FormValidationService>;


  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['signIn']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    const snackBarRefMock = {
      afterDismissed: () => of({ dismissedByAction: false }),
    } as MatSnackBarRef<TextOnlySnackBar>;

    snackBarSpy.open.and.returnValue(snackBarRefMock);
  

    formValidationServiceSpy = jasmine.createSpyObj('FormValidationService', ['inputHasError', 'getInputErrorMessage']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, MatSnackBarModule],
      providers: [
        provideHttpClient(),
        provideRouter([{ path: 'login', component: LoginComponent }]),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: Router, useValue: routerSpy },
        { provide: FormValidationService, useValue: formValidationServiceSpy },
      ],

    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar o formulário de login com campos vazios', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('deve chamar o método signIn do AuthService ao submeter o formulário com credenciais válidas', () => {
    component.loginForm.setValue({ email: 'test@test.com', password: 'senha123' });
    authServiceSpy.signIn.and.returnValue(of({ 
      exp: Date.now() / 1000 + 3600,
      iat: Date.now() / 1000,
      id_usuario: '123',
      iss: 'testIssuer',
      id_docente: '123',
      id_aluno: '456',
      name: 'User',
      scope: 'user',
      sub: '123' }));

    component.signIn();

    expect(authServiceSpy.signIn).toHaveBeenCalledWith('test@test.com', 'senha123');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('deve exibir mensagem de erro se o login falhar', fakeAsync(() => {
    component.loginForm.setValue({ email: 'test@test.com', password: 'senha123' });
  
    authServiceSpy.signIn.and.returnValue(
      throwError(() => new Error('Usuário ou senha inválidos')).pipe(
        catchError((error) => {
      
          component['snackBar'].open('Usuário não encontrado ou senha inválida', 'Close', { duration: 3000 });
          return of(null); 
        })
      )
    );
  
    component.signIn();
    tick(); 
  
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Usuário não encontrado ou senha inválida',
      'Close',
      { duration: 3000 }
    );
  }));

  it('deve marcar o campo de email como inválido se for preenchido incorretamente', () => {
    component.loginForm.get('email')?.setValue('emailinvalido');
    component.loginForm.get('email')?.markAsTouched();

    expect(component.isInvalid('email')).toBeTrue();
  });

  it('deve retornar true se houver erro no campo ao chamar hasError', () => {
    formValidationServiceSpy.inputHasError.and.returnValue(true);
    expect(component.hasError('email')).toBeTrue();
    expect(formValidationServiceSpy.inputHasError).toHaveBeenCalledWith(component.loginForm, 'email');
  });

  it('deve retornar uma mensagem de erro ao chamar getError', () => {
    const errorMessage = 'Email é um campo obrigatório.';
    formValidationServiceSpy.getInputErrorMessage.and.returnValue(errorMessage);
    expect(component.getError('email')).toBe(errorMessage);
    expect(formValidationServiceSpy.getInputErrorMessage).toHaveBeenCalledWith(component.loginForm, 'email');
  });

});