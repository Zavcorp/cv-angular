import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalCleanupService {

  constructor() {}

  limpiarModalAlCerrar(modalId: string, callback?: () => void) {
    const modalElement = document.getElementById(modalId);
    if (!modalElement) return;

    // Espera a que se cierre la modal
    modalElement.addEventListener('hidden.bs.modal', () => {
      // Limpia backdrop y estilos de body
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('padding-right');

      // Ejecuta callback opcional
      if (callback) callback();
    }, { once: true });
  }
}
