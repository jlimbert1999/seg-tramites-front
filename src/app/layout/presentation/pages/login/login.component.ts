import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../../presentation/services';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent {
  hidePassword = true;
  loginForm = this.fb.group({
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
    if (loginSaved) {
      this.loginForm.controls['remember'].setValue(true);
      this.loginForm.controls['login'].setValue(loginSaved);
    }
  }
  login() {
    if (this.loginForm.invalid) return;
    this.authService
      .login(
        {
          login: this.loginForm.get('login')?.value!,
          password: this.loginForm.get('password')?.value!,
        },
        this.loginForm.get('remember')?.value!
      )
      .subscribe((url) => {
        this.router.navigateByUrl(url);
      });
  }
}
