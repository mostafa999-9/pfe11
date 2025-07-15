import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Projet, TypeProjet } from '../../../../core/models/portfolio.model';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-projets',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule,
    TextareaModule, DropdownModule, CalendarModule, ChipsModule,
    TableModule, DialogModule, ConfirmDialogModule
  ],
  template: `
    <div class="section-header">
      <div>
        <h2>Projets</h2>
        <p>Présentez vos réalisations et projets</p>
      </div>
      <button pButton label="Ajouter un projet" icon="pi pi-plus" 
             class="p-button-raised" (click)="showDialog()"></button>
    </div>
    
    <p-table [value]="projets" styleClass="p-datatable-striped">
      <ng-template pTemplate="header">
        <tr>
          <th>Titre</th>
          <th>Type</th>
          <th>Période</th>
          <th>Technologies</th>
          <th>Actions</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-projet>
        <tr>
          <td>{{ projet.titre }}</td>
          <td>{{ getTypeProjetName(projet.typeProjetId) }}</td>
          <td>{{ formatPeriode(projet.dateDebut, projet.dateFin) }}</td>
          <td>
            <span *ngFor="let tech of projet.technologies.slice(0, 3)" 
                  class="tech-tag">{{ tech }}</span>
            <span *ngIf="projet.technologies.length > 3" class="tech-more">
              +{{ projet.technologies.length - 3 }}
            </span>
          </td>
          <td>
            <button pButton icon="pi pi-pencil" class="p-button-text p-button-sm" 
                   (click)="editProjet(projet)"></button>
            <button pButton icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" 
                   (click)="deleteProjet(projet)"></button>
          </td>
        </tr>
      </ng-template>
    </p-table>
    
    <p-dialog header="{{editMode ? 'Modifier' : 'Ajouter'}} un projet" 
             [(visible)]="displayDialog" [modal]="true" [style]="{width: '600px'}">
      <form [formGroup]="projetForm" (ngSubmit)="saveProjet()">
        <div class="form-grid">
          <div class="form-group">
            <label for="titre">Titre *</label>
            <input pInputText id="titre" formControlName="titre" />
          </div>
          
          <div class="form-group">
            <label for="typeProjetId">Type *</label>
            <p-dropdown id="typeProjetId" formControlName="typeProjetId" 
                       [options]="typesProjets" optionLabel="nom" optionValue="id"></p-dropdown>
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
            <label for="description">Description *</label>
            <textarea pInputTextarea id="description" formControlName="description" rows="3"></textarea>
          </div>
          
          <div class="form-group full-width">
            <label for="technologies">Technologies</label>
            <p-chips id="technologies" formControlName="technologies" 
                    placeholder="Appuyez sur Entrée pour ajouter"></p-chips>
          </div>
          
          <div class="form-group">
            <label for="lienDemo">Lien démo</label>
            <input pInputText id="lienDemo" formControlName="lienDemo" placeholder="https://" />
          </div>
          
          <div class="form-group">
            <label for="lienCode">Lien code source</label>
            <input pInputText id="lienCode" formControlName="lienCode" placeholder="https://" />
          </div>
        </div>
        
        <div class="dialog-actions">
          <button pButton type="button" label="Annuler" class="p-button-text" (click)="hideDialog()"></button>
          <button pButton type="submit" label="Sauvegarder" class="p-button-raised" 
                 [loading]="loading" [disabled]="projetForm.invalid"></button>
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
    
    .tech-tag {
      display: inline-block;
      background: var(--primary-color);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      margin-right: 0.25rem;
    }
    
    .tech-more {
      color: var(--text-color-secondary);
      font-size: 0.8rem;
    }
    
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 1rem;
    }
  `]
})
export class ProjetsComponent implements OnInit {
  projets: Projet[] = [];
  typesProjets: TypeProjet[] = [];
  projetForm: FormGroup;
  displayDialog = false;
  editMode = false;
  currentProjet: Projet | null = null;
  loading = false;
  
  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.projetForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: [''],
      technologies: [[]],
      lienDemo: [''],
      lienCode: [''],
      typeProjetId: ['', Validators.required]
    });
  }
  
  ngOnInit() {
    this.loadProjets();
    this.loadTypesProjets();
  }
  
  loadProjets() {
    this.projets = this.portfolioService.getProjets();
  }
  
  loadTypesProjets() {
    this.portfolioService.getTypesProjets().subscribe(types => {
      this.typesProjets = types;
    });
  }
  
  showDialog() {
    this.editMode = false;
    this.currentProjet = null;
    this.projetForm.reset();
    this.displayDialog = true;
  }
  
  hideDialog() {
    this.displayDialog = false;
  }
  
  editProjet(projet: Projet) {
    this.editMode = true;
    this.currentProjet = projet;
    this.projetForm.patchValue({
      ...projet,
      dateDebut: new Date(projet.dateDebut),
      dateFin: projet.dateFin ? new Date(projet.dateFin) : null
    });
    this.displayDialog = true;
  }
  
  saveProjet() {
    if (this.projetForm.valid) {
      this.loading = true;
      const user = this.authService.getCurrentUser();
      
      const data = {
        ...this.projetForm.value,
        utilisateurId: user?.id || '1'
      };
      
      const operation = this.editMode && this.currentProjet
        ? this.portfolioService.updateProjet(this.currentProjet.id, data)
        : this.portfolioService.addProjet(data);
      
      operation.subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `Projet ${this.editMode ? 'modifié' : 'ajouté'} avec succès`
          });
          this.loadProjets();
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
  
  deleteProjet(projet: Projet) {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer le projet "${projet.titre}" ?`,
      header: 'Confirmer la suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.portfolioService.deleteProjet(projet.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Projet supprimé avec succès'
            });
            this.loadProjets();
          }
        });
      }
    });
  }
  
  getTypeProjetName(typeId: string): string {
    return this.typesProjets.find(t => t.id === typeId)?.nom || '';
  }
  
  formatPeriode(debut: Date, fin?: Date): string {
    const debutStr = new Date(debut).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
    const finStr = fin ? new Date(fin).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }) : 'En cours';
    return `${debutStr} - ${finStr}`;
  }
}