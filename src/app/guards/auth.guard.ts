import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../presentation/services';
import { tap } from 'rxjs';

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
