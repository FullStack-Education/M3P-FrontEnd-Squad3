import { Component } from '@angular/core';
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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginForm: FormGroup;
  formFields = [
    {
      id: 'username_div',
      name: 'username',
      label: 'Email',
      type: 'text',
      model: this.username,
      errors: [
        { type: 'required', message: 'Email é um campo obrigatório.' },
        {
          type: 'minlength',
          message: 'Email deve conter ao menos 3 caracteres.',
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
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  signIn() {
    const { username, password } = this.loginForm.value;
    this.authService
      .signIn(username, password)
      .subscribe((user: IUser | null) => {
        if (user) {
          this.snackBar.open(
            `Bem vinda, ${user.name}! Papel: ${user.role?.name}`,
            'Close',
            { duration: 3000 }
          ).afterDismissed().subscribe(() => {
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

  hasError(fieldName: string, errorType: string): boolean {
    return this.loginForm.get(fieldName)?.hasError(errorType) || false;
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
}
