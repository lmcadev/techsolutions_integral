import { Component, OnInit } from '@angular/core';
import { ServiciosService, Servicio } from '../../../services/servicios.service';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServiciosComponent implements OnInit {
  // Lista de servicios disponibles.
  servicios: Servicio[] = [];

  // Datos para un nuevo servicio o para editar uno existente.
  nuevoServicio: Servicio = { 
    nombre: '', 
    descripcion: '', 
    precio: 0, 
    stock: true, 
    icono: 'bi-gear', 
    activo: true 
  };

  // Bandera que indica si se está mostrando el formulario de alta o
  // edición.
  mostrandoFormulario: boolean = false;

  // Lista de iconos disponibles
  iconosDisponibles: string[] = [
    'bi-gear', 'bi-cloud', 'bi-shield', 'bi-laptop', 'bi-server',
    'bi-database', 'bi-wifi', 'bi-headset', 'bi-tools', 'bi-graph-up',
    'bi-lock', 'bi-cpu', 'bi-hdd', 'bi-router', 'bi-phone',
    'bi-tablet', 'bi-camera', 'bi-printer', 'bi-bug', 'bi-code-slash'
  ];

  // Índice del servicio en edición; si es nulo, se está creando uno
  // nuevo.
  indiceEdicion: number | null = null;

  // Estados de carga y error
  isLoading: boolean = false;
  error: string = '';

  constructor(private serviciosService: ServiciosService) {}

  ngOnInit(): void {
    this.cargarServicios();
  }

  /**
   * Cargar servicios desde la API (versión admin)
   */
  cargarServicios(): void {
    this.isLoading = true;
    this.error = '';

    this.serviciosService.getServiciosAdmin().subscribe({
      next: (response) => {
        if (response.data) {
          this.servicios = response.data;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando servicios:', error);
        this.error = 'Error al cargar los servicios';
        this.isLoading = false;
      }
    });
  }

  /**
   * Muestra el formulario para agregar un nuevo servicio.
   */
  mostrarFormularioAgregar(): void {
    this.mostrandoFormulario = true;
    this.indiceEdicion = null;
    this.nuevoServicio = { 
      nombre: '', 
      descripcion: '', 
      precio: 0, 
      stock: true, 
      icono: 'bi-gear', 
      activo: true 
    };
  }

  /**
   * Agrega un nuevo servicio a la lista.
   */
  agregarServicio(): void {
    if (this.nuevoServicio.nombre.trim() && 
        this.nuevoServicio.descripcion.trim() && 
        this.nuevoServicio.precio !== undefined && 
        this.nuevoServicio.precio >= 0) {
      this.isLoading = true;
      
      this.serviciosService.createServicio(this.nuevoServicio).subscribe({
        next: (response) => {
          if (response.data) {
            this.servicios.push(response.data);
            this.nuevoServicio = { 
              nombre: '', 
              descripcion: '', 
              precio: 0, 
              stock: true, 
              icono: 'bi-gear', 
              activo: true 
            };
            this.mostrandoFormulario = false;
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error creando servicio:', error);
          this.error = 'Error al crear el servicio';
          this.isLoading = false;
        }
      });
    }
  }

  /**
   * Inicia la edición de un servicio existente.
   * @param indice Índice del servicio que se va a editar.
   */
  editarServicio(indice: number): void {
    this.indiceEdicion = indice;
    this.mostrandoFormulario = true;
    this.nuevoServicio = { ...this.servicios[indice] };
  }

  /**
   * Guarda los cambios en el servicio editado.
   */
  guardarServicio(): void {
    if (this.indiceEdicion !== null && 
        this.nuevoServicio.nombre.trim() && 
        this.nuevoServicio.descripcion.trim() && 
        this.nuevoServicio.precio !== undefined && 
        this.nuevoServicio.precio >= 0) {
      
      this.isLoading = true;
      const servicio = this.servicios[this.indiceEdicion];
      
      if (servicio.id) {
        this.serviciosService.updateServicio(servicio.id, this.nuevoServicio).subscribe({
          next: (response) => {
            if (response.data && this.indiceEdicion !== null) {
              this.servicios[this.indiceEdicion] = response.data;
              this.indiceEdicion = null;
              this.mostrandoFormulario = false;
              this.nuevoServicio = { 
                nombre: '', 
                descripcion: '', 
                precio: 0, 
                stock: true, 
                icono: 'bi-gear', 
                activo: true 
              };
            }
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error actualizando servicio:', error);
            this.error = 'Error al actualizar el servicio';
            this.isLoading = false;
          }
        });
      }
    }
  }

  /**
   * Cancela la operación de agregado o edición.
   */
  cancelar(): void {
    this.indiceEdicion = null;
    this.mostrandoFormulario = false;
    this.nuevoServicio = { 
      nombre: '', 
      descripcion: '', 
      precio: 0, 
      stock: true, 
      icono: 'bi-gear', 
      activo: true 
    };
  }

  /**
   * Elimina un servicio de la lista.
   * @param indice Índice del servicio a eliminar.
   */
  eliminarServicio(indice: number): void {
    const servicio = this.servicios[indice];
    if (servicio.id && confirm('¿Deseas eliminar este servicio?')) {
      this.isLoading = true;
      
      this.serviciosService.deleteServicio(servicio.id).subscribe({
        next: (response) => {
          this.servicios.splice(indice, 1);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error eliminando servicio:', error);
          this.error = 'Error al eliminar el servicio';
          this.isLoading = false;
        }
      });
    }
  }
}