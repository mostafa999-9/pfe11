import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { DropdownModule } from 'primeng/dropdown';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { PortfolioService } from '../../core/services/portfolio.service';
import { MessageService } from 'primeng/api';
import { Portfolio } from '../../core/models/portfolio.model';

@Component({
  selector: 'app-portfolio-builder',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ButtonModule,
    TabMenuModule,
    DropdownModule,
    ToggleButtonModule,
    FormsModule
  ],
  template: `
    <div class="builder-container">
      <div class="container">
        <!-- Actions en haut -->
        <div class="builder-actions-top">
          <button pButton label="Retour au Dashboard" icon="pi pi-arrow-left" 
                 class="p-button-outlined" (click)="goBack()"></button>
          
          <div class="portfolio-controls" *ngIf="currentPortfolio">
            <!-- <div class="control-group">
              <label>Statut:</label>
              <p-dropdown 
                [options]="statutOptions" 
                [(ngModel)]="currentPortfolio.statut"
                optionLabel="label" 
                optionValue="value"
                (onChange)="onStatusChange($event.value)"
                [style]="{'min-width': '120px'}">
              </p-dropdown>
            </div> -->
            
            <div class="control-group">
              <label>Visibilité:</label>
              <p-toggleButton 
                [(ngModel)]="currentPortfolio.isPublic"
                onLabel="Public" 
                offLabel="Privé"
                onIcon="pi pi-eye" 
                offIcon="pi pi-eye-slash"
                (onChange)="onVisibilityChange()"
                styleClass="p-button-sm">
              </p-toggleButton>
            </div>
          </div>
          
          <button pButton label="Aperçu du Portfolio" icon="pi pi-eye" 
                 class="p-button-raised" (click)="previewPortfolio()"></button>
        </div>
        
        <div class="builder-header">
          <h1>Constructeur de Portfolio</h1>
          <p>Créez et personnalisez votre portfolio professionnel</p>
        </div>
        
        <div class="builder-navigation">
          <p-tabMenu [model]="menuItems" [activeItem]="activeItem" (activeItemChange)="onTabChange($event)"></p-tabMenu>
        </div>
        
        <div class="builder-content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .builder-container {
      min-height: 100vh;
      background-color: var(--surface-ground);
      padding: 6rem 0 2rem;
    }
    
    .builder-actions-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding: 1rem 0;
      border-bottom: 1px solid #e0e0e0;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .portfolio-controls {
      display: flex;
      gap: 2rem;
      align-items: center;
    }
    
    .control-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .control-group label {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-color-secondary);
    }
    
    .builder-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .builder-header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      color: var(--text-color);
    }
    
    .builder-header p {
      color: var(--text-color-secondary);
      font-size: 1.1rem;
    }
    
    .builder-navigation {
      margin-bottom: 2rem;
    }
    
    .builder-content {
      background: white;
      border-radius: var(--border-radius);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      padding: 2rem;
      margin-bottom: 2rem;
      min-height: 500px;
    }
    
    @media (max-width: 768px) {
      .builder-actions-top {
        flex-direction: column;
        align-items: stretch;
      }
      
      .portfolio-controls {
        flex-direction: column;
        gap: 1rem;
      }
    }
  `]
})
export class PortfolioBuilderComponent {
  menuItems: MenuItem[] = [
    { label: 'Informations', icon: 'pi pi-user', routerLink: '/portfolio-builder/informations' },
    { label: 'Compétences', icon: 'pi pi-star', routerLink: '/portfolio-builder/competences' },
    { label: 'Projets', icon: 'pi pi-briefcase', routerLink: '/portfolio-builder/projets' },
    { label: 'Expériences', icon: 'pi pi-building', routerLink: '/portfolio-builder/experiences' },
    { label: 'Éducation', icon: 'pi pi-book', routerLink: '/portfolio-builder/educations' },
    { label: 'Témoignages', icon: 'pi pi-comments', routerLink: '/portfolio-builder/temoignages' },
    { label: 'Services', icon: 'pi pi-cog', routerLink: '/portfolio-builder/services' },
    { label: 'Réseaux Sociaux', icon: 'pi pi-share-alt', routerLink: '/portfolio-builder/reseaux-sociaux' },
    { label: 'Gestion des Types', icon: 'pi pi-tags', routerLink: '/portfolio-builder/types-management' }
  ];
  
  activeItem: MenuItem = this.menuItems[0];
  
  currentPortfolio: Portfolio | null = null;
  
  statutOptions = [
    { label: 'Actif', value: 'actif' },
    { label: 'Brouillon', value: 'brouillon' },
    { label: 'Archivé', value: 'archive' }
  ];
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private portfolioService: PortfolioService,
    private messageService: MessageService
  ) {}
  
  ngOnInit() {
    // Charger le portfolio actuel si on est en mode édition
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.loadPortfolio(params['id']);
      } else {
        // Nouveau portfolio
        this.currentPortfolio = {
          id: 'new',
          nom: 'Nouveau Portfolio',
          url: '',
          template: 'Modern Pro',
          statut: 'brouillon',
          dateCreation: new Date(),
          derniereModification: new Date(),
          vues: 0,
          utilisateurId: '1',
          isPublic: false
        };
      }
    });
  }
  
  loadPortfolio(id: string) {
    // Simulation de chargement du portfolio
    this.currentPortfolio = {
      id: id,
      nom: 'Mon Portfolio Professionnel',
      url: 'johndoe.quickfolio.com',
      template: 'Modern Pro',
      statut: 'actif',
      dateCreation: new Date('2024-01-15'),
      derniereModification: new Date(),
      vues: 1247,
      utilisateurId: '1',
      isPublic: true
    };
  }
  
  onStatusChange(newStatus: string) {
    if (this.currentPortfolio) {
      this.portfolioService.updatePortfolioStatus(this.currentPortfolio.id, newStatus as any).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Statut mis à jour',
            detail: `Portfolio maintenant en mode ${newStatus}`
          });
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
  }
  
  onVisibilityChange() {
    if (this.currentPortfolio) {
      this.portfolioService.updatePortfolioVisibility(this.currentPortfolio.id, this.currentPortfolio.isPublic).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Visibilité mise à jour',
            detail: `Portfolio ${this.currentPortfolio!.isPublic ? 'public' : 'privé'}`
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
  }
  
  onTabChange(item: MenuItem) {
    this.activeItem = item;
    if (item.routerLink) {
      this.router.navigate([item.routerLink]);
    }
  }
  
  goBack() {
    this.router.navigate(['/dashboard']);
  }
  
  previewPortfolio() {
    // TODO: Implémenter l'aperçu du portfolio
    console.log('Aperçu du portfolio');
  }
}