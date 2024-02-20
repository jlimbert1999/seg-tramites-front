import { Routes } from '@angular/router';
import { LoginComponent } from './presentation/layouts/login/login.component';
import { HomeComponent } from './presentation/layouts/home/home.component';
import { AuthGuard, isNotAuthenticatedGuard } from './presentation/guards';

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
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      {
        path: 'main',
        loadComponent: () =>
          import('./presentation/layouts/home/main/main.component').then(
            (c) => c.MainComponent
          ),
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
        loadComponent: () =>
          import(
            './presentation/pages/administration/accounts/accounts.component'
          ).then((c) => c.AccountsComponent),
      },
      {
        path: 'external',
        loadComponent: () =>
          import(
            './presentation/pages/procedures/externals/externals.component'
          ).then((c) => c.ExternalsComponent),
      },
      {
        path: 'internal',
        loadComponent: () =>
          import(
            './presentation/pages/procedures/internals/internals.component'
          ).then((c) => c.InternalsComponent),
      },
      {
        path: ':from/:group/:id',
        loadComponent: () =>
          import(
            './presentation/pages/procedures/detail/detail.component'
          ).then((c) => c.DetailComponent),
      },
      {
        path: 'inbox',
        loadComponent: () =>
          import(
            './presentation/pages/communications/inbox/inbox.component'
          ).then((c) => c.InboxComponent),
      },
      {
        path: 'inbox/:id',
        loadComponent: () =>
          import(
            './presentation/pages/communications/inbox/mail/mail.component'
          ).then((c) => c.MailComponent),
      },
      {
        path: 'outbox',
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
        path: 'reports/applicant',
        loadComponent: () =>
          import(
            './presentation/pages/reports/report-applicant/report-applicant.component'
          ).then((c) => c.ReportApplicantComponent),
      },
      {
        path: 'reports/search',
        loadComponent: () =>
          import(
            './presentation/pages/reports/report-search/report-search.component'
          ).then((c) => c.ReportSearchComponent),
      },
    ],
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
