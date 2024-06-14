import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SidenavButtonComponent } from '../../../components';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  AlertService,
  AppearanceService,
  AuthService,
} from '../../../services';
import { toSignal } from '@angular/core/rxjs-interop';
import { Account } from '../../../../domain/models';
import { FormValidators, handleFormErrorMessages } from '../../../../helpers';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { NotificationComponent } from '../../../components/notification/notification.component';

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
export class SettingsComponent implements OnInit {
  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  private appearanceService = inject(AppearanceService);
  private fb = inject(FormBuilder);
  public account = toSignal<Account>(this.authService.getMyAccount());
  public passoword = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);

  form = this.fb.group(
    {
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/
          ),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    { validator: FormValidators.MatchingPasswords }
  );

  dialogRef = inject(MatDialog);
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide);
    event.stopPropagation();
  }
  ngOnInit(): void {
    this.showNotification();
  }

  getErrorMessage() {
    return handleFormErrorMessages(this.passoword);
  }

  updatePassword() {
    if (this.form.invalid) return;
    this.authService
      .updateMyAccount(this.form.get('password')?.value!)
      .subscribe((resp) => {
        this.alertService.SuccesToast({ title: resp.message });
        this.hide.set(true);
        this.form.reset({});
        localStorage.setItem('updated', '1');
      });
  }

  get isDarkTheme() {
    return this.appearanceService.isDarkTheme();
  }

  toggleDarkTheme() {
    this.appearanceService.toggleTheme();
  }

  showNotification() {
    const isUpdate = localStorage.getItem('updated');
    if (isUpdate) return;
    this.dialogRef.open(NotificationComponent);
  }

  handleFormErrorMessages = (control: AbstractControl) => {
    if (control.hasError('required')) return 'Este campo es requerido';
    if (control.hasError('minlength')) {
      const minLengthRequired = control.getError('minlength').requiredLength;
      return `Ingrese al menos ${minLengthRequired} caracteres`;
    }
    if (control.hasError('pattern'))
      return 'Ingrese al menos: 1 letra mayúscula, 1 letra minúscula, 1 número, 1 carácter especial.';

    if (control.hasError('not_match')) {
      return `Las contraseñas no coinciden`;
    }
    return '';
  };
}
