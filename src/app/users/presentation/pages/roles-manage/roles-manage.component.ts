import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RoleService } from '../../services/role.service';
import { RoleDialogComponent } from './role-dialog/role-dialog.component';
import { roleResponse } from '../../../../infraestructure/interfaces';
import { SidenavButtonComponent } from '../../../../presentation/components';

@Component({
  selector: 'app-roles-manage',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatToolbarModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    SidenavButtonComponent,
  ],
  templateUrl: './roles-manage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RolesManageComponent {
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
    const dialogRef = this.dialog.open(RoleDialogComponent, {
      maxWidth: '600px',
      width: '600px',
    });
    dialogRef.afterClosed().subscribe((result?: roleResponse) => {
      if (!result) return;
      this.dataSource.update((values) => [result, ...values]);
    });
  }

  edit(role: roleResponse) {
    const dialogRef = this.dialog.open(RoleDialogComponent, {
      data: role,
      maxWidth: '600px',
      width: '600px',
    });
    dialogRef.afterClosed().subscribe((result: roleResponse) => {
      if (!result) return;
      this.dataSource.update((values) => {
        const index = values.findIndex(({ _id }) => _id === result._id);
        values[index] = result;
        return [...values];
      });
    });
  }
}
