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

interface HistoriqueAbonnement {
  id: string;
  planNom: string;
  dateDebut: Date;
  dateFin: Date;
  statut: 'actif' | 'expire' | 'annule';
  montant: number;
  methodePaiement: string;
}

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
  historiqueAbonnements: HistoriqueAbonnement[] = [];
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
    this.loadHistoriqueAbonnements();
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

  loadHistoriqueAbonnements() {
    // Simulation de données d'historique
    this.historiqueAbonnements = [
      {
        id: '1',
        planNom: 'Plan Mensuel',
        dateDebut: new Date('2024-01-01'),
        dateFin: new Date('2024-02-01'),
        statut: 'expire',
        montant: 19.99,
        methodePaiement: 'PayPal'
      },
      {
        id: '2',
        planNom: 'Essai Gratuit',
        dateDebut: new Date('2023-12-01'),
        dateFin: new Date('2023-12-04'),
        statut: 'expire',
        montant: 0,
        methodePaiement: 'Gratuit'
      },
      {
        id: '3',
        planNom: 'Plan Annuel',
        dateDebut: new Date('2024-02-01'),
        dateFin: new Date('2025-02-01'),
        statut: 'actif',
        montant: 199.99,
        methodePaiement: 'Carte bancaire'
      }
    ];
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
      case 'suspendu': 
      case 'annule': return 'warning';
      default: return 'info';
    }
  }

  getHistoriqueStatusLabel(status: string): string {
    switch (status) {
      case 'actif': return 'Actif';
      case 'expire': return 'Expiré';
      case 'annule': return 'Annulé';
      default: return status;
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