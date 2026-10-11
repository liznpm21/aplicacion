import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonIcon,
  IonButton,
  IonCard,
  IonCardContent,
  IonFooter,
  IonModal,
  IonDatetime
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  menuOutline,
  personCircleOutline,
  calendarOutline,
  statsChartOutline,
  personOutline,
  checkmarkCircle,
  closeCircle,
  close,
  cashOutline,
  starOutline
} from 'ionicons/icons';

import { BookingsService, Booking } from '../../services/bookings';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-barber',
  templateUrl: './barber.page.html',
  styleUrls: ['./barber.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonIcon,
    IonButton,
    IonCard,
    IonCardContent,
    IonFooter,
    IonModal,
    IonDatetime
  ]
})
export class BarberPage implements OnInit {

  allAppointments: Booking[] = [];
  appointments: Booking[] = [];

  selectedDate: string = new Date().toISOString();

  highlightedDates: { date: string; textColor: string; backgroundColor: string }[] = [];

  today = new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  isProfileModalOpen = false;
  isStatsModalOpen = false;

  barberEmail = '';

  constructor(
    private bookingsService: BookingsService,
    private authService: AuthService
  ) {
    addIcons({
      menuOutline,
      personCircleOutline,
      calendarOutline,
      statsChartOutline,
      personOutline,
      checkmarkCircle,
      closeCircle,
      close,
      cashOutline,
      starOutline
    });
  }

  ngOnInit() {
    this.bookingsService.getAllBookings().subscribe(bookings => {
      this.allAppointments = bookings;
      this.filterByDate();
      this.updateHighlightedDates();
    });

    const user = this.authService.getCurrentUser();
    this.barberEmail = user?.email || '';
  }

  onDateChange(event: CustomEvent) {
    this.selectedDate = event.detail.value as string;
    this.filterByDate();
    this.updateTodayLabel();
  }

  private filterByDate() {
    const dateOnly = this.selectedDate.split('T')[0];
    this.appointments = this.allAppointments.filter(a => a.date === dateOnly);
  }

  private updateTodayLabel() {
    const parsed = new Date(this.selectedDate);
    this.today = parsed.toLocaleDateString('es-CO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  }

  private updateHighlightedDates() {
    const uniqueDates = [...new Set(this.allAppointments.map(a => a.date))];

    this.highlightedDates = uniqueDates.map(date => ({
      date,
      textColor: '#111',
      backgroundColor: '#e58a3b'
    }));
  }

  async confirm(booking: Booking) {
    if (!booking.id) return;
    try {
      await this.bookingsService.updateStatus(booking.id, 'Confirmado');
    } catch (error) {
      console.error(error);
      alert('No se pudo confirmar la cita');
    }
  }

  async cancel(booking: Booking) {
    if (!booking.id) return;
    try {
      await this.bookingsService.updateStatus(booking.id, 'Cancelado');
    } catch (error) {
      console.error(error);
      alert('No se pudo cancelar la cita');
    }
  }

  openProfileModal() {
    this.isStatsModalOpen = false;
    this.isProfileModalOpen = true;
  }

  closeProfileModal() {
    this.isProfileModalOpen = false;
  }

  openStatsModal() {
    this.isProfileModalOpen = false;
    this.isStatsModalOpen = true;
  }

  closeStatsModal() {
    this.isStatsModalOpen = false;
  }

  goToAgenda() {
    this.isProfileModalOpen = false;
    this.isStatsModalOpen = false;
  }

  logout() {
    this.authService.logout();
  }

  // ---------- Estadísticas calculadas ----------

  get totalCitas(): number {
    return this.allAppointments.length;
  }

  get citasConfirmadas(): number {
    return this.allAppointments.filter(a => a.status === 'Confirmado').length;
  }

  get citasCanceladas(): number {
    return this.allAppointments.filter(a => a.status === 'Cancelado').length;
  }

  get ingresosTotales(): number {
    return this.allAppointments
      .filter(a => a.status !== 'Cancelado')
      .reduce((sum, a) => sum + (a.servicePrice || 0), 0);
  }

}