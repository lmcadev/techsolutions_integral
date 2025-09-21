import { Component } from '@angular/core';

/**
 * Interfaz que define un servicio del sistema.  Cada servicio tiene un
 * nombre y una descripción corta.
 */
interface Servicio {
  nombre: string;
  descripcion: string;
}

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServiciosComponent {
  // Lista de servicios disponibles.
  servicios: Servicio[] = [
    { nombre: 'Servicio 1', descripcion: 'Descripción del servicio 1' },
    { nombre: 'Servicio 2', descripcion: 'Descripción del servicio 2' },
    { nombre: 'Servicio 3', descripcion: 'Descripción del servicio 3' }
  ];

  // Datos para un nuevo servicio o para editar uno existente.
  nuevoServicio: Servicio = { nombre: '', descripcion: '' };

  // Bandera que indica si se está mostrando el formulario de alta o
  // edición.
  mostrandoFormulario: boolean = false;

  // Índice del servicio en edición; si es nulo, se está creando uno
  // nuevo.
  indiceEdicion: number | null = null;

  /**
   * Muestra el formulario para agregar un nuevo servicio.
   */
  mostrarFormularioAgregar(): void {
    this.mostrandoFormulario = true;
    this.indiceEdicion = null;
    this.nuevoServicio = { nombre: '', descripcion: '' };
  }

  /**
   * Agrega un nuevo servicio a la lista.
   */
  agregarServicio(): void {
    if (this.nuevoServicio.nombre.trim() && this.nuevoServicio.descripcion.trim()) {
      this.servicios.push({ ...this.nuevoServicio });
      this.nuevoServicio = { nombre: '', descripcion: '' };
      this.mostrandoFormulario = false;
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
    if (this.indiceEdicion !== null) {
      this.servicios[this.indiceEdicion] = { ...this.nuevoServicio };
      this.indiceEdicion = null;
      this.mostrandoFormulario = false;
      this.nuevoServicio = { nombre: '', descripcion: '' };
    }
  }

  /**
   * Cancela la operación de agregado o edición.
   */
  cancelar(): void {
    this.indiceEdicion = null;
    this.mostrandoFormulario = false;
    this.nuevoServicio = { nombre: '', descripcion: '' };
  }

  /**
   * Elimina un servicio de la lista.
   * @param indice Índice del servicio a eliminar.
   */
  eliminarServicio(indice: number): void {
    this.servicios.splice(indice, 1);
  }
}