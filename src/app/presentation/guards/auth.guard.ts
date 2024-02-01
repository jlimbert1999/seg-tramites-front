import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from '../services';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.checkAuthStatus().pipe(
    tap((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigate(['/login']);
      }
    })
  );
};
