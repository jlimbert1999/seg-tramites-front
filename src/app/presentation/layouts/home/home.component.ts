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
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import { map, shareReplay } from 'rxjs';
import {
  AuthService,
  SocketService,
  AppearanceService,
  AlertService,
} from '../../services';
import {
  SidenavButtonComponent,
  NavigationListComponent,
  ProfileComponent,
} from '../../components';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    NavigationListComponent,
    SidenavButtonComponent,
    ProfileComponent,
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
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);

  protected detailsOpen = false;

  @ViewChild('snav') public sidenav!: MatSidenav;
  public isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay()
  );

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.socketService.disconnect();
    });
    // effect(() => {
    //   this.sidenav.toggle();
    //   return this.appearanceService.isSidenavToggle();
    // });
  }

  ngOnInit(): void {
    this.socketService.connect();
    this.handleOnlineClients();
    this.handleExpelClient();
    this.handleCommunications();
  }

  logout() {
    this.socketService.disconnect();
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private handleOnlineClients(): void {
    this.socketService.listenClientConnection();
  }

  private handleExpelClient(): void {
    this.socketService
      .listExpel()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((message) => {
        this.alertservice.Alert({
          icon: 'info',
          title: 'Usted ha sido expulsado',
          text: message,
        });
        this.logout();
      });
  }

  private handleCommunications(): void {
    this.socketService
      .listenProceduresDispatches()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) =>
        this.alertservice.Toast({
          title: `${data.emitter.fullname} ha enviado un tramite`,
          message: data.reference,
        })
      );
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
