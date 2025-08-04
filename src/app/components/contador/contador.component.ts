import { Component , OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contador',
  imports: [],
  templateUrl: './contador.component.html',
  styleUrl: './contador.component.css'
})

export class ContadorComponent implements OnInit {

  visitas = 0;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.post<any>('https://visitor.6developer.com/visit', {
      domain: window.location.hostname,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      page_path: window.location.pathname,
      page_title: document.title,
      referrer: document.referrer
    }).subscribe(res => {
      this.visitas = res.totalCount;
    });
  }

}


