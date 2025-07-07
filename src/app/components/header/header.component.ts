import { Component, ViewChild, ElementRef, ChangeDetectorRef,AfterViewInit, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { CommonModule } from '@angular/common';
import { LoginComponent } from "../login/login.component";
import * as QRCode from 'qrcode';
import { TranslateService , TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, CommonModule, LoginComponent, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  schemas: [NO_ERRORS_SCHEMA]
})
export class HeaderComponent implements AfterViewInit {

  currentLang: string = 'es';
  switchLabel: string = 'Versión en inglés';

  @ViewChild('qrButton', { static: false }) qrButton!: ElementRef;
  cvLink: string = 'https://cv-adrianzavaleta.netlify.app';
  @ViewChild('canvas') canvas!: ElementRef;

    isLoggedIn = false;

    constructor(
      private authService: AuthService,
      private translate: TranslateService,
      private cdr: ChangeDetectorRef,
      private el: ElementRef ) {
      this.authService.authStatus.subscribe(status => {
        this.isLoggedIn = status;
        this.translate.setDefaultLang('es');
        this.currentLang = this.translate.currentLang || 'es';
        this.updateSwitchLabel();
      });
    }

    switchLanguage() {
      this.currentLang = this.currentLang === 'es' ? 'en' : 'es';
      this.translate.use(this.currentLang);
      this.updateSwitchLabel();
    }

    private updateSwitchLabel() {
      this.switchLabel = this.currentLang === 'es' ? 'Versión en inglés' : 'Spanish version';
    }

    logout() {
      this.authService.logout();
    }

    ngAfterViewInit() {
      this.generateQRCode();

      // Manejo de foco al cerrar la modal
      const modalEl = this.el.nativeElement.querySelector('#qrModal');
      modalEl.addEventListener('hidden.bs.modal', () => {
        if (this.qrButton) {
          this.qrButton.nativeElement.focus();
        }
      });
    }

    dataUrl: string = '';

    generateQRCode() {
      QRCode.toDataURL(this.cvLink, {
        width: 200,
        color: {
          dark: '#ffffff',
          light: '#212529'
        }
      }, (err, url) => {
        if (err) {
          console.error(err);
          return;
        }
        this.dataUrl = url;
      });
      this.cdr.detectChanges();
    }

    downloadQRCode() {
      const link = document.createElement('a');
      link.href = this.dataUrl;
      link.download = 'cv_qrcode.png';
      link.click();
    }
}
