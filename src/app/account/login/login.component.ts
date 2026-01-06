import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReCaptchaV3Service } from 'ng-recaptcha';

// import { AuthService } from '../../core/services/auth.service';
import { ToastService } from './toast-service';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType = false;
  isLoading = false;

  year = new Date().getFullYear();

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private recaptchaV3Service: ReCaptchaV3Service,
    private loginService: LoginService,
    public toastService: ToastService
  ) {
    // if (this.loginService.currentUserValue) {
    //   this.router.navigate(['/']);
    // }
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.isLoading = true;

    if (this.loginForm.invalid) return;

    this.recaptchaV3Service.execute('login').subscribe({
      next: (captchaToken) => {
        this.loginService.login({
          username: this.f['username'].value,
          password: this.f['password'].value,
          recaptchaToken: captchaToken
        }).subscribe({
          next: () => {
            this.isLoading = false;
            this.toastService.show(
              'Login berhasil',
              { classname: 'bg-success text-white', delay: 500 }
            );
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 1000);
          },
          error: (err) => {
            this.toastService.show(
              err?.error?.metadata?.message || 'Login gagal',
              { classname: 'bg-danger text-white', delay: 5000 }
            );
            this.isLoading = false;
          }
        });
      },
      error: () => {
        this.toastService.show(
          'Gagal memverifikasi captcha',
          { classname: 'bg-danger text-white', delay: 5000 }
        );
      }
    });
  }

  toggleFieldTextType(): void {
    this.fieldTextType = !this.fieldTextType;
  }
}
