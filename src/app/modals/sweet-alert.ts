import { Injectable } from '@angular/core';
declare const Swal: any; // porque uso CDN 

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor() {}

  // mensaje de error
  crearMensajeError(mensaje: string) {
    Swal.fire({
      icon: 'error',
      title: '¡Oh no!',
      text: mensaje,
      confirmButtonText: 'Aceptar'
    });
  }

  // mensaje de éxito
  crearMensajeExito(mensaje: string) {
    Swal.fire({
      icon: 'success',
      title: '¡Bien hecho!',
      text: mensaje,
      confirmButtonText: 'Aceptar'
    });
  }

  // mensaje de advertencia
  crearMensajeJuego(title: string, mensaje: string) {
    Swal.fire({
      icon: 'info',
      title: title,
      text: mensaje,
      confirmButtonText: 'Aceptar'
    });
  }
}
