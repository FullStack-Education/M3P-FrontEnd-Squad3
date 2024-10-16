import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { IUser as  ITeacher } from '../../core/interfaces/user.interface';
import { MatTableModule } from '@angular/material/table';


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
  ],
  templateUrl: './teacher-list.component.html',
  styleUrl: './teacher-list.component.scss',
})
export class TeacherListComponent implements OnInit {
  teachers: ITeacher[] = [];
  filteredTeachers: ITeacher[] = [];
  searchQuery: string = '';
  displayedColumns: string[] = ['id', 'name', 'phone', 'email', 'actions'];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.userService.getAllTeachers().subscribe((data: ITeacher[]) => {
      this.teachers = data;
      this.filteredTeachers = data;
    });
  }

  filterTeachers() {
    if (this.searchQuery) {
      this.filteredTeachers = this.teachers.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
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
