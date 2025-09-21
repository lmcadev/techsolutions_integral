import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onSubmit(): void {
    // Aquí podrías validar credenciales; por ahora, navega al dashboard si el formulario es válido
    this.router.navigate(['/dashboard']);
  }
}