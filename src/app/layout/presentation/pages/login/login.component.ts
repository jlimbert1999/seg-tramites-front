import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../presentation/services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent {
  hidePassword = true;
  loginForm: FormGroup = this.fb.group({
    login: ['', Validators.required],
    password: ['', Validators.required],
    remember: [false],
  });
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const loginSaved = localStorage.getItem('login');
    if (!loginSaved) return;
    this.loginForm.patchValue({ login: loginSaved, remember: true });
  }

  login() {
    if (this.loginForm.invalid) return;
    this.authService.login(this.loginForm.value).subscribe((url) => {
      this.router.navigateByUrl(url);
    });
  }
}
