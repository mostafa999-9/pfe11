import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { PaymentService } from '../../core/services/payment.service';

interface PricingPlan {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  buttonText: string;
  buttonClass: string;
  trialDays?: number;
}

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    ChipModule
  ],
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent implements OnInit, AfterViewInit {
  
  constructor(
    private router: Router,
    private paymentService: PaymentService
  ) {}
  
  ngOnInit() {
    this.setupScrollAnimation();
  }
  
  setupScrollAnimation() {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    setTimeout(() => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach(element => {
        observer.observe(element);
      });
    }, 100);
  }
  
  ngAfterViewInit() {
    // Initialiser PayPal après le rendu de la vue
    this.initializePayPalButtons();
  }
  
  plans: PricingPlan[] = [
    {
      name: 'Essai Gratuit',
      price: 0,
      period: '3 jours',
      description: 'Accès complet à toutes les fonctionnalités',
      trialDays: 3,
      features: [
        'Accès à toutes les fonctionnalités de la plateforme',
        'Tous les templates disponibles',
        'Création d\'un portfolio professionnel',
        // 'Domaine personnalisé',
        'Mises à jour automatiques',
        // 'Analytics avancés',
        'SSL inclus',
        // 'Support prioritaire',
        'Aucune limitation pendant 3 jours'
      ],
      popular: true,
      buttonText: 'Commencer l\'essai gratuit',
      buttonClass: 'p-button-raised'
    },
    {
      name: 'Plan Mensuel',
      price: 69,
      period: '30 jours',
      description: 'Continuez après l\'essai gratuit',
      features: [
        'Accès à toutes les fonctionnalités de la plateforme',
        'Un portfolio professionnel',
        'Tous les templates disponibles',
        // 'Domaine personnalisé',
        // 'Analytics avancés',
        'Support prioritaire 24/7',
        'Mises à jour automatiques',
        // 'Sauvegarde automatique',
        'SSL inclus'
      ],
      buttonText: 'Choisir ce plan',
      buttonClass: 'p-button-outlined'
    },
    {
      name: 'Plan Annuel',
      price: 690,
      period: '365 jours',
      description: 'Économisez 2 mois avec le plan annuel',
      features: [
        'Accès à toutes les fonctionnalités de la plateforme',
        'Un portfolio professionnel',
        'Tous les templates disponibles',
        // 'Domaine personnalisé',
        // 'Analytics avancés',
        'Support prioritaire 24/7',
        'Mises à jour automatiques',
        // 'Sauvegarde automatique',
        'SSL inclus',
        '2 mois gratuits'
      ],
      buttonText: 'Choisir ce plan',
      buttonClass: 'p-button-outlined'
    }
  ];
  
  async initializePayPalButtons() {
    try {
      await this.paymentService.initializePayPal();
      
      // Créer les boutons PayPal pour les plans payants
      this.plans.forEach((plan, index) => {
        if (plan.price > 0) {
          const containerId = `paypal-button-${index}`;
          setTimeout(() => {
            this.paymentService.createPayPalButton(
              containerId,
              plan.price.toString(),
              plan.name
            ).catch(error => {
              console.error(`Erreur lors de la création du bouton PayPal pour ${plan.name}:`, error);
            });
          }, 100);
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de PayPal:', error);
    }
  }
  
  selectPlan(plan: PricingPlan) {
    if (plan.price === 0) {
      this.router.navigate(['/auth/register']);
    } else {
      this.router.navigate(['/auth/register'], { 
        queryParams: { plan: plan.name.toLowerCase().replace(' ', '-') } 
      });
    }
  }
}