import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Alert } from '../../helpers';
import { AppearanceService } from '../../presentation/services';

export function loggingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const { loading } = inject(AppearanceService);
  const reqWithHeader = req.clone({
    headers: req.headers.append(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    ),
  });
  loading.set(true);
  return next(reqWithHeader).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse) hendleHttpErrors(error);
      return throwError(() => Error);
    }),
    finalize(() => {
      loading.set(false);
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
