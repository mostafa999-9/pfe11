import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { MessageService } from 'primeng/api';
import { PaymentService } from '../../../core/services/payment.service';
import { SubscriptionService } from '../../../core/services/subscription.service';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  trialDays?: number;
}

@Component({
  selector: 'app-select-subscription',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    ChipModule
  ],
  templateUrl: './select-subscription.component.html',
  styleUrls: ['./select-subscription.component.css']
})
export class SelectSubscriptionComponent implements OnInit, AfterViewInit {
  selectedPlan = '';
  loading = false;

  plans: SubscriptionPlan[] = [
    {
      id: 'gratuit',
      name: 'Essai Gratuit',
      price: 0,
      period: '3 jours',
      description: 'Accès complet à toutes les fonctionnalités',
      trialDays: 3,
      features: [
        'Accès à toutes les fonctionnalités',
        'Tous les templates disponibles',
        'Un portfolio professionnel',
        'Support prioritaire',
        'Aucune limitation pendant 3 jours'
      ],
      popular: true
    },
    {
      id: 'mensuel',
      name: 'Plan Mensuel',
      price: 19.99,
      period: '30 jours',
      description: 'Continuez après l\'essai gratuit',
      features: [
        'Accès à toutes les fonctionnalités',
        'Un portfolio professionnel',
        'Tous les templates disponibles',
        'Support prioritaire 24/7',
        'Mises à jour automatiques'
      ]
    },
    {
      id: 'annuel',
      name: 'Plan Annuel',
      price: 199.99,
      period: '365 jours',
      description: 'Économisez 2 mois avec le plan annuel',
      features: [
        'Tout du plan mensuel',
        '2 mois gratuits',
        'Support prioritaire 24/7',
        'Fonctionnalités exclusives'
      ]
    }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private subscriptionService: SubscriptionService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.selectedPlan = params['selectedPlan'] || 'gratuit';
    });
  }

  ngAfterViewInit() {
    // Initialiser PayPal après le rendu
    setTimeout(() => {
      this.initializePayPalButtons();
    }, 500);
  }

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
            ).then(() => {
              console.log(`Bouton PayPal créé pour ${plan.name}`);
            }).catch(error => {
              console.error(`Erreur PayPal pour ${plan.name}:`, error);
            });
          }, 100);
        }
      });
    } catch (error) {
      console.error('Erreur initialisation PayPal:', error);
    }
  }

  selectPlan(plan: SubscriptionPlan) {
    if (plan.price === 0) {
      // Plan gratuit - activer directement
      this.activateFreeTrial(plan);
    } else {
      // Plan payant - traité par PayPal
      this.messageService.add({
        severity: 'info',
        summary: 'Paiement requis',
        detail: 'Veuillez utiliser le bouton PayPal pour procéder au paiement'
      });
    }
  }

  activateFreeTrial(plan: SubscriptionPlan) {
    this.loading = true;
    
    this.subscriptionService.updateSubscription(plan.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Abonnement activé',
          detail: `Votre essai gratuit de ${plan.trialDays} jours a été activé !`
        });
        
        // Rediriger vers la page d'accueil/dashboard
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors de l\'activation de l\'abonnement'
        });
        this.loading = false;
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}