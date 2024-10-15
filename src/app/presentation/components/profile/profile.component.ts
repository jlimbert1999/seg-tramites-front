import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
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
  public user = computed(() => 'd');
  public isOpen = model.required<boolean>();
  onLogout = output<void>();

  close() {
    this.isOpen.set(false);
  }
}
