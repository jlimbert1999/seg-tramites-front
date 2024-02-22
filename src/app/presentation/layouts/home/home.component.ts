import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  ViewChild,
  effect,
  inject,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import {
  AuthService,
  SocketService,
  AppearanceService,
  AlertService,
} from '../../services';
import {
  SidenavButtonComponent,
  NavigationListComponent,
} from '../../components';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatMenuModule,
    RouterModule,
    MatProgressSpinnerModule,
    NavigationListComponent,
    SidenavButtonComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  private appearanceService = inject(AppearanceService);
  private socketService = inject(SocketService);
  private alertservice = inject(AlertService);
  private detroyref = inject(DestroyRef);
  private router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);

  @ViewChild('snav') public sidenav!: MatSidenav;
  public isHandset$ = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result) => result.matches));

  constructor() {
    effect(() => {
      this.sidenav.toggle();
      return this.appearanceService.isSidenavToggle();
    });
  }

  ngOnInit(): void {
    this.socketService.listenUserConnection();
    this.socketService
      .listenProceduresDispatches()
      .pipe(takeUntilDestroyed(this.detroyref))
      .subscribe((data) =>
        this.alertservice.Toast({
          title: `${data.emitter.fullname} ha enviado un tramite`,
          message: data.reference,
        })
      );
  }

  logout() {
    this.socketService.disconnect();
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  get menu() {
    return this.authService.menu();
  }

  get user() {
    return this.authService.account()!;
  }

  get isLoading() {
    return this.appearanceService.isLoading;
  }
}
