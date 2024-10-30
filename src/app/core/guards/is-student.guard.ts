import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const isStudentGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const currentUser = authService.getCurrentUser();
  const isUserStudent = currentUser?.scope === 'ALUNO';
  if (!isUserStudent) {
    router.navigate(['/unauthorized']);
  }
  return isUserStudent;
};
