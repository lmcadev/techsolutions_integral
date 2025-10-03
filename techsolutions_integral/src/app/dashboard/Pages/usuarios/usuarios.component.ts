import { Component, OnInit } from '@angular/core';
import { UsuariosService, Usuario } from '../../../services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  // Lista de usuarios que se muestran en la tabla.
  usuarios: Usuario[] = [];

  // Objeto utilizado para capturar los datos de un nuevo usuario.
  nuevoUsuario: Usuario = { nombre: '', correo: '', rol: 'user', password: '' };

  // Roles disponibles
  rolesDisponibles = [
    { value: 'admin', label: 'Administrador' },
    { value: 'user', label: 'Usuario' }
  ];

  // Indica si se está agregando un nuevo usuario.  Controla la
  // visualización del formulario de alta.
  mostrandoFormulario: boolean = false;

  // Índice del usuario que se está editando.  Si es nulo, no hay
  // edición en curso.
  indiceEdicion: number | null = null;

  // Estados de carga y error
  isLoading: boolean = false;
  error: string = '';

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  /**
   * Cargar usuarios desde la API
   */
  cargarUsuarios(): void {
    this.isLoading = true;
    this.error = '';

    this.usuariosService.getUsuarios().subscribe({
      next: (response) => {
        if (response.data) {
          this.usuarios = response.data;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando usuarios:', error);
        this.error = 'Error al cargar los usuarios';
        this.isLoading = false;
      }
    });
  }

  /**
   * Muestra el formulario para agregar un nuevo usuario.  Si ya se
   * estaba editando, se cancela la edición actual.
   */
  mostrarFormularioAgregar(): void {
    this.mostrandoFormulario = true;
    this.indiceEdicion = null;
    // Reiniciar los campos del formulario
    this.nuevoUsuario = { nombre: '', correo: '', rol: 'user', password: '' };
  }

  /**
   * Agrega un nuevo usuario a la lista y oculta el formulario.
   */
  agregarUsuario(): void {
    if (this.nuevoUsuario.nombre.trim() && this.nuevoUsuario.correo.trim() && this.nuevoUsuario.password?.trim()) {
      this.isLoading = true;
      
      this.usuariosService.createUsuario(this.nuevoUsuario).subscribe({
        next: (response) => {
          if (response.data) {
            this.usuarios.push(response.data);
            this.nuevoUsuario = { nombre: '', correo: '', rol: 'user', password: '' };
            this.mostrandoFormulario = false;
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error creando usuario:', error);
          this.error = 'Error al crear el usuario';
          this.isLoading = false;
        }
      });
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
      const usuario = this.usuarios[this.indiceEdicion];
      if (usuario.id) {
        this.isLoading = true;
        
        this.usuariosService.updateUsuario(usuario.id, this.nuevoUsuario).subscribe({
          next: (response) => {
            if (response.data) {
              this.usuarios[this.indiceEdicion!] = response.data;
              this.indiceEdicion = null;
              this.mostrandoFormulario = false;
              this.nuevoUsuario = { nombre: '', correo: '', rol: 'user', password: '' };
            }
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error actualizando usuario:', error);
            this.error = 'Error al actualizar el usuario';
            this.isLoading = false;
          }
        });
      }
    }
  }

  /**
   * Cancela la edición o la creación de un usuario y reinicia el
   * formulario.
   */
  cancelar(): void {
    this.indiceEdicion = null;
    this.mostrandoFormulario = false;
    this.nuevoUsuario = { nombre: '', correo: '', rol: 'user', password: '' };
  }

  /**
   * Elimina un usuario de la lista según su índice.
   * @param indice Índice del usuario a eliminar.
   */
  eliminarUsuario(indice: number): void {
    const usuario = this.usuarios[indice];
    if (usuario.id && confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.isLoading = true;
      
      this.usuariosService.deleteUsuario(usuario.id).subscribe({
        next: (response) => {
          this.usuarios.splice(indice, 1);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error eliminando usuario:', error);
          this.error = 'Error al eliminar el usuario';
          this.isLoading = false;
        }
      });
    }
  }
}