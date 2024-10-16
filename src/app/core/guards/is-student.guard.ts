import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const isStudentGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const currentUser = authService.getCurrentUser();
  const isUserStudent = currentUser?.role?.name === 'Aluno';
  if (!isUserStudent) {
    router.navigate(['/unauthorized']);
  }
  return isUserStudent;
};
