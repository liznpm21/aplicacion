import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

import {
  IonContent,
  IonItem,
  IonIcon,
  IonInput,
  IonButton
} from '@ionic/angular/standalone';

import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';

import { addIcons } from 'ionicons';
import { personOutline, lockClosedOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    IonContent,
    IonItem,
    IonIcon,
    IonInput,
    IonButton,
    RouterLink,
    FormsModule
  ]
})
export class HomePage {

  email = '';
  password = '';
  isLoggingIn = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ personOutline, lockClosedOutline });
  }

  async login() {

    if (!this.email || !this.password) {
      alert('Completa correo y contraseña');
      return;
    }

    try {
      this.isLoggingIn = true;

      const credential = await this.authService.login(this.email, this.password);

      console.log('UID del usuario:', credential.user.uid);

      const role = await this.authService.getUserRole(credential.user.uid);

      console.log('Rol obtenido:', role);

      this.isLoggingIn = false;

      if (role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/services']);
      }

    } catch (error) {
      this.isLoggingIn = false;
      alert('Correo o contraseña incorrectos');
      console.log(error);
    }

  }

}