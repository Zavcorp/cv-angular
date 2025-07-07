import { Component } from '@angular/core';
import { AuthService } from './../../services/auth.service';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, } from '@ngx-translate/core';

@Component({
  selector: 'app-projects',
  imports: [FormsModule, CommonModule, TranslateModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
  isLoggedIn = false;

  constructor(private authService: AuthService) {
    this.authService.authStatus.subscribe(status => {
      this.isLoggedIn = status;
    });
  }
}
