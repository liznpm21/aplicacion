import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User
} from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';

export type UserRole = 'admin' | 'client';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private firestore = inject(Firestore);

  constructor(private auth: Auth) {}

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async register(name: string, email: string, password: string, role: UserRole = 'client') {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);

    const userRef = doc(this.firestore, `users/${credential.user.uid}`);
    await setDoc(userRef, {
      name,
      email,
      role,
      createdAt: new Date()
    });

    return credential;
  }

  async getUserRole(uid: string): Promise<UserRole | null> {
    const userRef = doc(this.firestore, `users/${uid}`);
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
      return snapshot.data()['role'] as UserRole;
    }
    return null;
  }

  logout() {
    return signOut(this.auth);
  }

  resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  isLoggedIn(): boolean {
    return this.auth.currentUser !== null;
  }
}