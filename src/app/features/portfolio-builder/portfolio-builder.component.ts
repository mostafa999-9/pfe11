import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-portfolio-builder',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ButtonModule,
    TabMenuModule
  ],
  template: `
    <div class="builder-container">
      <div class="container">
        <!-- Actions en haut -->
        <div class="builder-actions-top">
          <button pButton label="Retour au Dashboard" icon="pi pi-arrow-left" 
                 class="p-button-outlined" (click)="goBack()"></button>
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
  
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}
  
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