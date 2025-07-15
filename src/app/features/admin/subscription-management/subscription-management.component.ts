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
  template: `
    <div class="subscription-management">
      <div class="page-header">
        <h1>Gestion des Abonnements</h1>
        <p>Gérez tous les abonnements de la plateforme</p>
      </div>

      <p-table [value]="subscriptions" styleClass="p-datatable-striped" 
               [paginator]="true" [rows]="10">
        <ng-template pTemplate="header">
          <tr>
            <th>Utilisateur</th>
            <th>Plan</th>
            <th>Statut</th>
            <th>Date de début</th>
            <th>Date de fin</th>
            <th>Montant</th>
            <th>Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-subscription>
          <tr>
            <td>{{ subscription.userName }}</td>
            <td>{{ subscription.planName }}</td>
            <td>
              <p-tag [value]="getStatusLabel(subscription.status)" 
                     [severity]="getStatusSeverity(subscription.status)"></p-tag>
            </td>
            <td>{{ subscription.startDate | date:'dd/MM/yyyy' }}</td>
            <td>{{ subscription.endDate | date:'dd/MM/yyyy' }}</td>
            <td>{{ subscription.amount }}€</td>
            <td>
              <div class="action-buttons">
                <button pButton icon="pi pi-ban" class="p-button-text p-button-sm p-button-warning" 
                       (click)="cancelSubscription(subscription)"></button>
                <button pButton icon="pi pi-refresh" class="p-button-text p-button-sm" 
                       (click)="renewSubscription(subscription)"></button>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>

      <p-confirmDialog></p-confirmDialog>
    </div>
  `,
  styles: [`
    .subscription-management {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .action-buttons {
      display: flex;
      gap: 0.25rem;
    }
  `]
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