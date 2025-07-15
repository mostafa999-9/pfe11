import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { SliderModule } from 'primeng/slider';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Competence, TypeCompetence } from '../../../../core/models/portfolio.model';

@Component({
  selector: 'app-competences',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    DataViewModule,
    DialogModule,
    ConfirmDialogModule,
    TagModule,
    SliderModule
  ],
  template: `
    <div class="section-header">
      <h2>Compétences</h2>
      <p>Gérez vos compétences techniques et comportementales</p>
      <button pButton label="Ajouter une compétence" icon="pi pi-plus" 
             class="p-button-raised" (click)="showDialog()"></button>
    </div>
    
    <p-dataView [value]="competences" layout="grid">
      <ng-template pTemplate="grid" let-competence>
        <div class="col-12 md:col-6 lg:col-4 p-2">
          <div class="competence-card">
            <div class="competence-header">
              <h4>{{ competence.nom }}</h4>
              <div class="competence-actions">
                <button pButton icon="pi pi-pencil" class="p-button-text p-button-sm" 
                       (click)="editCompetence(competence)" pTooltip="Modifier"></button>
                <button pButton icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" 
                       (click)="deleteCompetence(competence)" pTooltip="Supprimer"></button>
              </div>
            </div>
            <div class="competence-type">
              <small>{{ getTypeCompetenceName(competence.typeCompetenceId) }}</small>
            </div>
            <div class="competence-niveau">
              <div class="niveau-label">
                <span>Niveau: </span>
                <p-tag [value]="getNiveauLabel(competence.niveau)" 
                       [severity]="getNiveauSeverity(competence.niveau)"></p-tag>
              </div>
              <div class="niveau-bar">
                <div class="niveau-progress" [style.width.%]="getNiveauPercentage(competence.niveau)"></div>
              </div>
            </div>
          </div>
        </div>
      </ng-template>
      <ng-template pTemplate="empty">
        <div class="empty-state">
          <i class="pi pi-star" style="font-size: 3rem; color: #ccc;"></i>
          <h3>Aucune compétence ajoutée</h3>
          <p>Commencez par ajouter vos compétences professionnelles</p>
        </div>
      </ng-template>
    </p-dataView>
    
    <p-dialog header="{{editMode ? 'Modifier' : 'Ajouter'}} une compétence" 
             [(visible)]="displayDialog" [modal]="true" [style]="{width: '450px'}">
      <form [formGroup]="competenceForm" (ngSubmit)="saveCompetence()">
        <div class="form-group">
          <label for="nom">Nom de la compétence *</label>
          <input pInputText id="nom" formControlName="nom" placeholder="Ex: Angular, JavaScript..." />
          <small *ngIf="nom?.invalid && nom?.touched" class="p-error">Le nom est requis</small>
        </div>
        
        <div class="form-group">
          <label for="typeCompetenceId">Type *</label>
          <p-select id="typeCompetenceId" formControlName="typeCompetenceId" 
                   [options]="typesCompetences" optionLabel="nom" optionValue="id"
                   placeholder="Sélectionner un type" class="w-full"></p-select>
          <small *ngIf="typeCompetenceId?.invalid && typeCompetenceId?.touched" class="p-error">Le type est requis</small>
        </div>
        
        <div class="form-group">
          <label for="niveau">Niveau * ({{ getNiveauLabel(niveauValue) }})</label>
          <p-slider formControlName="niveau" [min]="1" [max]="4" [step]="1" class="w-full"></p-slider>
          <div class="niveau-labels">
            <span>Débutant</span>
            <span>Intermédiaire</span>
            <span>Avancé</span>
            <span>Expert</span>
          </div>
          <small *ngIf="niveau?.invalid && niveau?.touched" class="p-error">Le niveau est requis</small>
        </div>
        
        <div class="dialog-actions">
          <button pButton type="button" label="Annuler" class="p-button-text" 
                 (click)="hideDialog()"></button>
          <button pButton type="submit" label="Sauvegarder" class="p-button-raised" 
                 [loading]="loading" [disabled]="competenceForm.invalid"></button>
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
    
    .section-header div h2 {
      margin-bottom: 0.5rem;
      color: var(--text-color);
    }
    
    .section-header div p {
      color: var(--text-color-secondary);
      margin: 0;
    }
    
    .competence-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.5rem;
      height: 100%;
      transition: all 0.3s ease;
    }
    
    .competence-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }
    
    .competence-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.5rem;
    }
    
    .competence-header h4 {
      margin: 0;
      color: var(--text-color);
      font-size: 1.1rem;
    }
    
    .competence-actions {
      display: flex;
      gap: 0.25rem;
    }
    
    .competence-type {
      margin-bottom: 1rem;
    }
    
    .competence-type small {
      color: var(--text-color-secondary);
      background: #f0f0f0;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.8rem;
    }
    
    .competence-niveau {
      margin-top: 1rem;
    }
    
    .niveau-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    
    .niveau-bar {
      width: 100%;
      height: 6px;
      background: #e0e0e0;
      border-radius: 3px;
      overflow: hidden;
    }
    
    .niveau-progress {
      height: 100%;
      background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
      transition: width 0.3s ease;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: var(--text-color);
    }
    
    .niveau-labels {
      display: flex;
      justify-content: space-between;
      margin-top: 0.5rem;
      font-size: 0.8rem;
      color: var(--text-color-secondary);
    }
    
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 1rem;
    }
    
    .empty-state {
      text-align: center;
      padding: 3rem;
      color: var(--text-color-secondary);
    }
    
    .empty-state h3 {
      margin: 1rem 0 0.5rem 0;
    }
    
    .empty-state p {
      margin: 0;
    }
    
    @media (max-width: 768px) {
      .section-header {
        flex-direction: column;
        gap: 1rem;
      }
    }
  `]
})
export class CompetencesComponent implements OnInit {
  competences: Competence[] = [];
  typesCompetences: TypeCompetence[] = [];
  competenceForm: FormGroup;
  displayDialog = false;
  editMode = false;
  currentCompetence: Competence | null = null;
  loading = false;
  niveauValue = 1;
  
  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.competenceForm = this.fb.group({
      nom: ['', Validators.required],
      typeCompetenceId: ['', Validators.required],
      niveau: [1, [Validators.required, Validators.min(1), Validators.max(4)]]
    });

    // Écouter les changements du niveau pour l'affichage
    this.competenceForm.get('niveau')?.valueChanges.subscribe(value => {
      this.niveauValue = value;
    });
  }
  
  ngOnInit() {
    this.loadCompetences();
    this.loadTypesCompetences();
  }
  
  loadCompetences() {
    this.competences = this.portfolioService.getCompetences();
  }
  
  loadTypesCompetences() {
    this.portfolioService.getTypesCompetences().subscribe(types => {
      this.typesCompetences = types;
    });
  }
  
  showDialog() {
    this.editMode = false;
    this.currentCompetence = null;
    this.competenceForm.reset();
    this.competenceForm.patchValue({ niveau: 1 });
    this.niveauValue = 1;
    this.displayDialog = true;
  }
  
  hideDialog() {
    this.displayDialog = false;
    this.competenceForm.reset();
  }
  
  editCompetence(competence: Competence) {
    this.editMode = true;
    this.currentCompetence = competence;
    const niveauNumeric = this.convertNiveauToNumeric(competence.niveau);
    this.competenceForm.patchValue({
      ...competence,
      niveau: niveauNumeric
    });
    this.niveauValue = niveauNumeric;
    this.displayDialog = true;
  }
  
  saveCompetence() {
    if (this.competenceForm.valid) {
      this.loading = true;
      const user = this.authService.getCurrentUser();
      
      const formValue = this.competenceForm.value;
      const data = {
        ...formValue,
        niveau: this.convertNumericToNiveau(formValue.niveau),
        utilisateurId: user?.id || '1'
      };
      
      const operation = this.editMode && this.currentCompetence
        ? this.portfolioService.updateCompetence(this.currentCompetence.id, data)
        : this.portfolioService.addCompetence(data);
      
      operation.subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `Compétence ${this.editMode ? 'modifiée' : 'ajoutée'} avec succès`
          });
          this.loadCompetences();
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
  
  deleteCompetence(competence: Competence) {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer la compétence "${competence.nom}" ?`,
      header: 'Confirmer la suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.portfolioService.deleteCompetence(competence.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Compétence supprimée avec succès'
            });
            this.loadCompetences();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la suppression'
            });
          }
        });
      }
    });
  }
  
  getTypeCompetenceName(typeId: string): string {
    const type = this.typesCompetences.find(t => t.id === typeId);
    return type?.nom || '';
  }
  
  convertNiveauToNumeric(niveau: string): number {
    switch (niveau) {
      case 'debutant': return 1;
      case 'intermediaire': return 2;
      case 'avance': return 3;
      case 'expert': return 4;
      default: return 1;
    }
  }
  
  convertNumericToNiveau(numeric: number): 'debutant' | 'intermediaire' | 'avance' | 'expert' {
    switch (numeric) {
      case 1: return 'debutant';
      case 2: return 'intermediaire';
      case 3: return 'avance';
      case 4: return 'expert';
      default: return 'debutant';
    }
  }
  
  getNiveauLabel(niveau: string | number): string {
    if (typeof niveau === 'number') {
      niveau = this.convertNumericToNiveau(niveau);
    }
    switch (niveau) {
      case 'debutant': return 'Débutant';
      case 'intermediaire': return 'Intermédiaire';
      case 'avance': return 'Avancé';
      case 'expert': return 'Expert';
      default: return 'Débutant';
    }
  }
  
  getNiveauSeverity(niveau: string): string {
    switch (niveau) {
      case 'expert': return 'success';
      case 'avance': return 'info';
      case 'intermediaire': return 'warn';
      case 'debutant': return 'secondary';
      default: return 'secondary';
    }
  }
  
  getNiveauPercentage(niveau: string): number {
    switch (niveau) {
      case 'debutant': return 25;
      case 'intermediaire': return 50;
      case 'avance': return 75;
      case 'expert': return 100;
      default: return 25;
    }
  }
  
  get nom() { return this.competenceForm.get('nom'); }
  get typeCompetenceId() { return this.competenceForm.get('typeCompetenceId'); }
  get niveau() { return this.competenceForm.get('niveau'); }
}