import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Experience } from '../../../../core/models/portfolio.model';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-experiences',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule,
    TextareaModule, CalendarModule, TableModule, DialogModule, ConfirmDialogModule
  ],
  templateUrl: './experiences.component.html',
  styleUrls: ['./experiences.component.scss']
})
export class ExperiencesComponent implements OnInit {
  experiences: Experience[] = [];
  experienceForm: FormGroup;
  displayDialog = false;
  editMode = false;
  currentExperience: Experience | null = null;
  loading = false;
  
  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.experienceForm = this.fb.group({
      poste: ['', Validators.required],
      entreprise: ['', Validators.required],
      description: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: [''],
      lieu: ['']
    });
  }
  
  ngOnInit() {
    this.loadExperiences();
  }
  
  loadExperiences() {
    this.experiences = this.portfolioService.getExperiences();
  }
  
  showDialog() {
    this.editMode = false;
    this.currentExperience = null;
    this.experienceForm.reset();
    this.displayDialog = true;
  }
  
  hideDialog() {
    this.displayDialog = false;
  }
  
  editExperience(experience: Experience) {
    this.editMode = true;
    this.currentExperience = experience;
    this.experienceForm.patchValue({
      ...experience,
      dateDebut: new Date(experience.dateDebut),
      dateFin: experience.dateFin ? new Date(experience.dateFin) : null
    });
    this.displayDialog = true;
  }
  
  saveExperience() {
    if (this.experienceForm.valid) {
      this.loading = true;
      const user = this.authService.getCurrentUser();
      
      const data = {
        ...this.experienceForm.value,
        utilisateurId: user?.id || '1'
      };
      
      const operation = this.editMode && this.currentExperience
        ? this.portfolioService.updateExperience(this.currentExperience.id, data)
        : this.portfolioService.addExperience(data);
      
      operation.subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `Expérience ${this.editMode ? 'modifiée' : 'ajoutée'} avec succès`
          });
          this.loadExperiences();
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
  
  deleteExperience(experience: Experience) {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer l'expérience "${experience.poste}" ?`,
      header: 'Confirmer la suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.portfolioService.deleteExperience(experience.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Expérience supprimée avec succès'
            });
            this.loadExperiences();
          }
        });
      }
    });
  }
  
  formatPeriode(debut: Date, fin?: Date): string {
    const debutStr = new Date(debut).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
    const finStr = fin ? new Date(fin).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }) : 'En cours';
    return `${debutStr} - ${finStr}`;
  }
}