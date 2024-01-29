import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../presentation/services';
import { AuthStatus } from '../interfaces';

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  // if (authService.authStatus() === AuthStatus.authenticated) {
  //   console.log('usted ya esta autenticado');
  //   router.navigateByUrl('/home');
  //   return false;
  // }
  return true;
};
