import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TextareaModule } from 'primeng/textarea';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { PlanAbonnement, AvantageAbonnement } from '../../../core/models/user.model';

@Component({
  selector: 'app-plan-management',
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, ButtonModule, CardModule, TableModule,
    TagModule, DialogModule, InputTextModule, InputNumberModule, 
    ConfirmDialogModule, TextareaModule
  ],
  template: `
    <div class="plan-management">
      <div class="page-header">
        <div class="header-content">
          <button pButton icon="pi pi-arrow-left" label="Retour" 
                 class="p-button-text" (click)="goBack()"></button>
          <div>
            <h1>Gestion des Plans d'Abonnement</h1>
            <p>Gérez les plans et leurs avantages</p>
          </div>
        </div>
        <button pButton label="Ajouter un plan" icon="pi pi-plus" 
               class="p-button-raised" (click)="showPlanDialog()"></button>
      </div>

      <p-table [value]="plans" styleClass="p-datatable-striped">
        <ng-template pTemplate="header">
          <tr>
            <th>Nom</th>
            <th>Prix</th>
            <th>Durée</th>
            <th>Avantages</th>
            <th>Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-plan>
          <tr>
            <td>{{ plan.nom }}</td>
            <td>{{ plan.prix }}€</td>
            <td>{{ plan.dureeEnJours }} jours</td>
            <td>{{ plan.avantages.length }} avantage(s)</td>
            <td>
              <div class="action-buttons">
                <button pButton icon="pi pi-eye" class="p-button-text p-button-sm" 
                       (click)="viewPlan(plan)" pTooltip="Voir détails"></button>
                <button pButton icon="pi pi-pencil" class="p-button-text p-button-sm" 
                       (click)="editPlan(plan)" pTooltip="Modifier"></button>
                <button pButton icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" 
                       (click)="deletePlan(plan)" pTooltip="Supprimer"></button>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>

      <!-- Dialog Plan -->
      <p-dialog header="{{editMode ? 'Modifier' : 'Ajouter'}} un plan" 
               [(visible)]="showDialog" [modal]="true" [style]="{width: '600px'}">
        <form [formGroup]="planForm" (ngSubmit)="savePlan()">
          <div class="form-grid">
            <div class="form-group">
              <label for="nom">Nom du plan *</label>
              <input pInputText id="nom" formControlName="nom" />
            </div>
            
            <div class="form-group">
              <label for="prix">Prix (€) *</label>
              <p-inputNumber id="prix" formControlName="prix" 
                            mode="currency" currency="EUR" locale="fr-FR"></p-inputNumber>
            </div>
            
            <div class="form-group">
              <label for="dureeEnJours">Durée (jours) *</label>
              <p-inputNumber id="dureeEnJours" formControlName="dureeEnJours"></p-inputNumber>
            </div>
          </div>
          
          <div class="avantages-section">
            <div class="avantages-header">
              <h4>Avantages</h4>
              <button pButton type="button" icon="pi pi-plus" label="Ajouter" 
                     class="p-button-sm" (click)="addAvantage()"></button>
            </div>
            
            <div *ngFor="let avantage of avantages; let i = index" class="avantage-item">
              <input pInputText [(ngModel)]="avantage.texte" [ngModelOptions]="{standalone: true}"
                     placeholder="Texte de l'avantage" />
              <button pButton type="button" icon="pi pi-trash" 
                     class="p-button-sm p-button-danger p-button-text"
                     (click)="removeAvantage(i)"></button>
            </div>
          </div>
          
          <div class="dialog-actions">
            <button pButton type="button" label="Annuler" class="p-button-text" 
                   (click)="hideDialog()"></button>
            <button pButton type="submit" label="Sauvegarder" class="p-button-raised" 
                   [loading]="loading" [disabled]="planForm.invalid"></button>
          </div>
        </form>
      </p-dialog>

      <!-- Dialog Détails -->
      <p-dialog header="Détails du plan" [(visible)]="showDetailsDialog" 
               [modal]="true" [style]="{width: '500px'}">
        <div *ngIf="selectedPlan" class="plan-details">
          <div class="detail-item">
            <label>Nom:</label>
            <span>{{ selectedPlan.nom }}</span>
          </div>
          <div class="detail-item">
            <label>Prix:</label>
            <span>{{ selectedPlan.prix }}€</span>
          </div>
          <div class="detail-item">
            <label>Durée:</label>
            <span>{{ selectedPlan.dureeEnJours }} jours</span>
          </div>
          <div class="detail-item">
            <label>Avantages:</label>
            <ul>
              <li *ngFor="let avantage of selectedPlan.avantages">{{ avantage.texte }}</li>
            </ul>
          </div>
        </div>
        
        <ng-template pTemplate="footer">
          <button pButton label="Fermer" class="p-button-text" 
                 (click)="showDetailsDialog = false"></button>
        </ng-template>
      </p-dialog>

      <p-confirmDialog></p-confirmDialog>
    </div>
  `,
  styles: [`
    .plan-management {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .header-content h1 {
      margin: 0;
      color: var(--text-color);
    }

    .header-content p {
      margin: 0;
      color: var(--text-color-secondary);
    }

    .action-buttons {
      display: flex;
      gap: 0.25rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-weight: 600;
      color: var(--text-color);
    }

    .avantages-section {
      margin-bottom: 1.5rem;
    }

    .avantages-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .avantages-header h4 {
      margin: 0;
      color: var(--text-color);
    }

    .avantage-item {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      align-items: center;
    }

    .avantage-item input {
      flex: 1;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }

    .plan-details {
      padding: 1rem 0;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-bottom: 1rem;
    }

    .detail-item label {
      font-weight: 600;
      color: var(--text-color-secondary);
    }

    .detail-item span {
      color: var(--text-color);
    }

    .detail-item ul {
      margin: 0;
      padding-left: 1.5rem;
    }

    @media (max-width: 768px) {
      .plan-management {
        padding: 1rem;
      }
      
      .page-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }
      
      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PlanManagementComponent implements OnInit {
  plans: PlanAbonnement[] = [];
  planForm: FormGroup;
  showDialog = false;
  showDetailsDialog = false;
  editMode = false;
  currentPlan: PlanAbonnement | null = null;
  selectedPlan: PlanAbonnement | null = null;
  loading = false;
  avantages: AvantageAbonnement[] = [];

  constructor(
    private fb: FormBuilder,
    private subscriptionService: SubscriptionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
    this.planForm = this.fb.group({
      nom: ['', Validators.required],
      prix: [0, [Validators.required, Validators.min(0)]],
      dureeEnJours: [30, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.loadPlans();
  }

  loadPlans() {
    this.subscriptionService.getPlans().subscribe(plans => {
      this.plans = plans;
    });
  }

  showPlanDialog() {
    this.editMode = false;
    this.currentPlan = null;
    this.planForm.reset({ prix: 0, dureeEnJours: 30 });
    this.avantages = [];
    this.showDialog = true;
  }

  editPlan(plan: PlanAbonnement) {
    this.editMode = true;
    this.currentPlan = plan;
    this.planForm.patchValue(plan);
    this.avantages = [...plan.avantages];
    this.showDialog = true;
  }

  viewPlan(plan: PlanAbonnement) {
    this.selectedPlan = plan;
    this.showDetailsDialog = true;
  }

  addAvantage() {
    this.avantages.push({
      id: Date.now().toString(),
      texte: '',
      planAbonnementId: this.currentPlan?.id || ''
    });
  }

  removeAvantage(index: number) {
    this.avantages.splice(index, 1);
  }

  savePlan() {
    if (this.planForm.valid && this.avantages.length > 0) {
      this.loading = true;
      
      const planData: PlanAbonnement = {
        ...this.planForm.value,
        id: this.currentPlan?.id || Date.now().toString(),
        avantages: this.avantages.map(a => ({
          ...a,
          planAbonnementId: this.currentPlan?.id || Date.now().toString()
        }))
      };

      // Simulation de sauvegarde
      setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: `Plan ${this.editMode ? 'modifié' : 'créé'} avec succès`
        });
        this.loadPlans();
        this.hideDialog();
        this.loading = false;
      }, 500);
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Veuillez remplir tous les champs et ajouter au moins un avantage'
      });
    }
  }

  deletePlan(plan: PlanAbonnement) {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer le plan "${plan.nom}" ?`,
      header: 'Confirmer la suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Plan supprimé avec succès'
        });
        this.loadPlans();
      }
    });
  }

  hideDialog() {
    this.showDialog = false;
    this.planForm.reset();
    this.avantages = [];
  }

  goBack() {
    this.router.navigate(['/admin']);
  }
}