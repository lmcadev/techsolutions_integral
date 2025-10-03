import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login({
      correo: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error en login:', error);
        this.errorMessage = 'Credenciales inválidas. Por favor, verifica tu email y contraseña.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  /**
   * Limpiar mensaje de error cuando el usuario empiece a escribir
   */
  clearError(): void {
    this.errorMessage = '';
  }
}