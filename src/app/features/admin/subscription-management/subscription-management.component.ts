import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

interface SubscriptionInfo {
  id: string;
  userId: string;
  userName: string;
  planName: string;
  status: 'active' | 'expired' | 'cancelled';
  startDate: Date;
  endDate: Date;
  amount: number;
}

@Component({
  selector: 'app-admin-subscription-management',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TableModule,
    TagModule,
    ConfirmDialogModule
  ],
  templateUrl: './subscription-management.component.html',
  styleUrls: ['./subscription-management.component.scss']
})
export class AdminSubscriptionManagementComponent implements OnInit {
  subscriptions: SubscriptionInfo[] = [];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadSubscriptions();
  }

  loadSubscriptions() {
    // Simulation de données
    this.subscriptions = [
      {
        id: '1',
        userId: '1',
        userName: 'Marie Dubois',
        planName: 'Plan Mensuel',
        status: 'active',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-02-01'),
        amount: 19.99
      },
      {
        id: '2',
        userId: '2',
        userName: 'Thomas Martin',
        planName: 'Plan Annuel',
        status: 'active',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2025-01-15'),
        amount: 199.99
      }
    ];
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'active': return 'Actif';
      case 'expired': return 'Expiré';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'active': return 'success';
      case 'expired': return 'danger';
      case 'cancelled': return 'warning';
      default: return 'secondary';
    }
  }

  cancelSubscription(subscription: SubscriptionInfo) {
    this.confirmationService.confirm({
      message: `Voulez-vous annuler l'abonnement de ${subscription.userName} ?`,
      header: 'Annuler l\'abonnement',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Abonnement annulé',
          detail: `L'abonnement de ${subscription.userName} a été annulé`
        });
      }
    });
  }

  renewSubscription(subscription: SubscriptionInfo) {
    this.messageService.add({
      severity: 'success',
      summary: 'Abonnement renouvelé',
      detail: `L'abonnement de ${subscription.userName} a été renouvelé`
    });
  }
}