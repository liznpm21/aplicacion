import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonApp,
  IonRouterOutlet,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonMenuToggle
} from '@ionic/angular/standalone';

import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonApp,
    IonRouterOutlet,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonMenuToggle
  ],
})
export class AppComponent implements OnInit {

  isAdmin = false;
  isLoggedIn = false;

  constructor(
    private auth: Auth,
    private authService: AuthService
  ) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, async (user) => {
      this.isLoggedIn = !!user;

      if (user) {
        const role = await this.authService.getUserRole(user.uid);
        this.isAdmin = role === 'admin';
      } else {
        this.isAdmin = false;
      }
    });
  }

  logout() {
    this.authService.logout();
  }

}