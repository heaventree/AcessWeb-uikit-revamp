/**
 * Payments API Service
 * 
 * Provides secure API methods for payment and subscription-related operations.
 * Uses the base API service for secure HTTP requests.
 */

import api from './api';
import { validateData } from '../utils/validation';
import { z } from 'zod';

// Type definitions for API responses
export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  isPopular?: boolean;
  metadata?: Record<string, string>;
}

export interface CheckoutSession {
  id: string;
  url: string;
  expiresAt: number;
}

export interface BillingPortalSession {
  url: string;
}

export interface Subscription {
  id: string;
  status: 'active' | 'canceled' | 'incomplete' | 'past_due' | 'trialing' | 'unpaid';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  plan: Plan;
  canceledAt?: string;
  endedAt?: string;
  trialStart?: string;
  trialEnd?: string;
}

export interface Invoice {
  id: string;
  number: string;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  url: string;
  amountDue: number;
  amountPaid: number;
  currency: string;
  date: string;
  description?: string;
  paid: boolean;
}

export interface SessionStatus {
  status: 'complete' | 'expired' | 'open';
  subscription?: Subscription;
  error?: string;
}

// Input validation schemas
const createCheckoutSessionSchema = z.object({
  planId: z.string().min(1),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

const createBillingPortalSessionSchema = z.object({
  returnUrl: z.string().url(),
});

/**
 * Payments API methods
 */
const paymentsApi = {
  /**
   * Get available subscription plans
   */
  async getPlans(): Promise<Plan[]> {
    return api.get<Plan[]>('/payments/plans');
  },
  
  /**
   * Create a checkout session for subscription signup
   */
  async createCheckoutSession(
    planId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<CheckoutSession> {
    // Validate input data
    const validatedData = validateData(createCheckoutSessionSchema, {
      planId,
      successUrl,
      cancelUrl
    });
    
    // Make API request
    return api.post<CheckoutSession>('/payments/create-checkout-session', validatedData);
  },
  
  /**
   * Create a billing portal session for subscription management
   */
  async createBillingPortalSession(returnUrl: string): Promise<BillingPortalSession> {
    // Validate input data
    const validatedData = validateData(createBillingPortalSessionSchema, { returnUrl });
    
    // Make API request
    return api.post<BillingPortalSession>('/payments/create-billing-portal-session', validatedData);
  },
  
  /**
   * Get the current user's subscription
   */
  async getCurrentSubscription(): Promise<Subscription | null> {
    return api.get<Subscription | null>('/payments/subscription');
  },
  
  /**
   * Get the current user's invoices
   */
  async getInvoices(): Promise<Invoice[]> {
    return api.get<Invoice[]>('/payments/invoices');
  },
  
  /**
   * Cancel the current subscription at period end
   */
  async cancelSubscription(): Promise<Subscription> {
    return api.post<Subscription>('/payments/cancel-subscription', {});
  },
  
  /**
   * Reactivate a canceled subscription
   */
  async reactivateSubscription(): Promise<Subscription> {
    return api.post<Subscription>('/payments/reactivate-subscription', {});
  },
  
  /**
   * Check the status of a checkout session
   */
  async checkSessionStatus(sessionId: string): Promise<SessionStatus> {
    return api.get<SessionStatus>(`/payments/checkout-sessions/${sessionId}`);
  }
};

export default paymentsApi;