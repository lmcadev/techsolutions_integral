import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// Interface para solicitud de login
export interface LoginRequest {
  correo: string;
  password: string;
}

// Interface para solicitud de registro
export interface RegisterRequest {
  correo: string;
  password: string;
  nombre: string;
}

// Interface para respuesta de autenticación
export interface AuthResponse {
  message: string;
  token: string;
  usuario: {
    id: number;
    correo: string;
    nombre: string;
    rol: string;
  };
}

// Interface para datos de usuario
export interface Usuario {
  id: number;
  correo: string;
  nombre: string;
  rol: string;
}

// Servicio de autenticación y gestión de usuarios
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`; // URL base para auth
  private tokenSubject = new BehaviorSubject<string | null>(this.getStoredToken()); // Estado del token
  private userSubject = new BehaviorSubject<Usuario | null>(this.getStoredUser()); // Estado del usuario

  public token$ = this.tokenSubject.asObservable(); // Observable del token
  public user$ = this.userSubject.asObservable(); // Observable del usuario

  constructor(private http: HttpClient) {}

  // Iniciar sesión con credenciales
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.token && response.usuario) {
            this.setSession(response.token, response.usuario);
          }
        })
      );
  }

  /**
   * Registrar nuevo usuario
   */
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(response => {
          if (response.token && response.usuario) {
            this.setSession(response.token, response.usuario);
          }
        })
      );
  }

  /**
   * Verificar token
   */
  verifyToken(): Observable<{valid: boolean, usuario: Usuario}> {
    const headers = this.getAuthHeaders();
    return this.http.get<{valid: boolean, usuario: Usuario}>(`${this.apiUrl}/verify`, { headers });
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    this.tokenSubject.next(null);
    this.userSubject.next(null);
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    const token = this.getStoredToken();
    if (!token) {
      return false;
    }

    // Verificar si el token ha expirado (básico)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtener token actual
   */
  getToken(): string | null {
    return this.tokenSubject.value;
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): Usuario | null {
    return this.userSubject.value;
  }

  /**
   * Obtener headers de autenticación
   */
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  /**
   * Establecer sesión
   */
  private setSession(token: string, user: Usuario): void {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('current_user', JSON.stringify(user));
    this.tokenSubject.next(token);
    this.userSubject.next(user);
  }

  /**
   * Obtener token almacenado
   */
  private getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  /**
   * Obtener usuario almacenado
   */
  private getStoredUser(): Usuario | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('current_user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }
}