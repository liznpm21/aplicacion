import { Injectable, inject } from '@angular/core';
import { FirestoreService } from '../services/firestore';
import { Observable } from 'rxjs';
// ✅ Correcto
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  docData,
  query,
  orderBy,
  limit,
  Timestamp
} from '@angular/fire/firestore';

export interface Barber {
  id?: string;
  name: string;
  specialty: string;
  image: string;
  rating: number;
  votes: number;
}

@Injectable({
  providedIn: 'root'
})
export class BarbersService {
  private fs = inject(FirestoreService);
  private path = 'barbers';

  getBarbers(): Observable<Barber[]> {
    return this.fs.getAll<Barber>(this.path);
  }

  addBarber(barber: Omit<Barber, 'id'>) {
    return this.fs.add(this.path, barber);
  }

  updateBarber(id: string, data: Partial<Barber>) {
    return this.fs.update(this.path, id, data);
  }

  deleteBarber(id: string) {
    return this.fs.remove(this.path, id);
  }
}