import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'booking',
    loadComponent: () => import('./pages/booking/booking.page').then( m => m.BookingPage)
  },
  {
    path: 'confirmation',
    loadComponent: () => import('./pages/confirmation/confirmation.page').then( m => m.ConfirmationPage)
  },
  {
    path: 'services',
    loadComponent: () => import('./pages/services/services.page').then( m => m.ServicesPage)
  },
  {
    path: 'barber',
    loadComponent: () => import('./pages/barber/barber.page').then( m => m.BarberPage)
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.page').then( m => m.AdminPage),
    canActivate: [adminGuard]
  },
  {
    path: 'staff',
    loadComponent: () => import('./pages/staff/staff.page').then( m => m.StaffPage),
    canActivate: [adminGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
];