import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services';

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  // const router = inject(Router);
  // if (!authService.account()) {
  //   router.navigateByUrl('/home');
  //   return false;
  // }
  return true;
};
