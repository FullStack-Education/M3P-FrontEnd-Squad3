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
  ],
})
export class HomeComponent {
  studentSearchTerm: string = '';
  currentUser: IUser | null = null;
  statistics = [] as { title: string; detail: number }[];
  students = [] as IUser[];
  teachers = [] as IUser[];
  studentGrades = [] as IStudentGrade[];
  studentEnrollments = [] as IEnrollmentClass[];
  extraSubjects = ['Matemática', 'Química', 'Física']; // Mocks para materias extras

  constructor(
    private authService: AuthService,
    private router: Router,
    private studentService: StudentService,
    private userService: UserService,
    private enrollmentService: EnrollmentService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.isCurrentUserTeacher()) this.loadTeacherData();
    if (this.isCurrentUserAdmin()) this.loadAdminData();
    if (this.isCurrentUserStudent()) this.loadStudentData();
  }

  loadStudentData() {
    console.log('loadStudentData', this.currentUser!.id);
    
    this.studentService
      .getEnrollments(this.currentUser!.id)
      .subscribe((enrollments) => {        
        console.log("enrollments do aluno:" , enrollments);
        this.studentEnrollments = enrollments.slice(0, 3);

        this.studentEnrollments.forEach((enrollment) => {
          this.enrollmentService.getCourseNameById(enrollment.courseId).subscribe((courseName) => {
            enrollment.courseName = courseName; 
          });
        });
      });
    this.studentService
      .getGradesByOrder(this.currentUser!.id, 'desc', 3)
      .subscribe((grades) => {
        this.studentGrades = grades;
      });
  }

  loadAdminData() {
    this.studentService.getStudents().subscribe((data) => {
      this.students = data;
      this.statistics.push({ title: 'Alunos', detail: this.students.length });
    });
    this.userService.getUsersByRole("2").subscribe((data) => {
      this.teachers = data;
      this.statistics.push({ title: 'Docentes', detail: this.teachers.length });
    });
    this.enrollmentService.getEnrollmentCount().subscribe((data) => {
      this.statistics.push({ title: 'Turmas', detail: data });
    });
  }

  logout() {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }

  loadTeacherData() {
    this.studentService.getStudents().subscribe((data) => {
      this.students = data;
      this.statistics.push({ title: 'Alunos', detail: this.students.length });
    });
  }

  onSearch() {
    const searchTerm = this.studentSearchTerm.toLowerCase();

    this.studentService.getStudents().subscribe((data) => {
      this.students = data.filter((student) => {
        return (
          student.name.toLowerCase().includes(searchTerm) ||
          student.age?.toString().includes(searchTerm) ||
          student.phone?.includes(searchTerm)
        );
      });
    });
  }

  isCurrentUserAdmin(): boolean {
    return this.currentUser?.role?.name === 'Admin';
  }

  isCurrentUserTeacher(): boolean {
    return this.currentUser?.role?.name === 'Docente';
  }

  isCurrentUserStudent(): boolean {
    return this.currentUser?.role?.name === 'Aluno';
  }

  onViewGradeDetails(gradeId: string) {
    this.router.navigate(['/grade-list']);
  }
}
