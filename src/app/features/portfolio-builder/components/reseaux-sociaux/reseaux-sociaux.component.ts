import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ReseauSocial } from '../../../../core/models/portfolio.model';

@Component({
  selector: 'app-reseaux-sociaux',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule,
    DropdownModule, TableModule, DialogModule, ConfirmDialogModule
  ],
  templateUrl: './reseaux-sociaux.component.html',
  styleUrls: ['./reseaux-sociaux.component.scss']
})
export class ReseauxSociauxComponent implements OnInit {
  reseauxSociaux: ReseauSocial[] = [];
  reseauForm: FormGroup;
  displayDialog = false;
  editMode = false;
  currentReseau: ReseauSocial | null = null;
  loading = false;
  
  reseauxDisponibles = [
    { label: 'LinkedIn', value: 'LinkedIn' },
    { label: 'GitHub', value: 'GitHub' },
    { label: 'Twitter', value: 'Twitter' },
    { label: 'Instagram', value: 'Instagram' },
    { label: 'Facebook', value: 'Facebook' },
    { label: 'Behance', value: 'Behance' },
    { label: 'Dribbble', value: 'Dribbble' },
    { label: 'YouTube', value: 'YouTube' }
  ];
  
  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.reseauForm = this.fb.group({
      nom: ['', Validators.required],
      url: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
  }
  
  ngOnInit() {
    this.loadReseauxSociaux();
  }
  
  loadReseauxSociaux() {
    this.reseauxSociaux = this.portfolioService.getReseauxSociaux();
  }
  
  showDialog() {
    this.editMode = false;
    this.currentReseau = null;
    this.reseauForm.reset();
    this.displayDialog = true;
  }
  
  hideDialog() {
    this.displayDialog = false;
  }
  
  editReseau(reseau: ReseauSocial) {
    this.editMode = true;
    this.currentReseau = reseau;
    this.reseauForm.patchValue(reseau);
    this.displayDialog = true;
  }
  
  saveReseau() {
    if (this.reseauForm.valid) {
      this.loading = true;
      const user = this.authService.getCurrentUser();
      
      const data = {
        ...this.reseauForm.value,
        utilisateurId: user?.id || '1',
        icone: this.getReseauIcon(this.reseauForm.value.nom)
      };
      
      const operation = this.editMode && this.currentReseau
        ? this.portfolioService.updateReseauSocial(this.currentReseau.id, data)
        : this.portfolioService.addReseauSocial(data);
      
      operation.subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `Réseau social ${this.editMode ? 'modifié' : 'ajouté'} avec succès`
          });
          this.loadReseauxSociaux();
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
  
  deleteReseau(reseau: ReseauSocial) {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer le réseau "${reseau.nom}" ?`,
      header: 'Confirmer la suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.portfolioService.deleteReseauSocial(reseau.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Réseau social supprimé avec succès'
            });
            this.loadReseauxSociaux();
          }
        });
      }
    });
  }
  
  getReseauIcon(nom: string): string {
    const icons: { [key: string]: string } = {
      'LinkedIn': 'pi pi-linkedin',
      'GitHub': 'pi pi-github',
      'Twitter': 'pi pi-twitter',
      'Instagram': 'pi pi-instagram',
      'Facebook': 'pi pi-facebook',
      'Behance': 'pi pi-palette',
      'Dribbble': 'pi pi-circle',
      'YouTube': 'pi pi-video'
    };
    return icons[nom] || 'pi pi-link';
  }
}