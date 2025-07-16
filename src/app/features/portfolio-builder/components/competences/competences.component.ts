import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { SliderModule } from 'primeng/slider';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Competence, TypeCompetence } from '../../../../core/models/portfolio.model';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-competences',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    TagModule,
    SliderModule
  ],
  templateUrl: './competences.component.html',
  styleUrls: ['./competences.component.scss']
})
export class CompetencesComponent implements OnInit {
  competences: Competence[] = [];
  typesCompetences: TypeCompetence[] = [];
  competenceForm: FormGroup;
  displayDialog = false;
  editMode = false;
  currentCompetence: Competence | null = null;
  loading = false;
  niveauValue = 1;
  
  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.competenceForm = this.fb.group({
      nom: ['', Validators.required],
      typeCompetenceId: ['', Validators.required],
      niveau: [1, [Validators.required, Validators.min(1), Validators.max(4)]]
    });

    // Écouter les changements du niveau pour l'affichage
    this.competenceForm.get('niveau')?.valueChanges.subscribe(value => {
      this.niveauValue = value;
    });
  }
  
  ngOnInit() {
    this.loadCompetences();
    this.loadTypesCompetences();
  }
  
  loadCompetences() {
    this.competences = this.portfolioService.getCompetences();
  }
  
  loadTypesCompetences() {
    this.portfolioService.getTypesCompetences().subscribe(types => {
      this.typesCompetences = types;
    });
  }
  
  showDialog() {
    this.editMode = false;
    this.currentCompetence = null;
    this.competenceForm.reset();
    this.competenceForm.patchValue({ niveau: 1 });
    this.niveauValue = 1;
    this.displayDialog = true;
  }
  
  hideDialog() {
    this.displayDialog = false;
    this.competenceForm.reset();
  }
  
  editCompetence(competence: Competence) {
    this.editMode = true;
    this.currentCompetence = competence;
    const niveauNumeric = this.convertNiveauToNumeric(competence.niveau);
    this.competenceForm.patchValue({
      ...competence,
      niveau: niveauNumeric
    });
    this.niveauValue = niveauNumeric;
    this.displayDialog = true;
  }
  
  saveCompetence() {
    if (this.competenceForm.valid) {
      this.loading = true;
      const user = this.authService.getCurrentUser();
      
      const formValue = this.competenceForm.value;
      const data = {
        ...formValue,
        niveau: this.convertNumericToNiveau(formValue.niveau),
        utilisateurId: user?.id || '1'
      };
      
      const operation = this.editMode && this.currentCompetence
        ? this.portfolioService.updateCompetence(this.currentCompetence.id, data)
        : this.portfolioService.addCompetence(data);
      
      operation.subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `Compétence ${this.editMode ? 'modifiée' : 'ajoutée'} avec succès`
          });
          this.loadCompetences();
          this.hideDialog();
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
  
  deleteCompetence(competence: Competence) {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer la compétence "${competence.nom}" ?`,
      header: 'Confirmer la suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.portfolioService.deleteCompetence(competence.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Compétence supprimée avec succès'
            });
            this.loadCompetences();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la suppression'
            });
          }
        });
      }
    });
  }
  
  getTypeCompetenceName(typeId: string): string {
    const type = this.typesCompetences.find(t => t.id === typeId);
    return type?.nom || '';
  }
  
  convertNiveauToNumeric(niveau: string): number {
    switch (niveau) {
      case 'debutant': return 1;
      case 'intermediaire': return 2;
      case 'avance': return 3;
      case 'expert': return 4;
      default: return 1;
    }
  }
  
  convertNumericToNiveau(numeric: number): 'debutant' | 'intermediaire' | 'avance' | 'expert' {
    switch (numeric) {
      case 1: return 'debutant';
      case 2: return 'intermediaire';
      case 3: return 'avance';
      case 4: return 'expert';
      default: return 'debutant';
    }
  }
  
  getNiveauLabel(niveau: string | number): string {
    if (typeof niveau === 'number') {
      niveau = this.convertNumericToNiveau(niveau);
    }
    switch (niveau) {
      case 'debutant': return 'Débutant';
      case 'intermediaire': return 'Intermédiaire';
      case 'avance': return 'Avancé';
      case 'expert': return 'Expert';
      default: return 'Débutant';
    }
  }
  
  getNiveauSeverity(niveau: string): string {
    switch (niveau) {
      case 'expert': return 'success';
      case 'avance': return 'info';
      case 'intermediaire': return 'warn';
      case 'debutant': return 'secondary';
      default: return 'secondary';
    }
  }
  
  getNiveauPercentage(niveau: string): number {
    switch (niveau) {
      case 'debutant': return 25;
      case 'intermediaire': return 50;
      case 'avance': return 75;
      case 'expert': return 100;
      default: return 25;
    }
  }
  
  get nom() { return this.competenceForm.get('nom'); }
  get typeCompetenceId() { return this.competenceForm.get('typeCompetenceId'); }
  get niveau() { return this.competenceForm.get('niveau'); }
}