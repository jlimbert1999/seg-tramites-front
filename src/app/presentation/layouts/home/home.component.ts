import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
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
import { AuthService, SocketService } from '../../services';
import { NavigationListComponent } from '../../components/navigation-list/navigation-list.component';
import { AppearanceService } from './services/appearance.service';
import { SidenavButtonComponent } from '../../components/sidenav-button/sidenav-button.component';
import { CacheService } from '../../services/cache.service';

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
  public cacheService = inject(CacheService);

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private socketService: SocketService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnInit(): void {
    this.socketService.setupSocketConnection();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  get menu() {
    return this.authService.menu();
  }

  get isToggle() {
    return this.appearanceService.toggleSidenav();
  }
}
