import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../componentes/header/header.component';
import { FooterComponent } from '../../componentes/footer/footer.component';
import { ServiciosService, Servicio } from '../../services/servicios.service';
import { CarritoService } from '../../services/carrito.service';

// Página de detalle de servicio individual
@Component({
  selector: 'app-servicio-detalle',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './servicio-detalle.component.html',
  styleUrls: ['./servicio-detalle.component.css']
})
export class ServicioDetalleComponent implements OnInit {
  servicio: Servicio | null = null; // Datos del servicio actual
  isLoading = true; // Estado de carga
  error = ''; // Mensaje de error
  servicioId: number | null = null; // ID del servicio desde la URL

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviciosService: ServiciosService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    // Suscribirse a cambios en parámetros de la ruta
    this.route.params.subscribe(params => {
      this.servicioId = +params['id']; // Obtener ID del servicio
      if (this.servicioId) {
        this.cargarServicio();
      } else {
        this.error = 'ID de servicio no válido';
        this.isLoading = false;
      }
    });
  }

  // Cargar datos del servicio desde la API
  cargarServicio(): void {
    if (!this.servicioId) return;

    this.serviciosService.getServicio(this.servicioId).subscribe({
      next: (response) => {
        if (response.data) {
          this.servicio = response.data;
        } else {
          this.error = 'Servicio no encontrado';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando servicio:', error);
        this.error = 'Error al cargar la información del servicio';
        this.isLoading = false;
      }
    });
  }

  // Verificar si es ícono de Bootstrap
  get esIcono(): boolean {
    return this.servicio?.icono?.startsWith('bi-') || false;
  }

  // Agregar servicio al carrito
  agregarAlCarrito(): void {
    if (this.servicio && this.servicio.stock) {
      try {
        this.carritoService.agregarAlCarrito(this.servicio, 1);
        
        const mensaje = `${this.servicio.nombre} agregado al carrito exitosamente`;
        this.mostrarNotificacion(mensaje, 'success'); // Mostrar confirmación
        
      } catch (error) {
        console.error('Error agregando al carrito:', error);
        this.mostrarNotificacion('Error al agregar el servicio al carrito', 'error');
      }
    }
  }

  // Mostrar notificación toast
  private mostrarNotificacion(mensaje: string, tipo: 'success' | 'error'): void {
    const notificacion = document.createElement('div');
    notificacion.className = `alert alert-${tipo === 'success' ? 'success' : 'danger'} alert-dismissible fade show position-fixed`;
    notificacion.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
    notificacion.innerHTML = `
      <i class="bi bi-${tipo === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notificacion);
    
    // Auto-remover después de 3 segundos
    setTimeout(() => {
      if (notificacion.parentNode) {
        notificacion.parentNode.removeChild(notificacion);
      }
    }, 3000);
  }

  // Volver a la página principal
  volver(): void {
    this.router.navigate(['/']);
  }
}
