import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Alert } from '../../helpers';

export function loggingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const reqWithHeader = req.clone({
    headers: req.headers.append(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    ),
  });
  return next(reqWithHeader).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse) hendleHttpErrors(error);
      return throwError(() => Error);
    })
  );
}

const hendleHttpErrors = (error: HttpErrorResponse) => {
  console.log(error);
  switch (error.status) {
    case 500:
      Alert.showAlert({
        icon: 'error',
        title: 'Error en el servidor',
        text: 'Se ha producido un error en el servidor',
      });
      break;
    case 400:
      Alert.showAlert({
        icon: 'warning',
        title: 'Solicitud incorrecta',
        text: error.error.message,
      });
      break;
    case 403:
      Alert.showAlert({
        icon: 'info',
        title: 'Accesso denegado',
        text: 'Esta cuenta no tiene los permisos requeridos',
      });
      break;
    case 404:
      Alert.showAlert({
        icon: 'warning',
        title: 'Recurso no econtrado',
        text: error.error.message,
      });
      break;

    default:
      break;
  }
};
