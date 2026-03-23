// src/app/auth/login/login.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  form = { email: '', password: '' };
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    // corta espaços invisíveis que causam 401
    const payload = {
      email: (this.form.email || '').trim(),
      password: (this.form.password || '').trim(),
    };

    this.loading = true;
    this.error = '';

    this.auth.login(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/admin']); // ou /admin/dashboard
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Credenciais inválidas';
      }
    });
  }
}