import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  portfoliosCreated: number;
}

interface RecentActivity {
  id: string;
  type: 'user_registration' | 'subscription_created' | 'portfolio_created';
  description: string;
  timestamp: Date;
  user: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    ChartModule,
    TableModule,
    TagModule
  ],
  template: `
    <div class="admin-dashboard">
      <div class="dashboard-header">
        <h1>Tableau de Bord Administrateur</h1>
        <p>Vue d'ensemble de la plateforme QuickFolio</p>
      </div>

      <!-- Statistiques principales -->
      <div class="stats-grid">
        <p-card>
          <div class="stat-card">
            <div class="stat-icon users">
              <i class="pi pi-users"></i>
            </div>
            <div class="stat-content">
              <h3>{{ stats.totalUsers }}</h3>
              <p>Utilisateurs Total</p>
              <small>+12% ce mois</small>
            </div>
          </div>
        </p-card>

        <p-card>
          <div class="stat-card">
            <div class="stat-icon subscriptions">
              <i class="pi pi-credit-card"></i>
            </div>
            <div class="stat-content">
              <h3>{{ stats.activeSubscriptions }}</h3>
              <p>Abonnements Actifs</p>
              <small>+8% ce mois</small>
            </div>
          </div>
        </p-card>

        <p-card>
          <div class="stat-card">
            <div class="stat-icon revenue">
              <i class="pi pi-dollar"></i>
            </div>
            <div class="stat-content">
              <h3>{{ stats.totalRevenue }}€</h3>
              <p>Revenus Total</p>
              <small>+15% ce mois</small>
            </div>
          </div>
        </p-card>

        <p-card>
          <div class="stat-card">
            <div class="stat-icon portfolios">
              <i class="pi pi-briefcase"></i>
            </div>
            <div class="stat-content">
              <h3>{{ stats.portfoliosCreated }}</h3>
              <p>Portfolios Créés</p>
              <small>+20% ce mois</small>
            </div>
          </div>
        </p-card>
      </div>

      <!-- Actions rapides -->
      <div class="quick-actions">
        <h2>Actions Rapides</h2>
        <div class="actions-grid">
          <button pButton label="Gérer les Utilisateurs" icon="pi pi-users" 
                 class="p-button-raised" (click)="navigateTo('/admin/users')"></button>
          <button pButton label="Gérer les Abonnements" icon="pi pi-credit-card" 
                 class="p-button-raised" (click)="navigateTo('/admin/subscriptions')"></button>
          <button pButton label="Gérer les Thèmes" icon="pi pi-palette" 
                 class="p-button-raised" (click)="navigateTo('/admin/themes')"></button>
          <button pButton label="Voir les Statistiques" icon="pi pi-chart-bar" 
                 class="p-button-raised" (click)="navigateTo('/admin/statistics')"></button>
        </div>
      </div>

      <!-- Graphique des revenus -->
      <div class="charts-section">
        <p-card>
          <ng-template pTemplate="header">
            <h3>Évolution des Revenus</h3>
          </ng-template>
          <p-chart type="line" [data]="revenueChartData" [options]="chartOptions"></p-chart>
        </p-card>
      </div>

      <!-- Activité récente -->
      <div class="recent-activity">
        <p-card>
          <ng-template pTemplate="header">
            <h3>Activité Récente</h3>
          </ng-template>
          
          <p-table [value]="recentActivities" styleClass="p-datatable-striped">
            <ng-template pTemplate="header">
              <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Utilisateur</th>
                <th>Date</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-activity>
              <tr>
                <td>
                  <p-tag [value]="getActivityTypeLabel(activity.type)" 
                         [severity]="getActivityTypeSeverity(activity.type)"></p-tag>
                </td>
                <td>{{ activity.description }}</td>
                <td>{{ activity.user }}</td>
                <td>{{ activity.timestamp | date:'short':'fr' }}</td>
              </tr>
            </ng-template>
          </p-table>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 2rem;
      text-align: center;
    }

    .dashboard-header h1 {
      color: var(--text-color);
      margin-bottom: 0.5rem;
    }

    .dashboard-header p {
      color: var(--text-color-secondary);
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: white;
    }

    .stat-icon.users { background: linear-gradient(135deg, #667eea, #764ba2); }
    .stat-icon.subscriptions { background: linear-gradient(135deg, #f093fb, #f5576c); }
    .stat-icon.revenue { background: linear-gradient(135deg, #4facfe, #00f2fe); }
    .stat-icon.portfolios { background: linear-gradient(135deg, #43e97b, #38f9d7); }

    .stat-content h3 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 0.25rem 0;
      color: var(--text-color);
    }

    .stat-content p {
      margin: 0 0 0.25rem 0;
      color: var(--text-color-secondary);
    }

    .stat-content small {
      color: var(--success-color);
      font-weight: 600;
    }

    .quick-actions {
      margin-bottom: 3rem;
    }

    .quick-actions h2 {
      margin-bottom: 1.5rem;
      color: var(--text-color);
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .charts-section {
      margin-bottom: 3rem;
    }

    .recent-activity {
      margin-bottom: 2rem;
    }

    @media (max-width: 768px) {
      .admin-dashboard {
        padding: 1rem;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .actions-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats: AdminStats = {
    totalUsers: 1247,
    activeSubscriptions: 892,
    totalRevenue: 18450,
    portfoliosCreated: 1156
  };

  recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'user_registration',
      description: 'Nouvel utilisateur inscrit',
      timestamp: new Date(),
      user: 'Marie Dubois'
    },
    {
      id: '2',
      type: 'subscription_created',
      description: 'Abonnement mensuel souscrit',
      timestamp: new Date(Date.now() - 3600000),
      user: 'Thomas Martin'
    },
    {
      id: '3',
      type: 'portfolio_created',
      description: 'Nouveau portfolio créé',
      timestamp: new Date(Date.now() - 7200000),
      user: 'Sophie Laurent'
    }
  ];

  revenueChartData: any;
  chartOptions: any;

  constructor(private router: Router) {}

  ngOnInit() {
    this.initializeChartData();
  }

  initializeChartData() {
    this.revenueChartData = {
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
      datasets: [
        {
          label: 'Revenus (€)',
          data: [2400, 3200, 2800, 4100, 3800, 4500],
          fill: false,
          borderColor: 'var(--primary-color)',
          tension: 0.4
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: true
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  getActivityTypeLabel(type: string): string {
    switch (type) {
      case 'user_registration': return 'Inscription';
      case 'subscription_created': return 'Abonnement';
      case 'portfolio_created': return 'Portfolio';
      default: return type;
    }
  }

  getActivityTypeSeverity(type: string): string {
    switch (type) {
      case 'user_registration': return 'success';
      case 'subscription_created': return 'info';
      case 'portfolio_created': return 'warn';
      default: return 'secondary';
    }
  }
}