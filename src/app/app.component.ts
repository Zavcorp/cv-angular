import { AfterViewInit, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { AboutComponent } from "./components/about/about.component";
import { SkillsComponent } from "./components/skills/skills.component";
import { ContactComponent } from "./components/contact/contact.component";
import { ProjectsComponent } from './components/projects/projects.component';
import { PdfExportComponent } from "./components/pdf-export/pdf-export.component";
import { ContadorComponent } from "./components/contador/contador.component";
import { AuthService } from './services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    AboutComponent,
    SkillsComponent,
    ContactComponent,
    ProjectsComponent,
    PdfExportComponent,
    ContadorComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  title = 'cv-angular';
  anioActual = new Date().getFullYear();

  ngAfterViewInit() {
    // Mostrar mensaje de carga al iniciar
    Swal.fire({
      title: 'Cargando CV...',
      icon: "success",
      html: '<div class="d-flex flex-column align-items-center"><p class="mt-2">Por favor espera un momento</p></div>',
      allowOutsideClick: false,
      showConfirmButton: false
    });

    // Hacer scroll al tope después del render completo
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });

    // Cerrar el mensaje tras un pequeño delay
    setTimeout(() => {
      Swal.close();
    }, 1500); // ajusta el tiempo según lo que quieras
  }

  constructor(public authService: AuthService, private router: Router,private translate: TranslateService ) {
     // Idiomas soportados
     this.translate.addLangs(['es', 'en']);
     // Idioma por defecto
     this.translate.setDefaultLang('es');

     // Si quieres detectar idioma del navegador y usarlo si existe:
     const browserLang = translate.getBrowserLang();
     //this.translate.use(browserLang?.match(/en|es/) ? browserLang : 'es');
     this.translate.use('es');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
