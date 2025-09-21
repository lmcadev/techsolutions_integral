import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  // Este componente es la barra de navegación lateral utilizada en las
  // páginas del panel administrativo.  Define los enlaces de navegación
  // para Dashboard, Usuarios y Servicios.  El resaltado activo lo
  // maneja la directiva routerLinkActive.
}