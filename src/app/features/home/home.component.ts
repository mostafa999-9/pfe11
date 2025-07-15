import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { AuthService } from '../../core/services/auth.service';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface Testimonial {
  name: string;
  position: string;
  company: string;
  content: string;
  avatar: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    ChipModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}
  
  ngOnInit() {
    // Rediriger vers le dashboard si l'utilisateur est connecté
    this.setupScrollAnimation();
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }
  
  features: Feature[] = [
    {
      title: 'Essai Gratuit 3 Jours',
      description: 'Accédez à toutes les fonctionnalités premium pendant 3 jours, puis continuez avec un plan adapté.',
      icon: 'pi pi-gift'
    },
    {
      title: 'Un Portfolio par Compte',
      description: 'Concentrez-vous sur la création d\'un portfolio professionnel de qualité supérieure.',
      icon: 'pi pi-user'
    },
    {
      title: 'Templates Professionnels',
      description: 'Choisissez parmi une large sélection de templates modernes et personnalisables.',
      icon: 'pi pi-palette'
    },
    {
      title: 'Éditeur Intuitif',
      description: 'Interface simple et intuitive pour créer votre portfolio sans compétences techniques.',
      icon: 'pi pi-pencil'
    },
    {
      title: 'Responsive Design',
      description: 'Votre portfolio s\'adapte automatiquement à tous les appareils et tailles d\'écran.',
      icon: 'pi pi-mobile'
    },
    // {
    //   title: 'SEO Optimisé',
    //   description: 'Optimisation automatique pour les moteurs de recherche et meilleure visibilité.',
    //   icon: 'pi pi-search'
    // }
    {
      title: "Mise à Jour Instantanée",
      description: 'Toutes les modifications sont sauvegardées et mises à jour en temps réel, vous permettant de voir les changements immédiatement.',
      icon: 'pi pi-refresh'
    }
  ];
  
  testimonials: Testimonial[] = [
    {
      name: 'Marie Dubois',
      position: 'Designer UX/UI',
      company: 'Creative Agency',
      content: 'QuickFolio m\'a permis de créer un portfolio professionnel en quelques heures. L\'essai gratuit de 3 jours m\'a convaincue !',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg'
    },
    {
      name: 'Thomas Martin',
      position: 'Développeur Full Stack',
      company: 'Tech Solutions',
      content: 'Excellent service ! Un seul portfolio mais de qualité professionnelle. Mes clients sont impressionnés par le résultat.',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
    },
    {
      name: 'Sophie Laurent',
      position: 'Photographe',
      company: 'Freelance',
      content: 'La période d\'essai gratuite m\'a permis de tester toutes les fonctionnalités. J\'ai gagné de nouveaux clients grâce à mon portfolio.',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg'
    }
  ];
  
  navigateToRegister() {
    this.router.navigate(['/auth/register']);
  }
  
  navigateToPricing() {
    this.router.navigate(['/pricing']);
  }
  
  scrollToSection(sectionId: string) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
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
}