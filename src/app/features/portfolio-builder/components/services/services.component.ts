import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Service } from '../../../../core/models/portfolio.model';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule,
    TextareaModule, InputNumberModule, TableModule, DialogModule, ConfirmDialogModule
  ],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  services: Service[] = [];
  serviceForm: FormGroup;
  displayDialog = false;
  editMode = false;
  currentService: Service | null = null;
  loading = false;
  
  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.serviceForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      prix: [''],
      duree: ['']
    });
  }
  
  ngOnInit() {
    this.loadServices();
  }
  
  loadServices() {
    this.services = this.portfolioService.getServices();
  }
  
  showDialog() {
    this.editMode = false;
    this.currentService = null;
    this.serviceForm.reset();
    this.displayDialog = true;
  }
  
  hideDialog() {
    this.displayDialog = false;
  }
  
  editService(service: Service) {
    this.editMode = true;
    this.currentService = service;
    this.serviceForm.patchValue(service);
    this.displayDialog = true;
  }
  
  saveService() {
    if (this.serviceForm.valid) {
      this.loading = true;
      const user = this.authService.getCurrentUser();
      
      const data = {
        ...this.serviceForm.value,
        utilisateurId: user?.id || '1'
      };
      
      const operation = this.editMode && this.currentService
        ? this.portfolioService.updateService(this.currentService.id, data)
        : this.portfolioService.addService(data);
      
      operation.subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `Service ${this.editMode ? 'modifié' : 'ajouté'} avec succès`
          });
          this.loadServices();
          this.hideDialog();
          this.loading = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la sauvegarde'
          });
          this.loading = false;
        }
      });
    }
  }
  
  deleteService(service: Service) {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer le service "${service.nom}" ?`,
      header: 'Confirmer la suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.portfolioService.deleteService(service.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Service supprimé avec succès'
            });
            this.loadServices();
          }
        });
      }
    });
  }
  
  truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}