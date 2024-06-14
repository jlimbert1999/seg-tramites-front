import { Routes } from '@angular/router';
import { LoginComponent } from './presentation/layouts/login/login.component';
import { HomeComponent } from './presentation/layouts/home/home.component';
import { ReportApplicantComponent } from './presentation/pages/reports/report-applicant/report-applicant.component';
import { MainComponent } from './presentation/layouts/home/main/main.component';
import { DetailComponent } from './presentation/pages/procedures/detail/detail.component';
import { ReportSearchComponent } from './presentation/pages/reports/report-search/report-search.component';
import { PostsComponent } from './presentation/pages/groupware/posts/posts.component';
import {
  isAuthenticatedGuard,
  isNotAuthenticatedGuard,
  roleGuard,
  updatedPasswordGuard,
} from './presentation/guards';
import { InfoComponent } from './presentation/layouts/home/info/info.component';
import { ReportDependentsComponent } from './presentation/pages/reports/report-dependents/report-dependents.component';
import { ClientsComponent } from './presentation/pages/groupware/clients/clients.component';
import { VALID_RESOURCES } from './infraestructure/interfaces';
import { ReportsComponent } from './presentation/pages/reports/reports.component';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [isNotAuthenticatedGuard],
    component: LoginComponent,
    title: 'Inicio de sesion',
  },
  {
    path: 'home',
    canActivate: [isAuthenticatedGuard],
    canActivateChild: [roleGuard],
    component: HomeComponent,
    title: 'Inicio',
    children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      {
        path: 'main',
        component: MainComponent,
      },
      {
        path: 'dependencies',
        loadComponent: () =>
          import(
            './presentation/pages/administration/dependencies/dependencies.component'
          ).then((c) => c.DependenciesComponent),
      },
      {
        path: 'institutions',
        loadComponent: () =>
          import(
            './presentation/pages/administration/institutions/institutions.component'
          ).then((c) => c.InstitutionsComponent),
      },
      {
        path: 'types-procedures',
        loadComponent: () =>
          import(
            './presentation/pages/administration/types-procedures/types-procedures.component'
          ).then((c) => c.TypesProceduresComponent),
      },
      {
        path: 'officers',
        loadComponent: () =>
          import(
            './presentation/pages/administration/officers/officers.component'
          ).then((c) => c.OfficersComponent),
      },
      {
        path: 'jobs',
        loadComponent: () =>
          import(
            './presentation/pages/administration/jobs/jobs.component'
          ).then((c) => c.JobsComponent),
      },
      {
        path: 'roles',
        loadComponent: () =>
          import(
            './presentation/pages/administration/roles/roles.component'
          ).then((c) => c.RolesComponent),
      },
      {
        path: 'accounts',
        title: 'Cuentas',
        loadComponent: () =>
          import(
            './presentation/pages/administration/accounts/accounts.component'
          ).then((c) => c.AccountsComponent),
      },
      {
        path: 'external',
        title: 'Externos',
        canActivate: [updatedPasswordGuard],
        loadComponent: () =>
          import(
            './presentation/pages/procedures/externals/externals.component'
          ).then((c) => c.ExternalsComponent),
      },
      {
        path: 'internal',
        canActivate: [updatedPasswordGuard],
        title: 'Internos',
        loadComponent: () =>
          import(
            './presentation/pages/procedures/internals/internals.component'
          ).then((c) => c.InternalsComponent),
      },
      {
        path: ':from/:group/:id',
        canActivate: [updatedPasswordGuard],
        loadComponent: () =>
          import(
            './presentation/pages/procedures/detail/detail.component'
          ).then((c) => c.DetailComponent),
      },
      {
        path: 'inbox',
        title: 'Bandeja - Entrada',
        data: { resource: VALID_RESOURCES.communication },
        canActivate: [updatedPasswordGuard],
        loadComponent: () =>
          import(
            './presentation/pages/communications/inbox/inbox.component'
          ).then((c) => c.InboxComponent),
      },
      {
        path: 'inbox/:id',
        title: 'Detalle - Envio',
        canActivate: [updatedPasswordGuard],
        loadComponent: () =>
          import(
            './presentation/pages/communications/communication/communication.component'
          ).then((c) => c.CommunicationComponent),
      },
      {
        path: 'outbox',
        title: 'Bandeja - Salida',
        canActivate: [updatedPasswordGuard],
        loadComponent: () =>
          import(
            './presentation/pages/communications/outbox/outbox.component'
          ).then((c) => c.OutboxComponent),
      },
      {
        path: 'archives',
        loadComponent: () =>
          import(
            './presentation/pages/communications/archives/archives.component'
          ).then((c) => c.ArchivesComponent),
      },
      {
        path: 'resources',
        loadComponent: () =>
          import(
            './presentation/layouts/home/resources/resources.component'
          ).then((c) => c.ResourcesComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import(
            './presentation/layouts/home/settings/settings.component'
          ).then((c) => c.SettingsComponent),
      },
      {
        path: 'reports',
        component: ReportsComponent,
        title: 'Reportes',
        children: [
          {
            path: 'applicant',
            component: ReportApplicantComponent,
          },
          {
            path: 'search',
            component: ReportSearchComponent,
          },
          {
            path: 'dependents',
            component: ReportDependentsComponent,
          },
          {
            path: '',
            redirectTo: '/home/reports/search',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: 'groupware',
        data: { resource: VALID_RESOURCES.groupware },
        children: [
          {
            path: 'users',
            component: ClientsComponent,
          },
        ],
      },
      {
        path: 'posts',
        component: PostsComponent,
      },
      {
        path: 'info',
        component: InfoComponent,
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
