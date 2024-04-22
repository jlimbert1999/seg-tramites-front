import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services';

@Component({
  selector: 'profile',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private readonly authService = inject(AuthService);
  onLogout = output<void>();
  onClose = output<void>();

  logout() {
    this.onLogout.emit();
  }
  close() {
    this.onClose.emit();
  }

  get officer() {
    return this.authService.account()?.officer;
  }
}
