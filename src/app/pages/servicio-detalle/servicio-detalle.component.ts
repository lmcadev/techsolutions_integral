import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../componentes/header/header.component';
import { FooterComponent } from '../../componentes/footer/footer.component';

@Component({
  selector: 'app-servicio-detalle',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './servicio-detalle.component.html',
  styleUrls: ['./servicio-detalle.component.css']
})
export class ServicioDetalleComponent {
  // Puede ser una clase de ícono de Bootstrap (ej: 'bi bi-cloud') o una URL de imagen
  imagen: string = 'bi bi-cloud text-white';
  nombre = 'Servicio de nube';
  precio = 100000;
  stock = "Disponible";
  descripcion = `Nuestro servicio de nube está diseñado para ofrecer escalabilidad, 
  seguridad y alto rendimiento a empresas que buscan optimizar sus operaciones 
  digitales. A través de infraestructura virtualizada, permitimos el acceso remoto a datos, 
  aplicaciones y recursos desde cualquier lugar, en cualquier momento. Con soluciones personalizadas 
  en almacenamiento, respaldo, cómputo y despliegue de aplicaciones, garantizamos una experiencia 
  ágil y confiable que se adapta al crecimiento de tu negocio. Además, contamos con protocolos 
  avanzados de protección y monitoreo continuo para asegurar la integridad de tu información.`;

  // Determina si la propiedad `imagen` representa un ícono de Bootstrap Icons
  get esIcono(): boolean {
  // Heurística simple: si empieza por 'bi' o contiene 'bi-'
    return this.imagen.startsWith('bi') || this.imagen.includes('bi-');
  }
}
