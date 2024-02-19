import { Routes } from '@angular/router';
import { LoginComponent } from './presentation/layouts/login/login.component';
import { HomeComponent } from './presentation/layouts/home/home.component';
import { AccountsComponent } from './presentation/pages/administration/accounts/accounts.component';
import { AuthGuard, isNotAuthenticatedGuard } from './presentation/guards';
import { InboxComponent } from './presentation/pages/communications/inbox/inbox.component';
import { OutboxComponent } from './presentation/pages/communications/outbox/outbox.component';
import { DependenciesComponent } from './presentation/pages/administration/dependencies/dependencies.component';
import { PostsComponent } from './presentation/pages/groupware/posts/posts.component';
import { MailComponent } from './presentation/pages/communications/inbox/mail/mail.component';
import { ArchivesComponent } from './presentation/pages/communications/archives/archives.component';
import { InstitutionsComponent } from './presentation/pages/administration/institutions/institutions.component';
import { JobsComponent } from './presentation/pages/administration/jobs/jobs.component';
import { OfficersComponent } from './presentation/pages/administration/officers/officers.component';
import { RolesComponent } from './presentation/pages/administration/roles/roles.component';
import { TypesProceduresComponent } from './presentation/pages/administration/types-procedures/types-procedures.component';
import { DetailComponent } from './presentation/pages/procedures/detail/detail.component';
import { ExternalsComponent } from './presentation/pages/procedures/externals/externals.component';
import { InternalsComponent } from './presentation/pages/procedures/internals/internals.component';
import { ResourcesComponent } from './presentation/layouts/home/resources/resources.component';
import { SettingsComponent } from './presentation/layouts/home/settings/settings.component';

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
      { path: 'inbox/:id', component: MailComponent },
      { path: 'outbox', component: OutboxComponent },
      { path: 'archives', component: ArchivesComponent },
      { path: 'posts', component: PostsComponent },
      { path: 'resources', component: ResourcesComponent },
      { path: 'settings', component: SettingsComponent },
    ],
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
