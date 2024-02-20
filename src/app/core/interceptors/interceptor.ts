import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Alert } from '../../helpers';
import { AppearanceService, AuthService } from '../../presentation/services';
import { Router } from '@angular/router';

export function loggingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const loading = inject(AppearanceService).isloading$;
  const autService = inject(AuthService);
  const router = inject(Router);
  const reqWithHeader = req.clone({
    headers: req.headers.append(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    ),
  });
  loading.next(true);
  return next(reqWithHeader).pipe(
    catchError((error) => {
      console.log('intercetpor', error);
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          autService.logout();
          router.navigate(['/login']);
        }
        hendleHttpErrors(error);
      }
      return throwError(() => Error);
    }),
    finalize(() => {
      loading.next(false);
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
