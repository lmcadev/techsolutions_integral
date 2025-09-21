import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ServicioDetalleComponent } from './pages/servicio-detalle/servicio-detalle.component';
import { DashboardComponent } from './dashboard/Pages/dashboard-home/dashboard.component';
import { SidebarComponent } from './dashboard/componentes/sidebar/sidebar.component';
import { HeaderComponent } from './componentes/header/header.component';
import { HeaderComponentDashboard } from './dashboard/componentes/dashboard-header/header.componentDashboard';
import { FooterComponent } from './componentes/footer/footer.component';
import { UsuariosComponent } from './dashboard/Pages/usuarios/usuarios.component';
import { ServiciosComponent } from './dashboard/Pages/servicios/servicios.component';

@NgModule({
  declarations: [
  AppComponent,
  LoginComponent,
  DashboardComponent,
  SidebarComponent,
  UsuariosComponent,
  ServiciosComponent,
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    // Componentes standalone usados por componentes declarados en este módulo
    HeaderComponent,
    HeaderComponentDashboard,
    FooterComponent,
    HomeComponent,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'servicio', component: ServicioDetalleComponent },
      { path: 'dashboard', component: DashboardComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'servicios', component: ServiciosComponent },
      // Rutas de navegación del header (placeholders por ahora)
      { path: 'services', component: HomeComponent },
      { path: 'contact', component: HomeComponent },
      { path: 'carrito', component: HomeComponent },
      // Cualquier otra ruta redirige al home para evitar pantalla en blanco
      { path: '**', redirectTo: '', pathMatch: 'full' }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }