import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User, Abonnement } from '../models/user.model';

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterData {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  nomUtilisateur: string;
  titreProf: string;
  adresse: string;
  surNom: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  private token = signal<string | null>(null);
  
  constructor() {
    this.loadUserFromStorage();
  }
  
  login(email: string, password: string, rememberMe: boolean = false): Observable<LoginResponse> {
    // Simulation d'un appel API
    return of({
      user: {
        id: '1',
        nom: 'Doe',
        prenom: 'John',
        email: email,
        nomUtilisateur: 'johndoe',
        titreProf: 'Développeur Full Stack',
        adresse: 'Paris, France',
        surNom: 'JD',
        role: 'user' as const,
        abonnement: {
          id: '1',
          statut: 'actif' as const,
          planAbonnementId: 'gratuit',
          dateDebut: new Date(),
          dateFin: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 jours
          utilisateurId: '1'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      token: 'fake-jwt-token'
    }).pipe(
      delay(1000),
      map(response => {
        this.currentUser.set(response.user);
        this.token.set(response.token);
        
        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);
        } else {
          sessionStorage.setItem('user', JSON.stringify(response.user));
          sessionStorage.setItem('token', response.token);
        }
        
        return response;
      })
    );
  }
  
  register(data: RegisterData): Observable<LoginResponse> {
    return of({
      user: {
        id: '1',
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        nomUtilisateur: data.nomUtilisateur,
        titreProf: data.titreProf,
        adresse: data.adresse,
        surNom: data.surNom,
        role: 'user' as const,
        // Pas d'abonnement lors de l'inscription, sera ajouté après vérification email
        createdAt: new Date(),
        updatedAt: new Date()
      },
      token: 'fake-jwt-token'
    }).pipe(
      delay(1000),
      map(response => {
        // Ne pas connecter automatiquement, attendre la vérification email
        
        return response;
      })
    );
  }
  
  verifyEmail(email: string): Observable<boolean> {
    // Simulation de vérification d'email
    return of(true).pipe(delay(1000));
  }
  
  logout(): void {
    this.currentUser.set(null);
    this.token.set(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
  }
  
  isAuthenticated(): boolean {
    return this.currentUser() !== null && this.token() !== null;
  }
  
  isAdmin(): boolean {
    const user = this.currentUser();
    return user?.role === 'admin';
  }
  
  getCurrentUser(): User | null {
    return this.currentUser();
  }
  
  getToken(): string | null {
    return this.token();
  }
  
  hasActiveSubscription(): boolean {
    const user = this.currentUser();
    if (!user?.abonnement) return false;
    
    const now = new Date();
    return user.abonnement.statut === 'actif' && 
           new Date(user.abonnement.dateFin) > now;
  }
  
  getSubscriptionDaysLeft(): number {
    const user = this.currentUser();
    if (!user?.abonnement) return 0;
    
    const now = new Date();
    const endDate = new Date(user.abonnement.dateFin);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  }
  
  private loadUserFromStorage(): void {
    let userData = localStorage.getItem('user');
    let token = localStorage.getItem('token');
    
    if (!userData || !token) {
      userData = sessionStorage.getItem('user');
      token = sessionStorage.getItem('token');
    }
    
    if (userData && token) {
      try {
        this.currentUser.set(JSON.parse(userData));
        this.token.set(token);
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error);
        this.logout();
      }
    }
  }
}