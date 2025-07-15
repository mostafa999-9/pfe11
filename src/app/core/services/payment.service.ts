import { Injectable } from '@angular/core';
import { loadScript } from '@paypal/paypal-js';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private paypal: any;

  async initializePayPal() {
    try {
      this.paypal = await loadScript({
        
        clientId: 'AZY3bebOOUFEGIRdDuI0Xduonxtldtwpb4mia2n7VOV8Y1CJZhSN8FBNGWA8nQZKoKOP0jmeakxh6oOx', // Remplacez par votre client ID PayPal
        currency: 'EUR'
      });
      return this.paypal;
    } catch (error) {
      console.error('Erreur lors du chargement de PayPal:', error);
      throw error;
    }
  }

  async createPayPalButton(containerId: string, amount: string, planName: string) {
    if (!this.paypal) {
      await this.initializePayPal();
    }

    return this.paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: amount,
              currency_code: 'EUR'
            },
            description: `Abonnement ${planName}`
          }]
        });
      },
      onApprove: async (data: any, actions: any) => {
        const order = await actions.order.capture();
        console.log('Paiement réussi:', order);
        return order;
      },
      onError: (err: any) => {
        console.error('Erreur PayPal:', err);
      }
    }).render(`#${containerId}`);
  }
}