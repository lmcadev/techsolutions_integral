import { Component } from '@angular/core';

/**
 * Interfaz que define la estructura de un usuario.  Cada usuario
 * tiene un nombre y un correo electrónico.
 */
interface Usuario {
  nombre: string;
  correo: string;
}

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  // Lista de usuarios que se muestran en la tabla.
  usuarios: Usuario[] = [
    { nombre: 'Luis', correo: 'luis@gmail.com' },
    { nombre: 'Mario', correo: 'mario@gmail.com' },
    { nombre: 'Jose', correo: 'jose@gmail.com' }
  ];

  // Objeto utilizado para capturar los datos de un nuevo usuario.
  nuevoUsuario: Usuario = { nombre: '', correo: '' };

  // Indica si se está agregando un nuevo usuario.  Controla la
  // visualización del formulario de alta.
  mostrandoFormulario: boolean = false;

  // Índice del usuario que se está editando.  Si es nulo, no hay
  // edición en curso.
  indiceEdicion: number | null = null;

  /**
   * Muestra el formulario para agregar un nuevo usuario.  Si ya se
   * estaba editando, se cancela la edición actual.
   */
  mostrarFormularioAgregar(): void {
    this.mostrandoFormulario = true;
    this.indiceEdicion = null;
    // Reiniciar los campos del formulario
    this.nuevoUsuario = { nombre: '', correo: '' };
  }

  /**
   * Agrega un nuevo usuario a la lista y oculta el formulario.
   */
  agregarUsuario(): void {
    if (this.nuevoUsuario.nombre.trim() && this.nuevoUsuario.correo.trim()) {
      this.usuarios.push({ ...this.nuevoUsuario });
      this.nuevoUsuario = { nombre: '', correo: '' };
      this.mostrandoFormulario = false;
    }
  }

  /**
   * Inicia la edición de un usuario existente.  Se rellena el
   * formulario con los datos del usuario seleccionado.
   * @param indice Índice del usuario en la lista.
   */
  editarUsuario(indice: number): void {
    this.indiceEdicion = indice;
    this.mostrandoFormulario = true;
    this.nuevoUsuario = { ...this.usuarios[indice] };
  }

  /**
   * Guarda los cambios realizados a un usuario y limpia el estado de
   * edición.
   */
  guardarUsuario(): void {
    if (this.indiceEdicion !== null) {
      this.usuarios[this.indiceEdicion] = { ...this.nuevoUsuario };
      this.indiceEdicion = null;
      this.mostrandoFormulario = false;
      this.nuevoUsuario = { nombre: '', correo: '' };
    }
  }

  /**
   * Cancela la edición o la creación de un usuario y reinicia el
   * formulario.
   */
  cancelar(): void {
    this.indiceEdicion = null;
    this.mostrandoFormulario = false;
    this.nuevoUsuario = { nombre: '', correo: '' };
  }

  /**
   * Elimina un usuario de la lista según su índice.
   * @param indice Índice del usuario a eliminar.
   */
  eliminarUsuario(indice: number): void {
    this.usuarios.splice(indice, 1);
  }
}