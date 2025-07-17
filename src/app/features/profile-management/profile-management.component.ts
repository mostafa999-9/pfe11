import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-profile-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ConfirmDialogModule,
    DividerModule
  ],
  templateUrl: './profile-management.component.html',
  styleUrls: ['./profile-management.component.scss']
})
export class ProfileManagementComponent implements OnInit {
  passwordForm: FormGroup;
  currentUser: User | null = null;
  loading = false;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }
  
  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
  }
  
  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }
  
  onChangePassword() {
    if (this.passwordForm.valid) {
      this.loading = true;
      
      // Simulation de changement de mot de passe
      setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Mot de passe modifié',
          detail: 'Votre mot de passe a été modifié avec succès'
        });
        this.passwordForm.reset();
        this.loading = false;
      }, 1000);
    } else {
      this.markFormGroupTouched();
    }
  }
  
  onDeactivateAccount() {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir désactiver votre compte ? Cette action est irréversible et toutes vos données seront supprimées.',
      header: 'Désactiver le compte',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui, désactiver',
      rejectLabel: 'Annuler',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deactivateAccount();
      }
    });
  }
  
  private deactivateAccount() {
    this.loading = true;
    
    // Simulation de désactivation de compte
    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Compte désactivé',
        detail: 'Votre compte a été désactivé avec succès'
      });
      
      // Déconnexion et redirection
      setTimeout(() => {
        this.authService.logout();
        this.router.navigate(['/']);
      }, 2000);
    }, 1000);
  }
  
  private markFormGroupTouched() {
    Object.keys(this.passwordForm.controls).forEach(key => {
      const control = this.passwordForm.get(key);
      control?.markAsTouched();
    });
  }
  
  goBack() {
    this.router.navigate(['/dashboard']);
  }
  
  // Helper methods for form validation
  get currentPassword() { return this.passwordForm.get('currentPassword'); }
  get newPassword() { return this.passwordForm.get('newPassword'); }
  get confirmPassword() { return this.passwordForm.get('confirmPassword'); }
}