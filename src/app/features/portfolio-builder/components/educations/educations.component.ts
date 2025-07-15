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
import { Education } from '../../../../core/models/portfolio.model';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-educations',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule,
    TextareaModule, CalendarModule, TableModule, DialogModule, ConfirmDialogModule
  ],
  template: `
    <div class="section-header">
      <div>
        <h2>Formation & Éducation</h2>
        <p>Ajoutez vos diplômes et formations</p>
      </div>
      <button pButton label="Ajouter une formation" icon="pi pi-plus" 
             class="p-button-raised" (click)="showDialog()"></button>
    </div>
    
    <p-table [value]="educations" styleClass="p-datatable-striped">
      <ng-template pTemplate="header">
        <tr>
          <th>Diplôme</th>
          <th>Institution</th>
          <th>Domaine</th>
          <th>Période</th>
          <th>Actions</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-education>
        <tr>
          <td>{{ education.diplome }}</td>
          <td>{{ education.institution }}</td>
          <td>{{ education.domaine }}</td>
          <td>{{ formatPeriode(education.dateDebut, education.dateFin) }}</td>
          <td>
            <button pButton icon="pi pi-pencil" class="p-button-text p-button-sm" 
                   (click)="editEducation(education)"></button>
            <button pButton icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" 
                   (click)="deleteEducation(education)"></button>
          </td>
        </tr>
      </ng-template>
    </p-table>
    
    <p-dialog header="{{editMode ? 'Modifier' : 'Ajouter'}} une formation" 
             [(visible)]="displayDialog" [modal]="true" [style]="{width: '600px'}">
      <form [formGroup]="educationForm" (ngSubmit)="saveEducation()">
        <div class="form-grid">
          <div class="form-group">
            <label for="diplome">Diplôme *</label>
            <input pInputText id="diplome" formControlName="diplome" 
                   placeholder="Ex: Master en Informatique" />
          </div>
          
          <div class="form-group">
            <label for="institution">Institution *</label>
            <input pInputText id="institution" formControlName="institution" 
                   placeholder="Ex: Université de Paris" />
          </div>
          
          <div class="form-group full-width">
            <label for="domaine">Domaine d'étude *</label>
            <input pInputText id="domaine" formControlName="domaine" 
                   placeholder="Ex: Informatique, Génie logiciel" />
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
            <label for="description">Description</label>
            <textarea pInputTextarea id="description" formControlName="description" 
                     rows="3" placeholder="Spécialisations, mentions, projets..."></textarea>
          </div>
        </div>
        
        <div class="dialog-actions">
          <button pButton type="button" label="Annuler" class="p-button-text" (click)="hideDialog()"></button>
          <button pButton type="submit" label="Sauvegarder" class="p-button-raised" 
                 [loading]="loading" [disabled]="educationForm.invalid"></button>
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
export class EducationsComponent implements OnInit {
  educations: Education[] = [];
  educationForm: FormGroup;
  displayDialog = false;
  editMode = false;
  currentEducation: Education | null = null;
  loading = false;
  
  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.educationForm = this.fb.group({
      diplome: ['', Validators.required],
      institution: ['', Validators.required],
      domaine: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: [''],
      description: ['']
    });
  }
  
  ngOnInit() {
    this.loadEducations();
  }
  
  loadEducations() {
    this.educations = this.portfolioService.getEducations();
  }
  
  showDialog() {
    this.editMode = false;
    this.currentEducation = null;
    this.educationForm.reset();
    this.displayDialog = true;
  }
  
  hideDialog() {
    this.displayDialog = false;
  }
  
  editEducation(education: Education) {
    this.editMode = true;
    this.currentEducation = education;
    this.educationForm.patchValue({
      ...education,
      dateDebut: new Date(education.dateDebut),
      dateFin: education.dateFin ? new Date(education.dateFin) : null
    });
    this.displayDialog = true;
  }
  
  saveEducation() {
    if (this.educationForm.valid) {
      this.loading = true;
      const user = this.authService.getCurrentUser();
      
      const data = {
        ...this.educationForm.value,
        utilisateurId: user?.id || '1'
      };
      
      const operation = this.editMode && this.currentEducation
        ? this.portfolioService.updateEducation(this.currentEducation.id, data)
        : this.portfolioService.addEducation(data);
      
      operation.subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `Formation ${this.editMode ? 'modifiée' : 'ajoutée'} avec succès`
          });
          this.loadEducations();
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
  
  deleteEducation(education: Education) {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer la formation "${education.diplome}" ?`,
      header: 'Confirmer la suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.portfolioService.deleteEducation(education.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Formation supprimée avec succès'
            });
            this.loadEducations();
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