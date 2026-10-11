import { Injectable, inject } from '@angular/core';
import { FirestoreService } from './firestore';
import { Observable } from 'rxjs';

export interface Promotion {
  id?: string;
  title: string;
  description: string;
  discount: number;
}

@Injectable({
  providedIn: 'root'
})
export class PromotionsService {
  private fs = inject(FirestoreService);
  private path = 'promotions';

  getPromotions(): Observable<Promotion[]> {
    return this.fs.getAll<Promotion>(this.path);
  }

  addPromotion(promo: Omit<Promotion, 'id'>) {
    return this.fs.add(this.path, promo);
  }
}