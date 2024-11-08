import { Component, inject, OnInit } from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IUser } from '../../core/interfaces/user.interface';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import moment from 'moment';
import { map, Observable, startWith } from 'rxjs';
import { GradeService } from '../../core/services/grade.service';
import { FormValidationService } from '../../core/services/form-validation.service';
import AuthTokenService from '../../core/services/auth-token.service';
import { TeacherService } from '../../core/services/teacher.service';
import { ITeacher } from '../../core/interfaces/teacher.interface';
import { ITurma } from '../../core/interfaces/turma.inteface';
import { IMateria } from '../../core/interfaces/response.materias.inteface';
import { IStudent } from '../../core/interfaces/student.interface';
import { LoaderService } from '../../core/services/loader.service';

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
  loader = inject(LoaderService);
  gradeForm: FormGroup;
  teachers: ITeacher[] = [];
  enrollments = [] as ITurma[];
  disciplines = [] as IMateria[];
  students: IStudent[] = [];
  filteredStudents?: Observable<IStudent[]>;
  selectedEnrollment: string | null = null;
  viewMode: typeViewMode = 'read';
  gradeId: number | null = null;
  token!: string;
  currentTeacher: ITeacher | null = null


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private formValidationService: FormValidationService,
    private enrollmentService: EnrollmentService,
    private studentService: StudentService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private gradeService: GradeService,
    private authtoken: AuthTokenService,
    private teacherService: TeacherService,
    private router: Router,
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

    this.token = this.authtoken.getToken()
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
      this.gradeId = (paramGradeId) ? parseInt(paramGradeId) : 0;
      this.loadGradeData(this.gradeId.toString());
      const viewModeParam =
        this.route.snapshot.queryParamMap.get('mode') || 'read';
      this.viewMode = viewModeParam as typeViewMode;
      if (this.viewMode === 'read') this.gradeForm.disable();
      else this.gradeForm.enable();
    }
  }

  loadInitialData() {
    if (this.authService.isAdmin()) {
      this.teacherService.getAllTeachersToken(this.token).subscribe((data) => {
        this.teachers = data.docenteData;
      });
    } else if (this.authService.isTeacher()) {
      let clain = this.authtoken.decodePayloadJWT()
      this.teacherService.getTeacherByIdToken(clain.id_docente, this.token).subscribe((data) => {
        this.teachers = data.docenteData;
        this.teachers = data.docenteData.filter(teacher => teacher.id == clain.id_docente);
      });

    }
    this.studentService.getStudentsToken(this.token).subscribe((data) => {
      this.students = data.alunoData;
      const alunoId = this.route.snapshot.queryParamMap.get('studentId')
      if (alunoId) {
        this.students = this.students.filter(aluno => aluno.id == parseInt(alunoId));
      }
      this.filteredStudents = this.gradeForm.get('student')!.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || ''))
      );
    });

    this.enrollmentService
      .getDisciplinesToken(this.token)
      .subscribe((data) => {
        this.disciplines = data.materiaData;
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
      student.nome.toLowerCase().includes(filterValue)
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



    let body = {
      id_aluno: gradeData.student.id,
      id_professor: gradeData.teacher,
      id_materia: gradeData.discipline,
      id_turma: gradeData.enrollment,
      nome: gradeData.gradeName,
      valor: gradeData.grade,
      data: moment(gradeData.gradeDate, "DD-MM-YYYY").format("YYYY-MM-DD")
    }

    console.log(body)
    console.log(gradeData)
    if (this.viewMode === 'edit') {
      gradeData.id = this.gradeId;
      this.gradeService.setGradeToken(gradeData.id, body, this.token).subscribe(() => {
        this.snackBar.open('Nota atualizada com sucesso!', 'Fechar', {
          duration: 3000,
        });
        this.gradeForm.disable();
      });
    } else {
      this.gradeService.addGradeToken(body, this.token).subscribe((newGrade) => {
        this.snackBar.open('Nota cadastrada com sucesso!', 'Fechar', {
          duration: 3000,
        });
        this.loader.showLoading(700)
        this.router.navigate(['home']);
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
    this.gradeService.deleteGradeToken(this.gradeId, this.token).subscribe(() => {
      this.snackBar.open('Nota excluída com sucesso!', 'Fechar', {
        duration: 3000,
      });
      this.gradeForm.reset();
    });
  }

  displayStudentsFn(student: IStudent): string {
    console.log(student)
    return student && student.nome ? student.nome : '';
  }

  hasError(inputName: string): boolean {
    return this.formValidationService.inputHasError(this.gradeForm, inputName);
  }

  getError(inputName: string): string | undefined {
    return this.formValidationService.getInputErrorMessage(this.gradeForm, inputName);
  }
}
