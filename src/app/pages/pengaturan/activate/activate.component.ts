import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivateService } from './activate.service';

@Component({
  selector: 'app-activate',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss']
})
export class ActivateComponent implements OnInit {

  form!: FormGroup;
  token: string = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private activateService: ActivateService
  ) {}

  ngOnInit(): void {

    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    this.form = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20)
      ]],
      confirmPassword: ['', Validators.required]
    });
  }

  submit() {

    if (this.form.invalid) return;

    if (this.form.value.password !== this.form.value.confirmPassword) {
      this.errorMessage = "Password tidak sama";
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const payload = {
      token: this.token,
      password: this.form.value.password
    };

    this.activateService.activate(payload).subscribe({
      next: () => {
        this.successMessage = "Akun berhasil diaktivasi";
        this.loading = false;

        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: err => {
        this.errorMessage = err.error?.message || "Terjadi kesalahan";
        this.loading = false;
      }
    });
  }
}
