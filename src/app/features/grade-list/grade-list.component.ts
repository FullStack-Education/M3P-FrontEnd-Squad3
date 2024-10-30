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
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.student = this.authService.getCurrentUser();
    this.studentService
      .getGrades(this.student.id_usuario)
      .subscribe((data: IStudentGrade[]) => {
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
