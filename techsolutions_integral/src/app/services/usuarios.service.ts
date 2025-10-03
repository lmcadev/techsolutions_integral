import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface Usuario {
  id?: number;
  nombre: string;
  correo: string;
  rol?: string;
  password?: string;
}

export interface ApiResponse<T> {
  message: string;
  data?: T;
  total?: number;
  error?: string;
  details?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Obtener todos los usuarios
   */
  getUsuarios(): Observable<ApiResponse<Usuario[]>> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<ApiResponse<Usuario[]>>(this.apiUrl, { headers });
  }

  /**
   * Obtener un usuario por ID
   */
  getUsuario(id: number): Observable<ApiResponse<Usuario>> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<ApiResponse<Usuario>>(`${this.apiUrl}/${id}`, { headers });
  }

  /**
   * Crear un nuevo usuario
   */
  createUsuario(usuario: Usuario): Observable<ApiResponse<Usuario>> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<ApiResponse<Usuario>>(this.apiUrl, usuario, { headers });
  }

  /**
   * Actualizar un usuario existente
   */
  updateUsuario(id: number, usuario: Usuario): Observable<ApiResponse<Usuario>> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put<ApiResponse<Usuario>>(`${this.apiUrl}/${id}`, usuario, { headers });
  }

  /**
   * Eliminar un usuario
   */
  deleteUsuario(id: number): Observable<ApiResponse<Usuario>> {
    const headers = this.authService.getAuthHeaders();
    return this.http.delete<ApiResponse<Usuario>>(`${this.apiUrl}/${id}`, { headers });
  }
}