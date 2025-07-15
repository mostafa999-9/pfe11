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
  template: `
    <div class="section-header">
      <div>
        <h2>Services</h2>
        <p>Présentez les services que vous proposez</p>
      </div>
      <button pButton label="Ajouter un service" icon="pi pi-plus" 
             class="p-button-raised" (click)="showDialog()"></button>
    </div>
    
    <p-table [value]="services" styleClass="p-datatable-striped">
      <ng-template pTemplate="header">
        <tr>
          <th>Nom</th>
          <th>Description</th>
          <th>Prix</th>
          <th>Durée</th>
          <th>Actions</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-service>
        <tr>
          <td>{{ service.nom }}</td>
          <td>{{ truncateText(service.description, 80) }}</td>
          <td>{{ service.prix ? (service.prix + ' €') : 'Sur devis' }}</td>
          <td>{{ service.duree || '-' }}</td>
          <td>
            <button pButton icon="pi pi-pencil" class="p-button-text p-button-sm" 
                   (click)="editService(service)"></button>
            <button pButton icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" 
                   (click)="deleteService(service)"></button>
          </td>
        </tr>
      </ng-template>
    </p-table>
    
    <p-dialog header="{{editMode ? 'Modifier' : 'Ajouter'}} un service" 
             [(visible)]="displayDialog" [modal]="true" [style]="{width: '600px'}">
      <form [formGroup]="serviceForm" (ngSubmit)="saveService()">
        <div class="form-grid">
          <div class="form-group full-width">
            <label for="nom">Nom du service *</label>
            <input pInputText id="nom" formControlName="nom" 
                   placeholder="Ex: Développement d'application web" />
          </div>
          
          <div class="form-group full-width">
            <label for="description">Description *</label>
            <textarea pInputTextarea id="description" formControlName="description" 
                     rows="4" placeholder="Décrivez votre service en détail..."></textarea>
          </div>
          
          <div class="form-group">
            <label for="prix">Prix (€)</label>
            <p-inputNumber id="prix" formControlName="prix" 
                          mode="currency" currency="EUR" locale="fr-FR"
                          placeholder="Laisser vide pour 'Sur devis'"></p-inputNumber>
          </div>
          
          <div class="form-group">
            <label for="duree">Durée estimée</label>
            <input pInputText id="duree" formControlName="duree" 
                   placeholder="Ex: 2-3 semaines, 1 mois..." />
          </div>
        </div>
        
        <div class="dialog-actions">
          <button pButton type="button" label="Annuler" class="p-button-text" (click)="hideDialog()"></button>
          <button pButton type="submit" label="Sauvegarder" class="p-button-raised" 
                 [loading]="loading" [disabled]="serviceForm.invalid"></button>
        </div>
      </form>
    </p-dialog>
    
    <p-confirmDialog></p-confirmDialog>
  `,
  styles: [`
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
    }
    
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    
    .form-group.full-width {
      grid-column: span 2;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }
    
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 1rem;
    }
  `]
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