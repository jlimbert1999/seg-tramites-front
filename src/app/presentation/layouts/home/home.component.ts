import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatMenuModule } from '@angular/material/menu';

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
    NavigationListComponent,
    SidenavButtonComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  private authService = inject(AuthService);
  private appearanceService = inject(AppearanceService);
  private socketService = inject(SocketService);
  private alertservice = inject(AlertService);
  private detroyref = inject(DestroyRef);

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => {
      console.log('change view');
      return changeDetectorRef.detectChanges();
    };
    this.mobileQuery.addListener(this._mobileQueryListener);
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

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  get menu() {
    return this.authService.menu();
  }

  get user() {
    return this.authService.account()!;
  }

  get isToggle() {
    return this.appearanceService.toggleSidenav();
  }
}
