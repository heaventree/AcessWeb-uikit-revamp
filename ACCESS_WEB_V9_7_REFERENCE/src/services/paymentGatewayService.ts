import type { PaymentGateway } from '../types';
import { getEnvString } from '../utils/environment';

// Simulated database
let gateways: PaymentGateway[] = [
  {
    id: 'stripe',
    name: 'stripe',
    isActive: true,
    config: {
      mode: 'test',
      apiKey: getEnvString('VITE_STRIPE_PUBLISHABLE_KEY', 'pk_test_placeholder'),
      secretKey: getEnvString('VITE_STRIPE_SECRET_KEY', 'sk_test_placeholder'),
      webhookSecret: ''
    },
    lastUpdated: new Date().toISOString()
  }
];

export const paymentGatewayService = {
  getAllGateways: async (): Promise<PaymentGateway[]> => {
    return gateways;
  },

  getGatewayById: async (id: string): Promise<PaymentGateway | null> => {
    return gateways.find(gateway => gateway.id === id) || null;
  },

  updateGateway: async (id: string, data: Partial<PaymentGateway>): Promise<PaymentGateway | null> => {
    const index = gateways.findIndex(gateway => gateway.id === id);
    if (index === -1) return null;

    gateways[index] = {
      ...gateways[index],
      ...data,
      lastUpdated: new Date().toISOString()
    };

    return gateways[index];
  },

  toggleGateway: async (id: string): Promise<PaymentGateway | null> => {
    const gateway = gateways.find(g => g.id === id);
    if (!gateway) return null;

    gateway.isActive = !gateway.isActive;
    gateway.lastUpdated = new Date().toISOString();
    return gateway;
  },

  testConnection: async (gateway: PaymentGateway): Promise<boolean> => {
    // Simulate API connection test
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  }
};