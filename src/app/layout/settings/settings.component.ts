import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SidenavButtonComponent } from '../../presentation/components';
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
} from '../../presentation/services';
import { toSignal } from '@angular/core/rxjs-interop';
import { Account } from '../../domain/models';
import { FormValidators, handleFormErrorMessages } from '../../helpers';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { NotificationComponent } from '../../presentation/components/notification/notification.component';
import { Router } from '@angular/router';
import {
  Colors,
  THEME_OPTIONS,
  ThemeClass,
  ThemeService,
} from '../presentation/services/theme.service';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { ThemeSwitcherComponent } from '../components';
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
    MatButtonToggleModule,
    MatSelectModule,
    MatTabsModule,
    ThemeSwitcherComponent,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SettingsComponent implements OnInit {
  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  private appearanceService = inject(AppearanceService);
  private fb = inject(FormBuilder);
  public account = toSignal<Account>(this.authService.getMyAccount());
  private router = inject(Router);
  #themeService = inject(ThemeService);
  activeTheme = this.#themeService.theme;

  themeOptions = THEME_OPTIONS;

  form = this.fb.group(
    {
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    { validator: FormValidators.MatchingPasswords }
  );

  dialogRef = inject(MatDialog);
  hide = signal(true);

  colors = [
    'violet',
    'red',
    'blue',
    'green',
    'yellow',
    'cyan',
    'orange',
    'magenta',
    'chartreuse',
    'azure',
    'rose',
  ];

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  ngOnInit(): void {
    this.showNotification();
  }

  updatePassword() {
    if (this.form.invalid) return;
    this.authService
      .updateMyAccount(this.form.get('password')?.value!)
      .subscribe((resp) => {
        this.alertService.SuccesToast({ title: resp.message });
        this.hide.set(true);
        this.form.reset({});
        Object.keys(this.form.controls).forEach((key) => {
          this.form.get(key)?.setErrors(null);
          this.form.get(key)?.setErrors(null);
        });
        this.router.navigateByUrl('/home');
      });
  }

  get isDarkTheme() {
    return this.appearanceService.isDarkTheme();
  }

  toggleDarkTheme() {
    this.appearanceService.toggleTheme();
  }

  showNotification() {
    if (this.authService.updatedPassword()) return;
    this.dialogRef.open(NotificationComponent);
  }

  handleFormErrorMessages = (control: AbstractControl) => {
    if (control.hasError('required')) return 'Este campo es requerido';
    if (control.hasError('minlength')) {
      const minLengthRequired = control.getError('minlength').requiredLength;
      return `Ingrese al menos ${minLengthRequired} caracteres`;
    }
    if (control.hasError('pattern'))
      return 'Ingrese al menos: 1 letra mayúscula, 1 letra minúscula, 1 número';

    if (control.hasError('not_match')) {
      return `Las contraseñas no coinciden`;
    }
    return '';
  };

  color = signal<Colors>('azure');
  background = signal<'light' | 'dark'>('light');

  theme = computed(() => `${this.color()}-${this.background()}`);

  changeTheme() {
    this.#themeService.changeTheme(this.theme() as any);
  }
}
