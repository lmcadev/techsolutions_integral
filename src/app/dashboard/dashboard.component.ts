import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { SidebarComponent } from '../sidebar/sidebar.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  // Este componente representa el panel principal donde se muestran
  // accesos rápidos a las distintas secciones del sistema.  Los cuadros
  // redirigen a páginas de Usuarios, Servicios y Pedidos (este último
  // puede agregarse más adelante).
}