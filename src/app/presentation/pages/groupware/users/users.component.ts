import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { SidenavButtonComponent } from '../../../components';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, MaterialModule, SidenavButtonComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {}
