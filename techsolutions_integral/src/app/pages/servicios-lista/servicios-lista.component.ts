import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../componentes/header/header.component';
import { FooterComponent } from '../../componentes/footer/footer.component';
import { ServiciosService, Servicio } from '../../services/servicios.service';
import { CarritoService } from '../../services/carrito.service';

// Página de listado de todos los servicios
@Component({
  selector: 'app-servicios-lista',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './servicios-lista.component.html',
  styleUrls: ['./servicios-lista.component.css']
})
export class ServiciosListaComponent implements OnInit {
  servicios: Servicio[] = []; // Lista completa de servicios
  serviciosFiltrados: Servicio[] = []; // Servicios después del filtrado
  isLoading = true; // Estado de carga
  error = ''; // Mensaje de error
  filtroTexto = ''; // Texto para filtrar servicios
  ordenarPor = 'nombre'; // Campo para ordenar
  mostrarSoloDisponibles = false; // Filtro de disponibilidad

  constructor(
    private serviciosService: ServiciosService,
    private carritoService: CarritoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarServicios();
  }

  // Cargar todos los servicios desde la API
  cargarServicios(): void {
    this.isLoading = true;
    this.serviciosService.getServicios().subscribe({
      next: (response) => {
        if (response.data) {
          this.servicios = response.data.filter(s => s.activo); // Solo servicios activos
          this.aplicarFiltros();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando servicios:', error);
        this.error = 'Error al cargar los servicios. Por favor, intenta de nuevo.';
        this.isLoading = false;
      }
    });
  }

  // Aplicar filtros y ordenamiento
  aplicarFiltros(): void {
    let serviciosFiltrados = [...this.servicios];

    // Filtro por texto
    if (this.filtroTexto.trim()) {
      const texto = this.filtroTexto.toLowerCase();
      serviciosFiltrados = serviciosFiltrados.filter(s => 
        s.nombre.toLowerCase().includes(texto) ||
        s.descripcion.toLowerCase().includes(texto)
      );
    }

    // Filtro por disponibilidad
    if (this.mostrarSoloDisponibles) {
      serviciosFiltrados = serviciosFiltrados.filter(s => s.stock);
    }

    // Ordenamiento
    serviciosFiltrados.sort((a, b) => {
      switch (this.ordenarPor) {
        case 'nombre':
          return a.nombre.localeCompare(b.nombre);
        case 'precio':
          return (a.precio || 0) - (b.precio || 0);
        case 'precio-desc':
          return (b.precio || 0) - (a.precio || 0);
        default:
          return 0;
      }
    });

    this.serviciosFiltrados = serviciosFiltrados;
  }

  // Cambiar filtro de texto
  onFiltroTextoChange(event: any): void {
    this.filtroTexto = event.target.value;
    this.aplicarFiltros();
  }

  // Cambiar ordenamiento
  onOrdenamientoChange(event: any): void {
    this.ordenarPor = event.target.value;
    this.aplicarFiltros();
  }

  // Cambiar filtro de disponibilidad
  onDisponibilidadChange(event: any): void {
    this.mostrarSoloDisponibles = event.target.checked;
    this.aplicarFiltros();
  }

  // Navegar al detalle del servicio
  verDetalle(servicio: Servicio): void {
    if (servicio.id) {
      this.router.navigate(['/servicio', servicio.id]);
    }
  }

  // Agregar servicio al carrito
  agregarAlCarrito(servicio: Servicio, event: Event): void {
    event.stopPropagation(); // Evitar navegación al detalle
    
    if (servicio && servicio.stock) {
      try {
        this.carritoService.agregarAlCarrito(servicio, 1);
        this.mostrarNotificacion(`${servicio.nombre} agregado al carrito`, 'success');
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

  // Verificar si el servicio está en el carrito
  estaEnCarrito(servicio: Servicio): boolean {
    return servicio.id ? this.carritoService.estaEnCarrito(servicio.id) : false;
  }

  // Obtener cantidad en el carrito
  getCantidadEnCarrito(servicio: Servicio): number {
    return servicio.id ? this.carritoService.getCantidadEnCarrito(servicio.id) : 0;
  }
}