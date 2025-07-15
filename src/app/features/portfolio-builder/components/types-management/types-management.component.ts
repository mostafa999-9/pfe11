import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { AuthService } from '../../../../core/services/auth.service';
import { TypeCompetence, TypeProjet } from '../../../../core/models/portfolio.model';

@Component({
  selector: 'app-types-management',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule,
    TextareaModule, DataViewModule, DialogModule, ConfirmDialogModule,
    TabViewModule, CardModule, TooltipModule
  ],
  template: `
    <div class="types-management">
      <div class="section-header">
        <h2>Gestion des Types</h2>
        <p>Gérez vos types de compétences et de projets personnalisés</p>
      </div>
      
      <p-tabView>
        <!-- Onglet Types de Compétences -->
        <p-tabPanel header="Types de Compétences" leftIcon="pi pi-star">
          <div class="tab-content">
            <div class="tab-header">
              <h3>Types de Compétences</h3>
              <button pButton label="Ajouter un type" icon="pi pi-plus" 
                     class="p-button-raised" (click)="showCompetenceDialog()"></button>
            </div>
            
            <p-dataView [value]="typesCompetences" layout="grid" [paginator]="true" [rows]="6">
              <ng-template pTemplate="grid" let-type>
                <div class="col-12 md:col-6 lg:col-4 p-2">
                  <div class="type-card">
                    <div class="type-header">
                      <div class="type-icon">
                        <i class="pi pi-star"></i>
                      </div>
                      <div class="type-actions">
                        <button pButton icon="pi pi-pencil" class="p-button-text p-button-sm" 
                               (click)="editTypeCompetence(type)" pTooltip="Modifier"></button>
                        <button pButton icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" 
                               (click)="deleteTypeCompetence(type)" pTooltip="Supprimer"></button>
                      </div>
                    </div>
                    <h4>{{ type.nom }}</h4>
                    <p>{{ type.description || 'Aucune description' }}</p>
                    <div class="type-stats">
                      <small>{{ getCompetenceCount(type.id) }} compétence(s)</small>
                    </div>
                  </div>
                </div>
              </ng-template>
              <ng-template pTemplate="empty">
                <div class="empty-state">
                  <i class="pi pi-star" style="font-size: 3rem; color: #ccc;"></i>
                  <h3>Aucun type de compétence</h3>
                  <p>Créez votre premier type de compétence personnalisé</p>
                </div>
              </ng-template>
            </p-dataView>
          </div>
        </p-tabPanel>
        
        <!-- Onglet Types de Projets -->
        <p-tabPanel header="Types de Projets" leftIcon="pi pi-briefcase">
          <div class="tab-content">
            <div class="tab-header">
              <h3>Types de Projets</h3>
              <button pButton label="Ajouter un type" icon="pi pi-plus" 
                     class="p-button-raised" (click)="showProjetDialog()"></button>
            </div>
            
            <p-dataView [value]="typesProjets" layout="grid" [paginator]="true" [rows]="6">
              <ng-template pTemplate="grid" let-type>
                <div class="col-12 md:col-6 lg:col-4 p-2">
                  <div class="type-card">
                    <div class="type-header">
                      <div class="type-icon">
                        <i class="pi pi-briefcase"></i>
                      </div>
                      <div class="type-actions">
                        <button pButton icon="pi pi-pencil" class="p-button-text p-button-sm" 
                               (click)="editTypeProjet(type)" pTooltip="Modifier"></button>
                        <button pButton icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" 
                               (click)="deleteTypeProjet(type)" pTooltip="Supprimer"></button>
                      </div>
                    </div>
                    <h4>{{ type.nom }}</h4>
                    <p>{{ type.description || 'Aucune description' }}</p>
                    <div class="type-stats">
                      <small>{{ getProjetCount(type.id) }} projet(s)</small>
                    </div>
                  </div>
                </div>
              </ng-template>
              <ng-template pTemplate="empty">
                <div class="empty-state">
                  <i class="pi pi-briefcase" style="font-size: 3rem; color: #ccc;"></i>
                  <h3>Aucun type de projet</h3>
                  <p>Créez votre premier type de projet personnalisé</p>
                </div>
              </ng-template>
            </p-dataView>
          </div>
        </p-tabPanel>
      </p-tabView>
      
      <!-- Dialog pour Types de Compétences -->
      <p-dialog header="{{editModeCompetence ? 'Modifier' : 'Ajouter'}} un type de compétence" 
               [(visible)]="displayCompetenceDialog" [modal]="true" [style]="{width: '500px'}">
        <form [formGroup]="competenceTypeForm" (ngSubmit)="saveTypeCompetence()">
          <div class="form-group">
            <label for="nomCompetence">Nom du type *</label>
            <input pInputText id="nomCompetence" formControlName="nom" 
                   placeholder="Ex: Langages de programmation, Frameworks..." />
            <small *ngIf="competenceTypeForm.get('nom')?.invalid && competenceTypeForm.get('nom')?.touched" 
                   class="p-error">Le nom est requis</small>
          </div>
          
          <div class="form-group">
            <label for="descriptionCompetence">Description</label>
            <textarea pInputTextarea id="descriptionCompetence" formControlName="description" 
                     rows="3" placeholder="Description du type de compétence..."></textarea>
          </div>
          
          <div class="dialog-actions">
            <button pButton type="button" label="Annuler" class="p-button-text" 
                   (click)="hideCompetenceDialog()"></button>
            <button pButton type="submit" label="Sauvegarder" class="p-button-raised" 
                   [loading]="loading" [disabled]="competenceTypeForm.invalid"></button>
          </div>
        </form>
      </p-dialog>
      
      <!-- Dialog pour Types de Projets -->
      <p-dialog header="{{editModeProjet ? 'Modifier' : 'Ajouter'}} un type de projet" 
               [(visible)]="displayProjetDialog" [modal]="true" [style]="{width: '500px'}">
        <form [formGroup]="projetTypeForm" (ngSubmit)="saveTypeProjet()">
          <div class="form-group">
            <label for="nomProjet">Nom du type *</label>
            <input pInputText id="nomProjet" formControlName="nom" 
                   placeholder="Ex: Application Web, Application Mobile..." />
            <small *ngIf="projetTypeForm.get('nom')?.invalid && projetTypeForm.get('nom')?.touched" 
                   class="p-error">Le nom est requis</small>
          </div>
          
          <div class="form-group">
            <label for="descriptionProjet">Description</label>
            <textarea pInputTextarea id="descriptionProjet" formControlName="description" 
                     rows="3" placeholder="Description du type de projet..."></textarea>
          </div>
          
          <div class="dialog-actions">
            <button pButton type="button" label="Annuler" class="p-button-text" 
                   (click)="hideProjetDialog()"></button>
            <button pButton type="submit" label="Sauvegarder" class="p-button-raised" 
                   [loading]="loading" [disabled]="projetTypeForm.invalid"></button>
          </div>
        </form>
      </p-dialog>
      
      <p-confirmDialog></p-confirmDialog>
    </div>
  `,
  styles: [`
    .types-management {
      padding: 1rem;
    }
    
    .section-header {
      margin-bottom: 2rem;
      text-align: center;
    }
    
    .section-header h2 {
      margin-bottom: 0.5rem;
      color: var(--text-color);
    }
    
    .section-header p {
      color: var(--text-color-secondary);
      margin: 0;
    }
    
    .tab-content {
      padding: 1rem 0;
    }
    
    .tab-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    
    .tab-header h3 {
      margin: 0;
      color: var(--text-color);
    }
    
    .type-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 1.5rem;
      height: 100%;
      transition: all 0.3s ease;
      position: relative;
    }
    
    .type-card:hover {
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      transform: translateY(-5px);
    }
    
    .type-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }
    
    .type-icon {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
    }
    
    .type-actions {
      display: flex;
      gap: 0.25rem;
    }
    
    .type-card h4 {
      margin: 0 0 0.5rem 0;
      color: var(--text-color);
      font-size: 1.2rem;
    }
    
    .type-card p {
      color: var(--text-color-secondary);
      margin: 0 0 1rem 0;
      line-height: 1.5;
      min-height: 3rem;
    }
    
    .type-stats {
      border-top: 1px solid #f0f0f0;
      padding-top: 0.75rem;
    }
    
    .type-stats small {
      color: var(--text-color-secondary);
      font-weight: 600;
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
    
    :host ::ng-deep .p-tabview .p-tabview-panels {
      padding: 0;
    }
    
    :host ::ng-deep .p-dataview .p-dataview-content {
      background: transparent;
    }
    
    @media (max-width: 768px) {
      .tab-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
    }
  `]
})
export class TypesManagementComponent implements OnInit {
  typesCompetences: TypeCompetence[] = [];
  typesProjets: TypeProjet[] = [];
  
  competenceTypeForm: FormGroup;
  projetTypeForm: FormGroup;
  
  displayCompetenceDialog = false;
  displayProjetDialog = false;
  editModeCompetence = false;
  editModeProjet = false;
  
  currentTypeCompetence: TypeCompetence | null = null;
  currentTypeProjet: TypeProjet | null = null;
  
  loading = false;
  
  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.competenceTypeForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['']
    });
    
    this.projetTypeForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['']
    });
  }
  
  ngOnInit() {
    this.loadTypesCompetences();
    this.loadTypesProjets();
  }
  
  loadTypesCompetences() {
    this.portfolioService.getTypesCompetences().subscribe(types => {
      this.typesCompetences = types;
    });
  }
  
  loadTypesProjets() {
    this.portfolioService.getTypesProjets().subscribe(types => {
      this.typesProjets = types;
    });
  }
  
  // Gestion Types de Compétences
  showCompetenceDialog() {
    this.editModeCompetence = false;
    this.currentTypeCompetence = null;
    this.competenceTypeForm.reset();
    this.displayCompetenceDialog = true;
  }
  
  hideCompetenceDialog() {
    this.displayCompetenceDialog = false;
    this.competenceTypeForm.reset();
  }
  
  editTypeCompetence(type: TypeCompetence) {
    this.editModeCompetence = true;
    this.currentTypeCompetence = type;
    this.competenceTypeForm.patchValue(type);
    this.displayCompetenceDialog = true;
  }
  
  saveTypeCompetence() {
    if (this.competenceTypeForm.valid) {
      this.loading = true;
      const user = this.authService.getCurrentUser();
      
      const data = {
        ...this.competenceTypeForm.value,
        utilisateurId: user?.id || '1'
      };
      
      const operation = this.editModeCompetence && this.currentTypeCompetence
        ? this.portfolioService.updateTypeCompetence(this.currentTypeCompetence.id, data)
        : this.portfolioService.addTypeCompetence(data);
      
      operation.subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `Type de compétence ${this.editModeCompetence ? 'modifié' : 'ajouté'} avec succès`
          });
          this.loadTypesCompetences();
          this.hideCompetenceDialog();
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
  
  deleteTypeCompetence(type: TypeCompetence) {
    const competenceCount = this.getCompetenceCount(type.id);
    
    if (competenceCount > 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Suppression impossible',
        detail: `Ce type est utilisé par ${competenceCount} compétence(s). Supprimez d'abord les compétences associées.`
      });
      return;
    }
    
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer le type "${type.nom}" ?`,
      header: 'Confirmer la suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.portfolioService.deleteTypeCompetence(type.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Type de compétence supprimé avec succès'
            });
            this.loadTypesCompetences();
          }
        });
      }
    });
  }
  
  // Gestion Types de Projets
  showProjetDialog() {
    this.editModeProjet = false;
    this.currentTypeProjet = null;
    this.projetTypeForm.reset();
    this.displayProjetDialog = true;
  }
  
  hideProjetDialog() {
    this.displayProjetDialog = false;
    this.projetTypeForm.reset();
  }
  
  editTypeProjet(type: TypeProjet) {
    this.editModeProjet = true;
    this.currentTypeProjet = type;
    this.projetTypeForm.patchValue(type);
    this.displayProjetDialog = true;
  }
  
  saveTypeProjet() {
    if (this.projetTypeForm.valid) {
      this.loading = true;
      const user = this.authService.getCurrentUser();
      
      const data = {
        ...this.projetTypeForm.value,
        utilisateurId: user?.id || '1'
      };
      
      const operation = this.editModeProjet && this.currentTypeProjet
        ? this.portfolioService.updateTypeProjet(this.currentTypeProjet.id, data)
        : this.portfolioService.addTypeProjet(data);
      
      operation.subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `Type de projet ${this.editModeProjet ? 'modifié' : 'ajouté'} avec succès`
          });
          this.loadTypesProjets();
          this.hideProjetDialog();
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
  
  deleteTypeProjet(type: TypeProjet) {
    const projetCount = this.getProjetCount(type.id);
    
    if (projetCount > 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Suppression impossible',
        detail: `Ce type est utilisé par ${projetCount} projet(s). Supprimez d'abord les projets associés.`
      });
      return;
    }
    
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer le type "${type.nom}" ?`,
      header: 'Confirmer la suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.portfolioService.deleteTypeProjet(type.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Type de projet supprimé avec succès'
            });
            this.loadTypesProjets();
          }
        });
      }
    });
  }
  
  // Méthodes utilitaires
  getCompetenceCount(typeId: string): number {
    return this.portfolioService.getCompetences().filter(c => c.typeCompetenceId === typeId).length;
  }
  
  getProjetCount(typeId: string): number {
    return this.portfolioService.getProjets().filter(p => p.typeProjetId === typeId).length;
  }
}