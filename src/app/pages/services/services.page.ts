import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonIcon,
  IonMenu,
  IonList,
  IonItem,
  IonLabel,
  IonMenuToggle,
  IonModal
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { personCircle, cut, brush, water, close, star, calendarOutline } from 'ionicons/icons';

import { BookingSelectionService } from '../../services/booking-selection';
import { BarbersService, Barber } from '../../services/barbers';
import { ServicesCatalogService, ServiceItem } from '../../services/services-catalog';
import { AuthService } from '../../services/auth';

interface ServiceOption {
  name: string;
  price: number;
  image: string;
}

interface Service {
  name: string;
  icon: string;
  price: number;
  description: string;
  options: ServiceOption[];
}

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonButton,
    IonIcon,
    IonMenu,
    IonList,
    IonItem,
    IonLabel,
    IonMenuToggle,
    IonModal
  ]
})
export class ServicesPage implements OnInit {

  services: Service[] = [];
  barbers: Barber[] = [];

  selectedService: Service | null = null;
  selectedBarber: Barber | null = null;
  selectedOption: ServiceOption | null = null;

  isServiceModalOpen = false;
  isBarberModalOpen = false;

  isAdmin = false;

  constructor(
    private router: Router,
    public selection: BookingSelectionService,
    private barbersService: BarbersService,
    private servicesService: ServicesCatalogService,
    private authService: AuthService
  ) {
    addIcons({ personCircle, cut, brush, water, close, star, calendarOutline });
  }

  ngOnInit() {
    this.barbersService.getBarbers().subscribe(barbers => {
      this.barbers = barbers;
    });

    this.servicesService.getServices().subscribe(items => {
      this.services = items.map(item => this.mapToService(item));
    });

    const user = this.authService.getCurrentUser();
    if (user) {
      this.authService.getUserRole(user.uid).then(role => {
        this.isAdmin = role === 'admin';
      });
    }
  }

  private mapToService(item: ServiceItem): Service {
    return {
      name: item.name,
      icon: item.icon || 'cut',
      price: item.price,
      description: item.description,
      options: [
        {
          name: item.name,
          price: item.price,
          image: 'assets/options/default.jpg'
        }
      ]
    };
  }

  openService(service: Service) {
    this.selectedService = service;
    this.selectedOption = null;
    this.isServiceModalOpen = true;
  }

  closeServiceModal() {
    this.isServiceModalOpen = false;
  }

  selectOption(option: ServiceOption) {
    this.selectedOption = option;
  }

  openBarber(barber: Barber) {
    this.selectedBarber = barber;
    this.isBarberModalOpen = true;
  }

  closeBarberModal() {
    this.isBarberModalOpen = false;
  }

  goToBookingFromService() {
    if (!this.selectedOption && !this.selectedService) return;

    this.selection.setService(
      this.selectedOption?.name || this.selectedService?.name || '',
      this.selectedOption?.price || this.selectedService?.price || 0
    );

    this.isServiceModalOpen = false;
  }

 chooseBarber() {
  if (!this.selectedBarber) return;

  this.selection.setBarber(this.selectedBarber.name);

  this.isBarberModalOpen = false;

  this.router.navigate(['/booking']);
}

  goToBooking() {
    this.router.navigate(['/booking']);
  }

  getStars(count: number): number[] {
    return Array(count).fill(0);
  }

}