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
import { accountGuard } from './procedures/presentation/guards/account.guard';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Inicio de sesion',
    // canActivate: [isNotAuthenticatedGuard],
    loadComponent: () =>
      import('./layout/presentation/pages/login/login.component'),
  },
  {
    path: '',
    canActivate: [isAuthenticatedGuard],
    // canActivateChild: [roleGuard],
    loadComponent: () =>
      import('./layout/presentation/pages/dashboard/dashboard.component'),

    children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      {
        path: 'usuarios',
        title: 'Usuarios',
        loadComponent: () =>
          import(
            './users/presentation/pages/users-manage/users-manage.component'
          ),
      },
      {
        path: 'roles',
        title: 'Roles',
        loadComponent: () =>
          import(
            './users/presentation/pages/roles-manage/roles-manage.component'
          ),
      },
      {
        path: 'institutions',
        title: 'Instituciones',
        loadComponent: () =>
          import(
            './administration/presentation/pages/institutions-manage/institutions-manage.component'
          ),
      },

      {
        title: 'Funcionarios',
        path: 'officers',
        loadComponent: () =>
          import(
            './administration/presentation/pages/officers-manage/officers-manage.component'
          ),
      },

      {
        path: 'dependencies',
        title: 'Dependencias',
        loadComponent: () =>
          import(
            './administration/presentation/pages/dependencies-manage/dependencies-manage.component'
          ),
      },
      {
        path: 'accounts',
        title: 'Cuentas',
        loadComponent: () =>
          import(
            './administration/presentation/pages/accounts-manage/accounts-manage.component'
          ),
      },
      {
        path: 'types-procedures',
        loadComponent: () =>
          import(
            './administration/presentation/pages/types-procedures/types-procedures.component'
          ),
      },
      {
        path: 'manage',
        canActivate: [accountGuard],
        children: [
          {
            path: 'external',
            title: 'Externos',
            canActivate: [updatedPasswordGuard],
            loadComponent: () =>
              import(
                './procedures/presentation/pages/externals-manage/externals-manage.component'
              ),
          },
          {
            path: 'external/:id',
            loadComponent: () =>
              import(
                './procedures/presentation/pages/externals-manage/external-detail/external-detail.component'
              ),
          },
          {
            path: 'internal',
            title: 'Internos',
            canActivate: [updatedPasswordGuard],
            loadComponent: () =>
              import(
                './procedures/presentation/pages/internals-manage/internals-manage.component'
              ),
          },
        ],
      },

      // {
      //   path: ':from/:group/:id',
      //   canActivate: [updatedPasswordGuard],
      //   loadComponent: () =>
      //     import(
      //       './presentation/pages/procedures/detail/detail.component'
      //     ).then((c) => c.DetailComponent),
      // },
      {
        path: 'inbox',
        title: 'Bandeja - Entrada',
        data: { resource: VALID_RESOURCES.communication },
        canActivate: [updatedPasswordGuard],
        loadComponent: () =>
          import('./communications/pages/inbox/inbox.component'),
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
        canActivate: [updatedPasswordGuard],
        loadComponent: () =>
          import(
            './presentation/pages/communications/archives/archives.component'
          ).then((c) => c.ArchivesComponent),
      },
      {
        path: 'resources',
        loadComponent: () =>
          import('./layout/resources/resources.component').then(
            (c) => c.ResourcesComponent
          ),
      },
      {
        path: 'reports',
        canActivate: [updatedPasswordGuard],
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
            path: 'unit',
            component: ReportUnitComponent,
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
        path: 'main',
        loadComponent: () =>
          import('./layout/presentation/pages/main/main.component'),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./layout/presentation/pages/settings/settings.component'),
      },
      {
        path: 'info',
        component: InfoComponent,
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
