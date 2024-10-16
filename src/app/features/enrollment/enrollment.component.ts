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
  teachers = [] as IUser[];
  viewMode: typeViewMode = 'read';
  enrollmentId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private enrollmentService: EnrollmentService,
    private route: ActivatedRoute,
    private router : Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const paramEnrollmentId = this.route.snapshot.queryParamMap.get('id');
    this.initializeForm();
    if (!paramEnrollmentId) {
      this.viewMode = 'insert';
      this.enrollmentForm.enable();
    } else {
      this.enrollmentId = paramEnrollmentId;
      this.loadEnrollmentData(this.enrollmentId);
      const viewModeParam =
        this.route.snapshot.queryParamMap.get('mode') || 'read';
      this.viewMode = viewModeParam as typeViewMode;
      if (this.viewMode === 'read') this.enrollmentForm.disable();
      else this.enrollmentForm.enable();
    }
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
      dateStart: ['', Validators.required],
      dateEnd: [
        '',
        [Validators.required],
      ],
      timeStart: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
        ],
      ],
      teacher: [{value: '', disabled: this.isCurrentUserTeacher() }, Validators.required],
    });
    this.userService.getAllTeachers().subscribe((teachers) => {
      this.teachers = teachers;
    });
  }

  loadEnrollmentData(enrollmentId: string) {    
    this.enrollmentService.getEnrollmentById(enrollmentId).subscribe((enrollment) => {
      this.enrollmentForm.patchValue(enrollment);
    });
  }

  onSave() {
    if (this.enrollmentForm.invalid) {
      this.enrollmentForm.markAllAsTouched(this.enrollmentForm.controls);
      alert('Existem campos inválidos, revise e tente novamente');
      return;
    }

    const enrollmentData = this.enrollmentForm.value;
    if (this.viewMode === 'edit') {
      enrollmentData.id = this.enrollmentId;
      this.enrollmentService.setEnrollment(enrollmentData).subscribe(() => {
        this.snackBar.open('Turma atualizada com sucesso!', 'Fechar', {
          duration: 3000,
        });
        this.enrollmentForm.disable();
      });
    } else {
      this.enrollmentService.addEnrollment(enrollmentData).subscribe((newEnrollment) => {
        this.snackBar.open('Turma cadastrada com sucesso!', 'Fechar', {
          duration: 3000,
        });
        this.enrollmentId = newEnrollment.id;
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
    this.userService.deleteUser(this.enrollmentId).subscribe(() => {
      this.snackBar.open('Turma excluída com sucesso!', 'Fechar', {
        duration: 3000,
      });
      this.enrollmentForm.reset();
    });
  }

  isCurrentUserTeacher(): boolean {
    return this.authService.isTeacher();
  }
}
