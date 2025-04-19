import { useState, useCallback } from 'react';
import stripeService from '../services/stripe';
import { DEVELOPMENT_MODE } from './useAuth';

export interface Plan {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  priceOnetime: number;
  features: string[];
  isPopular: boolean;
}

export interface Subscription {
  id: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete' | 'trialing';
  planId: string;
  planName: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  paymentMethod?: {
    brand: string;
    last4: string;
  };
}

export interface Invoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: string;
  date: string;
  pdfUrl: string;
}

export function useSubscription() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Fetch subscription plans
  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      if (DEVELOPMENT_MODE) {
        response = stripeService.mockGetPlans();
      } else {
        response = await stripeService.getPlans();
      }
      
      setPlans(response.plans);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setError('Failed to load subscription plans. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch current subscription
  const fetchCurrentSubscription = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      if (DEVELOPMENT_MODE) {
        response = stripeService.mockCurrentSubscription();
      } else {
        response = await stripeService.getCurrentSubscription();
      }
      
      setSubscription(response.subscription);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setError('Failed to load subscription details. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch invoice history
  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      if (DEVELOPMENT_MODE) {
        response = stripeService.mockInvoices();
      } else {
        response = await stripeService.getInvoices();
      }
      
      setInvoices(response.invoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setError('Failed to load invoice history. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create checkout session for subscription
  const createCheckoutSession = useCallback(async (planId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const successUrl = `${window.location.origin}/checkout-success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${window.location.origin}/pricing`;
      
      let response;
      
      if (DEVELOPMENT_MODE) {
        response = stripeService.mockCreateCheckoutSession();
      } else {
        response = await stripeService.createCheckoutSession(planId, successUrl, cancelUrl);
      }
      
      // In development mode, we'll simulate a redirect
      if (DEVELOPMENT_MODE) {
        console.info('🔓 Development mode: Simulating checkout success');
        
        // Wait a moment to simulate redirect
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update subscription state immediately in dev mode
        setSubscription({
          id: 'sub_mock123',
          status: 'active',
          planId: planId,
          planName: plans.find(p => p.id === planId)?.name || planId,
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          cancelAtPeriodEnd: false,
          paymentMethod: {
            brand: 'visa',
            last4: '4242'
          }
        });
        
        setLoading(false);
        return { success: true };
      }
      
      // In production, we'll redirect to Stripe Checkout
      window.location.href = response.sessionUrl;
      return { success: true };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setError('Failed to start checkout process. Please try again later.');
      setLoading(false);
      return { success: false, error: 'Failed to start checkout process' };
    }
  }, [plans]);

  // Create billing portal session
  const createBillingPortalSession = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const returnUrl = `${window.location.origin}/my-account/billing`;
      
      if (DEVELOPMENT_MODE) {
        console.info('🔓 Development mode: Simulating billing portal redirect');
        
        // Wait a moment to simulate redirect
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
        
        return { success: true };
      }
      
      const response = await stripeService.createBillingPortalSession(returnUrl);
      
      // Redirect to Stripe Billing Portal
      window.location.href = response.url;
      return { success: true };
    } catch (error) {
      console.error('Error creating billing portal session:', error);
      setError('Failed to open billing portal. Please try again later.');
      setLoading(false);
      return { success: false, error: 'Failed to open billing portal' };
    }
  }, []);

  // Cancel subscription
  const cancelSubscription = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (DEVELOPMENT_MODE) {
        console.info('🔓 Development mode: Simulating subscription cancellation');
        
        // Wait a moment to simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update subscription state
        setSubscription(prev => {
          if (!prev) return null;
          return {
            ...prev,
            cancelAtPeriodEnd: true
          };
        });
        
        setLoading(false);
        return { success: true };
      }
      
      await stripeService.cancelSubscription();
      
      // Refresh subscription details
      await fetchCurrentSubscription();
      
      return { success: true };
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      setError('Failed to cancel subscription. Please try again later.');
      setLoading(false);
      return { success: false, error: 'Failed to cancel subscription' };
    }
  }, [fetchCurrentSubscription]);

  // Reactivate canceled subscription
  const reactivateSubscription = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (DEVELOPMENT_MODE) {
        console.info('🔓 Development mode: Simulating subscription reactivation');
        
        // Wait a moment to simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update subscription state
        setSubscription(prev => {
          if (!prev) return null;
          return {
            ...prev,
            cancelAtPeriodEnd: false
          };
        });
        
        setLoading(false);
        return { success: true };
      }
      
      // In a real implementation, you would call your backend API
      // to reactivate the subscription with Stripe
      
      // Refresh subscription details
      await fetchCurrentSubscription();
      
      return { success: true };
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      setError('Failed to reactivate subscription. Please try again later.');
      setLoading(false);
      return { success: false, error: 'Failed to reactivate subscription' };
    }
  }, [fetchCurrentSubscription]);

  // Check if a session was successful (after Stripe redirect)
  const checkSessionStatus = useCallback(async (_sessionId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      if (DEVELOPMENT_MODE) {
        console.info('🔓 Development mode: Simulating session check');
        
        // Wait a moment to simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setLoading(false);
        return { success: true };
      }
      
      // In a real implementation, you would call your backend API
      // to check the Stripe session status
      
      // Refresh subscription details
      await fetchCurrentSubscription();
      
      return { success: true };
    } catch (error) {
      console.error('Error checking session status:', error);
      setError('Failed to verify payment. Please contact support.');
      setLoading(false);
      return { success: false, error: 'Failed to verify payment' };
    }
  }, [fetchCurrentSubscription]);

  return {
    loading,
    error,
    plans,
    subscription,
    invoices,
    fetchPlans,
    fetchCurrentSubscription,
    fetchInvoices,
    createCheckoutSession,
    createBillingPortalSession,
    cancelSubscription,
    reactivateSubscription,
    checkSessionStatus,
  };
}