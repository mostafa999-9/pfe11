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
import { DropdownModule } from 'primeng/dropdown';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { PortfolioService } from '../../core/services/portfolio.service';
import { Portfolio } from '../../core/models/portfolio.model';


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
    TooltipModule,
    DropdownModule,
    ToggleButtonModule,
    FormsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  
  constructor(
    public router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public authService: AuthService,
    private portfolioService: PortfolioService
  ) {}
  
  ngOnInit() {
    this.loadPortfolios();
  }
  
  loadPortfolios() {
    // Simulation de données portfolio
    const mockPortfolio: Portfolio = {
      id: '1',
      nom: 'Mon Portfolio Professionnel',
      url: 'johndoe.quickfolio.com',
      template: 'Modern Pro',
      statut: 'actif',
      dateCreation: new Date('2024-01-15'),
      derniereModification: new Date('2024-01-20'),
      vues: 1247,
      utilisateurId: '1',
      isPublic: true
    };
    this.portfolios = [mockPortfolio];
  }
  
  statutOptions = [
    { label: 'Actif', value: 'actif' },
    { label: 'Brouillon', value: 'brouillon' },
    { label: 'Archivé', value: 'archive' }
  ];
  
  stats: DashboardStats = {
    totalPortfolios: 1,
    totalViews: 1247,
    totalContacts: 23,
    conversionRate: 1.8
  };
  
  portfolios: Portfolio[] = [];
  
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
  
  onStatusChange(portfolio: Portfolio, newStatus: string) {
    this.portfolioService.updatePortfolioStatus(portfolio.id, newStatus as any).subscribe({
      next: (updatedPortfolio) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Statut mis à jour',
          detail: `Le portfolio est maintenant ${this.getStatusLabel(newStatus)}`
        });
        this.loadPortfolios();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de mettre à jour le statut'
        });
      }
    });
  }
  
  onVisibilityChange(portfolio: Portfolio) {
    this.portfolioService.updatePortfolioVisibility(portfolio.id, portfolio.isPublic).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Visibilité mise à jour',
          detail: `Portfolio ${portfolio.isPublic ? 'public' : 'privé'}`
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de mettre à jour la visibilité'
        });
      }
    });
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
      message: `Êtes-vous sûr de vouloir supprimer le portfolio "${portfolio.nom}" ? Cette action est irréversible.`,
      header: 'Confirmer la suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.portfolioService.deletePortfolio(portfolio.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Portfolio supprimé',
              detail: `${portfolio.nom} a été supprimé avec succès`
            });
            this.loadPortfolios();
          }
        });
      }
    });
  }
  
  getStatusSeverity(status: string): string {
    switch (status) {
      case 'actif': return 'success';
      case 'brouillon': return 'warning';
      case 'archive': return 'secondary';
      default: return 'info';
    }
  }
  
  getStatusLabel(status: string): string {
    switch (status) {
      case 'actif': return 'Actif';
      case 'brouillon': return 'Brouillon';
      case 'archive': return 'Archivé';
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