import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { AuthService } from '../../services';
import { VALID_RESOURCES } from '../../../infraestructure/interfaces';

interface menu {
  label: string;
  link: string;
  description: string;
}
@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [RouterModule, CommonModule, MaterialModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly permissionMappings: Record<string, menu> = {
    applicants: {
      label: 'Solicitante',
      link: 'applicant',
      description: 'Buscar por contribuyente',
    },
    search: {
      label: 'Busquedas',
      link: 'search',
      description: 'Buscar cualquier tramite',
    },
    dependents: {
      label: 'Dependientes',
      link: 'dependents',
      description: 'Listado de unidad',
    },
  };
  public menu = signal<menu[]>([]);

  constructor() {}

  ngOnInit(): void {
    this._loadMenu();
  }

  private _loadMenu() {
    const menu = this.authService
      .permissions()
      [VALID_RESOURCES.reports].map((action) => this.permissionMappings[action])
      .filter((item) => item);
    this.menu.set(menu);
  }
}
