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
  IEnrollmentClass,
} from '../../core/services/enrollment.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ActivatedRoute } from '@angular/router';
import { StudentService, IStudentEnrollment } from '../../core/services/student.service';

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
  ],
})
export class StudentComponent implements OnInit {
  studentForm!: FormGroup;
  genders = ['Masculino', 'Feminino', 'Outro'];
  maritalStatuses = ['Solteiro', 'Casado', 'Divorciado', 'Viúvo'];
  enrollments = [] as IEnrollmentClass[];
  viewMode: typeViewMode = 'read';
  studentId: string | null = null;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private viaCepService: ViaCepService,
    private studentService: StudentService,
    private enrollmentService: EnrollmentService,
    private route: ActivatedRoute
  ) {}

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
      cpf: ['', [Validators.required, this.cpfValidator]],
      rg: ['', [Validators.required, Validators.maxLength(20)]],
      maritalStatus: ['', Validators.required],
      phone: ['', [Validators.required, this.phoneValidator]],
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
      cep: ['', [Validators.required, Validators.minLength(8)]],
      street: [{ value: '', disabled: true }],
      number: [''],
      city: [{ value: '', disabled: true }],
      state: [{ value: '', disabled: true }],
      complement: [''],
      enrollments: [[], [Validators.required]],
    });
    this.enrollmentService.getEnrollments().subscribe((enrollments) => {
      this.enrollments = enrollments;
    });
  }

  loadStudentData(studentId: string) {
    this.userService.getUserById(studentId).subscribe((student) => {
      this.studentForm.patchValue(student);
    });
  }

  cpfValidator(control: FormControl) {
    /* const cpf = control.value;
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfRegex.test(cpf)) {
      return { invalidCpf: true };
    }
    return null; */
  }
  dateValidator(control: FormControl) {
    /* const date = control.value;
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(date)) {
      return { invalidDate: true };
    }
    return null; */
  }
  phoneValidator(control: FormControl) {}

  onCepBlur() {
    const cep = this.studentForm.get('cep')?.value;
    this.viaCepService.getAddressByCep(cep).subscribe((address) => {
      console.log('address', address);

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
      alert('Existem campos inválidos, revise e tente novamente');
      return
    }

    const studentData = this.studentForm.value;
    studentData.papelId = 3; // Aluno
    if (this.viewMode === 'edit') {
      studentData.id = this.studentId;
      this.userService.setUser(studentData).subscribe(() => {
        this.snackBar.open('Aluno atualizado com sucesso!', 'Fechar', {
          duration: 3000,
        });
      });
    } else {
      this.userService.addUser(studentData).subscribe(() => {
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
}
