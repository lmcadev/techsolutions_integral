import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ha ocurrido un error desconocido';

        if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Error del lado del servidor
          switch (error.status) {
            case 401:
              // Token expirado o inválido
              this.authService.logout();
              this.router.navigate(['/login']);
              errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
              break;
            case 403:
              errorMessage = 'No tienes permisos para realizar esta acción.';
              break;
            case 404:
              errorMessage = 'Recurso no encontrado.';
              break;
            case 409:
              errorMessage = error.error?.message || 'Conflicto en los datos.';
              break;
            case 422:
              errorMessage = 'Datos inválidos.';
              break;
            case 500:
              errorMessage = 'Error interno del servidor.';
              break;
            default:
              errorMessage = error.error?.message || `Error: ${error.status}`;
          }
        }

        console.error('Error HTTP:', error);
        
        // Mostrar mensaje de error (podrías usar un servicio de notificaciones aquí)
        alert(errorMessage);

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}