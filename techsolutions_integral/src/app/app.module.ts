import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ErrorInterceptor } from './interceptors/error.interceptor';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ServicioDetalleComponent } from './pages/servicio-detalle/servicio-detalle.component';
import { ServiciosListaComponent } from './pages/servicios-lista/servicios-lista.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { DashboardComponent } from './dashboard/Pages/dashboard-home/dashboard.component';
import { SidebarComponent } from './dashboard/componentes/sidebar/sidebar.component';
import { HeaderComponent } from './componentes/header/header.component';
import { HeaderComponentDashboard } from './dashboard/componentes/dashboard-header/header.componentDashboard';
import { FooterComponent } from './componentes/footer/footer.component';
import { UsuariosComponent } from './dashboard/Pages/usuarios/usuarios.component';
import { ServiciosComponent } from './dashboard/Pages/servicios/servicios.component';
import { CarritoComponent } from './dashboard/Pages/carrito/carrito.component';
import { OrdenesComponent } from './dashboard/Pages/ordenes/ordenes.component';

@NgModule({
  declarations: [
  AppComponent,
  LoginComponent,
  DashboardComponent,
  SidebarComponent,
  UsuariosComponent,
  ServiciosComponent,
  CarritoComponent,
  OrdenesComponent
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    // Componentes standalone usados por componentes
    HeaderComponent,
    HeaderComponentDashboard,
    FooterComponent,
    HomeComponent,
    ServiciosListaComponent,
    ContactoComponent,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'servicio/:id', component: ServicioDetalleComponent },
      { path: 'services', component: ServiciosListaComponent }, // Página de servicios públicos
      { path: 'contact', component: ContactoComponent }, // Página de contacto
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      // Rutas para administradores
      { path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard, AdminGuard] },
      { path: 'servicios', component: ServiciosComponent, canActivate: [AuthGuard, AdminGuard] },
      // Rutas para usuarios
      { path: 'carrito', component: CarritoComponent, canActivate: [AuthGuard] },
      { path: 'ordenes', component: OrdenesComponent, canActivate: [AuthGuard] },
      // Cualquier otra ruta redirige al home para evitar pantalla en blanco
      { path: '**', redirectTo: '', pathMatch: 'full' }
    ])
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }