import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { PlanAbonnement, AvantageAbonnement, Abonnement } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private plans = signal<PlanAbonnement[]>([]);
  private currentSubscription = signal<Abonnement | null>(null);

  constructor() {
    // Initialisation des plans par défaut
    this.plans.set([
      {
        id: 'gratuit',
        nom: 'Essai Gratuit',
        prix: 0,
        dureeEnJours: 3,
        avantages: [
          { id: '1', texte: 'Accès à toutes les fonctionnalités', planAbonnementId: 'gratuit' },
          { id: '2', texte: 'Tous les templates', planAbonnementId: 'gratuit' },
          { id: '3', texte: 'Support prioritaire', planAbonnementId: 'gratuit' }
        ]
      },
      {
        id: 'mensuel',
        nom: 'Plan Mensuel',
        prix: 19.99,
        dureeEnJours: 30,
        avantages: [
          { id: '4', texte: 'Portfolio professionnel', planAbonnementId: 'mensuel' },
          { id: '5', texte: 'Domaine personnalisé', planAbonnementId: 'mensuel' },
          { id: '6', texte: 'Analytics avancés', planAbonnementId: 'mensuel' }
        ]
      },
      {
        id: 'annuel',
        nom: 'Plan Annuel',
        prix: 199.99,
        dureeEnJours: 365,
        avantages: [
          { id: '7', texte: 'Tout du plan mensuel', planAbonnementId: 'annuel' },
          { id: '8', texte: '2 mois gratuits', planAbonnementId: 'annuel' },
          { id: '9', texte: 'Support 24/7', planAbonnementId: 'annuel' }
        ]
      }
    ]);
  }

  getPlans(): Observable<PlanAbonnement[]> {
    return of(this.plans()).pipe(delay(200));
  }

  getCurrentSubscription(): Abonnement | null {
    return this.currentSubscription();
  }

  updateSubscription(planId: string): Observable<Abonnement> {
    const newSubscription: Abonnement = {
      id: Date.now().toString(),
      statut: 'actif',
      planAbonnementId: planId,
      dateDebut: new Date(),
      dateFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      utilisateurId: '1'
    };

    return of(newSubscription).pipe(
      delay(500),
      map(result => {
        this.currentSubscription.set(result);
        return result;
      })
    );
  }

  cancelSubscription(): Observable<boolean> {
    return of(true).pipe(
      delay(300),
      map(() => {
        const current = this.currentSubscription();
        if (current) {
          this.currentSubscription.set({
            ...current,
            statut: 'suspendu'
          });
        }
        return true;
      })
    );
  }
}