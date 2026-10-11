import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonModal,
  IonItem,
  IonLabel,
  IonInput,
  IonMenu,
  IonList,
  IonMenuToggle,
  IonAvatar
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  menuOutline,
  personCircleOutline,
  peopleOutline,
  calendarOutline,
  cashOutline,
  addCircleOutline,
  ribbonOutline,
  settingsOutline,
  homeOutline,
  close,
  cameraOutline,
  eyeOutline,
  trashOutline,
  checkmarkCircle,
  closeCircle,
  starOutline,
  cutOutline
} from 'ionicons/icons';

import { BarbersService, Barber } from '../../services/barbers';
import { ServicesCatalogService, ServiceItem } from '../../services/services-catalog';
import { PromotionsService, Promotion } from '../../services/promotions';
import { StorageService } from '../../services/storage';
import { BookingsService, Booking } from '../../services/bookings';
import { FirestoreService } from '../../services/firestore';
import { AuthService } from '../../services/auth';

interface ActivityItem {
  icon: string;
  title: string;
  description: string;
  date: Date;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonContent,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    IonModal,
    IonItem,
    IonLabel,
    IonInput,
    IonMenu,
    IonList,
    IonMenuToggle,
    IonAvatar
  ]
})
export class AdminPage implements OnInit {

  barbers: Barber[] = [];
  services: ServiceItem[] = [];
  bookings: Booking[] = [];

  isNewBarberModalOpen = false;
  isNewServiceModalOpen = false;
  isNewPromoModalOpen = false;

  isBarberListModalOpen = false;
  isServiceListModalOpen = false;
  isBookingListModalOpen = false;

  isUploading = false;

  newBarber = { name: '', specialty: '', image: '' };
  newService = { name: '', description: '', price: 0, icon: 'cut' };
  newPromo = { title: '', description: '', discount: 0 };

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  recent: ActivityItem[] = [];

  constructor(
    private barbersService: BarbersService,
    private servicesService: ServicesCatalogService,
    private promotionsService: PromotionsService,
    private storageService: StorageService,
    private bookingsService: BookingsService,
    private firestoreService: FirestoreService,
    private authService: AuthService
  ) {
    addIcons({
      menuOutline,
      personCircleOutline,
      peopleOutline,
      calendarOutline,
      cashOutline,
      addCircleOutline,
      ribbonOutline,
      settingsOutline,
      homeOutline,
      close,
      cameraOutline,
      eyeOutline,
      trashOutline,
      checkmarkCircle,
      closeCircle,
      starOutline,
      cutOutline
    });
  }

  ngOnInit() {
    this.barbersService.getBarbers().subscribe(barbers => {
      this.barbers = barbers;
    });

    this.servicesService.getServices().subscribe(services => {
      this.services = services;
    });

    this.bookingsService.getAllBookings().subscribe(bookings => {
      this.bookings = bookings;
    });

    this.loadRecentActivity();
  }

  private loadRecentActivity() {
    const recentBarbers$ = this.firestoreService.getRecent<any>('barbers', 'createdAt', 3);
    const recentServices$ = this.firestoreService.getRecent<any>('services', 'createdAt', 3);
    const recentPromos$ = this.firestoreService.getRecent<any>('promotions', 'createdAt', 3);
    const recentBookings$ = this.firestoreService.getRecent<any>('bookings', 'createdAt', 3);

    combineLatest([recentBarbers$, recentServices$, recentPromos$, recentBookings$])
      .subscribe(([barbers, services, promos, bookings]) => {

        const items: ActivityItem[] = [];

        barbers.forEach(b => items.push({
          icon: 'people-outline',
          title: 'Nuevo barbero',
          description: `${b.name} fue agregado al equipo`,
          date: b.createdAt?.toDate ? b.createdAt.toDate() : new Date()
        }));

        services.forEach(s => items.push({
          icon: 'add-circle-outline',
          title: 'Nuevo servicio',
          description: `${s.name} agregado por $${s.price}`,
          date: s.createdAt?.toDate ? s.createdAt.toDate() : new Date()
        }));

        promos.forEach(p => items.push({
          icon: 'ribbon-outline',
          title: 'Nueva promoción',
          description: `${p.title} — ${p.discount}% de descuento`,
          date: p.createdAt?.toDate ? p.createdAt.toDate() : new Date()
        }));

        bookings.forEach(bk => items.push({
          icon: 'calendar-outline',
          title: 'Nueva cita',
          description: `${bk.clientName} reservó ${bk.serviceName} con ${bk.barberName}`,
          date: bk.createdAt?.toDate ? bk.createdAt.toDate() : new Date()
        }));

        items.sort((a, b) => b.date.getTime() - a.date.getTime());

        this.recent = items.slice(0, 5);
      });
  }

  // ---------- SESIÓN ----------

  logout() {
    this.authService.logout();
  }

  // ---------- BARBERO ----------

  openNewBarberModal() {
    this.newBarber = { name: '', specialty: '', image: '' };
    this.selectedFile = null;
    this.previewUrl = null;
    this.isNewBarberModalOpen = true;
  }

  closeNewBarberModal() {
    this.isNewBarberModalOpen = false;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.previewUrl = URL.createObjectURL(this.selectedFile);
    }
  }

  async saveNewBarber() {
    if (!this.newBarber.name || !this.newBarber.specialty) {
      alert('Completa nombre y especialidad');
      return;
    }

    try {
      this.isUploading = true;

      let imageUrl = 'assets/barbers/default.jpg';

      if (this.selectedFile) {
        imageUrl = await this.storageService.uploadFile(this.selectedFile, 'barbers');
      }

      await this.barbersService.addBarber({
        name: this.newBarber.name,
        specialty: this.newBarber.specialty,
        image: imageUrl,
        rating: 5,
        votes: 0
      });

      this.isUploading = false;
      this.isNewBarberModalOpen = false;
      alert('Barbero agregado correctamente');

    } catch (error) {
      this.isUploading = false;
      console.error(error);
      alert('No se pudo agregar el barbero');
    }
  }

  get totalBarbers(): number {
    return this.barbers.length;
  }

  get totalCitasHoy(): number {
    const hoy = new Date().toISOString().split('T')[0];
    return this.bookings.filter(b => b.date === hoy).length;
  }

  get ingresosHoy(): number {
    const hoy = new Date().toISOString().split('T')[0];
    return this.bookings
      .filter(b => b.date === hoy && b.status !== 'Cancelado')
      .reduce((sum, b) => sum + (b.servicePrice || 0), 0);
  }

  // ---------- LISTA DE BARBEROS ----------

  openBarberListModal() {
    this.isBarberListModalOpen = true;
  }

  closeBarberListModal() {
    this.isBarberListModalOpen = false;
  }

  async deleteBarberFromList(barber: Barber) {
    if (!barber.id) return;
    const confirmDelete = confirm(`¿Eliminar a ${barber.name}?`);
    if (!confirmDelete) return;

    try {
      await this.barbersService.deleteBarber(barber.id);
    } catch (error) {
      console.error(error);
      alert('No se pudo eliminar el barbero');
    }
  }

  // ---------- SERVICIO ----------

  openNewServiceModal() {
    this.newService = { name: '', description: '', price: 0, icon: 'cut' };
    this.isNewServiceModalOpen = true;
  }

  closeNewServiceModal() {
    this.isNewServiceModalOpen = false;
  }

  async saveNewService() {
    if (!this.newService.name || !this.newService.price) {
      alert('Completa nombre y precio');
      return;
    }

    try {
      await this.servicesService.addService({
        name: this.newService.name,
        description: this.newService.description,
        price: this.newService.price,
        icon: this.newService.icon
      });

      this.isNewServiceModalOpen = false;
      alert('Servicio agregado correctamente');

    } catch (error) {
      console.error(error);
      alert('No se pudo agregar el servicio');
    }
  }

  // ---------- LISTA DE SERVICIOS ----------

  openServiceListModal() {
    this.isServiceListModalOpen = true;
  }

  closeServiceListModal() {
    this.isServiceListModalOpen = false;
  }

  async deleteServiceFromList(service: ServiceItem) {
    if (!service.id) return;
    const confirmDelete = confirm(`¿Eliminar el servicio "${service.name}"?`);
    if (!confirmDelete) return;

    try {
      await this.servicesService.deleteService(service.id);
    } catch (error) {
      console.error(error);
      alert('No se pudo eliminar el servicio');
    }
  }

  // ---------- PROMOCIÓN ----------

  openNewPromoModal() {
    this.newPromo = { title: '', description: '', discount: 0 };
    this.isNewPromoModalOpen = true;
  }

  closeNewPromoModal() {
    this.isNewPromoModalOpen = false;
  }

  async saveNewPromo() {
    if (!this.newPromo.title || !this.newPromo.discount) {
      alert('Completa título y descuento');
      return;
    }

    try {
      await this.promotionsService.addPromotion({
        title: this.newPromo.title,
        description: this.newPromo.description,
        discount: this.newPromo.discount
      });

      this.isNewPromoModalOpen = false;
      alert('Promoción agregada correctamente');

    } catch (error) {
      console.error(error);
      alert('No se pudo agregar la promoción');
    }
  }

  // ---------- LISTA DE CITAS ----------

  openBookingListModal() {
    this.isBookingListModalOpen = true;
  }

  closeBookingListModal() {
    this.isBookingListModalOpen = false;
  }

  async confirmBooking(booking: Booking) {
    if (!booking.id) return;
    try {
      await this.bookingsService.updateStatus(booking.id, 'Confirmado');
    } catch (error) {
      console.error(error);
      alert('No se pudo confirmar la cita');
    }
  }

  async cancelBooking(booking: Booking) {
    if (!booking.id) return;
    try {
      await this.bookingsService.updateStatus(booking.id, 'Cancelado');
    } catch (error) {
      console.error(error);
      alert('No se pudo cancelar la cita');
    }
  }

}