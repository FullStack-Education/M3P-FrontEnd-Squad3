import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  StudentService,
  IStudentGrade,
} from '../../core/services/student.service';
import { UserService } from '../../core/services/user.service';
import { EnrollmentService, IEnrollmentClass } from '../../core/services/enrollment.service';
import { IUser } from '../../core/interfaces/user.interface';
import { ICourse } from '../../core/interfaces/course.interface';
import { IToken } from '../../core/interfaces/Itoken.inteface';
import { StatiticService } from '../../core/services/statistic.service';
import AuthTokenService from '../../core/services/auth-token.service';
import { IStudent } from '../../core/interfaces/student.interface';
import { IdadePipe } from '../../core/pipes/idade.pipe';
import { PhonePipe } from '../../core/pipes/phone.pipe';
import { INota } from '../../core/interfaces/nota.inteface';
import { ICursoAluno } from '../../core/interfaces/curso.aluno.inteface';
import { DateFormatPipe } from '../../core/pipes/date-format.pipe';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatDividerModule,
    CommonModule,
    RouterModule,
    MatButtonModule,
    IdadePipe,
    PhonePipe,
    DateFormatPipe
  ],
})
export class HomeComponent {
  studentSearchTerm: string = '';
  currentUser: IToken | null = null;
  statistics = [] as { title: string; detail: number }[];
  students = [] as IStudent[];
  teachers = [] as IUser[];
  studentGrades = [] as INota[];
  studentYourCourse: ICursoAluno | null = null;
  studentExtraCourses = [] as ICursoAluno[];
  studentEnrollments = [] as IEnrollmentClass[];
  extraSubjects = [] as ICourse[];


  constructor(
    private authService: AuthService,
    private router: Router,
    private studentService: StudentService,
    private userService: UserService,
    private enrollmentService: EnrollmentService,
    private statisticService: StatiticService,
    private authTokenService: AuthTokenService,
    private idadePipe: IdadePipe,
    private phonePipe: PhonePipe
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.isCurrentUserTeacher()) this.loadTeacherData();
    if (this.isCurrentUserAdmin()) this.loadAdminData();
    if (this.isCurrentUserStudent()) this.loadStudentData();
  }

  loadStudentData() {
    let token: string = this.authTokenService.getToken();
    
    if(this.currentUser?.id_aluno){
      this.studentService
      .getNotasAlunoToken(this.currentUser.id_aluno, token)
      .subscribe((notas) => {
        this.studentGrades = notas.notaData.sort((a:INota, b:INota) => parseInt(b.id)-parseInt(a.id));
      });

      this.studentService
      .getCursoAlunoToken(this.currentUser.id_aluno, token)
      .subscribe((curso) => {
        this.studentYourCourse = curso.cursoData[0];
      });

      this.studentService
      .getCursosExtrasAlunoToken(this.currentUser.id_aluno, token)
      .subscribe((cursos) => {
        this.studentExtraCourses = cursos.cursoData;
      });
      


    }
    

    // this.studentService
    //   .getGradesByOrder(this.currentUser!.id_usuario, 'desc', 3)
    //   .subscribe((grades) => {
    //     this.studentGrades = grades;
    //   });
  }

  loadCourses() {
    this.enrollmentService.getCourses().subscribe((courses) => {
      this.extraSubjects = courses;
    });
  }

  loadAdminData() {
    let token: string = this.authTokenService.getToken();
    this.statisticService.getStatitics(token).subscribe((data) => {
      this.statistics.push({ title: 'Alunos', detail: data.alunosCount });
      this.statistics.push({ title: 'Docentes', detail: data.docentesCount });
      this.statistics.push({ title: 'Turmas', detail: data.turmasCount });
    })
    this.studentService.getStudentsToken(token).subscribe((data) => {
      this.students = data.alunoData;
    });

  }

  logout() {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }

  loadTeacherData() {
    let token: string = this.authTokenService.getToken();
    this.statisticService.getStatitics(token).subscribe((data) => {
      this.statistics.push({ title: 'Alunos', detail: data.alunosCount });
    })
    this.studentService.getStudentsToken(token).subscribe((data) => {
      this.students = data.alunoData;
    });
  }

  onSearch() {
    const searchTerm = this.studentSearchTerm.toLowerCase();
    let token: string = this.authTokenService.getToken();

    this.studentService.getStudentsToken(token).subscribe((data) => {
      this.students = data.alunoData.filter((student) => {

        return (
          student.id?.toString().includes(searchTerm) ||
          student.nome.toLowerCase().includes(searchTerm) ||
          student.email?.toString().includes(searchTerm) ||
          student.cpf?.toString().includes(searchTerm) ||
          student.naturalidade?.toString().includes(searchTerm) ||
          student.dataNascimento?.toString().includes(searchTerm) ||
          (this.idadePipe.transform(student.dataNascimento)?.toString().includes(searchTerm)  
            && this.idadePipe.transform(student.dataNascimento)?.toString().length === searchTerm.length 
          )||
          this.phonePipe.transform(student.telefone)?.includes(searchTerm) ||
          student.telefone?.includes(searchTerm)
        );
      });
    });
  }

  isCurrentUserAdmin(): boolean {
    return this.currentUser?.scope === 'ADM';
  }

  isCurrentUserTeacher(): boolean {
    return this.currentUser?.scope === "PEDAGOGICO" || this.currentUser?.scope === "PROFESSOR"
  }

  isCurrentUserStudent(): boolean {
    return this.currentUser?.scope === 'ALUNO';
  }

  onViewGradeDetails(gradeId: string) {
    this.router.navigate(['/grade-list']);
  }
}
