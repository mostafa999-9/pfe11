import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';

export interface Theme {
  id: string;
  nom: string;
  description: string;
  preview: string;
  active: boolean;
  premium: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themes = signal<Theme[]>([]);
  private activeTheme = signal<Theme | null>(null);

  constructor() {
    // Initialisation des thèmes par défaut
    this.themes.set([
      {
        id: 'modern',
        nom: 'Modern Pro',
        description: 'Design moderne et épuré',
        preview: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
        active: true,
        premium: false
      },
      {
        id: 'creative',
        nom: 'Creative Studio',
        description: 'Pour les créatifs et designers',
        preview: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
        active: false,
        premium: true
      },
      {
        id: 'minimal',
        nom: 'Minimal Clean',
        description: 'Simplicité et élégance',
        preview: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg',
        active: false,
        premium: true
      },
      {
        id: 'corporate',
        nom: 'Corporate',
        description: 'Professionnel et corporate',
        preview: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
        active: false,
        premium: false
      }
    ]);
  }

  getThemes(): Observable<Theme[]> {
    return of(this.themes()).pipe(delay(200));
  }

  getActiveTheme(): Theme | null {
    return this.activeTheme();
  }

  setActiveTheme(themeId: string): Observable<Theme> {
    return this.getThemes().pipe(
      map(themes => {
        const theme = themes.find(t => t.id === themeId);
        if (theme) {
          this.activeTheme.set(theme);
          return theme;
        }
        throw new Error('Theme not found');
      }),
      delay(300)
    );
  }

  customizeTheme(themeId: string, customizations: any): Observable<Theme> {
    return of({
      id: themeId + '_custom',
      nom: 'Theme Personnalisé',
      description: 'Theme personnalisé par l\'utilisateur',
      preview: '',
      active: true,
      premium: false
    }).pipe(delay(500));
  }
}