import { Routes } from '@angular/router';
import { LoginComponent } from './presentation/layouts/login/login.component';
import { HomeComponent } from './presentation/layouts/home/home.component';
import { AuthGuard, isNotAuthenticatedGuard } from './guards';
import { DependenciesComponent } from './presentation/pages/dependencies/dependencies.component';
import { InstitutionsComponent } from './presentation/pages/institutions/institutions.component';
import { TypesProceduresComponent } from './presentation/pages/types-procedures/types-procedures.component';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [isNotAuthenticatedGuard],
    component: LoginComponent,
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    component: HomeComponent,
    children: [
      { path: 'types-procedures', component: TypesProceduresComponent },
      { path: 'dependencies', component: DependenciesComponent },
      { path: 'institutions', component: InstitutionsComponent },
    ],
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
