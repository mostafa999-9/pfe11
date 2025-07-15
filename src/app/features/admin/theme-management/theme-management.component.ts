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
  template: `
    <div class="theme-management">
      <div class="page-header">
        <h1>Gestion des Thèmes</h1>
        <p>Gérez les thèmes disponibles sur la plateforme</p>
        <button pButton label="Ajouter un thème" icon="pi pi-plus" 
               class="p-button-raised" (click)="showAddDialog()"></button>
      </div>

      <p-table [value]="themes" styleClass="p-datatable-striped">
        <ng-template pTemplate="header">
          <tr>
            <th>Nom</th>
            <th>Description</th>
            <th>Type</th>
            <th>Statut</th>
            <th>Utilisations</th>
            <th>Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-theme>
          <tr>
            <td>{{ theme.name }}</td>
            <td>{{ theme.description }}</td>
            <td>
              <p-tag [value]="theme.premium ? 'Premium' : 'Gratuit'" 
                     [severity]="theme.premium ? 'warning' : 'success'"></p-tag>
            </td>
            <td>
              <p-tag [value]="theme.active ? 'Actif' : 'Inactif'" 
                     [severity]="theme.active ? 'success' : 'secondary'"></p-tag>
            </td>
            <td>{{ theme.usageCount }}</td>
            <td>
              <div class="action-buttons">
                <button pButton icon="pi pi-pencil" class="p-button-text p-button-sm" 
                       (click)="editTheme(theme)"></button>
                <button pButton icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" 
                       (click)="deleteTheme(theme)"></button>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>

      <!-- Dialog d'ajout/modification -->
      <p-dialog header="Ajouter un thème" [(visible)]="showDialog" [modal]="true" [style]="{width: '500px'}">
        <div class="form-group">
          <label for="themeName">Nom du thème</label>
          <input pInputText id="themeName" [(ngModel)]="currentTheme.name" class="w-full" />
        </div>
        
        <div class="form-group">
          <label for="themeDescription">Description</label>
          <input pInputText id="themeDescription" [(ngModel)]="currentTheme.description" class="w-full" />
        </div>
        
        <ng-template pTemplate="footer">
          <button pButton label="Annuler" class="p-button-text" (click)="hideDialog()"></button>
          <button pButton label="Sauvegarder" class="p-button-raised" (click)="saveTheme()"></button>
        </ng-template>
      </p-dialog>
    </div>
  `,
  styles: [`
    .theme-management {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .action-buttons {
      display: flex;
      gap: 0.25rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }
  `]
})
export class AdminThemeManagementComponent implements OnInit {
  themes: ThemeInfo[] = [];
  showDialog = false;
  currentTheme: any = {};

  constructor(private messageService: MessageService) {}

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
}