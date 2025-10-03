
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ServiciosService, Servicio } from '../../services/servicios.service';

// Componente slideshow de servicios para homepage
@Component({
  selector: 'app-services-slideshow',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './servicios-slideshow.component.html',
  styleUrl: './servicios-slideshow.component.css'
})
export class ServicesSlideshowComponent implements OnInit, OnDestroy {
  listaServicios: Servicio[] = []; // Lista de servicios disponibles
  indiceActual = 0; // Índice del servicio actual mostrado
  idIntervalo: any; // ID del interval para rotación automática
  cantidadVisible = 4; // Cantidad de servicios visibles
  isLoading = true; // Estado de carga
  error = ''; // Mensaje de error

  constructor(
    private serviciosService: ServiciosService,
    private router: Router
  ) {}

  // Getter para servicios visibles actualmente
  get serviciosVisibles() {
    if (this.listaServicios.length === 0) return [];
    const resultado = [];
    for (let i = 0; i < this.cantidadVisible; i++) {
      resultado.push(this.listaServicios[(this.indiceActual + i) % this.listaServicios.length]);
    }
    return resultado;
  }

  ngOnInit() {
    this.cargarServicios(); // Cargar servicios al inicializar
  }

  // Cargar servicios desde la API
  cargarServicios() {
    this.serviciosService.getServicios().subscribe({
      next: (response) => {
        if (response.data) {
          this.listaServicios = response.data.filter(s => s.activo && s.stock); // filtro para servicos activos
          this.isLoading = false;
          this.iniciarSlideshow();
        }
      },
      error: (error) => {
        console.error('Error cargando servicios:', error);
        this.error = 'Error al cargar los servicios';
        this.isLoading = false;
      }
    });
  }

  // Iniciar movimiento
  iniciarSlideshow() {
    if (this.listaServicios.length > 0) {
      this.idIntervalo = setInterval(() => {
        this.indiceActual = (this.indiceActual + 1) % this.listaServicios.length;
      }, 3000); // parametro de tiempo movimiento
    }
  }

  // Manejar click en servicio para navegar a detalle
  onServicioClick(servicio: Servicio) {
    this.router.navigate(['/servicio', servicio.id]);
  }

  ngOnDestroy() {
    if (this.idIntervalo) {
      clearInterval(this.idIntervalo); // Limpiar intervalo
    }
  }
}
