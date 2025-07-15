import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Experience } from '../../../../core/models/portfolio.model';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-experiences',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule,
    TextareaModule, CalendarModule, TableModule, DialogModule, ConfirmDialogModule
  ],
  template: `
    <div class="section-header">
      <div>
        <h2>Expériences Professionnelles</h2>
        <p>Ajoutez vos expériences de travail</p>
      </div>
      <button pButton label="Ajouter une expérience" icon="pi pi-plus" 
             class="p-button-raised" (click)="showDialog()"></button>
    </div>
    
    <p-table [value]="experiences" styleClass="p-datatable-striped">
      <ng-template pTemplate="header">
        <tr>
          <th>Poste</th>
          <th>Entreprise</th>
          <th>Période</th>
          <th>Lieu</th>
          <th>Actions</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-experience>
        <tr>
          <td>{{ experience.poste }}</td>
          <td>{{ experience.entreprise }}</td>
          <td>{{ formatPeriode(experience.dateDebut, experience.dateFin) }}</td>
          <td>{{ experience.lieu || '-' }}</td>
          <td>
            <button pButton icon="pi pi-pencil" class="p-button-text p-button-sm" 
                   (click)="editExperience(experience)"></button>
            <button pButton icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" 
                   (click)="deleteExperience(experience)"></button>
          </td>
        </tr>
      </ng-template>
    </p-table>
    
    <p-dialog header="{{editMode ? 'Modifier' : 'Ajouter'}} une expérience" 
             [(visible)]="displayDialog" [modal]="true" [style]="{width: '600px'}">
      <form [formGroup]="experienceForm" (ngSubmit)="saveExperience()">
        <div class="form-grid">
          <div class="form-group">
            <label for="poste">Poste *</label>
            <input pInputText id="poste" formControlName="poste" />
          </div>
          
          <div class="form-group">
            <label for="entreprise">Entreprise *</label>
            <input pInputText id="entreprise" formControlName="entreprise" />
          </div>
          
          <div class="form-group">
            <label for="dateDebut">Date de début *</label>
            <p-calendar id="dateDebut" formControlName="dateDebut" [showIcon]="true"></p-calendar>
          </div>
          
          <div class="form-group">
            <label for="dateFin">Date de fin</label>
            <p-calendar id="dateFin" formControlName="dateFin" [showIcon]="true"></p-calendar>
          </div>
          
          <div class="form-group full-width">
            <label for="lieu">Lieu</label>
            <input pInputText id="lieu" formControlName="lieu" placeholder="Ville, Pays" />
          </div>
          
          <div class="form-group full-width">
            <label for="description">Description *</label>
            <textarea pInputTextarea id="description" formControlName="description" 
                     rows="4" placeholder="Décrivez vos missions et réalisations..."></textarea>
          </div>
        </div>
        
        <div class="dialog-actions">
          <button pButton type="button" label="Annuler" class="p-button-text" (click)="hideDialog()"></button>
          <button pButton type="submit" label="Sauvegarder" class="p-button-raised" 
                 [loading]="loading" [disabled]="experienceForm.invalid"></button>
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
export class ExperiencesComponent implements OnInit {
  experiences: Experience[] = [];
  experienceForm: FormGroup;
  displayDialog = false;
  editMode = false;
  currentExperience: Experience | null = null;
  loading = false;
  
  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.experienceForm = this.fb.group({
      poste: ['', Validators.required],
      entreprise: ['', Validators.required],
      description: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: [''],
      lieu: ['']
    });
  }
  
  ngOnInit() {
    this.loadExperiences();
  }
  
  loadExperiences() {
    this.experiences = this.portfolioService.getExperiences();
  }
  
  showDialog() {
    this.editMode = false;
    this.currentExperience = null;
    this.experienceForm.reset();
    this.displayDialog = true;
  }
  
  hideDialog() {
    this.displayDialog = false;
  }
  
  editExperience(experience: Experience) {
    this.editMode = true;
    this.currentExperience = experience;
    this.experienceForm.patchValue({
      ...experience,
      dateDebut: new Date(experience.dateDebut),
      dateFin: experience.dateFin ? new Date(experience.dateFin) : null
    });
    this.displayDialog = true;
  }
  
  saveExperience() {
    if (this.experienceForm.valid) {
      this.loading = true;
      const user = this.authService.getCurrentUser();
      
      const data = {
        ...this.experienceForm.value,
        utilisateurId: user?.id || '1'
      };
      
      const operation = this.editMode && this.currentExperience
        ? this.portfolioService.updateExperience(this.currentExperience.id, data)
        : this.portfolioService.addExperience(data);
      
      operation.subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `Expérience ${this.editMode ? 'modifiée' : 'ajoutée'} avec succès`
          });
          this.loadExperiences();
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
  
  deleteExperience(experience: Experience) {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer l'expérience "${experience.poste}" ?`,
      header: 'Confirmer la suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.portfolioService.deleteExperience(experience.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Expérience supprimée avec succès'
            });
            this.loadExperiences();
          }
        });
      }
    });
  }
  
  formatPeriode(debut: Date, fin?: Date): string {
    const debutStr = new Date(debut).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
    const finStr = fin ? new Date(fin).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }) : 'En cours';
    return `${debutStr} - ${finStr}`;
  }
}