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
import { Education } from '../../../../core/models/portfolio.model';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-educations',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule,
    TextareaModule, CalendarModule, TableModule, DialogModule, ConfirmDialogModule
  ],
  templateUrl: './educations.component.html',
  styleUrls: ['./educations.component.scss']
})
export class EducationsComponent implements OnInit {
  educations: Education[] = [];
  educationForm: FormGroup;
  displayDialog = false;
  editMode = false;
  currentEducation: Education | null = null;
  loading = false;
  
  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.educationForm = this.fb.group({
      diplome: ['', Validators.required],
      institution: ['', Validators.required],
      domaine: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: [''],
      description: ['']
    });
  }
  
  ngOnInit() {
    this.loadEducations();
  }
  
  loadEducations() {
    this.educations = this.portfolioService.getEducations();
  }
  
  showDialog() {
    this.editMode = false;
    this.currentEducation = null;
    this.educationForm.reset();
    this.displayDialog = true;
  }
  
  hideDialog() {
    this.displayDialog = false;
  }
  
  editEducation(education: Education) {
    this.editMode = true;
    this.currentEducation = education;
    this.educationForm.patchValue({
      ...education,
      dateDebut: new Date(education.dateDebut),
      dateFin: education.dateFin ? new Date(education.dateFin) : null
    });
    this.displayDialog = true;
  }
  
  saveEducation() {
    if (this.educationForm.valid) {
      this.loading = true;
      const user = this.authService.getCurrentUser();
      
      const data = {
        ...this.educationForm.value,
        utilisateurId: user?.id || '1'
      };
      
      const operation = this.editMode && this.currentEducation
        ? this.portfolioService.updateEducation(this.currentEducation.id, data)
        : this.portfolioService.addEducation(data);
      
      operation.subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `Formation ${this.editMode ? 'modifiée' : 'ajoutée'} avec succès`
          });
          this.loadEducations();
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
  
  deleteEducation(education: Education) {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer la formation "${education.diplome}" ?`,
      header: 'Confirmer la suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.portfolioService.deleteEducation(education.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Formation supprimée avec succès'
            });
            this.loadEducations();
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