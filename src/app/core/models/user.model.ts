export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  motDePasse?: string;
  nomUtilisateur: string;
  titreProf: string;
  adresse: string;
  surNom: string;
  dateNaissance?: Date;
  nationalite?: string;
  photo?: string;
  description?: string;
  abonnement?: Abonnement;
  portfolio?: Portfolio;
  createdAt: Date;
  updatedAt: Date;
}

export interface Abonnement {
  id: string;
  statut: 'actif' | 'expire' | 'suspendu';
  planAbonnementId: string;
  dateDebut: Date;
  dateFin: Date;
  utilisateurId: string;
}

export interface PlanAbonnement {
  id: string;
  nom: string;
  prix: number;
  dureeEnJours: number;
  avantages: AvantageAbonnement[];
}

export interface AvantageAbonnement {
  id: string;
  texte: string;
  planAbonnementId: string;
}

export interface Portfolio {
  id: string;
  utilisateurId: string;
  theme: Theme;
  isPublic: boolean;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Theme {
  id: string;
  nom: string;
  active: boolean;
}