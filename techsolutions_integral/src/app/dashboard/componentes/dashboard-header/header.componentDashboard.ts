import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, Usuario } from '../../../services/auth.service';

// Componente de encabezado del dashboard
@Component({
  selector: 'app-headerDashboard',
  standalone: true,
  templateUrl: './header.componentDashboard.html',
  styleUrls: ['./header.componentDashboard.css'],
  imports: [RouterModule, CommonModule]
})
export class HeaderComponentDashboard implements OnInit {
  currentUser: Usuario | null = null; // Usuario autenticado actual

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener datos del usuario autenticado
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
    });
  }

  // Cerrar sesión con confirmación
  logout(): void {
    if (confirm('¿Deseas cerrar sesión?')) {
      this.authService.logout();
      this.router.navigate(['/home']);
    }
  }
}