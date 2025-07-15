import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../../core/services/auth.service';

interface Portfolio {
  id: number;
  name: string;
  url: string;
  template: string;
  status: 'active' | 'draft' | 'archived';
  lastModified: Date;
  views: number;
}

interface DashboardStats {
  totalPortfolios: number;
  totalViews: number;
  totalContacts: number;
  conversionRate: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TableModule,
    TagModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  
  constructor(
    public router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public authService: AuthService
  ) {}
  
  stats: DashboardStats = {
    totalPortfolios: 1,
    totalViews: 1247,
    totalContacts: 23,
    conversionRate: 1.8
  };
  
  portfolios: Portfolio[] = [
    {
      id: 1,
      name: 'Mon Portfolio Professionnel',
      url: 'johndoe.QuickFolio.com',
      template: 'Modern Pro',
      status: 'active',
      lastModified: new Date('2024-01-15'),
      views: 1247
    }
  ];
  
  createNewPortfolio() {
    if (this.portfolios.length >= 1) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Limite atteinte',
        detail: 'Vous ne pouvez créer qu\'un seul portfolio par compte. Modifiez votre portfolio existant.'
      });
      return;
    }
    
    this.router.navigate(['/portfolio-builder']);
  }
  
  editPortfolio(portfolio: Portfolio) {
    this.router.navigate(['/portfolio-builder'], { queryParams: { id: portfolio.id } });
  }
  
  viewPortfolio(portfolio: Portfolio) {
    window.open(`https://${portfolio.url}`, '_blank');
  }
  
  duplicatePortfolio(portfolio: Portfolio) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Action non autorisée',
      detail: 'Vous ne pouvez avoir qu\'un seul portfolio par compte.'
    });
  }
  
  deletePortfolio(portfolio: Portfolio) {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer le portfolio "${portfolio.name}" ? Cette action est irréversible.`,
      header: 'Confirmer la suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.portfolios = this.portfolios.filter(p => p.id !== portfolio.id);
        this.stats.totalPortfolios = this.portfolios.length;
        this.messageService.add({
          severity: 'success',
          summary: 'Portfolio supprimé',
          detail: `${portfolio.name} a été supprimé avec succès`
        });
      }
    });
  }
  
  getStatusSeverity(status: string): string {
    switch (status) {
      case 'active': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'secondary';
      default: return 'info';
    }
  }
  
  getStatusLabel(status: string): string {
    switch (status) {
      case 'active': return 'Actif';
      case 'draft': return 'Brouillon';
      case 'archived': return 'Archivé';
      default: return status;
    }
  }
  
  getSubscriptionStatus(): string {
    const user = this.authService.getCurrentUser();
    if (!user?.abonnement) return 'Aucun abonnement';
    
    const daysLeft = this.authService.getSubscriptionDaysLeft();
    if (daysLeft > 0) {
      return `${daysLeft} jour${daysLeft > 1 ? 's' : ''} restant${daysLeft > 1 ? 's' : ''}`;
    }
    
    return 'Abonnement expiré';
  }
}