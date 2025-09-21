import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-headerDashboard',
  standalone: true,
  templateUrl: './header.componentDashboard.html',
  styleUrls: ['./header.componentDashboard.css'],
  imports: [RouterModule]
})
export class HeaderComponentDashboard {
  // El componente de encabezado contiene el logo de la aplicación y los enlaces de navegación.
}