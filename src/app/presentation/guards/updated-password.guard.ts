import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services';
import { tap } from 'rxjs';

export const updatedPasswordGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.checkUpdatedPasswrod().pipe(
    tap((isUpdated) => {
      if (!isUpdated) router.navigateByUrl('/home/settings');
    })
  );
};
