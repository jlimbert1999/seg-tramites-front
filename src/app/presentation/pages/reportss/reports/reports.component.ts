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
  private permissionMappings: Record<string, menu> = {
    applicant: { label: 'Solicitante', link: 'applicant' },
    search: { label: 'Busquedas', link: 'search' },
    dependents: { label: 'Dependientes', link: 'dependents' },
  };
  private overlay = inject(Overlay);
  @ViewChild(CdkPortal) portal!: CdkPortal;

  @ViewChild('pdfTable') pdfTable!: ElementRef;

  private authService = inject(AuthService);
  private pdfService = inject(PdfService);

  public menu: menu[] = [];
  public isOpen: boolean = false;
  private overlayRef?: OverlayRef;

  constructor(private _viewContainerRef: ViewContainerRef) {}

  ngOnInit(): void {
    const actions = this.authService.permissions()!['reports'];
    this.menu = actions.map((action) => ({
      name: action,
      ...this.permissionMappings[action],
    }));
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
}
