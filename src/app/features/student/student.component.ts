import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ViaCepService } from '../../core/services/viacep.service';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import {
  MatOptionModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { CommonModule } from '@angular/common';
import {
  EnrollmentService,
  IDisciplines,
  IEnrollmentClass,
} from '../../core/services/enrollment.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ActivatedRoute } from '@angular/router';
import { StudentService, IStudentEnrollment } from '../../core/services/student.service';
import { FormValidationService } from '../../core/services/form-validation.service';
import { NgxMaskDirective } from 'ngx-mask';
import AuthTokenService from '../../core/services/auth-token.service';
import moment from 'moment';
import { ITurma } from '../../core/interfaces/turma.inteface';

type typeViewMode = 'read' | 'insert' | 'edit';


@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatOptionModule,
    MatIconModule,
    MatDatepickerModule,
    NgxMaskDirective
  ],
})
export class StudentComponent implements OnInit {
  studentForm!: FormGroup;
  genders = ['Masculino', 'Feminino', 'Outro'];
  maritalStatuses = ['Solteiro', 'Casado', 'Divorciado', 'Viúvo'];
  enrollments = [] as ITurma[];
  viewMode: typeViewMode = 'read';
  studentId: string | null = null;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private formValidationService: FormValidationService,
    private snackBar: MatSnackBar,
    private viaCepService: ViaCepService,
    private studentService: StudentService,
    private enrollmentService: EnrollmentService,
    private route: ActivatedRoute,
    private authToken: AuthTokenService
  ) { }

  ngOnInit() {
    const paramStudentId = this.route.snapshot.queryParamMap.get('id');
    this.initializeForm();
    if (!paramStudentId) {
      this.viewMode = 'insert';
      this.studentForm.enable();
    } else {
      this.studentId = paramStudentId;
      this.loadStudentData(this.studentId);
      const viewModeParam = this.route.snapshot.queryParamMap.get('mode') || 'read';
      this.viewMode = viewModeParam as typeViewMode;
      if (this.viewMode === 'read') this.studentForm.disable();
      else this.studentForm.enable();
    }
  }

  initializeForm() {
    this.studentForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(64),
        ],
      ],
      gender: ['', Validators.required],
      birthDate: ['', [Validators.required, this.dateValidator]],
      cpf: ['', [Validators.required, this.formValidationService.requireNumberLength(11), this.cpfValidator]],
      rg: ['', [Validators.required, Validators.maxLength(20)]],
      maritalStatus: ['', Validators.required],
      phone: ['', [Validators.required, (control: FormControl) => this.formValidationService.requireNumberLength(11)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      naturalness: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(64),
        ],
      ],
      cep: ['', [Validators.required, this.formValidationService.requireNumberLength(8)]],
      street: [{ value: '', disabled: true }],
      number: [''],
      city: [{ value: '', disabled: true }],
      state: [{ value: '', disabled: true }],
      complement: [''],
      enrollment: ['', [Validators.required]]
    });
    let token = this.authToken.getToken()    
    this.enrollmentService.getEnrollmentsToken(token)
    .subscribe((enrollments) => {
      this.enrollments = enrollments.turmaData;
    });
  }

  loadStudentData(studentId: string) {
    this.userService.getUserById(studentId).subscribe((student) => {
      this.studentForm.patchValue(student);
    });
  }

  cpfValidator(control: FormControl) {
    const cpf: string = control.value;

    const numbers: number[] = cpf?.split('')
      .map(char => Number.parseInt(char))
      .filter(number => !Number.isNaN(number));

    const firstNums = numbers.slice(0, 9);

    {
      const sum = firstNums.reduce((accumulator, currVal, idx) => accumulator + currVal * (10 - idx), 0);
      const firstControlDigit = 11 - (sum % 11);
      if (firstControlDigit != numbers.at(-2))
        return { invalidCpf: true };

      firstNums.push(firstControlDigit);
    }

    {
      const sum = firstNums.reduce(
        (accumulator, currVal, idx) => accumulator + currVal * (11 - idx), 0
      );
      const secondControlDigit = 11 - (sum % 11);
      if (secondControlDigit != numbers.at(-1))
        return { invalidCpf: true };
    }

    return null;
  }

  dateValidator(control: FormControl) {
    /* const date = control.value;
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(date)) {
      return { invalidDate: true };
    }
    return null; */
  }

  onCepBlur() {
    const cepInput = this.studentForm.get('cep');
    if (!cepInput || cepInput.invalid) {
      return;
    }
    this.viaCepService.getAddressByCep(cepInput.value).subscribe((address) => {
      console.log('address', address);

      if ('erro' in address) {
        cepInput?.setErrors({ invalid: true });
        this.snackBar.open('CEP informado não existe!', 'Fechar', {
          duration: 3000,
        });
        return;
      }

      this.studentForm.patchValue({
        city: address.localidade,
        state: address.uf,
        street: address.logradouro,
        neighborhood: address.bairro,
      });
    });
  }

  onSave() {
    

    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched(this.studentForm.controls);
      return
    }

    const studentData = this.studentForm.value;
    studentData.papelId = 5; // Aluno
    let token = this.authToken.getToken()
    if (this.viewMode === 'edit') {
      studentData.id = this.studentId;
      this.userService.setUser(studentData).subscribe(() => {
        this.snackBar.open('Aluno atualizado com sucesso!', 'Fechar', {
          duration: 3000,
        });
      });
    } else {
      console.log('salve')
      let body = {
        nome: studentData.name ,
        data_nascimento: moment(studentData.birthDate,'DDMMYYYY').format('YYYY-MM-DD'),
        id_papel: studentData.papelId,
        id_usuario: 1,
        id_turma: studentData.enrollment,
        telefone: studentData.phone,
        genero: studentData.gender,
        estadoCivil: studentData.maritalStatus,
        email: studentData.email,
        cpf: studentData.cpf,
        rg: studentData.rg,
        naturalidade: studentData.naturalness,
        cep: studentData.cep,
        logadouro: studentData.street,
        numero: studentData.number,
        cidade: studentData.city,
        complemento: studentData.complement,
        senha: studentData.password
      }

      this.studentService.saveStudentToken(body,token).subscribe(() => {
        this.snackBar.open('Aluno cadastrado com sucesso!', 'Fechar', {
          duration: 3000,
        });
      });
    }
    this.cancelEdit();
  }

  enableEdit() {
    // Logic to switch to edit mode
    this.viewMode = 'edit';
    this.studentForm.enable();
  }

  cancelEdit() {
    if (this.studentId) {
      this.loadStudentData(this.studentId);
    } else {
      this.studentForm.reset();
    }
    this.viewMode = 'read';
    this.studentForm.disable();
  }

  onDelete() {
    if (!this.studentId) return;
    this.userService.deleteUser(this.studentId).subscribe(() => {
      this.snackBar.open('Aluno excluído com sucesso!', 'Fechar', {
        duration: 3000,
      });
      this.studentForm.reset();
    });
  }

  hasError(inputName: string): boolean {
    return this.formValidationService.inputHasError(this.studentForm, inputName);
  }

  getError(inputName: string): string | undefined {
    return this.formValidationService.getInputErrorMessage(this.studentForm, inputName);
  }
}
