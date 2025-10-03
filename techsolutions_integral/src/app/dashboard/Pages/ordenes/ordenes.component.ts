import { Component, OnInit } from '@angular/core';
import { AuthService, Usuario } from '../../../services/auth.service';

interface Orden {
  id: number;
  fecha: Date;
  total: number;
  estado: string;
  items: {
    nombre: string;
    cantidad: number;
    precio: number;
  }[];
}

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.css']
})
export class OrdenesComponent implements OnInit {
  currentUser: Usuario | null = null;
  ordenes: Orden[] = [];
  isLoading: boolean = false;
  error: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
    });
    this.cargarOrdenes();
  }

  cargarOrdenes(): void {
   
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'Completada':
        return 'badge bg-success';
      case 'En Progreso':
        return 'badge bg-warning';
      case 'Cancelada':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  verDetalle(orden: Orden): void {
    // Aquí implementarías la navegación al detalle de la orden
    alert(`Ver detalle de la orden ${orden.id}`);
  }
}