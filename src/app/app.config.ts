import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { LOCALE_ID } from '@angular/core';
import { routes } from './app.routes';
import { loggingInterceptor } from './core/interceptors/interceptor';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es-BO';
import { ToastrModule, provideToastr } from 'ngx-toastr';
registerLocaleData(localeEs, 'es');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([loggingInterceptor])),
    provideToastr(),
    provideAnimations(),
    { provide: LOCALE_ID, useValue: 'es' },
  ],
};
