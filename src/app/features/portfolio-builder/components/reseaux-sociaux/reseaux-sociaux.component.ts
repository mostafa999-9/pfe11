import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ReseauSocial } from '../../../../core/models/portfolio.model';

@Component({
  selector: 'app-reseaux-sociaux',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule,
    DropdownModule, TableModule, DialogModule, ConfirmDialogModule
  ],
  template: `
    <div class="section-header">
      <div>
        <h2>Réseaux Sociaux</h2>
        <p>Ajoutez vos profils sur les réseaux sociaux</p>
      </div>
      <button pButton label="Ajouter un réseau" icon="pi pi-plus" 
             class="p-button-raised" (click)="showDialog()"></button>
    </div>
    
    <p-table [value]="reseauxSociaux" styleClass="p-datatable-striped">
      <ng-template pTemplate="header">
        <tr>
          <th>Réseau</th>
          <th>URL</th>
          <th>Actions</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-reseau>
        <tr>
          <td>
            <div class="reseau-info">
              <i [class]="getReseauIcon(reseau.nom)"></i>
              {{ reseau.nom }}
            </div>
          </td>
          <td>
            <a [href]="reseau.url" target="_blank" class="reseau-link">
              {{ reseau.url }}
              <i class="pi pi-external-link"></i>
            </a>
          </td>
          <td>
            <button pButton icon="pi pi-pencil" class="p-button-text p-button-sm" 
                   (click)="editReseau(reseau)"></button>
            <button pButton icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" 
                   (click)="deleteReseau(reseau)"></button>
          </td>
        </tr>
      </ng-template>
    </p-table>
    
    <p-dialog header="{{editMode ? 'Modifier' : 'Ajouter'}} un réseau social" 
             [(visible)]="displayDialog" [modal]="true" [style]="{width: '500px'}">
      <form [formGroup]="reseauForm" (ngSubmit)="saveReseau()">
        <div class="form-grid">
          <div class="form-group">
            <label for="nom">Réseau social *</label>
            <p-dropdown id="nom" formControlName="nom" 
                       [options]="reseauxDisponibles" optionLabel="label" optionValue="value"
                       placeholder="Sélectionner un réseau"></p-dropdown>
          </div>
          
          <div class="form-group">
            <label for="url">URL du profil *</label>
            <input pInputText id="url" formControlName="url" 
                   placeholder="https://..." />
          </div>
        </div>
        
        <div class="dialog-actions">
          <button pButton type="button" label="Annuler" class="p-button-text" (click)="hideDialog()"></button>
          <button pButton type="submit" label="Sauvegarder" class="p-button-raised" 
                 [loading]="loading" [disabled]="reseauForm.invalid"></button>
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
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }
    
    .reseau-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .reseau-info i {
      font-size: 1.2rem;
    }
    
    .reseau-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--primary-color);
      text-decoration: none;
    }
    
    .reseau-link:hover {
      text-decoration: underline;
    }
    
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 1rem;
    }
  `]
})
export class ReseauxSociauxComponent implements OnInit {
  reseauxSociaux: ReseauSocial[] = [];
  reseauForm: FormGroup;
  displayDialog = false;
  editMode = false;
  currentReseau: ReseauSocial | null = null;
  loading = false;
  
  reseauxDisponibles = [
    { label: 'LinkedIn', value: 'LinkedIn' },
    { label: 'GitHub', value: 'GitHub' },
    { label: 'Twitter', value: 'Twitter' },
    { label: 'Instagram', value: 'Instagram' },
    { label: 'Facebook', value: 'Facebook' },
    { label: 'Behance', value: 'Behance' },
    { label: 'Dribbble', value: 'Dribbble' },
    { label: 'YouTube', value: 'YouTube' }
  ];
  
  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.reseauForm = this.fb.group({
      nom: ['', Validators.required],
      url: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
  }
  
  ngOnInit() {
    this.loadReseauxSociaux();
  }
  
  loadReseauxSociaux() {
    this.reseauxSociaux = this.portfolioService.getReseauxSociaux();
  }
  
  showDialog() {
    this.editMode = false;
    this.currentReseau = null;
    this.reseauForm.reset();
    this.displayDialog = true;
  }
  
  hideDialog() {
    this.displayDialog = false;
  }
  
  editReseau(reseau: ReseauSocial) {
    this.editMode = true;
    this.currentReseau = reseau;
    this.reseauForm.patchValue(reseau);
    this.displayDialog = true;
  }
  
  saveReseau() {
    if (this.reseauForm.valid) {
      this.loading = true;
      const user = this.authService.getCurrentUser();
      
      const data = {
        ...this.reseauForm.value,
        utilisateurId: user?.id || '1',
        icone: this.getReseauIcon(this.reseauForm.value.nom)
      };
      
      const operation = this.editMode && this.currentReseau
        ? this.portfolioService.updateReseauSocial(this.currentReseau.id, data)
        : this.portfolioService.addReseauSocial(data);
      
      operation.subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `Réseau social ${this.editMode ? 'modifié' : 'ajouté'} avec succès`
          });
          this.loadReseauxSociaux();
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
  
  deleteReseau(reseau: ReseauSocial) {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer le réseau "${reseau.nom}" ?`,
      header: 'Confirmer la suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.portfolioService.deleteReseauSocial(reseau.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Réseau social supprimé avec succès'
            });
            this.loadReseauxSociaux();
          }
        });
      }
    });
  }
  
  getReseauIcon(nom: string): string {
    const icons: { [key: string]: string } = {
      'LinkedIn': 'pi pi-linkedin',
      'GitHub': 'pi pi-github',
      'Twitter': 'pi pi-twitter',
      'Instagram': 'pi pi-instagram',
      'Facebook': 'pi pi-facebook',
      'Behance': 'pi pi-palette',
      'Dribbble': 'pi pi-circle',
      'YouTube': 'pi pi-video'
    };
    return icons[nom] || 'pi pi-link';
  }
}