import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule
  ],
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  email = '';
  selectedPlan = '';
  verificationSent = false;
  loading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      this.selectedPlan = params['selectedPlan'] || '';
    });

    // Simuler l'envoi automatique de l'email de vérification
    this.sendVerificationEmail();
  }

  sendVerificationEmail() {
    this.loading = true;
    // Simulation d'envoi d'email
    setTimeout(() => {
      this.verificationSent = true;
      this.loading = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Email envoyé',
        detail: `Un email de vérification a été envoyé à ${this.email}`
      });
    }, 1000);
  }

  resendEmail() {
    this.sendVerificationEmail();
  }

  // Simulation de vérification d'email (normalement appelée via un lien dans l'email)
  verifyEmail() {
    this.loading = true;
    
    // Simulation de vérification
    setTimeout(() => {
      this.authService.verifyEmail(this.email).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Email vérifié',
            detail: 'Votre email a été vérifié avec succès'
          });
          
          // Rediriger vers la sélection d'abonnement
          this.router.navigate(['/auth/select-subscription'], {
            queryParams: { selectedPlan: this.selectedPlan }
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la vérification de l\'email'
          });
        }
      });
      this.loading = false;
    }, 1000);
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}