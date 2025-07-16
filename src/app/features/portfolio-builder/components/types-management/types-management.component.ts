import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { AuthService } from '../../../../core/services/auth.service';
import { TypeCompetence, TypeProjet } from '../../../../core/models/portfolio.model';

@Component({
  selector: 'app-types-management',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule,
    TextareaModule, DataViewModule, DialogModule, ConfirmDialogModule,
    TabViewModule, CardModule, TooltipModule
  ],
  templateUrl: './types-management.component.html',
  styleUrls: ['./types-management.component.scss']
})
export class TypesManagementComponent implements OnInit {
  typesCompetences: TypeCompetence[] = [];
  typesProjets: TypeProjet[] = [];
  activeTab = 'competences';
  
  competenceTypeForm: FormGroup;
  projetTypeForm: FormGroup;
  
  displayCompetenceDialog = false;
  displayProjetDialog = false;
  editModeCompetence = false;
  editModeProjet = false;
  
  currentTypeCompetence: TypeCompetence | null = null;
  currentTypeProjet: TypeProjet | null = null;
  
  loading = false;
  
  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.competenceTypeForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['']
    });
    
    this.projetTypeForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['']
    });
  }
  
  ngOnInit() {
    this.loadTypesCompetences();
    this.loadTypesProjets();
  }
  
  loadTypesCompetences() {
    this.portfolioService.getTypesCompetences().subscribe(types => {
      this.typesCompetences = types;
    });
  }
  
  loadTypesProjets() {
    this.portfolioService.getTypesProjets().subscribe(types => {
      this.typesProjets = types;
    });
  }
  
  // Gestion Types de Compétences
  showCompetenceDialog() {
    this.editModeCompetence = false;
    this.currentTypeCompetence = null;
    this.competenceTypeForm.reset();
    this.displayCompetenceDialog = true;
  }
  
  hideCompetenceDialog() {
    this.displayCompetenceDialog = false;
    this.competenceTypeForm.reset();
  }
  
  editTypeCompetence(type: TypeCompetence) {
    this.editModeCompetence = true;
    this.currentTypeCompetence = type;
    this.competenceTypeForm.patchValue(type);
    this.displayCompetenceDialog = true;
  }
  
  saveTypeCompetence() {
    if (this.competenceTypeForm.valid) {
      this.loading = true;
      const user = this.authService.getCurrentUser();
      
      const data = {
        ...this.competenceTypeForm.value,
        utilisateurId: user?.id || '1'
      };
      
      const operation = this.editModeCompetence && this.currentTypeCompetence
        ? this.portfolioService.updateTypeCompetence(this.currentTypeCompetence.id, data)
        : this.portfolioService.addTypeCompetence(data);
      
      operation.subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `Type de compétence ${this.editModeCompetence ? 'modifié' : 'ajouté'} avec succès`
          });
          this.loadTypesCompetences();
          this.hideCompetenceDialog();
          this.loading = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la sauvegarde'
          });
          this.loading = false;
        }
      });
    }
  }
  
  deleteTypeCompetence(type: TypeCompetence) {
    const competenceCount = this.getCompetenceCount(type.id);
    
    if (competenceCount > 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Suppression impossible',
        detail: `Ce type est utilisé par ${competenceCount} compétence(s). Supprimez d'abord les compétences associées.`
      });
      return;
    }
    
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer le type "${type.nom}" ?`,
      header: 'Confirmer la suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.portfolioService.deleteTypeCompetence(type.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Type de compétence supprimé avec succès'
            });
            this.loadTypesCompetences();
          }
        });
      }
    });
  }
  
  // Gestion Types de Projets
  showProjetDialog() {
    this.editModeProjet = false;
    this.currentTypeProjet = null;
    this.projetTypeForm.reset();
    this.displayProjetDialog = true;
  }
  
  hideProjetDialog() {
    this.displayProjetDialog = false;
    this.projetTypeForm.reset();
  }
  
  editTypeProjet(type: TypeProjet) {
    this.editModeProjet = true;
    this.currentTypeProjet = type;
    this.projetTypeForm.patchValue(type);
    this.displayProjetDialog = true;
  }
  
  saveTypeProjet() {
    if (this.projetTypeForm.valid) {
      this.loading = true;
      const user = this.authService.getCurrentUser();
      
      const data = {
        ...this.projetTypeForm.value,
        utilisateurId: user?.id || '1'
      };
      
      const operation = this.editModeProjet && this.currentTypeProjet
        ? this.portfolioService.updateTypeProjet(this.currentTypeProjet.id, data)
        : this.portfolioService.addTypeProjet(data);
      
      operation.subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `Type de projet ${this.editModeProjet ? 'modifié' : 'ajouté'} avec succès`
          });
          this.loadTypesProjets();
          this.hideProjetDialog();
          this.loading = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la sauvegarde'
          });
          this.loading = false;
        }
      });
    }
  }
  
  deleteTypeProjet(type: TypeProjet) {
    const projetCount = this.getProjetCount(type.id);
    
    if (projetCount > 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Suppression impossible',
        detail: `Ce type est utilisé par ${projetCount} projet(s). Supprimez d'abord les projets associés.`
      });
      return;
    }
    
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer le type "${type.nom}" ?`,
      header: 'Confirmer la suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.portfolioService.deleteTypeProjet(type.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Type de projet supprimé avec succès'
            });
            this.loadTypesProjets();
          }
        });
      }
    });
  }
  
  // Méthodes utilitaires
  getCompetenceCount(typeId: string): number {
    return this.portfolioService.getCompetences().filter(c => c.typeCompetenceId === typeId).length;
  }
  
  getProjetCount(typeId: string): number {
    return this.portfolioService.getProjets().filter(p => p.typeProjetId === typeId).length;
  }
}