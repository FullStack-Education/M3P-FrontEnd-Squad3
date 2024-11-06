import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import {
  DialogComponent,
  IDialogData,
} from '../../core/components/dialog/dialog.component';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { AuthService} from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IUser } from '../../core/interfaces/user.interface';
import { FormValidationService } from '../../core/services/form-validation.service';
import AuthTokenService from '../../core/services/auth-token.service';
import { IToken } from '../../core/interfaces/Itoken.inteface';
import { LoaderService } from '../../core/services/loader.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loader = inject(LoaderService);
  email: string = '';
  password: string = '';
  loginForm: FormGroup;
  formFields = [
    {
      id: 'email_div',
      name: 'email',
      label: 'Email',
      type: 'email',
      model: this.email,
      errors: [
        { type: 'required', message: 'Email é um campo obrigatório.' },
        {
          type: 'email',
          message: 'Por favor insira um email válido.',
        },
      ],
    },
    {
      id: 'password_div',
      name: 'password',
      label: 'Senha',
      type: 'password',
      model: this.password,
      errors: [
        { type: 'required', message: 'É necessário digitar uma senha.' },
        {
          type: 'minlength',
          message: 'Senha precisa ter ao menos 6 caracteres.',
        },
      ],
    },
  ];

  footerActions = [
    {
      id: 'forgot_password_div',
      label: 'Esqueci minha senha',
      handler: this.forgotPassword.bind(this),
    },
    {
      id: 'sign_up_div',
      label: 'Criar nova conta',
      handler: this.signUp.bind(this),
    },
  ];

  constructor(
    private fb: FormBuilder,
    private dialog: Dialog,
    private authService: AuthService,
    private formValidationService: FormValidationService,
    private snackBar: MatSnackBar,
    private router: Router,
    private authToken: AuthTokenService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  signIn() {
    const { email, password } = this.loginForm.value;
    this.authService
      .signIn(email, password)
      .subscribe((user: IToken | null) => {
        if (user) {
          this.snackBar.open(
            `Bem vinda, ${user.name}! Papel: ${user.scope}`,
            'Close',
            { duration: 1000 }
          ).afterDismissed().subscribe(() => {
            this.loader.showLoading(700)
            this.router.navigate(['/home']);
          });
        } else {
          this.snackBar.open(
            'Usuário não encontrado ou senha inválida',
            'Close',
            { duration: 3000 }
          );
        }
      });
  }

  isInvalid(fieldName: string): boolean | undefined {
    const field = this.loginForm.get(fieldName);
    return field?.invalid && field.touched;
  }

  forgotPassword() {
    const dialogRef = this.dialog.open<IDialogData>(DialogComponent, {
      minWidth: '300px',
      data: {
        message: 'Funcionalidade não implementada',
        actions: [{ label: 'OK', action: 'close', visible: true }],
      },
    });
  }

  signUp() {
    const dialogRef = this.dialog.open<IDialogData>(DialogComponent, {
      minWidth: '300px',
      data: {
        message: 'Funcionalidade não implementada',
        actions: [{ label: 'OK', action: 'close', visible: true }],
      },
    });
  }

  hasError(inputName: string): boolean {
    return this.formValidationService.inputHasError(this.loginForm, inputName);
  }

  getError(inputName: string): string | undefined {
    return this.formValidationService.getInputErrorMessage(this.loginForm, inputName);
  }
}
