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

import { RoleService } from '../../../services/role.service';
import {
  roleResponse,
  systemResource,
} from '../../../../../infraestructure/interfaces';
import { MaterialModule } from '../../../../../material.module';

@Component({
  selector: 'app-role-dialog',
  standalone: true,
  templateUrl: './role-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MaterialModule,
  ],
})
export class RoleDialogComponent {
  private dialogRef = inject(MatDialogRef);
  private roleService = inject(RoleService);

  public role = inject<roleResponse | undefined>(MAT_DIALOG_DATA);
  public name = new FormControl('', Validators.required);
  public resources = signal<systemResource[]>([]);

  ngOnInit(): void {
    this.roleService.getResources().subscribe((resources) => {
      this.loadResources(resources);
    });
  }

  save(): void {
    const hasPermissions = this.resources().some((resource) =>
      resource.actions.some((action) => action.isSelected)
    );
    if (this.name.invalid || !hasPermissions) return;
    const subscription = this.role
      ? this.roleService.edit(this.role._id, this.name.value!, this.resources())
      : this.roleService.add(this.name.value!, this.resources());
    subscription.subscribe((resp) => {
      this.dialogRef.close(resp);
    });
  }

  setAllPermissions(resource: string, isSelected: boolean) {
    this.resources.update((values) => {
      const index = values.findIndex(({ value }) => value === resource);
      values[index].isSelected = isSelected;
      values[index].actions.forEach(
        (action) => (action.isSelected = isSelected)
      );
      return values;
    });
  }

  updateAllComplete(resource: string) {
    this.resources.update((values) => {
      const index = values.findIndex(({ value }) => value === resource);
      values[index].isSelected = values[index].actions.every(
        (action) => action.isSelected
      );
      return values;
    });
  }

  someComplete(validResource: string): boolean {
    const index = this.resources().findIndex(
      (resource) => resource.value === validResource
    );
    const resorce = this.resources()[index];
    return (
      resorce.actions.filter((action) => action.isSelected).length > 0 &&
      !resorce.isSelected
    );
  }

  loadResources(resources: systemResource[]) {
    if (!this.role) return this.resources.set(resources);
    const { permissions, name } = this.role;
    this.name.setValue(name);
    const checkedResources = resources.map((resource) => {
      const hasPermission = permissions.find(
        (perm) => perm.resource === resource.value
      );
      if (hasPermission) {
        const checkedActions = resource.actions.map((action) => ({
          ...action,
          isSelected: hasPermission.actions.includes(action.value),
        }));
        resource.actions = checkedActions;
        resource.isSelected = checkedActions.every(
          ({ isSelected }) => isSelected
        );
      }
      return resource;
    });
    this.resources.set(checkedResources);
  }
}
