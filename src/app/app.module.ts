import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ServicioDetalleComponent } from './servicio-detalle/servicio-detalle.component';

@NgModule({
  declarations: [
  AppComponent,
  LoginComponent,
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HomeComponent,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'login', component: LoginComponent }
      ,{ path: 'servicio', component: ServicioDetalleComponent }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }