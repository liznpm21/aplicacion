import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,    // <-- Add this
  IonToolbar,   // <-- Add this
  IonTitle,     // <-- Add this
  IonItem,
  IonIcon,
  IonInput,
  IonButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,  // <-- Add this
    IonToolbar, // <-- Add this
    IonTitle,   // <-- Add this
    IonItem,
    IonIcon,
    IonInput,
    IonButton,
    RouterLink,
  ],
})
export class LoginPage {}