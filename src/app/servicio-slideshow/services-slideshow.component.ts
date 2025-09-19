
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-services-slideshow',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './services-slideshow.component.html',
  styleUrl: './services-slideshow.component.css'
})
export class ServicesSlideshowComponent implements OnInit, OnDestroy {
  // Ruta objetivo para el botón, configurable desde una sola variable
  rutaServicio: string = '/servicio';

  listaServicios = [
    { icono: 'bi-cloud', nombre: 'Servicio de nube' },
    { icono: 'bi-gear', nombre: 'Servicio de seguridad' },
    { icono: 'bi-phone', nombre: 'Servicio aplicativos' },
    { icono: 'bi-display', nombre: 'Servicio de diseño web' },
    { icono: 'bi-hdd-network', nombre: 'Hosting dedicado' },
    { icono: 'bi-envelope', nombre: 'Correo corporativo' },
    { icono: 'bi-server', nombre: 'Servidores VPS' },
    { icono: 'bi-globe', nombre: 'Dominio web' },
    { icono: 'bi-database', nombre: 'Bases de datos' },
    { icono: 'bi-lock', nombre: 'Certificados SSL' },
    { icono: 'bi-bar-chart', nombre: 'Analítica web' },
    { icono: 'bi-people', nombre: 'Soporte técnico' },
    { icono: 'bi-laptop', nombre: 'Desarrollo a medida' },
    { icono: 'bi-credit-card', nombre: 'Pasarelas de pago' },
    { icono: 'bi-wifi', nombre: 'Redes y conectividad' },
    { icono: 'bi-briefcase', nombre: 'Consultoría TI' },
    { icono: 'bi-clipboard-data', nombre: 'Backups automáticos' },
    { icono: 'bi-bug', nombre: 'Auditoría de seguridad' },
    { icono: 'bi-rocket', nombre: 'Optimización web' },
    { icono: 'bi-lightning', nombre: 'Infraestructura cloud' }
  ];

  indiceActual = 0;
  idIntervalo: any;
  cantidadVisible = 4;

  get serviciosVisibles() {
    const resultado = [];
    for (let i = 0; i < this.cantidadVisible; i++) {
      resultado.push(this.listaServicios[(this.indiceActual + i) % this.listaServicios.length]);
    }
    return resultado;
  }

  ngOnInit() {
    this.idIntervalo = setInterval(() => {
      this.indiceActual = (this.indiceActual + 1) % this.listaServicios.length;
    }, 3000);
  }

  ngOnDestroy() {
    if (this.idIntervalo) {
      clearInterval(this.idIntervalo);
    }
  }
}
