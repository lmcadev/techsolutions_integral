import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ServicioDetalleComponent } from './servicio-detalle/servicio-detalle.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ServiciosComponent } from './servicios/servicios.component';

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