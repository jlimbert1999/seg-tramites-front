import { Routes } from '@angular/router';
import { LoginComponent } from './presentation/layouts/login/login.component';
import { HomeComponent } from './presentation/layouts/home/home.component';
import { AuthGuard, isNotAuthenticatedGuard } from './guards';
import { DependenciesComponent } from './presentation/pages/dependencies/dependencies.component';
import { InstitutionsComponent } from './presentation/pages/institutions/institutions.component';
import { TypesProceduresComponent } from './presentation/pages/types-procedures/types-procedures.component';
import { OfficersComponent } from './presentation/pages/officers/officers.component';
import { JobsComponent } from './presentation/pages/jobs/jobs.component';
import { RolesComponent } from './presentation/pages/roles/roles.component';
import { AccountsComponent } from './presentation/pages/accounts/accounts.component';

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
      { path: 'dependencies', component: DependenciesComponent },
      { path: 'institutions', component: InstitutionsComponent },
      { path: 'types-procedures', component: TypesProceduresComponent },
      { path: 'officers', component: OfficersComponent },
      { path: 'jobs', component: JobsComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'accounts', component: AccountsComponent },
    ],
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
