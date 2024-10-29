import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';


export const AdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const currentUser = authService.getCurrentUser();
  const isUserAdmin = currentUser?.scope === 'ADM';
  if (!isUserAdmin) {
    router.navigate(['/unauthorized']);
  }
  return isUserAdmin;
};
