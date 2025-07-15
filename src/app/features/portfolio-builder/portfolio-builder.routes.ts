import { Routes } from '@angular/router';

export const portfolioBuilderRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./portfolio-builder.component').then(m => m.PortfolioBuilderComponent),
    children: [
      {
        path: '',
        redirectTo: 'informations',
        pathMatch: 'full'
      },
      {
        path: 'informations',
        loadComponent: () => import('./components/informations-personnelles/informations-personnelles.component').then(m => m.InformationsPersonnellesComponent)
      },
      {
        path: 'competences',
        loadComponent: () => import('./components/competences/competences.component').then(m => m.CompetencesComponent)
      },
      {
        path: 'projets',
        loadComponent: () => import('./components/projets/projets.component').then(m => m.ProjetsComponent)
      },
      {
        path: 'experiences',
        loadComponent: () => import('./components/experiences/experiences.component').then(m => m.ExperiencesComponent)
      },
      {
        path: 'educations',
        loadComponent: () => import('./components/educations/educations.component').then(m => m.EducationsComponent)
      },
      {
        path: 'temoignages',
        loadComponent: () => import('./components/temoignages/temoignages.component').then(m => m.TemoignagesComponent)
      },
      {
        path: 'services',
        loadComponent: () => import('./components/services/services.component').then(m => m.ServicesComponent)
      },
      {
        path: 'reseaux-sociaux',
        loadComponent: () => import('./components/reseaux-sociaux/reseaux-sociaux.component').then(m => m.ReseauxSociauxComponent)
      },
      {
        path: 'types-management',
        loadComponent: () => import('./components/types-management/types-management.component').then(m => m.TypesManagementComponent)
      }
    ]
  }
];