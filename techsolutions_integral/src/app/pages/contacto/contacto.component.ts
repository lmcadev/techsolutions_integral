import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../componentes/header/header.component';
import { FooterComponent } from '../../componentes/footer/footer.component';

// Página de contacto con información del proyecto académico
@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {
  // Información del equipo de desarrollo
  integrantes = [
    { nombre: 'Cristian Camilo Correa Cuesta', rol: 'Desarrollador Frontend' },
    { nombre: 'Mauricio Figueredo Torres', rol: 'Desarrollador Backend' },
    { nombre: 'Luis Miguel Castañeda Arciniegas', rol: 'Desarrollador Full Stack' },
    { nombre: 'Jorge David Torres Muñoz', rol: 'Desarrollador Frontend' },
    { nombre: 'Jefferson Arenas Zea', rol: 'Desarrollador Backend' }
  ];

  // Información del proyecto académico
  proyectoInfo = {
    asignatura: 'Front-end',
    grupo: 'Grupo B01 - Subgrupo 4',
    profesor: 'John Olarte',
    facultad: 'Facultad de Ingenieria, Diseno e Innovacion',
    institucion: 'Politecnico Grancolombiano',
    anio: '2025'
  };

  // Tecnologías utilizadas
  tecnologias = [
    { nombre: 'Angular 17', descripcion: 'Framework frontend principal', icono: 'bi-code-square' },
    { nombre: 'Node.js', descripcion: 'Runtime del backend', icono: 'bi-server' },
    { nombre: 'Express.js', descripcion: 'Framework del servidor', icono: 'bi-gear' },
    { nombre: 'PostgreSQL', descripcion: 'Base de datos relacional', icono: 'bi-database' },
    { nombre: 'Bootstrap 5', descripcion: 'Framework CSS', icono: 'bi-palette' },
    { nombre: 'Docker', descripcion: 'Contenedorización', icono: 'bi-box' }
  ];
}