import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import {
  IonContent,
  IonItem,
  IonIcon,
  IonInput,
  IonButton
} from '@ionic/angular/standalone';


import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,

  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],

  imports: [
    IonContent,
    IonItem,
    IonIcon,
    IonInput,
    IonButton,
    FormsModule,
    RouterLink
  ]
})
export class RegisterPage {

  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async register() {

    if (!this.name || !this.email || !this.password || !this.confirmPassword) {

      alert('Completa todos los campos');

      return;
    }

    if (this.password !== this.confirmPassword) {

      alert('Las contraseñas no coinciden');

      return;
    }

    if (this.password.length < 6) {

      alert('La contraseña debe tener mínimo 6 caracteres');

      return;
    }

    try {

      await this.authService.register(
  this.name,
  this.email,
  this.password
);
      alert('Cuenta creada correctamente');

      this.router.navigate(['/services']);

    } catch (error) {

      console.error(error);

      alert('No se pudo crear la cuenta');

    }

  }

}
