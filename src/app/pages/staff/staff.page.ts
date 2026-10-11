import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
  IonFab,
  IonFabButton,
  IonAvatar,
  IonFooter,
  IonModal,
  IonItem,
  IonLabel,
  IonInput,
  IonList
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  personOutline,
  createOutline,
  trashOutline,
  add,
  star,
  peopleOutline,
  homeOutline,
  settingsOutline,
  close,
  cameraOutline,
  logOutOutline,
  businessOutline
} from 'ionicons/icons';

import { BarbersService, Barber } from '../../services/barbers';
import { StorageService } from '../../services/storage';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.page.html',
  styleUrls: ['./staff.page.scss'],
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
    IonFab,
    IonFabButton,
    IonAvatar,
    IonFooter,
    IonModal,
    IonItem,
    IonLabel,
    IonInput,
    IonList
  ]
})
export class StaffPage implements OnInit {

  staff: Barber[] = [];

  isFormModalOpen = false;
  isSettingsModalOpen = false;
  isEditing = false;
  isUploading = false;

  form = { name: '', specialty: '', image: '' };
  editingId: string | null = null;

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private barbersService: BarbersService,
    private storageService: StorageService,
    private router: Router
  ) {
    addIcons({
      personOutline,
      createOutline,
      trashOutline,
      add,
      star,
      peopleOutline,
      homeOutline,
      settingsOutline,
      close,
      cameraOutline,
      logOutOutline,
      businessOutline
    });
  }

  ngOnInit() {
    this.barbersService.getBarbers().subscribe(staff => {
      this.staff = staff;
    });
  }

  // ---------- Navegación ----------

  goToHome() {
    this.router.navigate(['/admin']);
  }

  openSettingsModal() {
    this.isSettingsModalOpen = true;
  }

  closeSettingsModal() {
    this.isSettingsModalOpen = false;
  }

  // ---------- Crear ----------

  openNewModal() {
    this.isEditing = false;
    this.editingId = null;
    this.form = { name: '', specialty: '', image: '' };
    this.selectedFile = null;
    this.previewUrl = null;
    this.isFormModalOpen = true;
  }

  // ---------- Editar ----------

  openEditModal(employee: Barber) {
    this.isEditing = true;
    this.editingId = employee.id || null;
    this.form = {
      name: employee.name,
      specialty: employee.specialty,
      image: employee.image
    };
    this.selectedFile = null;
    this.previewUrl = employee.image || null;
    this.isFormModalOpen = true;
  }

  closeFormModal() {
    this.isFormModalOpen = false;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.previewUrl = URL.createObjectURL(this.selectedFile);
    }
  }

  async save() {
    if (!this.form.name || !this.form.specialty) {
      alert('Completa nombre y especialidad');
      return;
    }

    try {
      this.isUploading = true;

      let imageUrl = this.form.image || 'assets/barbers/default.jpg';

      if (this.selectedFile) {
        imageUrl = await this.storageService.uploadFile(this.selectedFile, 'barbers');
      }

      if (this.isEditing && this.editingId) {
        await this.barbersService.updateBarber(this.editingId, {
          name: this.form.name,
          specialty: this.form.specialty,
          image: imageUrl
        });
      } else {
        await this.barbersService.addBarber({
          name: this.form.name,
          specialty: this.form.specialty,
          image: imageUrl,
          rating: 5,
          votes: 0
        });
      }

      this.isUploading = false;
      this.isFormModalOpen = false;

    } catch (error) {
      this.isUploading = false;
      console.error(error);
      alert('No se pudo guardar el empleado');
    }
  }

  async remove(employee: Barber) {
    if (!employee.id) return;

    const confirmDelete = confirm(`¿Eliminar a ${employee.name}?`);
    if (!confirmDelete) return;

    try {
      await this.barbersService.deleteBarber(employee.id);
    } catch (error) {
      console.error(error);
      alert('No se pudo eliminar el empleado');
    }
  }

}