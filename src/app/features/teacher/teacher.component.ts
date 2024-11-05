import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ViaCepService } from '../../core/services/viacep.service';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import {
  MatOptionModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { EnrollmentService, IDisciplines } from '../../core/services/enrollment.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ActivatedRoute } from '@angular/router';
import { FormValidationService } from '../../core/services/form-validation.service';
import { NgxMaskDirective } from 'ngx-mask';
import { TeacherService } from '../../core/services/teacher.service';
import AuthTokenService from '../../core/services/auth-token.service';
import { IMateria } from '../../core/interfaces/response.materias.inteface';
import moment from 'moment';

type typeViewMode = 'read' | 'insert' | 'edit';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrl: './teacher.component.scss',
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
export class TeacherComponent implements OnInit {
  teacherForm!: FormGroup;
  genders = ['Masculino', 'Feminino', 'Outro'];
  maritalStatuses = ['Solteiro', 'Casado', 'Divorciado', 'Viúvo'];
  subjects = [] as IMateria[];
  viewMode: typeViewMode = 'read';
  teacherId: number | null = null;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private formValidationService: FormValidationService,
    private snackBar: MatSnackBar,
    private viaCepService: ViaCepService,
    private enrollmentService: EnrollmentService,
    private route: ActivatedRoute,
    private teacherService: TeacherService,
    private authToken: AuthTokenService
  ) { }

  ngOnInit() {
    const paramTeacherId = this.route.snapshot.queryParamMap.get('id');
    this.initializeForm();
    if (!paramTeacherId) {
      this.viewMode = 'insert';
      this.teacherForm.enable();
    } else {
      this.teacherId = parseInt(paramTeacherId);
      this.loadTeacherData(this.teacherId);
      const viewModeParam =
        this.route.snapshot.queryParamMap.get('mode') || 'read';
      this.viewMode = viewModeParam as typeViewMode;
      if (this.viewMode === 'read') this.teacherForm.disable();
      else this.teacherForm.enable();
    }
  }

  initializeForm() {
    this.teacherForm = this.fb.group({
      name: [
        'leandro dias',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(64),
        ],
      ],
      gender: ['M', Validators.required],
      birthDate: ['04042024', [Validators.required, this.dateValidator]],
      cpf: ['88888888888', [Validators.required, this.formValidationService.requireNumberLength(11), this.cpfValidator]],
      rg: ['998398', [Validators.required, Validators.maxLength(20)]],
      maritalStatus: ['S', Validators.required],
      phone: ['48999999999', [Validators.required, this.formValidationService.requireNumberLength(11)]],
      email: ['leandroDias@mail.com', [Validators.required, Validators.email]],
      password: ['123456789', [Validators.required, Validators.minLength(8)]],
      naturalness: [
        'brasileiro',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(64),
        ],
      ],
      cep: ['88134000', [Validators.required, this.formValidationService.requireNumberLength(8)]],
      street: [{ value: 'rua sei lah ', disabled: true }],
      number: ['452'],
      city: [{ value: 'palhoça', disabled: true }],
      state: [{ value: 'SC', disabled: true }],
      complement: ['casa'],
      idPapel: [''],
      subjects: [[1, 2, 3], [Validators.required]],
    });
    let token = this.authToken.getToken()
    this.enrollmentService.getDisciplinesToken(token).subscribe((disciplines) => {
      this.subjects = disciplines.materiaData;
    });

    console.log(this.teacherForm);
    this.teacherForm.get('street')?.disable();
  }

  loadTeacherData(teacherId: number) {
    let token = this.authToken.getToken()
    this.teacherService.getTeacherToken(teacherId, token).subscribe((data) => {
      let teacher = data.docenteData[0]

      console.log(teacher)
      this.teacherForm.patchValue({
        name: teacher.nome,
        phone: teacher.telefone,
        gender: teacher.genero,
        maritalStatus: teacher.estadoCivil,
        birthDate: moment(teacher.dataNascimento, 'YYYY-MM-DD').format('DDMMYYYY'),
        email: teacher.email,
        cpf: teacher.cpf,
        rg: teacher.rg,
        naturalness: teacher.naturalidade,
        cep: teacher.cep,
        street: teacher.logradouro,
        number: teacher.numero,
        city: teacher.cidade,
        complement: teacher.complemento,
        iduser: teacher.usuario.id,
        subjects: teacher.materias.map((materia: IMateria) => materia.id),
        state: teacher.estado,
        password: ''
      });
    });
  }

  cpfValidator(control: FormControl) {
    const cpf: string = control.value;

    // Extrai os números do CPF
    const numbers: number[] = (cpf || '')
      .split('')
      .map(char => Number.parseInt(char))
      .filter(number => !Number.isNaN(number));

    if (numbers.length !== 11) return { invalidCpf: true }; // CPF deve ter 11 dígitos

    // Função auxiliar para calcular o dígito de controle
    const calculateControlDigit = (nums: number[], factor: number) => {
      const sum = nums.reduce((acc, curr, idx) => acc + curr * (factor - idx), 0);
      const controlDigit = 11 - (sum % 11);
      return controlDigit >= 10 ? 0 : controlDigit;
    };

    // Verifica o primeiro dígito de controle
    const firstControlDigit = calculateControlDigit(numbers.slice(0, 9), 10);
    if (firstControlDigit !== numbers[9]) return { invalidCpf: true };

    // Verifica o segundo dígito de controle
    const secondControlDigit = calculateControlDigit(numbers.slice(0, 10), 11);
    if (secondControlDigit !== numbers[10]) return { invalidCpf: true };

    return null;
  }

  dateValidator(control: FormControl) {
    const value: string = control.value;
    if (!value) return null;

    // Transform the format dd/MM/yyyy (input's default) to MM/dd/yyyy
    const timestamp = Date.parse(`${value.substring(2, 4)}/${value.substring(0, 2)}/${value.substring(4)}`);
    if (isNaN(timestamp)) return { invalidFormat: true };

    const diffTime = (Date.now() - timestamp) / 1000;
    const ageInSeconds = 140 * 365 * 24 * 60 * 60;

    // Check if the date is beyond a reasonable range (140 years old) or in the future
    return diffTime > ageInSeconds || diffTime < 0 ? { invalidDate: true } : null;
  }

  onCepBlur() {
    const cepInput = this.teacherForm.get('cep');
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

      this.teacherForm.patchValue({
        city: address.localidade,
        state: address.uf,
        street: address.logradouro,
        neighborhood: address.bairro,
      });
    });
  }

  onSave() {
    if (this.teacherForm.invalid) {
      this.teacherForm.markAllAsTouched(this.teacherForm.controls);
      alert('Existem campos inválidos, revise e tente novamente');
      return;
    }
    let token = this.authToken.getToken()
    const teacherData = this.teacherForm.value;
    teacherData.papelId = 2; // Docente
    if (this.viewMode === 'edit') {
      teacherData.id = this.teacherId;
      let body = {
        nome: teacherData.name,
        telefone: teacherData.phone,
        genero: teacherData.gender,
        estadoCivil: teacherData.maritalStatus,
        dataNascimento: moment(teacherData.birthDate, 'DDMMYYYY').format("YYYY-MM-DD"),
        email: teacherData.email,
        CPF: teacherData.cpf,
        RG: teacherData.rg,
        naturalidade: teacherData.naturalness,
        cep: teacherData.cep,
        logradouro: teacherData.street,
        numero: teacherData.number,
        cidade: teacherData.city,
        estado: teacherData.state,
        complemento: teacherData.complement,
        id_papel: parseInt(teacherData.papelId),
        id_materias: teacherData.subjects
      }
      if (this.teacherId) {
        this.teacherService.getUpdateTeachersToken(this.teacherId, body, token)
          .subscribe({
            next: (data) => {
              let teacher = data.docenteData[0]
              this.loadTeacherData(teacher.id)

              this.snackBar.open('Docente atualizado com sucesso!', 'Fechar', {
                duration: 3000,
              });
              this.cancelEdit();

            },
            error: (data) => {
              this.snackBar.open(data.error.message, 'Fechar', {
                duration: 3000,
              });
            }
          });
      }
    } else {

      let body = {
        nome: teacherData.name,
        telefone: teacherData.phone,
        genero: teacherData.gender,
        estadoCivil: teacherData.maritalStatus,
        dataNascimento: moment(teacherData.birthDate, 'DDMMYYYY').format("YYYY-MM-DD"),
        email: teacherData.email,
        CPF: teacherData.cpf,
        RG: teacherData.rg,
        naturalidade: teacherData.naturalness,
        cep: teacherData.cep,
        logradouro: teacherData.street,
        numero: teacherData.number,
        cidade: teacherData.city,
        estado: teacherData.state,
        complemento: teacherData.complement,
        senha: teacherData.password,
        id_papel: parseInt(teacherData.papelId),
        id_materias: teacherData.subjects
      }

      this.teacherService.getCreateTeachersToken(body, token).subscribe({
        next: () => {
          this.snackBar.open('Docente cadastrado com sucesso!', 'Fechar', {
            duration: 3000,
          });
          this.cancelEdit();
        },
        error: (data) => {
          this.snackBar.open(data.error.message, 'Fechar', {
            duration: 3000,
          });
        }
      });
    }
  }
  configurarValidacaoSenha() {
    const passwordControl = this.teacherForm!.get('password');
    if (passwordControl) {
      if (this.viewMode === 'edit') {

        passwordControl.clearValidators();
      } else {
        passwordControl.setValidators([Validators.required, Validators.minLength(8)]);
        // Remove todas as validações do controle

      }

      // Atualiza o estado do controle
      passwordControl.updateValueAndValidity();
    }
  }
  enableEdit() {
    // Logic to switch to edit mode
    this.viewMode = 'edit';
    this.teacherForm.enable();
    this.configurarValidacaoSenha()
  }

  cancelEdit() {
    if (this.teacherId) {
      this.loadTeacherData(this.teacherId);
    } else {
      this.teacherForm.reset();
    }
    this.viewMode = 'read';
    this.teacherForm.disable();
  }

  onDelete() {
    if (!this.teacherId) return;
    let token = this.authToken.getToken();
    this.teacherService.getDeleteTeacherToken(this.teacherId, token).subscribe(() => {
      this.snackBar.open('Docente excluído com sucesso!', 'Fechar', {
        duration: 3000,
      });
      this.teacherForm.reset();
    });
  }

  hasError(inputName: string): boolean {
    return this.formValidationService.inputHasError(this.teacherForm, inputName);
  }

  getError(inputName: string): string | undefined {
    return this.formValidationService.getInputErrorMessage(this.teacherForm, inputName);
  }
}
