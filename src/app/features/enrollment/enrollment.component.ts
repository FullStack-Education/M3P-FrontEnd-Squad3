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
import { MatSelectModule } from '@angular/material/select';
import {
  MatOptionModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { CommonModule } from '@angular/common';
import {
  EnrollmentService,
} from '../../core/services/enrollment.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { IUser } from '../../core/interfaces/user.interface';
import { FormValidationService } from '../../core/services/form-validation.service';
import { ICourse } from '../../core/interfaces/course.interface';
import AuthTokenService from '../../core/services/auth-token.service';
import { coursesService } from '../../core/services/courses.service';
import { ICursoAluno } from '../../core/interfaces/curso.aluno.inteface';
import { TeacherService } from '../../core/services/teacher.service';
import { ITeacher } from '../../core/interfaces/teacher.interface';
import moment from 'moment';

type typeViewMode = 'read' | 'insert' | 'edit';

@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrl: './enrollment.component.scss',
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
export class EnrollmentComponent implements OnInit {
  enrollmentForm!: FormGroup;
  teachers = [] as ITeacher[];
  courses: ICursoAluno[] = [];
  filteredTeachers: ITeacher[] = [];
  filteredCourses: ICursoAluno[] = [];
  viewMode: typeViewMode = 'read';
  enrollmentId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private formValidationService: FormValidationService,
    private snackBar: MatSnackBar,
    private enrollmentService: EnrollmentService,
    private route: ActivatedRoute,
    private router : Router,
    private authService: AuthService,
    private authtoken:  AuthTokenService,
    private coursesService: coursesService,
    private teacherService: TeacherService,
  ) {}

  ngOnInit() {
    const paramEnrollmentId = this.route.snapshot.queryParamMap.get('id');
    this.initializeForm();
    if (!paramEnrollmentId) {
      this.viewMode = 'insert';
      this.enrollmentForm.enable();
    } else {
      this.enrollmentId = parseInt(paramEnrollmentId);
      this.loadEnrollmentData(this.enrollmentId);
      const viewModeParam =
        this.route.snapshot.queryParamMap.get('mode') || 'read';
      this.viewMode = viewModeParam as typeViewMode;
      if (this.viewMode === 'read') this.enrollmentForm.disable();
      else this.enrollmentForm.enable();
    }
    this.loadTeachers();
    this.loadCourses();
  }

  initializeForm() {
    this.enrollmentForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(64),
        ],
      ],
      dateStart: ['', [Validators.required, this.dateValidator]],
      dateEnd: ['', [Validators.required, this.dateValidator]],
      timeStart: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
        ],
      ],
      teacher: [{value: '', disabled: this.isCurrentUserTeacher() }, Validators.required],
      course: ['', Validators.required],
    });
    const token = this.authtoken.getToken()
    this.teacherService.getAllTeachersToken(token).subscribe((teachers) => {
      this.teachers = teachers.docenteData;
    });
  }

  loadEnrollmentData(enrollmentId: string|number) {    
    this.enrollmentService.getEnrollmentById(enrollmentId.toString()).subscribe((enrollment) => {
      this.enrollmentForm.patchValue(enrollment);
    });
  }

  loadTeachers() {
    const token = this.authtoken.getToken()
    this.teacherService.getAllTeachersToken(token).subscribe((teachers) => {
      this.teachers = teachers.docenteData;
      this.filteredTeachers = teachers.docenteData;
    });
  }

  loadCourses() {
    const token = this.authtoken.getToken()
    this.coursesService.getCources(token).subscribe((courses) => {
      this.courses = courses.cursoData;
      this.filteredCourses = courses.cursoData;
    });
  }

  dateValidator(control: FormControl) {
    if (!control.value) return null;

    const timestamp = Date.parse(control.value);
    if (isNaN(timestamp)) return { invalidFormat: true };

    const diffTime = (Date.now() - timestamp) / 1000;
    const minDateDiffInSeconds = 30 * 365 * 24 * 60 * 60;

    // Success if the date started up to 30 years ago or in the future
    return diffTime > minDateDiffInSeconds ? { invalidDate: true } : null;
  }

  onSave() {
    if (this.enrollmentForm.invalid) {
      this.enrollmentForm.markAllAsTouched(this.enrollmentForm.controls);
      alert('Existem campos inválidos, revise e tente novamente');
      return;
    }
    const token = this.authtoken.getToken()

    const enrollmentData = this.enrollmentForm.value;
  

    let body = {
      "nome": enrollmentData.name,
      "id_curso": enrollmentData.course,
      "hora": enrollmentData.timeStart,
      "dataFim": enrollmentData.dateEnd,
      "dataInicio": enrollmentData.dateStart,
      "id_professor": enrollmentData.teacher
    }
    if (this.viewMode === 'edit') {
      enrollmentData.id = this.enrollmentId;
      this.enrollmentService.setEnrollment(enrollmentData.id,body,token).subscribe(() => {
        this.snackBar.open('Turma atualizada com sucesso!', 'Fechar', {
          duration: 3000,
        });
        this.enrollmentForm.disable();
      });
    } else {
      this.enrollmentService.addEnrollment(body,token).subscribe((newEnrollment) => {
        this.snackBar.open('Turma cadastrada com sucesso!', 'Fechar', {
          duration: 3000,
        });
        this.enrollmentId = newEnrollment.turmaData[0].id;
        this.enrollmentForm.disable();
      });
    }
  }

  enableEdit() {
    this.viewMode = 'edit';
    this.enrollmentForm.enable();
  }

  cancelEdit() {
    if (this.enrollmentId) {
      this.loadEnrollmentData(this.enrollmentId);
    } else {
      this.enrollmentForm.reset();
    }
    this.viewMode = 'read';
    this.enrollmentForm.disable();
  }

  onDelete() {
    if (!this.enrollmentId) return;
    const token = this.authtoken.getToken()
    this.teacherService.getDeleteTeacherToken(this.enrollmentId,token).subscribe(() => {
      this.snackBar.open('Turma excluída com sucesso!', 'Fechar', {
        duration: 3000,
      });
      this.enrollmentForm.reset();
    });
  }

  isCurrentUserTeacher(): boolean {
    return this.authService.isTeacher();
  }

  hasError(inputName: string): boolean {
    return this.formValidationService.inputHasError(this.enrollmentForm, inputName);
  }

  getError(inputName: string): string | undefined {
    return this.formValidationService.getInputErrorMessage(this.enrollmentForm, inputName);
  }
}
