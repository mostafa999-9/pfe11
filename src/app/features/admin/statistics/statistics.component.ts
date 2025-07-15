import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';

interface StatisticsData {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  portfoliosCreated: number;
  monthlyGrowth: number;
}

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    ChartModule,
    TableModule
  ],
  template: `
    <div class="statistics-container">
      <div class="page-header">
        <h1>Statistiques Globales</h1>
        <p>Analyse détaillée des performances de la plateforme</p>
      </div>

      <div class="stats-overview">
        <p-card>
          <ng-template pTemplate="header">
            <h3>Vue d'ensemble</h3>
          </ng-template>
          
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">{{ stats.totalUsers }}</div>
              <div class="stat-label">Utilisateurs Total</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.activeSubscriptions }}</div>
              <div class="stat-label">Abonnements Actifs</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.totalRevenue }}€</div>
              <div class="stat-label">Revenus Total</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.portfoliosCreated }}</div>
              <div class="stat-label">Portfolios Créés</div>
            </div>
          </div>
        </p-card>
      </div>

      <div class="charts-section">
        <p-card>
          <ng-template pTemplate="header">
            <h3>Évolution des Revenus</h3>
          </ng-template>
          <p-chart type="line" [data]="revenueChartData" [options]="chartOptions"></p-chart>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    .statistics-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
      padding: 1rem;
    }

    .stat-item {
      text-align: center;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--primary-color);
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: var(--text-color-secondary);
      font-weight: 600;
    }

    .charts-section {
      margin-top: 2rem;
    }
  `]
})
export class StatisticsComponent implements OnInit {
  stats: StatisticsData = {
    totalUsers: 1247,
    activeSubscriptions: 892,
    totalRevenue: 18450,
    portfoliosCreated: 1156,
    monthlyGrowth: 12
  };

  revenueChartData: any;
  chartOptions: any;

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
          borderColor: '#3366FF',
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
}