import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';

// Componente de encabezado principal
@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [RouterModule, CommonModule]
})
export class HeaderComponent implements OnInit {
  cantidadCarrito = 0; // Contador de items en el carrito

  constructor(private carritoService: CarritoService) {}

  ngOnInit(): void {
    // Actualizar contador del carrito en tiempo real
    this.carritoService.carrito$.subscribe(items => {
      this.cantidadCarrito = this.carritoService.getCantidadTotal();
    });
  }
}