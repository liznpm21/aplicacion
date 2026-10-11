import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonBackButton,
  IonContent,
  IonCard,
  IonCardContent,
  IonIcon,
  IonButton
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  checkmarkCircle,
  cutOutline,
  personOutline,
  calendarOutline,
  timeOutline,
  cashOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.page.html',
  styleUrls: ['./confirmation.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonBackButton,
    IonContent,
    IonCard,
    IonCardContent,
    IonIcon,
    IonButton
  ]
})
export class ConfirmationPage {

  serviceName: string | null = null;
  barberName: string | null = null;
  servicePrice: number | null = null;
  date: string | null = null;
  time: string | null = null;

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as any;

    if (state) {
      this.serviceName = state.serviceName || null;
      this.barberName = state.barberName || null;
      this.servicePrice = state.servicePrice || null;
      this.date = state.date || null;
      this.time = state.time || null;
    } else {
      const historyState = window.history.state;
      this.serviceName = historyState?.serviceName || null;
      this.barberName = historyState?.barberName || null;
      this.servicePrice = historyState?.servicePrice || null;
      this.date = historyState?.date || null;
      this.time = historyState?.time || null;
    }

    addIcons({
      checkmarkCircle,
      cutOutline,
      personOutline,
      calendarOutline,
      timeOutline,
      cashOutline
    });
  }

  get formattedDate(): string {
    if (!this.date) return '';
    return new Date(this.date).toLocaleDateString('es-CO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  }

}