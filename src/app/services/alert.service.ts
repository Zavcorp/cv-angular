import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  success(title: string, text: string) {
    Swal.fire({
      icon: 'success',
      title: title,
      text: text,
      confirmButtonColor: '#3085d6'
    });
  }

  error(title: string, text: string) {
    Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      confirmButtonColor: '#d33'
    });
  }

  info(title: string, text: string) {
    Swal.fire({
      icon: 'info',
      title: title,
      text: text,
      confirmButtonColor: '#3085d6'
    });
  }

  confirm(title: string, text: string) {
    return Swal.fire({
      icon: 'question',
      title: title,
      text: text,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    });
  }
}
