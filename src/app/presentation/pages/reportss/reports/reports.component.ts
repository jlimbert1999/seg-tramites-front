import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  inject,
  signal,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { SidenavButtonComponent } from '../../../components';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { AuthService, PdfService } from '../../../services';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import {
  CdkPortal,
  ComponentPortal,
  PortalModule,
  TemplatePortal,
} from '@angular/cdk/portal';

import { OverlayModule } from '@angular/cdk/overlay';
import { MaterialModule } from '../../../../material.module';
import { VALID_RESOURCES } from '../../../../infraestructure/interfaces';

interface menu {
  label: string;
  link: string;
}
@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    SidenavButtonComponent,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    OverlayModule,
    PortalModule,
    MaterialModule,
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsComponent implements OnInit {
  private readonly permissionMappings: Record<string, menu> = {
    applicants: { label: 'Solicitante', link: 'applicant' },
    search: { label: 'Busquedas', link: 'search' },
    dependents: { label: 'Dependientes', link: 'dependents' },
  };
  private overlay = inject(Overlay);
  @ViewChild(CdkPortal) portal!: CdkPortal;

  @ViewChild('pdfTable') pdfTable!: ElementRef;

  private authService = inject(AuthService);
  private pdfService = inject(PdfService);

  public menu = signal<menu[]>([]);
  public isOpen: boolean = false;
  private overlayRef?: OverlayRef;

  constructor(private _viewContainerRef: ViewContainerRef) {}

  ngOnInit(): void {
    this._loadMenu();
  }

  help() {
    const config = new OverlayConfig({
      hasBackdrop: true,
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),
      // width: '60%',
    });
    const overlayRef = this.overlay.create(config);
    overlayRef.attach(this.portal);
    overlayRef.backdropClick().subscribe(() => overlayRef.detach());
  }

  private _loadMenu() {
    console.log(this.authService.permissions());
    const menu = this.authService
      .permissions()
      [VALID_RESOURCES.reports].map((action) => this.permissionMappings[action])
      .filter((item) => item);
    console.log(menu);
    this.menu.set(menu);
  }
}
