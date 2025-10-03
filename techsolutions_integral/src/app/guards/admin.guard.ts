import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.user$.pipe(
      take(1),
      map(user => {
        if (user && user.rol === 'admin') {
          return true;
        } else {
          // Redirigir a una página de "acceso denegado" o al dashboard
          this.router.navigate(['/dashboard']);
          return false;
        }
      })
    );
  }
}