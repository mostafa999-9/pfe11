import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { AuthService } from '../../../../core/services/auth.service';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-informations-personnelles',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    CalendarModule,
    FileUploadModule
  ],
  template: `
    <div class="section-header">
      <h2>Informations Personnelles</h2>
      <p>Complétez vos informations personnelles pour votre portfolio</p>
    </div>
    
    <form [formGroup]="infoForm" (ngSubmit)="onSubmit()" class="info-form">
      <div class="form-grid">
        <div class="form-group">
          <label for="nom">Nom *</label>
          <input pInputText id="nom" formControlName="nom" placeholder="Votre nom" />
          <small *ngIf="nom?.invalid && nom?.touched" class="p-error">Le nom est requis</small>
        </div>
        
        <div class="form-group">
          <label for="prenom">Prénom *</label>
          <input pInputText id="prenom" formControlName="prenom" placeholder="Votre prénom" />
          <small *ngIf="prenom?.invalid && prenom?.touched" class="p-error">Le prénom est requis</small>
        </div>
        
        <div class="form-group">
          <label for="email">Email *</label>
          <input pInputText id="email" formControlName="email" placeholder="votre@email.com" />
          <small *ngIf="email?.invalid && email?.touched" class="p-error">Email valide requis</small>
        </div>
        
        <div class="form-group">
          <label for="telephone">Téléphone</label>
          <input pInputText id="telephone" formControlName="telephone" placeholder="+33 6 12 34 56 78" />
        </div>
        
        <div class="form-group full-width">
          <label for="adresse">Adresse *</label>
          <input pInputText id="adresse" formControlName="adresse" placeholder="Votre adresse complète" />
          <small *ngIf="adresse?.invalid && adresse?.touched" class="p-error">L'adresse est requise</small>
        </div>
        
        <div class="form-group">
          <label for="dateNaissance">Date de naissance</label>
          <p-calendar id="dateNaissance" formControlName="dateNaissance" [showIcon]="true" dateFormat="dd/mm/yy"></p-calendar>
        </div>
        
        <div class="form-group">
          <label for="nationalite">Nationalité</label>
          <input pInputText id="nationalite" formControlName="nationalite" placeholder="Française" />
        </div>
        
        <div class="form-group full-width">
          <label for="description">Description professionnelle</label>
          <textarea pInputTextarea id="description" formControlName="description" 
                   placeholder="Décrivez-vous en quelques mots..." rows="4"></textarea>
        </div>
        
        <div class="form-group full-width">
          <label>Photo de profil</label>
          <p-fileUpload mode="basic" name="photo" accept="image/*" 
                       [maxFileSize]="1000000" chooseLabel="Choisir une photo"
                       (onSelect)="onPhotoSelect($event)"></p-fileUpload>
          <small class="p-help">Format accepté: JPG, PNG (max 1MB)</small>
        </div>
      </div>
      
      <div class="form-actions">
        <button pButton type="submit" label="Sauvegarder" icon="pi pi-save" 
               class="p-button-raised" [loading]="loading" [disabled]="infoForm.invalid"></button>
      </div>
    </form>
  `,
  styles: [`
    .section-header {
      margin-bottom: 2rem;
    }
    
    .section-header h2 {
      margin-bottom: 0.5rem;
      color: var(--text-color);
    }
    
    .section-header p {
      color: var(--text-color-secondary);
      margin: 0;
    }
    
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
    }
    
    .form-group.full-width {
      grid-column: span 2;
    }
    
    .form-group label {
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: var(--text-color);
    }
    
    .form-group input,
    .form-group textarea {
      width: 100%;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
    }
    
    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
      
      .form-group.full-width {
        grid-column: span 1;
      }
    }
  `]
})
export class InformationsPersonnellesComponent implements OnInit {
  infoForm: FormGroup;
  loading = false;
  
  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.infoForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: [''],
      adresse: ['', Validators.required],
      dateNaissance: [''],
      nationalite: [''],
      description: [''],
      photo: ['']
    });
  }
  
  ngOnInit() {
    this.loadInformations();
  }
  
  loadInformations() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.infoForm.patchValue({
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        adresse: user.adresse
      });
    }
    
    const infos = this.portfolioService.getInformationsPersonnelles();
    if (infos) {
      this.infoForm.patchValue(infos);
    }
  }
  
  onSubmit() {
    if (this.infoForm.valid) {
      this.loading = true;
      const user = this.authService.getCurrentUser();
      
      const data = {
        ...this.infoForm.value,
        utilisateurId: user?.id || '1'
      };
      
      this.portfolioService.updateInformationsPersonnelles(data).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Informations sauvegardées avec succès'
          });
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
  
  onPhotoSelect(event: any) {
    const file = event.files[0];
    if (file) {
      // TODO: Implémenter l'upload de photo
      console.log('Photo sélectionnée:', file);
    }
  }
  
  get nom() { return this.infoForm.get('nom'); }
  get prenom() { return this.infoForm.get('prenom'); }
  get email() { return this.infoForm.get('email'); }
  get adresse() { return this.infoForm.get('adresse'); }
}