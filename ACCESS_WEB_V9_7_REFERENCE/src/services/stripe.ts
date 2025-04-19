/**
 * Stripe Service
 * 
 * Provides secure payment processing functionality using Stripe API.
 * All implementation details of the Stripe API are abstracted here.
 */

import paymentsApi, { Plan, CheckoutSession, BillingPortalSession, Subscription, Invoice, SessionStatus } from './paymentsApi';
import { ErrorType, createError, logError } from '../utils/errorHandler';

// Mock plans for development mode
const mockPlans = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Perfect for small websites and personal projects',
    priceMonthly: 999,
    priceYearly: 9990,
    priceOnetime: 19990,
    features: [
      'Up to 5 pages per scan',
      'Weekly automated scans',
      'Basic accessibility reports',
      'Email notifications',
      'Standard support'
    ],
    isPopular: false
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'Ideal for growing businesses and agencies',
    priceMonthly: 2999,
    priceYearly: 29990,
    priceOnetime: 59990,
    features: [
      'Up to 25 pages per scan',
      'Daily automated scans',
      'Advanced accessibility reports',
      'Priority email support',
      'Custom badge styles',
      'API access',
      'Multiple team members'
    ],
    isPopular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations with complex needs',
    priceMonthly: 9999,
    priceYearly: 99990,
    priceOnetime: 199990,
    features: [
      'Unlimited pages per scan',
      'Real-time monitoring',
      'Custom scan schedules',
      'Dedicated support manager',
      'Custom integrations',
      'SLA guarantees',
      'Advanced analytics',
      'Multiple domains'
    ],
    isPopular: false
  }
];

/**
 * Secure Stripe payment service
 */
class StripeService {
  /**
   * Mock getPlans for development mode
   */
  mockGetPlans() {
    return {
      plans: mockPlans
    };
  }

  /**
   * Mock createCheckoutSession for development mode
   */
  mockCreateCheckoutSession() {
    return {
      sessionId: 'mock_session_' + Math.random().toString(36).substring(2, 9),
      sessionUrl: '#mock-checkout-url'
    };
  }

  /**
   * Mock getCurrentSubscription for development mode
   */
  mockCurrentSubscription() {
    return {
      subscription: {
        id: 'sub_mock' + Math.random().toString(36).substring(2, 9),
        status: 'active',
        planId: 'pro',
        planName: 'Professional',
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancelAtPeriodEnd: false,
        paymentMethod: {
          brand: 'visa',
          last4: '4242'
        }
      }
    };
  }

  /**
   * Mock getInvoices for development mode
   */
  mockInvoices() {
    return {
      invoices: [
        {
          id: 'in_mock' + Math.random().toString(36).substring(2, 9),
          number: 'INV-001',
          amount: 2999,
          currency: 'usd',
          status: 'paid',
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          pdfUrl: '#'
        },
        {
          id: 'in_mock' + Math.random().toString(36).substring(2, 9),
          number: 'INV-002',
          amount: 2999,
          currency: 'usd',
          status: 'paid',
          date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          pdfUrl: '#'
        }
      ]
    };
  }
  /**
   * Get available plans
   */
  async getPlans(): Promise<Plan[]> {
    try {
      return await paymentsApi.getPlans();
    } catch (error) {
      logError(error);
      throw createError(
        ErrorType.API,
        'plans_fetch_error',
        'Failed to fetch subscription plans',
        { originalError: error }
      );
    }
  }

  /**
   * Create a checkout session
   */
  async createCheckoutSession(
    planId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<CheckoutSession> {
    try {
      return await paymentsApi.createCheckoutSession(planId, successUrl, cancelUrl);
    } catch (error) {
      logError(error);
      throw createError(
        ErrorType.API,
        'checkout_creation_error',
        'Failed to create checkout session',
        { originalError: error, planId }
      );
    }
  }

  /**
   * Create a billing portal session
   */
  async createBillingPortalSession(returnUrl: string): Promise<BillingPortalSession> {
    try {
      return await paymentsApi.createBillingPortalSession(returnUrl);
    } catch (error) {
      logError(error);
      throw createError(
        ErrorType.API,
        'billing_portal_error',
        'Failed to create billing portal session',
        { originalError: error }
      );
    }
  }

  /**
   * Get current subscription
   */
  async getCurrentSubscription(): Promise<Subscription | null> {
    try {
      return await paymentsApi.getCurrentSubscription();
    } catch (error) {
      logError(error);
      throw createError(
        ErrorType.API,
        'subscription_fetch_error',
        'Failed to fetch subscription details',
        { originalError: error }
      );
    }
  }

  /**
   * Get invoices
   */
  async getInvoices(): Promise<Invoice[]> {
    try {
      return await paymentsApi.getInvoices();
    } catch (error) {
      logError(error);
      throw createError(
        ErrorType.API,
        'invoices_fetch_error',
        'Failed to fetch invoices',
        { originalError: error }
      );
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(): Promise<Subscription> {
    try {
      return await paymentsApi.cancelSubscription();
    } catch (error) {
      logError(error);
      throw createError(
        ErrorType.API,
        'subscription_cancel_error',
        'Failed to cancel subscription',
        { originalError: error }
      );
    }
  }

  /**
   * Reactivate subscription
   */
  async reactivateSubscription(): Promise<Subscription> {
    try {
      return await paymentsApi.reactivateSubscription();
    } catch (error) {
      logError(error);
      throw createError(
        ErrorType.API,
        'subscription_reactivate_error',
        'Failed to reactivate subscription',
        { originalError: error }
      );
    }
  }

  /**
   * Check session status
   */
  async checkSessionStatus(sessionId: string): Promise<SessionStatus> {
    try {
      return await paymentsApi.checkSessionStatus(sessionId);
    } catch (error) {
      logError(error);
      throw createError(
        ErrorType.API,
        'session_status_error',
        'Failed to check session status',
        { originalError: error, sessionId }
      );
    }
  }

  /**
   * Format price for display
   */
  formatPrice(price: number, currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2
    }).format(price / 100); // Stripe uses cents
  }

  /**
   * Get interval display text
   */
  getIntervalDisplay(interval: 'month' | 'year'): string {
    return interval === 'month' ? 'monthly' : 'yearly';
  }
}

export default new StripeService();