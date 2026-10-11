import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookingSelectionService {

  serviceName: string | null = null;
  servicePrice: number | null = null;
  barberName: string | null = null;

  setService(name: string, price: number) {
    this.serviceName = name;
    this.servicePrice = price;
  }

  setBarber(name: string) {
    this.barberName = name;
  }

  isComplete(): boolean {
    return !!this.serviceName && !!this.barberName;
  }

  clear() {
    this.serviceName = null;
    this.servicePrice = null;
    this.barberName = null;
  }

}