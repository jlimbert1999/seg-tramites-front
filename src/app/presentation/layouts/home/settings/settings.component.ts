import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SidenavButtonComponent } from '../../../components';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AlertService, AppearanceService, AuthService } from '../../../services';
import { toSignal } from '@angular/core/rxjs-interop';
import { Account } from '../../../../domain/models';
import { handleFormErrorMessages } from '../../../../helpers';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    SidenavButtonComponent,
    MatExpansionModule,
    ReactiveFormsModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  private appearanceService = inject(AppearanceService);
  public account = toSignal<Account>(this.authService.getMyAccount());
  public passoword = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    Validators.pattern(/^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\/\\-]+$/),
  ]);
  public hidePassword = true;

  getErrorMessage() {
    return handleFormErrorMessages(this.passoword);
  }

  updatePassword() {
    if (this.passoword.invalid) return;
    this.authService
      .updateMyAccount(this.passoword.value!)
      .subscribe((resp) => {
        this.alertService.SuccesToast({ title: resp.message });
        this.passoword.reset();
        this.hidePassword = true;
      });
  }

  get isDarkTheme() {
    return this.appearanceService.isDarkTheme();
  }

  toggleDarkTheme() {
    this.appearanceService.toggleTheme();
  }
}
