
import { Component } from '@angular/core';
import { TranslateService, TranslateModule  } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skills',
  imports: [ TranslateModule, FormsModule, CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.css'
})
export class SkillsComponent {
    backendList: string[] = [];
    othersList: string[] = [];
    personalList: string[] = [];

    constructor(private translate: TranslateService) {
      this.loadSkills();
      this.translate.onLangChange.subscribe(() => this.loadSkills());
    }

    loadSkills() {
      this.translate.get([
        'SKILLS.BACKEND_LIST',
        'SKILLS.OTHERS_LIST',
        'SKILLS.PERSONAL_LIST'
      ]).subscribe(translations => {
        this.backendList = translations['SKILLS.BACKEND_LIST'];
        this.othersList = translations['SKILLS.OTHERS_LIST'];
        this.personalList = translations['SKILLS.PERSONAL_LIST'];
      });
    }

}
