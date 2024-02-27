import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { AppearanceService, AuthService } from '../../presentation/services';
import { Alert } from '../../helpers';

export function loggingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const appearanceService = inject(AppearanceService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const reqWithHeader = req.clone({
    headers: req.headers.append(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    ),
  });
  appearanceService.showLoading();
  console.log(reqWithHeader.url);
  return next(reqWithHeader).pipe(
    catchError((error) => {
      console.error(error);
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          authService.logout();
          router.navigate(['/login']);
        }
        hendleHttpErrors(error);
      }
      return throwError(() => Error);
    }),
    finalize(() => {
      appearanceService.hideLoading();
    })
  );
}

const hendleHttpErrors = (error: HttpErrorResponse) => {
  switch (error.status) {
    case 500:
      Alert.Alert({
        icon: 'error',
        title: 'Error en el servidor',
        text: 'Se ha producido un error en el servidor',
      });
      break;
    case 400:
      Alert.Alert({
        icon: 'warning',
        title: 'Solicitud incorrecta',
        text: error.error.message,
      });
      break;
    case 403:
      Alert.Alert({
        icon: 'info',
        title: 'Accesso denegado',
        text: 'Esta cuenta no tiene los permisos requeridos',
      });
      break;
    case 404:
      Alert.Alert({
        icon: 'warning',
        title: 'Recurso no econtrado',
        text: error.error.message,
      });
      break;
    default:
      break;
  }
};
