import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import AuthTokenService from '../../core/services/auth-token.service';
import { TeacherService } from '../../core/services/teacher.service';
import { IResponseTeachers } from '../../core/interfaces/response.teacher.interface';
import { ITeacher } from '../../core/interfaces/teacher.interface';
import { PhonePipe } from '../../core/pipes/phone.pipe';


@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatTableModule,
    PhonePipe
  ],
  templateUrl: './teacher-list.component.html',
  styleUrl: './teacher-list.component.scss',
})
export class TeacherListComponent implements OnInit {
  teachers: ITeacher[] = [];
  filteredTeachers: ITeacher[] = [];
  searchQuery: string = '';
  displayedColumns: string[] = ['id', 'name', 'phone', 'email', 'actions'];

  constructor(
    private teacherService: TeacherService, 
    private router: Router,
    private authToken: AuthTokenService
  ) {}

  ngOnInit() {
    let token  = this.authToken.getToken();
    this.teacherService.getAllTeachersToken(token)
    .subscribe((data: IResponseTeachers) => {
      this.teachers = data.docenteData;
      this.filteredTeachers = data.docenteData;
    });
  }

  filterTeachers() {
    if (this.searchQuery) {
      this.filteredTeachers = this.teachers.filter(
        (teacher) =>
          teacher.nome.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          teacher.id.toString().includes(this.searchQuery)
      );
    } else {
      this.filteredTeachers = this.teachers;
    }
  }

  viewTeacher(id: string) {
    this.router.navigate(['/teacher'], {
      queryParams: { id: id, mode: 'read' },
    });
  }
}
