import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { roleResponse } from './interfaces/role-response.interface';
import { RoleService } from './services/role.service';
import { RoleComponent } from './role/role.component';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SidenavButtonComponent } from '../../components/sidenav-button/sidenav-button.component';
import { MatButtonModule } from '@angular/material/button';
import { FilterSystemResourcesPipe } from './pipes/filter-system-resources.pipe';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatToolbarModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    SidenavButtonComponent,
    // FilterSystemResourcesPipe,
  ],
  templateUrl: './roles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesComponent {
  private dialog = inject(MatDialog);
  private roleService = inject(RoleService);
  public displayedColumns: string[] = ['rol', 'privilegios', 'options'];
  public dataSource = signal<roleResponse[]>([]);

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.roleService.findAll().subscribe((resp) => {
      this.dataSource.set(resp.roles);
    });
  }
  add(): void {
    const dialogRef = this.dialog.open(RoleComponent, {
      width: '1200px',
    });
    dialogRef.afterClosed().subscribe((result?: roleResponse) => {
      if (!result) return;
      this.dataSource.update((values) => [result, ...values]);
    });
  }
  edit(role: roleResponse) {
    const dialogRef = this.dialog.open(RoleComponent, {
      data: role,
      width: '1200px',
    });
    dialogRef.afterClosed().subscribe((result: roleResponse) => {
      if (!result) return;
      this.dataSource.update((values) => {
        const index = values.findIndex((value) => value._id === result._id);
        values[index] = result;
        return [...values];
      });
    });
  }
}
