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
  templateUrl: './plan-management.component.html',
  styleUrls: ['./plan-management.component.scss']
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