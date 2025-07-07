import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { NgForm, FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';
import { AlertService } from '../../services/alert.service';
import { ModalCleanupService } from '../services/modal-cleanup.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private alertService: AlertService, private modalCleanupService: ModalCleanupService, private router: Router) {}


  login() {
    if (this.authService.login(this.username, this.password)) {
      // Cerrar la modal manualmente
      const modalElement = document.getElementById('loginModal')!;
      const modalInstance = Modal.getInstance(modalElement);

      // Asocia limpieza de modal al evento de cerrado
        this.modalCleanupService.limpiarModalAlCerrar('loginModal', () => {
          // Swal.fire({
          //   icon: 'success',
          //   title: 'Mensaje enviado',
          //   text: 'Tu mensaje fue enviado correctamente.',
          //   confirmButtonColor: '#3085d6'
          // });
        });

      modalInstance?.hide();

       // Mostrar sweetalert de éxito
    this.alertService.success('Bienvenido', 'Sesión iniciada correctamente.');
    } else {
      this.alertService.error('Error', 'Credenciales inválidas');
    }
  }
}
