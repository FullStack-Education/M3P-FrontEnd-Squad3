import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { EnrollmentService, IDisciplines, IEnrollmentClass } from '../../core/services/enrollment.service';
import { StudentService } from '../../core/services/student.service';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatOptionModule, 
  DateAdapter,
} from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IUser } from '../../core/interfaces/user.interface';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import moment from 'moment';
import { map, Observable, startWith } from 'rxjs';
import { GradeService } from '../../core/services/grade.service';
import { FormValidationService } from '../../core/services/form-validation.service';

type typeViewMode = 'read' | 'insert' | 'edit';
@Component({
  selector: 'app-grade',
  standalone: true,
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
    MatAutocompleteModule,
    FormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './grade.component.html',
  styleUrl: './grade.component.scss',
})
export class GradeComponent implements OnInit {
  gradeForm: FormGroup;
  teachers: IUser[] = [];
  enrollments = [] as IEnrollmentClass[];
  disciplines = [] as IDisciplines[];
  students: IUser[] = [];
  filteredStudents?: Observable<IUser[]>;
  selectedEnrollment: string | null = null;
  viewMode: typeViewMode = 'read';
  gradeId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private formValidationService: FormValidationService,
    private enrollmentService: EnrollmentService,
    private studentService: StudentService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private gradeService: GradeService
  ) {
    this.gradeForm = this.fb.group({
      teacher: ['', Validators.required],
      enrollment: ['', Validators.required],
      discipline: ['', Validators.required],
      gradeName: ['', Validators.required],
      gradeDate: ['', [Validators.required, this.dateValidator]],
      student: ['', Validators.required],
      grade: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
    });
  }

  ngOnInit() {
    this.loadInitialData();
    const paramGradeId = this.route.snapshot.queryParamMap.get('id');
    if (!paramGradeId) {
      this.viewMode = 'insert';
      this.gradeForm.enable();
      this.gradeForm.get('gradeDate')?.setValue(moment().format('DD-MM-YYYY'));
      const paramStudentId = this.route.snapshot.queryParamMap.get('studentId');
      if (paramStudentId) {
        const targetStudent = this.studentService.getStudentById(paramStudentId).subscribe((student) => {
          this.gradeForm.get('student')?.setValue(student);
        });
      }
    } else {
      this.gradeId = paramGradeId;
      this.loadGradeData(this.gradeId);
      const viewModeParam =
        this.route.snapshot.queryParamMap.get('mode') || 'read';
      this.viewMode = viewModeParam as typeViewMode;
      if (this.viewMode === 'read') this.gradeForm.disable();
      else this.gradeForm.enable();
    }
  }

  loadInitialData() {
    if (this.authService.isAdmin()) {
      this.userService.getAllTeachers().subscribe((data: IUser[]) => {
        this.teachers = data;
      });
    } else if (this.authService.isTeacher()) {
      const currentTeacher = this.authService.getCurrentUser();
      this.teachers = [];
      this.gradeForm.get('teacher')?.setValue(currentTeacher.id_usuario);
      this.gradeForm.get('teacher')?.disable();
    }

    this.enrollmentService
      .getEnrollments()
      .subscribe((data: IEnrollmentClass[]) => {
        this.enrollments = data;
        console.log('Enrollments:', this.enrollments);
      });

    this.studentService.getStudents().subscribe((data: IUser[]) => {
      this.students = data;
      this.filteredStudents = this.gradeForm.get('student')!.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || ''))
      );
    });

    this.enrollmentService
      .getDisciplines()
      .subscribe((data: IDisciplines[]) => {
        this.disciplines = data;
      });
  }

  loadGradeData(gradeId: string | null) {
    this.gradeService.getGradeById(gradeId!).subscribe((gradeData) => {
      this.gradeForm.patchValue(gradeData);
    });
  }

  private _filter(value: string): any[] {
    if (typeof value !== 'string') return [];
    console.log('Value:', value, typeof value);
    const filterValue = value.toLowerCase();
    return this.students.filter((student) =>
      student.name.toLowerCase().includes(filterValue)
    );
  }

  onEnrollmentSelected() {
    // Handle class selection if necessary
  }

  dateValidator(control: FormControl) {
    if (!control.value) return null;

    const timestamp = Date.parse(control.value);
    if (isNaN(timestamp)) return { invalidFormat: true };

    const diffTime = (Date.now() - timestamp) / 1000;
    const ageInSeconds = 140 * 365 * 24 * 60 * 60;

    // Check if the date is beyond a reasonable range (140 years old) or in the future
    return diffTime > ageInSeconds || diffTime < 0 ? { invalidDate: true } : null;
  }

  onSave() {
    if (this.gradeForm.invalid) {
      this.gradeForm.markAllAsTouched(this.gradeForm.controls);
      alert('Existem campos inválidos, revise e tente novamente');
      return;
    }

    const gradeData = this.gradeForm.value;
    if (this.viewMode === 'edit') {
      gradeData.id = this.gradeId;
      this.gradeService.setGrade(gradeData).subscribe(() => {
        this.snackBar.open('Nota atualizada com sucesso!', 'Fechar', {
          duration: 3000,
        });
        this.gradeForm.disable();
      });
    } else {
      this.gradeService.addGrade(gradeData).subscribe((newGrade) => {
        this.snackBar.open('Nota cadastrada com sucesso!', 'Fechar', {
          duration: 3000,
        });
        this.gradeId = newGrade.id;
        this.gradeForm.disable();
      });
    }
    this.cancelEdit();
  }

  enableEdit() {
    // Logic to switch to edit mode
    this.viewMode = 'edit';
    this.gradeForm.enable();
  }

  cancelEdit() {
    if (this.gradeId) {
      //this.loadGradeData(this.teacherId);
    } else {
      this.gradeForm.reset();
    }
    this.viewMode = 'read';
    this.gradeForm.disable();
  }

  onDelete() {
    if (!this.gradeId) return;
    this.gradeService.deleteGrade(this.gradeId).subscribe(() => {
      this.snackBar.open('Nota excluída com sucesso!', 'Fechar', {
        duration: 3000,
      });
      this.gradeForm.reset();
    });
  }

  displayStudentsFn(student: IUser): string {
    return student && student.name ? student.name : '';
  }

  hasError(inputName: string): boolean {
    return this.formValidationService.inputHasError(this.gradeForm, inputName);
  }

  getError(inputName: string): string | undefined {
    return this.formValidationService.getInputErrorMessage(this.gradeForm, inputName);
  }
}
