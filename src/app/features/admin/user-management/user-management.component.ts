import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    TagModule,
    DialogModule,
    InputTextModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  template: `
    <div class="user-management">
      <div class="page-header">
        <h1>Gestion des Utilisateurs</h1>
        <p>Gérez tous les utilisateurs de la plateforme</p>
      </div>

      <div class="table-toolbar">
        <div class="search-container">
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input pInputText type="text" placeholder="Rechercher un utilisateur..." 
                   [(ngModel)]="searchTerm" (input)="filterUsers()">
          </span>
        </div>
        <div class="toolbar-actions">
          <button pButton label="Exporter" icon="pi pi-download" class="p-button-outlined"></button>
          <button pButton label="Actualiser" icon="pi pi-refresh" (click)="loadUsers()"></button>
        </div>
      </div>

      <p-table [value]="filteredUsers" styleClass="p-datatable-striped" 
               [paginator]="true" [rows]="10" [showCurrentPageReport]="true"
               currentPageReportTemplate="Affichage de {first} à {last} sur {totalRecords} utilisateurs">
        <ng-template pTemplate="header">
          <tr>
            <th>Utilisateur</th>
            <th>Email</th>
            <th>Titre Professionnel</th>
            <th>Abonnement</th>
            <th>Date d'inscription</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-user>
          <tr>
            <td>
              <div class="user-info">
                <div class="user-avatar">
                  <i class="pi pi-user"></i>
                </div>
                <div>
                  <div class="user-name">{{ user.prenom }} {{ user.nom }}</div>
                  <div class="user-username">@{{ user.nomUtilisateur }}</div>
                </div>
              </div>
            </td>
            <td>{{ user.email }}</td>
            <td>{{ user.titreProf }}</td>
            <td>
              <p-tag [value]="getSubscriptionLabel(user)" 
                     [severity]="getSubscriptionSeverity(user)"></p-tag>
            </td>
            <td>{{ user.createdAt | date:'dd/MM/yyyy' }}</td>
            <td>
              <p-tag [value]="user.role === 'admin' ? 'Admin' : 'Utilisateur'" 
                     [severity]="user.role === 'admin' ? 'danger' : 'success'"></p-tag>
            </td>
            <td>
              <div class="action-buttons">
                <button pButton icon="pi pi-eye" class="p-button-text p-button-sm" 
                       pTooltip="Voir détails" (click)="viewUser(user)"></button>
                <button pButton icon="pi pi-pencil" class="p-button-text p-button-sm" 
                       pTooltip="Modifier" (click)="editUser(user)"></button>
                <button pButton icon="pi pi-ban" class="p-button-text p-button-sm p-button-warning" 
                       pTooltip="Suspendre" (click)="suspendUser(user)"></button>
                <button pButton icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" 
                       pTooltip="Supprimer" (click)="deleteUser(user)"></button>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>

      <!-- Dialog de détails utilisateur -->
      <p-dialog header="Détails de l'utilisateur" [(visible)]="showUserDialog" 
               [modal]="true" [style]="{width: '600px'}">
        <div *ngIf="selectedUser" class="user-details">
          <div class="detail-section">
            <h4>Informations Personnelles</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <label>Nom complet:</label>
                <span>{{ selectedUser.prenom }} {{ selectedUser.nom }}</span>
              </div>
              <div class="detail-item">
                <label>Email:</label>
                <span>{{ selectedUser.email }}</span>
              </div>
              <div class="detail-item">
                <label>Nom d'utilisateur:</label>
                <span>{{ selectedUser.nomUtilisateur }}</span>
              </div>
              <div class="detail-item">
                <label>Titre professionnel:</label>
                <span>{{ selectedUser.titreProf }}</span>
              </div>
              <div class="detail-item">
                <label>Adresse:</label>
                <span>{{ selectedUser.adresse }}</span>
              </div>
              <div class="detail-item">
                <label>Date d'inscription:</label>
                <span>{{ selectedUser.createdAt | date:'dd/MM/yyyy à HH:mm' }}</span>
              </div>
            </div>
          </div>

          <div class="detail-section" *ngIf="selectedUser.abonnement">
            <h4>Abonnement</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <label>Plan:</label>
                <span>{{ selectedUser.abonnement.planAbonnementId }}</span>
              </div>
              <div class="detail-item">
                <label>Statut:</label>
                <p-tag [value]="selectedUser.abonnement.statut" 
                       [severity]="getSubscriptionSeverity(selectedUser)"></p-tag>
              </div>
              <div class="detail-item">
                <label>Date de début:</label>
                <span>{{ selectedUser.abonnement.dateDebut | date:'dd/MM/yyyy' }}</span>
              </div>
              <div class="detail-item">
                <label>Date de fin:</label>
                <span>{{ selectedUser.abonnement.dateFin | date:'dd/MM/yyyy' }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <ng-template pTemplate="footer">
          <button pButton label="Fermer" class="p-button-text" (click)="showUserDialog = false"></button>
        </ng-template>
      </p-dialog>

      <p-confirmDialog></p-confirmDialog>
    </div>
  `,
  styles: [`
    .user-management {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-header h1 {
      color: var(--text-color);
      margin-bottom: 0.5rem;
    }

    .page-header p {
      color: var(--text-color-secondary);
      margin: 0;
    }

    .table-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      gap: 1rem;
    }

    .search-container {
      flex: 1;
      max-width: 400px;
    }

    .toolbar-actions {
      display: flex;
      gap: 0.5rem;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      background: var(--primary-color);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .user-name {
      font-weight: 600;
      color: var(--text-color);
    }

    .user-username {
      font-size: 0.85rem;
      color: var(--text-color-secondary);
    }

    .action-buttons {
      display: flex;
      gap: 0.25rem;
    }

    .user-details {
      padding: 1rem 0;
    }

    .detail-section {
      margin-bottom: 2rem;
    }

    .detail-section h4 {
      margin-bottom: 1rem;
      color: var(--text-color);
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 0.5rem;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .detail-item label {
      font-weight: 600;
      color: var(--text-color-secondary);
      font-size: 0.9rem;
    }

    .detail-item span {
      color: var(--text-color);
    }

    @media (max-width: 768px) {
      .user-management {
        padding: 1rem;
      }
      
      .table-toolbar {
        flex-direction: column;
        align-items: stretch;
      }
      
      .detail-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  selectedUser: User | null = null;
  showUserDialog = false;
  searchTerm = '';

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    // Simulation de données utilisateurs
    this.users = [
      {
        id: '1',
        nom: 'Dubois',
        prenom: 'Marie',
        email: 'marie.dubois@email.com',
        nomUtilisateur: 'mariedubois',
        titreProf: 'Designer UX/UI',
        adresse: 'Paris, France',
        surNom: 'Marie',
        role: 'user',
        abonnement: {
          id: '1',
          statut: 'actif',
          planAbonnementId: 'mensuel',
          dateDebut: new Date('2024-01-01'),
          dateFin: new Date('2024-02-01'),
          utilisateurId: '1'
        },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        nom: 'Martin',
        prenom: 'Thomas',
        email: 'thomas.martin@email.com',
        nomUtilisateur: 'thomasmartin',
        titreProf: 'Développeur Full Stack',
        adresse: 'Lyon, France',
        surNom: 'Tom',
        role: 'user',
        abonnement: {
          id: '2',
          statut: 'actif',
          planAbonnementId: 'annuel',
          dateDebut: new Date('2024-01-15'),
          dateFin: new Date('2025-01-15'),
          utilisateurId: '2'
        },
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20')
      }
    ];
    this.filteredUsers = [...this.users];
  }

  filterUsers() {
    if (!this.searchTerm) {
      this.filteredUsers = [...this.users];
      return;
    }

    this.filteredUsers = this.users.filter(user =>
      user.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.nomUtilisateur.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  viewUser(user: User) {
    this.selectedUser = user;
    this.showUserDialog = true;
  }

  editUser(user: User) {
    // TODO: Implémenter l'édition d'utilisateur
    this.messageService.add({
      severity: 'info',
      summary: 'Fonctionnalité',
      detail: 'Édition d\'utilisateur à implémenter'
    });
  }

  suspendUser(user: User) {
    this.confirmationService.confirm({
      message: `Voulez-vous suspendre l'utilisateur ${user.prenom} ${user.nom} ?`,
      header: 'Suspendre l\'utilisateur',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Utilisateur suspendu',
          detail: `${user.prenom} ${user.nom} a été suspendu`
        });
      }
    });
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.prenom} ${user.nom} ? Cette action est irréversible.`,
      header: 'Supprimer l\'utilisateur',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.users = this.users.filter(u => u.id !== user.id);
        this.filterUsers();
        this.messageService.add({
          severity: 'success',
          summary: 'Utilisateur supprimé',
          detail: `${user.prenom} ${user.nom} a été supprimé`
        });
      }
    });
  }

  getSubscriptionLabel(user: User): string {
    if (!user.abonnement) return 'Aucun';
    return user.abonnement.planAbonnementId;
  }

  getSubscriptionSeverity(user: User): string {
    if (!user.abonnement) return 'secondary';
    switch (user.abonnement.statut) {
      case 'actif': return 'success';
      case 'expire': return 'danger';
      case 'suspendu': return 'warning';
      default: return 'secondary';
    }
  }
}