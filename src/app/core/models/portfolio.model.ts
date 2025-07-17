export interface InformationPersonnelle {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  adresse: string;
  dateNaissance?: Date;
  nationalite?: string;
  photo?: string;
  description?: string;
  utilisateurId: string;
}

export interface Competence {
  id: string;
  nom: string;
  niveau: 'debutant' | 'intermediaire' | 'avance' | 'expert';
  typeCompetenceId: string;
  utilisateurId: string;
}

export interface TypeCompetence {
  id: string;
  nom: string;
  description?: string;
  utilisateurId: string;
}

export interface Projet {
  id: string;
  titre: string;
  description: string;
  dateDebut: Date;
  dateFin?: Date;
  technologies: string[];
  lienDemo?: string;
  lienCode?: string;
  images?: string[];
  typeProjetId: string;
  utilisateurId: string;
}

export interface TypeProjet {
  id: string;
  nom: string;
  description?: string;
  utilisateurId: string;
}

export interface Experience {
  id: string;
  entreprise: string;
  poste: string;
  description: string;
  dateDebut: Date;
  dateFin?: Date;
  lieu?: string;
  utilisateurId: string;
}

export interface Education {
  id: string;
  institution: string;
  diplome: string;
  domaine: string;
  dateDebut: Date;
  dateFin?: Date;
  description?: string;
  utilisateurId: string;
}

export interface Temoignage {
  id: string;
  auteur: string;
  poste: string;
  entreprise: string;
  contenu: string;
  photo?: string;
  dateCreation: Date;
  utilisateurId: string;
}

export interface Service {
  id: string;
  nom: string;
  description: string;
  prix?: number;
  duree?: string;
  utilisateurId: string;
}

export interface ReseauSocial {
  id: string;
  nom: string;
  url: string;
  icone?: string;
  utilisateurId: string;
}

export interface Portfolio {
  id: string;
  nom: string;
  url: string;
  template: string;
  statut: 'actif' | 'brouillon' | 'archive';
  dateCreation: Date;
  derniereModification: Date;
  vues: number;
  utilisateurId: string;
  isPublic: boolean;
}