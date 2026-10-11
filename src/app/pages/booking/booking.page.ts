import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonMenuButton,
  IonCard,
  IonCardContent,
  IonDatetime,
  IonButton
} from '@ionic/angular/standalone';

import { BookingsService } from '../../services/bookings';
import { AuthService } from '../../services/auth';
import { BookingSelectionService } from '../../services/booking-selection';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonMenuButton,
    IonCard,
    IonCardContent,
    IonDatetime,
    IonButton
  ]
})
export class BookingPage implements OnInit {

  selectedDate: string = new Date().toISOString();
  selectedHour: string | null = null;

  availableHours = ['09:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM'];

  isSaving = false;

  constructor(
    private router: Router,
    private bookingsService: BookingsService,
    private authService: AuthService,
    public selection: BookingSelectionService
  ) {}

  ngOnInit() {}

  selectHour(hour: string) {
    this.selectedHour = hour;
  }

async confirm() {
  if (!this.selection.serviceName || !this.selection.barberName) {
    alert('Elige un servicio y un barbero desde la sección de Servicios antes de confirmar');
    return;
  }

  if (!this.selectedHour) {
    alert('Elige una hora disponible');
    return;
  }

  const currentUser = this.authService.getCurrentUser();

  try {
    this.isSaving = true;

    await this.bookingsService.addBooking({
      clientName: currentUser?.email || 'Cliente sin registrar',
      clientId: currentUser?.uid || '',
      barberId: this.selection.barberName || '',
      barberName: this.selection.barberName || '',
      serviceName: this.selection.serviceName || '',
      servicePrice: this.selection.servicePrice || 0,
      date: this.selectedDate.split('T')[0],
      time: this.selectedHour,
      status: 'Pendiente'
    });

    const summary = {
      serviceName: this.selection.serviceName,
      barberName: this.selection.barberName,
      servicePrice: this.selection.servicePrice,
      date: this.selectedDate,
      time: this.selectedHour
    };

    this.isSaving = false;
    this.selection.clear();

    this.router.navigate(['/confirmation'], { state: summary });

  } catch (error) {
    this.isSaving = false;
    console.error(error);
    alert('No se pudo crear la reserva');
  }
}
}