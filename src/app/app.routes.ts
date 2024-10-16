import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { AdminOrTeacherGuard } from './core/guards/admin-or-teacher.guard';
import { isStudentGuard } from './core/guards/is-student.guard';
import { TeacherComponent } from './features/teacher/teacher.component';

import { GradeListComponent } from './features/grade-list/grade-list.component';
import { StudentComponent } from './features/student/student.component';
import { GradeComponent } from './features/grade/grade.component';
import { TeacherListComponent } from './features/teacher-list/teacher-list.component';
import { EnrollmentComponent } from './features/enrollment/enrollment.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'unauthenticated', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: 'teacher',
    component: TeacherComponent,
    canActivate: [AuthGuard] && [AdminGuard],
  },
  {
    path: 'enrollment',
    component: EnrollmentComponent,
    canActivate: [AuthGuard] && [AdminOrTeacherGuard],
  },
  {
    path: 'grade-list',
    component: GradeListComponent,
    canActivate: [AuthGuard] && [isStudentGuard],
  },
  {
    path: 'student',
    component: StudentComponent,
    canActivate: [AuthGuard] && [AdminGuard],
  },
  {
    path: 'grade',
    component: GradeComponent,
    canActivate: [AuthGuard] && [AdminOrTeacherGuard],
  },
  {
    path: 'teacher-list',
    component: TeacherListComponent,
    canActivate: [AuthGuard] && [AdminGuard],
  },
  { path: '**', redirectTo: '/home' },
];
