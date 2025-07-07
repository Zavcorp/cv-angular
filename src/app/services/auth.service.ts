import { environment } from './../../environments/enviroment';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated = new BehaviorSubject<boolean>(false);
  public authStatus = this.isAuthenticated.asObservable();

  constructor() {
    const storedLogin = localStorage.getItem('loggedIn') === 'true';
    this.isAuthenticated.next(storedLogin);
  }

  login(username: string, password: string): boolean {
    if (username === environment.adminUser && password === environment.adminPassword) {
      localStorage.setItem('loggedIn', 'true');
      this.isAuthenticated.next(true);
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('loggedIn');
    this.isAuthenticated.next(false);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated.value;
  }
}
