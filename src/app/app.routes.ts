import { Routes } from '@angular/router';
import { LoginComponent } from './presentation/layouts/login/login.component';
import { HomeComponent } from './presentation/layouts/home/home.component';
import { InstitutionsComponent } from './presentation/pages/institutions/institutions.component';
import { TypesProceduresComponent } from './presentation/pages/types-procedures/types-procedures.component';
import { OfficersComponent } from './presentation/pages/officers/officers.component';
import { JobsComponent } from './presentation/pages/jobs/jobs.component';
import { RolesComponent } from './presentation/pages/roles/roles.component';
import { AccountsComponent } from './presentation/pages/administration/accounts/accounts.component';
import { AuthGuard, isNotAuthenticatedGuard } from './presentation/guards';
import { ExternalsComponent } from './presentation/pages/procedures/pages/externals/externals.component';
import { DetailComponent } from './presentation/pages/procedures/pages/detail/detail.component';
import { InternalsComponent } from './presentation/pages/procedures/pages/internals/internals.component';
import { InboxComponent } from './presentation/pages/communications/inbox/inbox.component';
import { OutboxComponent } from './presentation/pages/communications/outbox/outbox.component';
import { DependenciesComponent } from './presentation/pages/administration/dependencies/dependencies.component';
import { PostsComponent } from './presentation/pages/groupware/posts/posts.component';

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
      { path: 'external', component: ExternalsComponent },
      { path: 'internal', component: InternalsComponent },
      { path: ':from/:group/:id', component: DetailComponent },
      { path: 'inbox', component: InboxComponent },
      { path: 'outbox', component: OutboxComponent },
      { path: 'posts', component: PostsComponent },
    ],
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
