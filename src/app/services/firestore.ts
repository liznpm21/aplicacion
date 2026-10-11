import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
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
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private firestore = inject(Firestore);
  private injector = inject(Injector);

  getAll<T>(path: string): Observable<T[]> {
    return runInInjectionContext(this.injector, () => {
      const ref = collection(this.firestore, path);
      return collectionData(ref, { idField: 'id' }) as Observable<T[]>;
    });
  }

  getRecent<T>(path: string, field: string, max: number): Observable<T[]> {
    return runInInjectionContext(this.injector, () => {
      const ref = collection(this.firestore, path);
      const q = query(ref, orderBy(field, 'desc'), limit(max));
      return collectionData(q, { idField: 'id' }) as Observable<T[]>;
    });
  }

  getById<T>(path: string, id: string): Observable<T> {
    return runInInjectionContext(this.injector, () => {
      const ref = doc(this.firestore, `${path}/${id}`);
      return docData(ref, { idField: 'id' }) as Observable<T>;
    });
  }

  add(path: string, data: any) {
    const ref = collection(this.firestore, path);
    return addDoc(ref, { ...data, createdAt: Timestamp.now() });
  }

  update(path: string, id: string, data: any) {
    const ref = doc(this.firestore, `${path}/${id}`);
    return updateDoc(ref, data);
  }

  remove(path: string, id: string) {
    const ref = doc(this.firestore, `${path}/${id}`);
    return deleteDoc(ref);
  }
}