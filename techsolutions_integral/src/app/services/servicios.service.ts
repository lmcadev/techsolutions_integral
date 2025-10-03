import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

// Interface para datos de servicio
export interface Servicio {
  id?: number;
  nombre: string;
  descripcion: string;
  precio?: number;
  stock?: boolean;
  icono?: string;
  activo?: boolean;
}

// Interface para respuestas de la API
export interface ApiResponse<T> {
  message: string;
  data?: T;
  total?: number;
  error?: string;
  details?: any[];
}

// Servicio para gestionar servicios de la empresa
@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  private apiUrl = `${environment.apiUrl}/servicios`; // URL base para servicios

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Obtener servicios públicos para slideshow
  getServicios(): Observable<ApiResponse<Servicio[]>> {
    return this.http.get<ApiResponse<Servicio[]>>(this.apiUrl);
  }

  // Obtener todos los servicios (solo admin)
  getServiciosAdmin(): Observable<ApiResponse<Servicio[]>> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<ApiResponse<Servicio[]>>(`${this.apiUrl}/admin/all`, { headers });
  }

  // Obtener servicio individual por ID
  getServicio(id: number): Observable<ApiResponse<Servicio>> {
    return this.http.get<ApiResponse<Servicio>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crear un nuevo servicio
   */
  createServicio(servicio: Servicio): Observable<ApiResponse<Servicio>> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<ApiResponse<Servicio>>(this.apiUrl, servicio, { headers });
  }

  /**
   * Actualizar un servicio existente
   */
  updateServicio(id: number, servicio: Servicio): Observable<ApiResponse<Servicio>> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put<ApiResponse<Servicio>>(`${this.apiUrl}/${id}`, servicio, { headers });
  }

  /**
   * Eliminar un servicio
   */
  deleteServicio(id: number): Observable<ApiResponse<Servicio>> {
    const headers = this.authService.getAuthHeaders();
    return this.http.delete<ApiResponse<Servicio>>(`${this.apiUrl}/${id}`, { headers });
  }
}