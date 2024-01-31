import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { RoleService } from '../services/role.service';
import { roleResponse, systemResource } from '../interfaces';
import { FilterSystemResourcesPipe } from '../pipes/filter-system-resources.pipe';

@Component({
  selector: 'app-role',
  standalone: true,
  templateUrl: './role.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    MatCheckboxModule,
    MatDialogModule,
    MatButtonModule,
    FilterSystemResourcesPipe,
  ],
})
export class RoleComponent {
  private role: roleResponse = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef);
  private roleService = inject(RoleService);

  public name = new FormControl('', Validators.required);
  public filterValue: string = '';
  public systemResources = signal<systemResource[]>([]);
  public isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.roleService.getResources().subscribe((resources) => {
      this.systemResources.set(resources);
      this.loadPermissions();
      this.isLoading.set(false);
    });
  }

  save(): void {
    const hasPermissions = this.systemResources().some((resource) =>
      resource.actions.some((action) => action.isSelected)
    );
    if (this.name.invalid || !hasPermissions) return;
    const subscription = this.role
      ? this.roleService.edit(
          this.role._id,
          this.name.value!,
          this.systemResources()
        )
      : this.roleService.add(this.name.value!, this.systemResources());
    subscription.subscribe((resp) => {
      this.dialogRef.close(resp);
    });
  }

  setAllPermissions(validResource: string, isSelected: boolean) {
    this.systemResources.update((values) => {
      const index = values.findIndex(
        (resource) => resource.value === validResource
      );
      values[index].isSelected = isSelected;
      values[index].actions.forEach(
        (action) => (action.isSelected = isSelected)
      );
      return values;
    });
  }

  updateAllComplete(validResource: string) {
    this.systemResources.update((values) => {
      const index = values.findIndex(
        (resource) => resource.value === validResource
      );
      values[index].isSelected = values[index].actions.every(
        (action) => action.isSelected
      );
      return values;
    });
  }

  someComplete(validResource: string): boolean {
    const index = this.systemResources().findIndex(
      (resource) => resource.value === validResource
    );
    const resorce = this.systemResources()[index];
    return (
      resorce.actions.filter((action) => action.isSelected).length > 0 &&
      !resorce.isSelected
    );
  }

  loadPermissions() {
    if (!this.role) return;
    const { name, permissions } = this.role;
    this.name.setValue(name);
    this.systemResources.update((values) => {
      permissions.forEach((permission) => {
        const index = values.findIndex(
          (resource) => resource.value === permission.resource
        );
        if (index >= 0) {
          values[index].actions.forEach(
            (action) =>
              (action.isSelected = permission.actions.includes(action.value))
          );
          values[index].isSelected = values[index].actions.every(
            (action) => action.isSelected
          );
        }
      });
      return values;
    });
  }
}
