import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SubscriptionService } from '../../core/services/subscription.service';
import { AuthService } from '../../core/services/auth.service';
import { PlanAbonnement, Abonnement } from '../../core/models/user.model';

@Component({
  selector: 'app-subscription-management',
  standalone: true,
  imports: [
    CommonModule, ButtonModule, CardModule, TableModule, 
    TagModule, ConfirmDialogModule
  ],
  templateUrl: './subscription-management.component.html',
  styleUrls: ['./subscription-management.component.scss']
})
export class SubscriptionManagementComponent implements OnInit {
  plans: PlanAbonnement[] = [];
  currentSubscription: Abonnement | null = null;
  showPlans = false;

  constructor(
    private subscriptionService: SubscriptionService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPlans();
    this.loadCurrentSubscription();
  }

  loadPlans() {
    this.subscriptionService.getPlans().subscribe(plans => {
      this.plans = plans;
    });
  }

  loadCurrentSubscription() {
    const user = this.authService.getCurrentUser();
    this.currentSubscription = user?.abonnement || null;
  }

  getCurrentPlanName(): string {
    if (!this.currentSubscription) return '';
    const plan = this.plans.find(p => p.id === this.currentSubscription?.planAbonnementId);
    return plan?.nom || 'Plan inconnu';
  }

  getDaysLeft(): number {
    return this.authService.getSubscriptionDaysLeft();
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'actif': return 'Actif';
      case 'expire': return 'Expiré';
      case 'suspendu': return 'Suspendu';
      default: return status;
    }
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'actif': return 'success';
      case 'expire': return 'danger';
      case 'suspendu': return 'warning';
      default: return 'info';
    }
  }

  isCurrentPlan(plan: PlanAbonnement): boolean {
    return this.currentSubscription?.planAbonnementId === plan.id;
  }

  selectPlan(plan: PlanAbonnement) {
    this.confirmationService.confirm({
      message: `Voulez-vous changer pour le plan "${plan.nom}" ?`,
      header: 'Changer de plan',
      icon: 'pi pi-question-circle',
      accept: () => {
        this.subscriptionService.updateSubscription(plan.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Plan mis à jour',
              detail: `Vous êtes maintenant abonné au plan ${plan.nom}`
            });
            this.loadCurrentSubscription();
            this.showPlans = false;
          }
        });
      }
    });
  }

  cancelSubscription() {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir annuler votre abonnement ?',
      header: 'Annuler l\'abonnement',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptionService.cancelSubscription().subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Abonnement annulé',
              detail: 'Votre abonnement a été annulé'
            });
            this.loadCurrentSubscription();
          }
        });
      }
    });
  }
}