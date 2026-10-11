import { Injectable, inject } from '@angular/core';
import { FirestoreService } from './firestore';
import { Observable } from 'rxjs';

export interface Booking {
  id?: string;
  clientName: string;
  clientId?: string;
  barberId: string;
  barberName: string;
  serviceName: string;
  servicePrice: number;
  date: string;
  time: string;
  status: 'Pendiente' | 'Confirmado' | 'Cancelado' | 'Completado';
  avatar?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  private fs = inject(FirestoreService);
  private path = 'bookings';

  getAllBookings(): Observable<Booking[]> {
    return this.fs.getAll<Booking>(this.path);
  }

  addBooking(booking: Omit<Booking, 'id'>) {
    return this.fs.add(this.path, booking);
  }

  updateStatus(id: string, status: Booking['status']) {
    return this.fs.update(this.path, id, { status });
  }

  deleteBooking(id: string) {
    return this.fs.remove(this.path, id);
  }
}