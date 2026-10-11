import { Injectable, inject } from '@angular/core';
import { FirestoreService } from './firestore';
import { Observable } from 'rxjs';

export interface ServiceItem {
  id?: string;
  name: string;
  description: string;
  price: number;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServicesCatalogService {
  private fs = inject(FirestoreService);
  private path = 'services';

  getServices(): Observable<ServiceItem[]> {
    return this.fs.getAll<ServiceItem>(this.path);
  }

  addService(service: Omit<ServiceItem, 'id'>) {
    return this.fs.add(this.path, service);
  }
  deleteService(id: string) {
  return this.fs.remove(this.path, id);
}
}