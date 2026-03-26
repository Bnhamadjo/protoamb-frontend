import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  form = { email: '', password: '' };
  loading = false;
  error = '';
  showPassword = false;

  constructor(private auth: AuthService, private router: Router) {}

  submit(): void {
    const payload = {
      email: (this.form.email || '').trim(),
      password: (this.form.password || '').trim(),
    };

    this.loading = true;
    this.error = '';

    this.auth.login(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Credenciais invalidas';
      }
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
