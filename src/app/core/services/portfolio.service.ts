import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { 
  InformationPersonnelle, 
  Competence, 
  TypeCompetence, 
  Projet, 
  TypeProjet,
  Experience, 
  Education, 
  Temoignage, 
  Service, 
  ReseauSocial 
} from '../models/portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private informationsPersonnelles = signal<InformationPersonnelle | null>(null);
  private competences = signal<Competence[]>([]);
  private projets = signal<Projet[]>([]);
  private experiences = signal<Experience[]>([]);
  private educations = signal<Education[]>([]);
  private temoignages = signal<Temoignage[]>([]);
  private services = signal<Service[]>([]);
  private reseauxSociaux = signal<ReseauSocial[]>([]);

  // Getters
  getInformationsPersonnelles() { return this.informationsPersonnelles(); }
  getCompetences() { return this.competences(); }
  getProjets() { return this.projets(); }
  getExperiences() { return this.experiences(); }
  getEducations() { return this.educations(); }
  getTemoignages() { return this.temoignages(); }
  getServices() { return this.services(); }
  getReseauxSociaux() { return this.reseauxSociaux(); }

  // Types de compétences et projets
  private typesCompetences = signal<TypeCompetence[]>([
    { id: '1', nom: 'Technique', description: 'Compétences techniques', utilisateurId: '1' },
    { id: '2', nom: 'Soft Skills', description: 'Compétences comportementales', utilisateurId: '1' },
    { id: '3', nom: 'Langues', description: 'Compétences linguistiques', utilisateurId: '1' }
  ]);
  
  private typesProjets = signal<TypeProjet[]>([
    { id: '1', nom: 'Web', description: 'Projets web', utilisateurId: '1' },
    { id: '2', nom: 'Mobile', description: 'Applications mobiles', utilisateurId: '1' },
    { id: '3', nom: 'Desktop', description: 'Applications desktop', utilisateurId: '1' },
    { id: '4', nom: 'Design', description: 'Projets de design', utilisateurId: '1' }
  ]);

  // Informations personnelles
  updateInformationsPersonnelles(data: Partial<InformationPersonnelle>): Observable<InformationPersonnelle> {
    return of(data as InformationPersonnelle).pipe(
      delay(500),
      map(result => {
        this.informationsPersonnelles.set(result);
        return result;
      })
    );
  }

  // Compétences
  addCompetence(competence: Omit<Competence, 'id'>): Observable<Competence> {
    const newCompetence = { ...competence, id: Date.now().toString() };
    return of(newCompetence).pipe(
      delay(300),
      map(result => {
        this.competences.update(items => [...items, result]);
        return result;
      })
    );
  }

  updateCompetence(id: string, data: Partial<Competence>): Observable<Competence> {
    return of(data as Competence).pipe(
      delay(300),
      map(result => {
        this.competences.update(items => 
          items.map(item => item.id === id ? { ...item, ...result } : item)
        );
        return result;
      })
    );
  }

  deleteCompetence(id: string): Observable<boolean> {
    return of(true).pipe(
      delay(300),
      map(() => {
        this.competences.update(items => items.filter(item => item.id !== id));
        return true;
      })
    );
  }

  // Projets
  addProjet(projet: Omit<Projet, 'id'>): Observable<Projet> {
    const newProjet = { ...projet, id: Date.now().toString() };
    return of(newProjet).pipe(
      delay(300),
      map(result => {
        this.projets.update(items => [...items, result]);
        return result;
      })
    );
  }

  updateProjet(id: string, data: Partial<Projet>): Observable<Projet> {
    return of(data as Projet).pipe(
      delay(300),
      map(result => {
        this.projets.update(items => 
          items.map(item => item.id === id ? { ...item, ...result } : item)
        );
        return result;
      })
    );
  }

  deleteProjet(id: string): Observable<boolean> {
    return of(true).pipe(
      delay(300),
      map(() => {
        this.projets.update(items => items.filter(item => item.id !== id));
        return true;
      })
    );
  }

  // Expériences
  addExperience(experience: Omit<Experience, 'id'>): Observable<Experience> {
    const newExperience = { ...experience, id: Date.now().toString() };
    return of(newExperience).pipe(
      delay(300),
      map(result => {
        this.experiences.update(items => [...items, result]);
        return result;
      })
    );
  }

  updateExperience(id: string, data: Partial<Experience>): Observable<Experience> {
    return of(data as Experience).pipe(
      delay(300),
      map(result => {
        this.experiences.update(items => 
          items.map(item => item.id === id ? { ...item, ...result } : item)
        );
        return result;
      })
    );
  }

  deleteExperience(id: string): Observable<boolean> {
    return of(true).pipe(
      delay(300),
      map(() => {
        this.experiences.update(items => items.filter(item => item.id !== id));
        return true;
      })
    );
  }

  // Éducations
  addEducation(education: Omit<Education, 'id'>): Observable<Education> {
    const newEducation = { ...education, id: Date.now().toString() };
    return of(newEducation).pipe(
      delay(300),
      map(result => {
        this.educations.update(items => [...items, result]);
        return result;
      })
    );
  }

  updateEducation(id: string, data: Partial<Education>): Observable<Education> {
    return of(data as Education).pipe(
      delay(300),
      map(result => {
        this.educations.update(items => 
          items.map(item => item.id === id ? { ...item, ...result } : item)
        );
        return result;
      })
    );
  }

  deleteEducation(id: string): Observable<boolean> {
    return of(true).pipe(
      delay(300),
      map(() => {
        this.educations.update(items => items.filter(item => item.id !== id));
        return true;
      })
    );
  }

  // Témoignages
  addTemoignage(temoignage: Omit<Temoignage, 'id'>): Observable<Temoignage> {
    const newTemoignage = { ...temoignage, id: Date.now().toString() };
    return of(newTemoignage).pipe(
      delay(300),
      map(result => {
        this.temoignages.update(items => [...items, result]);
        return result;
      })
    );
  }

  updateTemoignage(id: string, data: Partial<Temoignage>): Observable<Temoignage> {
    return of(data as Temoignage).pipe(
      delay(300),
      map(result => {
        this.temoignages.update(items => 
          items.map(item => item.id === id ? { ...item, ...result } : item)
        );
        return result;
      })
    );
  }

  deleteTemoignage(id: string): Observable<boolean> {
    return of(true).pipe(
      delay(300),
      map(() => {
        this.temoignages.update(items => items.filter(item => item.id !== id));
        return true;
      })
    );
  }

  // Services
  addService(service: Omit<Service, 'id'>): Observable<Service> {
    const newService = { ...service, id: Date.now().toString() };
    return of(newService).pipe(
      delay(300),
      map(result => {
        this.services.update(items => [...items, result]);
        return result;
      })
    );
  }

  updateService(id: string, data: Partial<Service>): Observable<Service> {
    return of(data as Service).pipe(
      delay(300),
      map(result => {
        this.services.update(items => 
          items.map(item => item.id === id ? { ...item, ...result } : item)
        );
        return result;
      })
    );
  }

  deleteService(id: string): Observable<boolean> {
    return of(true).pipe(
      delay(300),
      map(() => {
        this.services.update(items => items.filter(item => item.id !== id));
        return true;
      })
    );
  }

  // Réseaux sociaux
  addReseauSocial(reseau: Omit<ReseauSocial, 'id'>): Observable<ReseauSocial> {
    const newReseau = { ...reseau, id: Date.now().toString() };
    return of(newReseau).pipe(
      delay(300),
      map(result => {
        this.reseauxSociaux.update(items => [...items, result]);
        return result;
      })
    );
  }

  updateReseauSocial(id: string, data: Partial<ReseauSocial>): Observable<ReseauSocial> {
    return of(data as ReseauSocial).pipe(
      delay(300),
      map(result => {
        this.reseauxSociaux.update(items => 
          items.map(item => item.id === id ? { ...item, ...result } : item)
        );
        return result;
      })
    );
  }

  deleteReseauSocial(id: string): Observable<boolean> {
    return of(true).pipe(
      delay(300),
      map(() => {
        this.reseauxSociaux.update(items => items.filter(item => item.id !== id));
        return true;
      })
    );
  }

  getTypesCompetences(): Observable<TypeCompetence[]> {
    return of(this.typesCompetences()).pipe(delay(200));
  }

  getTypesProjets(): Observable<TypeProjet[]> {
    return of(this.typesProjets()).pipe(delay(200));
  }
  
  // CRUD Types de Compétences
  addTypeCompetence(type: Omit<TypeCompetence, 'id'>): Observable<TypeCompetence> {
    const newType = { ...type, id: Date.now().toString() };
    return of(newType).pipe(
      delay(300),
      map(result => {
        this.typesCompetences.update(items => [...items, result]);
        return result;
      })
    );
  }
  
  updateTypeCompetence(id: string, data: Partial<TypeCompetence>): Observable<TypeCompetence> {
    return of(data as TypeCompetence).pipe(
      delay(300),
      map(result => {
        this.typesCompetences.update(items => 
          items.map(item => item.id === id ? { ...item, ...result } : item)
        );
        return result;
      })
    );
  }
  
  deleteTypeCompetence(id: string): Observable<boolean> {
    return of(true).pipe(
      delay(300),
      map(() => {
        this.typesCompetences.update(items => items.filter(item => item.id !== id));
        return true;
      })
    );
  }
  
  // CRUD Types de Projets
  addTypeProjet(type: Omit<TypeProjet, 'id'>): Observable<TypeProjet> {
    const newType = { ...type, id: Date.now().toString() };
    return of(newType).pipe(
      delay(300),
      map(result => {
        this.typesProjets.update(items => [...items, result]);
        return result;
      })
    );
  }
  
  updateTypeProjet(id: string, data: Partial<TypeProjet>): Observable<TypeProjet> {
    return of(data as TypeProjet).pipe(
      delay(300),
      map(result => {
        this.typesProjets.update(items => 
          items.map(item => item.id === id ? { ...item, ...result } : item)
        );
        return result;
      })
    );
  }
  
  deleteTypeProjet(id: string): Observable<boolean> {
    return of(true).pipe(
      delay(300),
      map(() => {
        this.typesProjets.update(items => items.filter(item => item.id !== id));
        return true;
      })
    );
  }
}