import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { IUser } from '../../core/interfaces/user.interface';
import { IGrade } from '../../core/interfaces/grade.interface';
import { GradeService } from '../../core/services/grade.service';
import { AuthService } from '../../core/services/auth.service';
import { StudentService, IStudentGrade } from '../../core/services/student.service';
import { MatTableModule } from '@angular/material/table';
import { IToken } from '../../core/interfaces/Itoken.inteface';
import AuthTokenService from '../../core/services/auth-token.service';
import { IResponseNotaAluno } from '../../core/interfaces/response.nota.aluno.inteface';
import { INota } from '../../core/interfaces/nota.inteface';

@Component({
  selector: 'app-grade-list',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatTableModule,
  ],
  templateUrl: './grade-list.component.html',
  styleUrl: './grade-list.component.scss',
})
export class GradeListComponent implements OnInit {
  grades: IStudentGrade[] = [];
  filteredGrades: IStudentGrade[] = [];
  searchQuery: string = '';
  student?: IToken;
  displayedColumns: string[] = ['materiaName', 'name', 'grade', 'date'];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private gradeService: GradeService,
    private authTokenService: AuthTokenService,
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.student = this.authService.getCurrentUser();
    const token: string = this.authTokenService.getToken();
    this.studentService
      .getNotasAlunoToken(this.student.id_usuario, token)
      .subscribe((response: IResponseNotaAluno) => {      
        
        const data: IStudentGrade[] = response.notaData.map((nota: INota) => ({
          id: nota.id,
          name: nota.nome,
          grade: nota.valor.toString(),
          date: new Date(nota.data),
          materiaName: nota.materia.nome,
          professorId: '',
          materiaId: nota.materia.id,
          usuarioId: this.student!.id_usuario,
        }));
        this.grades = data;
        this.filteredGrades = data;
      });
  }

  filterGrades() {
    if (this.searchQuery) {
      this.filteredGrades = this.grades.filter(
        (grade) =>
          grade.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          grade.id.toString().includes(this.searchQuery)
      );
    } else {
      this.filteredGrades = this.grades;
    }
  }

  viewGrade(id: string) {
    this.router.navigate(['/grade'], {
      queryParams: { id: id, mode: 'edit' },
    });
  }
}
