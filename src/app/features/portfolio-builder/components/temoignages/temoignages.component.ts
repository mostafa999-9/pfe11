import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Temoignage } from '../../../../core/models/portfolio.model';
import { TextareaModule } from 'primeng/textarea';
@Component({
  selector: 'app-temoignages',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule,
    TextareaModule, TableModule, DialogModule, ConfirmDialogModule, FileUploadModule
  ],
  template: `
    <div class="section-header">
      <div>
        <h2>Témoignages</h2>
        <p>Collectez les avis de vos clients et collaborateurs</p>
      </div>
      <button pButton label="Ajouter un témoignage" icon="pi pi-plus" 
             class="p-button-raised" (click)="showDialog()"></button>
    </div>
    
    <p-table [value]="temoignages" styleClass="p-datatable-striped">
      <ng-template pTemplate="header">
        <tr>
          <th>Auteur</th>
          <th>Poste</th>
          <th>Entreprise</th>
          <th>Contenu</th>
          <th>Actions</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-temoignage>
        <tr>
          <td>{{ temoignage.auteur }}</td>
          <td>{{ temoignage.poste }}</td>
          <td>{{ temoignage.entreprise }}</td>
          <td>{{ truncateText(temoignage.contenu, 100) }}</td>
          <td>
            <button pButton icon="pi pi-pencil" class="p-button-text p-button-sm" 
                   (click)="editTemoignage(temoignage)"></button>
            <button pButton icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" 
                   (click)="deleteTemoignage(temoignage)"></button>
          </td>
        </tr>
      </ng-template>
    </p-table>
    
    <p-dialog header="{{editMode ? 'Modifier' : 'Ajouter'}} un témoignage" 
             [(visible)]="displayDialog" [modal]="true" [style]="{width: '600px'}">
      <form [formGroup]="temoignageForm" (ngSubmit)="saveTemoignage()">
        <div class="form-grid">
          <div class="form-group">
            <label for="auteur">Nom de l'auteur *</label>
            <input pInputText id="auteur" formControlName="auteur" />
          </div>
          
          <div class="form-group">
            <label for="poste">Poste *</label>
            <input pInputText id="poste" formControlName="poste" />
          </div>
          
          <div class="form-group full-width">
            <label for="entreprise">Entreprise *</label>
            <input pInputText id="entreprise" formControlName="entreprise" />
          </div>
          
          <div class="form-group full-width">
            <label for="contenu">Témoignage *</label>
            <textarea pInputTextarea id="contenu" formControlName="contenu" 
                     rows="4" placeholder="Le témoignage complet..."></textarea>
          </div>
          
          <div class="form-group full-width">
            <label>Photo de l'auteur</label>
            <p-fileUpload mode="basic" name="photo" accept="image/*" 
                         [maxFileSize]="1000000" chooseLabel="Choisir une photo"
                         (onSelect)="onPhotoSelect($event)"></p-fileUpload>
            <small class="p-help">Format accepté: JPG, PNG (max 1MB)</small>
          </div>
        </div>
        
        <div class="dialog-actions">
          <button pButton type="button" label="Annuler" class="p-button-text" (click)="hideDialog()"></button>
          <button pButton type="submit" label="Sauvegarder" class="p-button-raised" 
                 [loading]="loading" [disabled]="temoignageForm.invalid"></button>
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
export class TemoignagesComponent implements OnInit {
  temoignages: Temoignage[] = [];
  temoignageForm: FormGroup;
  displayDialog = false;
  editMode = false;
  currentTemoignage: Temoignage | null = null;
  loading = false;
  
  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.temoignageForm = this.fb.group({
      auteur: ['', Validators.required],
      poste: ['', Validators.required],
      entreprise: ['', Validators.required],
      contenu: ['', Validators.required],
      photo: ['']
    });
  }
  
  ngOnInit() {
    this.loadTemoignages();
  }
  
  loadTemoignages() {
    this.temoignages = this.portfolioService.getTemoignages();
  }
  
  showDialog() {
    this.editMode = false;
    this.currentTemoignage = null;
    this.temoignageForm.reset();
    this.displayDialog = true;
  }
  
  hideDialog() {
    this.displayDialog = false;
  }
  
  editTemoignage(temoignage: Temoignage) {
    this.editMode = true;
    this.currentTemoignage = temoignage;
    this.temoignageForm.patchValue(temoignage);
    this.displayDialog = true;
  }
  
  saveTemoignage() {
    if (this.temoignageForm.valid) {
      this.loading = true;
      const user = this.authService.getCurrentUser();
      
      const data = {
        ...this.temoignageForm.value,
        utilisateurId: user?.id || '1',
        dateCreation: new Date()
      };
      
      const operation = this.editMode && this.currentTemoignage
        ? this.portfolioService.updateTemoignage(this.currentTemoignage.id, data)
        : this.portfolioService.addTemoignage(data);
      
      operation.subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `Témoignage ${this.editMode ? 'modifié' : 'ajouté'} avec succès`
          });
          this.loadTemoignages();
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
  
  deleteTemoignage(temoignage: Temoignage) {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer le témoignage de "${temoignage.auteur}" ?`,
      header: 'Confirmer la suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.portfolioService.deleteTemoignage(temoignage.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Témoignage supprimé avec succès'
            });
            this.loadTemoignages();
          }
        });
      }
    });
  }
  
  onPhotoSelect(event: any) {
    const file = event.files[0];
    if (file) {
      // TODO: Implémenter l'upload de photo
      console.log('Photo sélectionnée:', file);
    }
  }
  
  truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}