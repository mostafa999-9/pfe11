import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';

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
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
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
  
  goBack() {
    this.router.navigate(['/admin']);
  }
}