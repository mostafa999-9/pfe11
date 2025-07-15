import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

interface ThemeInfo {
  id: string;
  name: string;
  description: string;
  active: boolean;
  premium: boolean;
  usageCount: number;
}

@Component({
  selector: 'app-admin-theme-management',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TableModule,
    TagModule,
    DialogModule,
    InputTextModule,
    FormsModule
  ],
  templateUrl: './theme-management.component.html',
  styleUrls: ['./theme-management.component.scss']
})
export class AdminThemeManagementComponent implements OnInit {
  themes: ThemeInfo[] = [];
  showDialog = false;
  currentTheme: any = {};

  constructor(
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadThemes();
  }

  loadThemes() {
    this.themes = [
      {
        id: '1',
        name: 'Modern Pro',
        description: 'Thème moderne et professionnel',
        active: true,
        premium: false,
        usageCount: 245
      },
      {
        id: '2',
        name: 'Creative Studio',
        description: 'Pour les créatifs et designers',
        active: true,
        premium: true,
        usageCount: 156
      }
    ];
  }

  showAddDialog() {
    this.currentTheme = {};
    this.showDialog = true;
  }

  hideDialog() {
    this.showDialog = false;
  }

  editTheme(theme: ThemeInfo) {
    this.currentTheme = { ...theme };
    this.showDialog = true;
  }

  saveTheme() {
    this.messageService.add({
      severity: 'success',
      summary: 'Thème sauvegardé',
      detail: 'Le thème a été sauvegardé avec succès'
    });
    this.hideDialog();
  }

  deleteTheme(theme: ThemeInfo) {
    this.messageService.add({
      severity: 'success',
      summary: 'Thème supprimé',
      detail: `Le thème ${theme.name} a été supprimé`
    });
  }
  
  goBack() {
    this.router.navigate(['/admin']);
  }
}