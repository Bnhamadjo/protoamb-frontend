import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth';

export const authGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLogged()) {
    router.navigate(['/login']);
    return false;
  }

  const expectedRoles = route.data['roles'] as string[];
  if (expectedRoles && !auth.hasRole(expectedRoles)) {
    router.navigate(['/admin/dashboard']); // Ou página de erro
    return false;
  }

  return true;
};
