
import { Component, ViewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';
import { ModalCleanupService } from '../services/modal-cleanup.service';


@Component({
  selector: 'app-contact',
  imports: [ FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  message: string = '';

  @ViewChild('contactForm') contactForm!: NgForm;
  constructor(private modalCleanupService: ModalCleanupService) {}

  sendMessage() {
    if (!this.message) return;

    emailjs.send('service_dgt4jhm', 'msj_contacto_cv', {
      message: this.message,
      to_email: 'zavcorp23@gmail.com'
    }, 'Rlb60z6Lc_vjdf3UG')
      .then((result: EmailJSResponseStatus) => {
        console.log('Correo enviado:', result.text);
        this.contactForm.resetForm();

        const modalElement = document.getElementById('contactModal')!;
        const modalInstance = Modal.getInstance(modalElement);

        // Asocia limpieza de modal al evento de cerrado
        this.modalCleanupService.limpiarModalAlCerrar('contactModal', () => {
          Swal.fire({
            icon: 'success',
            title: 'Mensaje enviado',
            text: 'Tu mensaje fue enviado correctamente.',
            confirmButtonColor: '#3085d6'
          });
        });

        modalInstance?.hide();

      }, (error) => {
        console.error('Error al enviar:', error.text);

        Swal.fire({
          icon: 'error',
          title: 'Error al enviar',
          text: 'Hubo un problema al enviar el mensaje. Intenta más tarde.',
          confirmButtonColor: '#d33'
        });
      });
  }
}

