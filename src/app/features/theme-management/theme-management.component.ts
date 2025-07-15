import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ColorPickerModule } from 'primeng/colorpicker';
import { InputTextModule } from 'primeng/inputtext';
import { ThemeService, Theme } from '../../core/services/theme.service';

@Component({
  selector: 'app-theme-management',
  standalone: true,
  imports: [
    CommonModule, ButtonModule, CardModule, DialogModule,
    ColorPickerModule, InputTextModule
  ],
  templateUrl: './theme-management.component.html',
  styleUrls: ['./theme-management.component.scss']
})
export class ThemeManagementComponent implements OnInit {
  themes: Theme[] = [];
  selectedTheme: Theme | null = null;
  showCustomizeDialog = false;
  customizations = {
    primaryColor: '#3366FF',
    secondaryColor: '#14B8A6',
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px'
  };

  constructor(
    private themeService: ThemeService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadThemes();
  }

  loadThemes() {
    this.themeService.getThemes().subscribe(themes => {
      this.themes = themes;
    });
  }

  activateTheme(theme: Theme) {
    this.themeService.setActiveTheme(theme.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thème activé',
          detail: `Le thème "${theme.nom}" est maintenant actif`
        });
        this.loadThemes();
      }
    });
  }

  customizeTheme(theme: Theme) {
    this.selectedTheme = theme;
    this.showCustomizeDialog = true;
  }

  applyCustomizations() {
    if (this.selectedTheme) {
      this.themeService.customizeTheme(this.selectedTheme.id, this.customizations).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thème personnalisé',
            detail: 'Vos personnalisations ont été appliquées'
          });
          this.showCustomizeDialog = false;
          this.loadThemes();
        }
      });
    }
  }
}