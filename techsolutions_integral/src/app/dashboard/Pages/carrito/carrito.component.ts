import { Component, OnInit } from '@angular/core';
import { AuthService, Usuario } from '../../../services/auth.service';
import { CarritoService, ItemCarrito } from '../../../services/carrito.service';

// Página del carrito de compras
@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  currentUser: Usuario | null = null; // Usuario actual
  carrito: ItemCarrito[] = []; // Items en el carrito
  total: number = 0; // Total del carrito
  isLoading: boolean = false; // Estado de carga
  error: string = ''; // Mensaje de error

  constructor(
    private authService: AuthService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    // Suscribirse a cambios de usuario
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
    });
    this.cargarCarrito();
  }

  // Cargar items del carrito
  cargarCarrito(): void {
    this.isLoading = true;
    
    // Suscribirse a cambios del carrito en tiempo real
    this.carritoService.carrito$.subscribe({
      next: (items) => {
        this.carrito = items;
        this.calcularTotal();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando carrito:', error);
        this.error = 'Error al cargar el carrito';
        this.isLoading = false;
      }
    });
  }

  calcularTotal(): void {
    this.total = this.carritoService.getTotal();
  }

  actualizarCantidad(index: number, cantidadStr: string): void {
    const cantidad = parseInt(cantidadStr, 10);
    if (cantidad > 0 && this.carrito[index]) {
      this.carritoService.actualizarCantidad(this.carrito[index].id, cantidad);
    }
  }

  eliminarItem(index: number): void {
    if (this.carrito[index]) {
      this.carritoService.eliminarItem(this.carrito[index].id);
    }
  }

  procederAlPago(): void {
    if (this.carrito.length > 0) {
      const total = this.carritoService.getTotal();
      const cantidadItems = this.carritoService.getCantidadTotal();
      
      const confirmacion = confirm(
        `¿Confirmar compra de ${cantidadItems} items por un total de $${(total * 1.16).toFixed(2)} (incluyendo impuestos)?`
      );
      
      if (confirmacion) {
        // Aquí implementarías la integración con pasarela de pagos
        alert('Compra realizada exitosamente! (Funcionalidad de pago simulada)');
        this.carritoService.vaciarCarrito();
      }
    }
  }

  // Método para vaciar el carrito completamente
  vaciarCarrito(): void {
    const confirmacion = confirm('¿Estás seguro de que deseas vaciar todo el carrito?');
    if (confirmacion) {
      this.carritoService.vaciarCarrito();
    }
  }
}