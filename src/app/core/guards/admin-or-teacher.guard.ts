import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';


export const AdminOrTeacherGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const currentUser = authService.getCurrentUser();
  const isUserAdminOrTeacher = currentUser?.scope === 'ADM' || currentUser?.scope === 'PROFESSOR';
  if (!isUserAdminOrTeacher) {
    router.navigate(['/unauthorized']);
  }
  return isUserAdminOrTeacher;
};
