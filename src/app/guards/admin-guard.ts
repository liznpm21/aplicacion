import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getCurrentUser();

  if (!user) {
    router.navigate(['/home']);
    return false;
  }

  const role = await authService.getUserRole(user.uid);

  if (role === 'admin') {
    return true;
  }

  router.navigate(['/services']);
  return false;
};