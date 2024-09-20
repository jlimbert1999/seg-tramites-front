import { Routes } from '@angular/router';
import { ReportApplicantComponent } from './presentation/pages/reports/report-applicant/report-applicant.component';
import { ReportSearchComponent } from './presentation/pages/reports/report-search/report-search.component';
import {
  isAuthenticatedGuard,
  isNotAuthenticatedGuard,
  roleGuard,
  updatedPasswordGuard,
} from './presentation/guards';
import { ReportDependentsComponent } from './presentation/pages/reports/report-dependents/report-dependents.component';
import { ClientsComponent } from './presentation/pages/groupware/clients/clients.component';
import { VALID_RESOURCES } from './infraestructure/interfaces';
import { ReportsComponent } from './presentation/pages/reports/reports.component';
import { ReportUnitComponent } from './presentation/pages/reports/report-unit/report-unit.component';
import { InfoComponent } from './layout/presentation/pages/info/info.component';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Inicio de sesion',
    // canActivate: [isNotAuthenticatedGuard],
    loadComponent: () =>
      import('./layout/presentation/pages/login/login.component'),
  },
  {
    path: 'home',
    title: 'Inicio',
    canActivate: [isAuthenticatedGuard],
    // canActivateChild: [roleGuard],
    loadComponent: () =>
      import('./layout/presentation/pages/dashboard/dashboard.component'),

    children: [
      {
        path: 'settings',
        loadComponent: () =>
          import('./layout/presentation/pages/settings/settings.component'),
      },
      {
        path: 'posts',
        children: [
          {
            path: 'history',
            loadComponent: () =>
              import(
                './publications/presentation/pages/publication-history/publication-history.component'
              ),
          },
          {
            path: 'manage',
            loadComponent: () =>
              import(
                './publications/presentation/pages/manage-publications/manage-publications.component'
              ),
          },
        ],
      },
      {
        path: 'external',
        title: 'Externos',
        // canActivate: [updatedPasswordGuard],
        loadComponent: () =>
          import(
            './presentation/pages/procedures/externals/externals.component'
          ),
      },
      {
        path: 'internal',
        title: 'Internos',
        // canActivate: [updatedPasswordGuard],
        loadComponent: () =>
          import(
            './presentation/pages/procedures/internals/internals.component'
          ),
      },
      {
        path: 'accounts',
        title: 'Cuentas',
        loadComponent: () =>
          import(
            './presentation/pages/administration/accounts/accounts.component'
          ).then((c) => c.AccountsComponent),
      },
    ],

    // children: [
    //   { path: '', redirectTo: 'main', pathMatch: 'full' },

    //   {
    //     path: 'dependencies',
    //     loadComponent: () =>
    //       import(
    //         './presentation/pages/administration/dependencies/dependencies.component'
    //       ).then((c) => c.DependenciesComponent),
    //   },
    //   {
    //     path: 'institutions',
    //     loadComponent: () =>
    //       import(
    //         './presentation/pages/administration/institutions/institutions.component'
    //       ).then((c) => c.InstitutionsComponent),
    //   },
    //   {
    //     path: 'types-procedures',
    //     loadComponent: () =>
    //       import(
    //         './presentation/pages/administration/types-procedures/types-procedures.component'
    //       ).then((c) => c.TypesProceduresComponent),
    //   },
    //   {
    //     path: 'officers',
    //     loadComponent: () =>
    //       import(
    //         './presentation/pages/administration/officers/officers.component'
    //       ).then((c) => c.OfficersComponent),
    //   },
    //   {
    //     path: 'jobs',
    //     loadComponent: () =>
    //       import(
    //         './presentation/pages/administration/jobs/jobs.component'
    //       ).then((c) => c.JobsComponent),
    //   },
    //   {
    //     path: 'roles',
    //     loadComponent: () =>
    //       import(
    //         './presentation/pages/administration/roles/roles.component'
    //       ).then((c) => c.RolesComponent),
    //   },
    //   {
    //     path: 'accounts',
    //     title: 'Cuentas',
    //     loadComponent: () =>
    //       import(
    //         './presentation/pages/administration/accounts/accounts.component'
    //       ).then((c) => c.AccountsComponent),
    //   },
    //   {
    //     path: 'external',
    //     title: 'Externos',
    //     canActivate: [updatedPasswordGuard],
    //     loadComponent: () =>
    //       import(
    //         './presentation/pages/procedures/externals/externals.component'
    //       ).then((c) => c.ExternalsComponent),
    //   },
    //   {
    //     path: 'internal',
    //     title: 'Internos',
    //     canActivate: [updatedPasswordGuard],
    //     loadComponent: () =>
    //       import(
    //         './presentation/pages/procedures/internals/internals.component'
    //       ).then((c) => c.InternalsComponent),
    //   },
    //   {
    //     path: ':from/:group/:id',
    //     canActivate: [updatedPasswordGuard],
    //     loadComponent: () =>
    //       import(
    //         './presentation/pages/procedures/detail/detail.component'
    //       ).then((c) => c.DetailComponent),
    //   },
    //   {
    //     path: 'inbox',
    //     title: 'Bandeja - Entrada',
    //     data: { resource: VALID_RESOURCES.communication },
    //     canActivate: [updatedPasswordGuard],
    //     loadComponent: () =>
    //       import(
    //         './presentation/pages/communications/inbox/inbox.component'
    //       ).then((c) => c.InboxComponent),
    //   },
    //   {
    //     path: 'inbox/:id',
    //     title: 'Detalle - Envio',
    //     canActivate: [updatedPasswordGuard],
    //     loadComponent: () =>
    //       import(
    //         './presentation/pages/communications/communication/communication.component'
    //       ).then((c) => c.CommunicationComponent),
    //   },
    //   {
    //     path: 'outbox',
    //     title: 'Bandeja - Salida',
    //     canActivate: [updatedPasswordGuard],
    //     loadComponent: () =>
    //       import(
    //         './presentation/pages/communications/outbox/outbox.component'
    //       ).then((c) => c.OutboxComponent),
    //   },
    //   {
    //     path: 'archives',
    //     canActivate: [updatedPasswordGuard],
    //     loadComponent: () =>
    //       import(
    //         './presentation/pages/communications/archives/archives.component'
    //       ).then((c) => c.ArchivesComponent),
    //   },
    //   {
    //     path: 'resources',
    //     loadComponent: () =>
    //       import('./layout/resources/resources.component').then(
    //         (c) => c.ResourcesComponent
    //       ),
    //   },
    //   {
    //     path: 'reports',
    //     canActivate: [updatedPasswordGuard],
    //     component: ReportsComponent,
    //     title: 'Reportes',
    //     children: [
    //       {
    //         path: 'applicant',
    //         component: ReportApplicantComponent,
    //       },
    //       {
    //         path: 'search',
    //         component: ReportSearchComponent,
    //       },
    //       {
    //         path: 'dependents',
    //         component: ReportDependentsComponent,
    //       },
    //       {
    //         path: 'unit',
    //         component: ReportUnitComponent,
    //       },
    //       {
    //         path: '',
    //         redirectTo: '/home/reports/search',
    //         pathMatch: 'full',
    //       },
    //     ],
    //   },
    //   {
    //     path: 'groupware',
    //     data: { resource: VALID_RESOURCES.groupware },
    //     children: [
    //       {
    //         path: 'users',
    //         component: ClientsComponent,
    //       },
    //     ],
    //   },
    //   {
    //     path: 'posts',
    //     children: [
    //       {
    //         path: 'history',
    //         loadComponent: () =>
    //           import(
    //             './publications/presentation/pages/publication-history/publication-history.component'
    //           ),
    //       },
    //       {
    //         path: 'manage',
    //         loadComponent: () =>
    //           import(
    //             './publications/presentation/pages/manage-publications/manage-publications.component'
    //           ),
    //       },
    //     ],
    //   },
    //   // {
    //   //   path: 'main',
    //   //   loadComponent: () => import('./layout/'),
    //   // },
    //   {
    //     path: 'settings',
    //     loadComponent: () =>
    //       import('./layout/presentation/pages/settings/settings.component'),
    //   },
    //   {
    //     path: 'info',
    //     component: InfoComponent,
    //   },
    // ],
  },
  // { path: '**', redirectTo: 'login' },
];
