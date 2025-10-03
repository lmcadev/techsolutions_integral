import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Servicio } from './servicios.service';

// Interface para items del carrito
export interface ItemCarrito {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  servicio: Servicio;
}

// Servicio para gestionar el carrito de compras
@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private readonly STORAGE_KEY = 'techsolutions_carrito'; // Clave para localStorage
  private carritoSubject = new BehaviorSubject<ItemCarrito[]>([]); // Estado del carrito
  public carrito$: Observable<ItemCarrito[]> = this.carritoSubject.asObservable(); // Observable público

  constructor() {
    this.cargarCarritoDesdeStorage(); // Cargar carrito al inicializar
  }

  /**
   * Obtener todos los items del carrito
   */
  getCarrito(): ItemCarrito[] {
    return this.carritoSubject.value;
  }

  // Agregar servicio al carrito
  agregarAlCarrito(servicio: Servicio, cantidad: number = 1): void {
    if (!servicio.id || !servicio.stock) {
      throw new Error('El servicio no está disponible');
    }

    const carritoActual = this.getCarrito();
    const itemExistente = carritoActual.find(item => item.id === servicio.id);

    if (itemExistente) {
      itemExistente.cantidad += cantidad; // Sumar cantidad si ya existe
    } else {
      // Crear nuevo item si no existe
      const nuevoItem: ItemCarrito = {
        id: servicio.id,
        nombre: servicio.nombre,
        precio: servicio.precio || 0,
        cantidad: cantidad,
        servicio: servicio
      };
      carritoActual.push(nuevoItem);
    }

    this.actualizarCarrito(carritoActual);
  }

  // Actualizar cantidad de un item
  actualizarCantidad(itemId: number, nuevaCantidad: number): void {
    if (nuevaCantidad <= 0) {
      this.eliminarItem(itemId); // Eliminar si cantidad es 0
      return;
    }

    const carritoActual = this.getCarrito();
    const item = carritoActual.find(i => i.id === itemId);
    
    if (item) {
      item.cantidad = nuevaCantidad;
      this.actualizarCarrito(carritoActual);
    }
  }

  // Eliminar item del carrito
  eliminarItem(itemId: number): void {
    const carritoActual = this.getCarrito().filter(item => item.id !== itemId);
    this.actualizarCarrito(carritoActual);
  }

  // Vaciar carrito completamente
  vaciarCarrito(): void {
    this.actualizarCarrito([]);
  }

  /**
   * Obtener el total del carrito
   */
  getTotal(): number {
    return this.getCarrito().reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }

  /**
   * Obtener la cantidad total de items
   */
  getCantidadTotal(): number {
    return this.getCarrito().reduce((total, item) => total + item.cantidad, 0);
  }

  /**
   * Verificar si un servicio ya está en el carrito
   */
  estaEnCarrito(servicioId: number): boolean {
    return this.getCarrito().some(item => item.id === servicioId);
  }

  /**
   * Obtener la cantidad de un servicio específico en el carrito
   */
  getCantidadEnCarrito(servicioId: number): number {
    const item = this.getCarrito().find(i => i.id === servicioId);
    return item ? item.cantidad : 0;
  }

  // Actualizar carrito y notificar cambios
  private actualizarCarrito(nuevoCarrito: ItemCarrito[]): void {
    this.carritoSubject.next(nuevoCarrito);
    this.guardarCarritoEnStorage(nuevoCarrito);
  }

  // Guardar carrito en localStorage
  private guardarCarritoEnStorage(carrito: ItemCarrito[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(carrito));
    } catch (error) {
      console.error('Error guardando carrito en localStorage:', error);
    }
  }

  // Cargar carrito desde localStorage
  private cargarCarritoDesdeStorage(): void {
    try {
      const carritoGuardado = localStorage.getItem(this.STORAGE_KEY);
      if (carritoGuardado) {
        const carrito = JSON.parse(carritoGuardado) as ItemCarrito[];
        this.carritoSubject.next(carrito);
      }
    } catch (error) {
      console.error('Error cargando carrito desde localStorage:', error);
      this.carritoSubject.next([]);
    }
  }
}